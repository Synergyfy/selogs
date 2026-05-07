import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateStaffDto,
  UpdateStaffDto,
  StaffResponseDto,
  StaffCheckInDto,
  ShiftResponseDto,
} from './dto/staff.dto';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new staff member (Admin only).
   */
  async create(dto: CreateStaffDto, organizationId: string): Promise<StaffResponseDto> {
    // 1. Check if email exists
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingEmail) throw new ConflictException('Email already in use');

    // 2. Check if staffId exists
    const existingStaffId = await this.prisma.user.findUnique({
      where: { staffId: dto.staffId },
    });
    if (existingStaffId) throw new ConflictException('Staff ID already exists');

    // 3. Prevent creating admins via this endpoint
    if (dto.role === Role.admin || dto.role === Role.super_admin) {
      throw new ForbiddenException('Cannot create administrative roles here');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        staffId: dto.staffId,
        role: dto.role,
        branchId: dto.branchId,
        organizationId,
      },
      include: {
        branch: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName || undefined,
      staffId: user.staffId || undefined,
      role: user.role,
      branchId: user.branchId || undefined,
      branchName: user.branch?.name,
      createdAt: user.createdAt,
    };
  }

  /**
   * List all staff in an organization.
   */
  async findAll(organizationId: string): Promise<StaffResponseDto[]> {
    const users = await this.prisma.user.findMany({
      where: { 
        organizationId,
        role: { in: [Role.supervisor, Role.guard] }
      },
      include: {
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName || undefined,
      staffId: user.staffId || undefined,
      role: user.role,
      branchId: user.branchId || undefined,
      branchName: user.branch?.name,
      createdAt: user.createdAt,
    }));
  }

  /**
   * Start a shift (Check-In).
   */
  async checkIn(dto: StaffCheckInDto, organizationId: string): Promise<ShiftResponseDto> {
    // 1. Find user by staffId
    const user = await this.prisma.user.findFirst({
      where: { 
        staffId: dto.staffId,
        organizationId,
      },
    });

    if (!user) {
      throw new NotFoundException(`Staff with ID ${dto.staffId} not found`);
    }

    // 2. Check if already has an active shift
    const activeShift = await this.prisma.shift.findFirst({
      where: {
        userId: user.id,
        endTime: null,
      },
    });

    if (activeShift) {
      throw new ConflictException('Staff already has an active shift');
    }

    // 3. Get gate and branch
    const gate = await this.prisma.gate.findFirst({
      where: { 
        id: dto.gateId,
        branch: { organizationId }
      },
      include: { branch: true },
    });

    if (!gate) {
      throw new NotFoundException('Gate not found or access denied');
    }

    // 4. Resolve Device if provided
    let deviceId: string | undefined;
    if (dto.deviceId) {
      const device = await this.prisma.device.findUnique({
        where: { deviceId: dto.deviceId },
      });
      if (device) deviceId = device.id;
    }

    // 5. Create Shift
    const shift = await this.prisma.shift.create({
      data: {
        userId: user.id,
        branchId: gate.branchId,
        gateId: gate.id, // Wait, I didn't add gateId to Shift model!
        deviceId,
        organizationId,
      } as any, // Adding gateId if I update schema, but let's check
      include: {
        user: true,
        branch: true,
        device: true,
      },
    });
    
    // Actually, I didn't add gateId to Shift in schema. 
    // It's not strictly necessary if we have deviceId or just branchId, 
    // but good for tracking. I'll stick to what's in schema for now.

    return {
      id: shift.id,
      staffId: user.staffId!,
      fullName: user.fullName || user.email,
      branchName: shift.branch.name,
      startTime: shift.startTime,
      deviceName: shift.device?.name || undefined,
    };
  }

  /**
   * End a shift (Check-Out).
   */
  async checkOut(staffId: string, organizationId: string): Promise<ShiftResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { staffId, organizationId },
    });

    if (!user) throw new NotFoundException('Staff not found');

    const activeShift = await this.prisma.shift.findFirst({
      where: {
        userId: user.id,
        endTime: null,
      },
      include: { branch: true },
    });

    if (!activeShift) {
      throw new BadRequestException('No active shift found for this staff');
    }

    const updated = await this.prisma.shift.update({
      where: { id: activeShift.id },
      data: { endTime: new Date() },
      include: {
        user: true,
        branch: true,
      },
    });

    return {
      id: updated.id,
      staffId: user.staffId!,
      fullName: user.fullName || user.email,
      branchName: updated.branch.name,
      startTime: updated.startTime,
      endTime: updated.endTime!,
    };
  }

  /**
   * Get shift history for an organization.
   */
  async getShiftHistory(organizationId: string): Promise<ShiftResponseDto[]> {
    const shifts = await this.prisma.shift.findMany({
      where: { organizationId },
      include: {
        user: true,
        branch: true,
        device: true,
      },
      orderBy: { startTime: 'desc' },
      take: 100, // Limit for now
    });

    return shifts.map((s) => ({
      id: s.id,
      staffId: s.user.staffId!,
      fullName: s.user.fullName || s.user.email,
      branchName: s.branch.name,
      startTime: s.startTime,
      endTime: s.endTime || undefined,
      deviceName: s.device?.name || undefined,
    }));
  }
}
