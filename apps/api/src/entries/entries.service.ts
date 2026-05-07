import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { EntryStatus, Role } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateEntryDto,
  CheckoutEntryDto,
  EntriesQueryDto,
  EntryResponseDto,
  PaginatedEntriesResponseDto,
} from './dto/entry.dto';

@Injectable()
export class EntriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find all entries with filters and pagination.
   */
  async findAll(
    query: EntriesQueryDto,
    organizationId: string,
    userRole: Role,
    userBranchId?: string,
  ): Promise<PaginatedEntriesResponseDto> {
    const {
      branchId,
      staffId,
      plateNumber,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = query;

    const skip = (page - 1) * limit;

    // Build filters
    const where: any = { organizationId };

    // Role-based scoping: Supervisors and Guards only see their assigned branch by default
    if ((userRole === Role.supervisor || userRole === Role.guard) && userBranchId) {
      where.branchId = userBranchId;
    } else if (branchId) {
      where.branchId = branchId;
    }

    if (staffId) {
      where.OR = [
        { checkInStaffId: staffId },
        { checkOutStaffId: staffId },
      ];
    }

    if (plateNumber) {
      where.plateNumber = { contains: plateNumber, mode: 'insensitive' };
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.checkInTime = {};
      if (startDate) where.checkInTime.gte = new Date(startDate);
      if (endDate) where.checkInTime.lte = new Date(endDate);
    }

    const [total, entries] = await Promise.all([
      this.prisma.vehicleEntry.count({ where }),
      this.prisma.vehicleEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { checkInTime: 'desc' },
        include: {
          branch: true,
          checkInStaff: true,
          checkOutStaff: true,
          checkInGate: true,
          checkOutGate: true,
        },
      }),
    ]);

    const data: EntryResponseDto[] = entries.map((entry) => ({
      id: entry.id,
      plateNumber: entry.plateNumber,
      phoneNumber: entry.phoneNumber,
      notes: entry.notes,
      status: entry.status,
      checkInTime: entry.checkInTime,
      checkOutTime: entry.checkOutTime,
      branchName: entry.branch.name,
      checkInStaffName: entry.checkInStaff.email, // Using email for now as we don't have fullName in User model yet
      checkOutStaffName: entry.checkOutStaff?.email || null,
      checkInGateName: entry.checkInGate.name,
      checkOutGateName: entry.checkOutGate?.name || null,
      imagePath: entry.imagePath,
      createdAt: entry.createdAt,
    }));

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Get a single entry by ID.
   */
  async findOne(id: string, organizationId: string): Promise<EntryResponseDto> {
    const entry = await this.prisma.vehicleEntry.findFirst({
      where: { id, organizationId },
      include: {
        branch: true,
        checkInStaff: true,
        checkOutStaff: true,
        checkInGate: true,
        checkOutGate: true,
      },
    });

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }

    return {
      id: entry.id,
      plateNumber: entry.plateNumber,
      phoneNumber: entry.phoneNumber,
      notes: entry.notes,
      status: entry.status,
      checkInTime: entry.checkInTime,
      checkOutTime: entry.checkOutTime,
      branchName: entry.branch.name,
      checkInStaffName: entry.checkInStaff.email,
      checkOutStaffName: entry.checkOutStaff?.email || null,
      checkInGateName: entry.checkInGate.name,
      checkOutGateName: entry.checkOutGate?.name || null,
      imagePath: entry.imagePath,
      createdAt: entry.createdAt,
    };
  }

  /**
   * Create a new vehicle entry (Check-In).
   */
  async create(
    dto: CreateEntryDto,
    organizationId: string,
    staffId: string,
  ): Promise<EntryResponseDto> {
    // 1. Get gate and verify it belongs to the organization
    const gate = await this.prisma.gate.findFirst({
      where: { 
        id: dto.gateId,
        branch: {
          organizationId
        }
      },
    });

    if (!gate) {
      throw new NotFoundException('Gate not found or access denied');
    }

    // 2. Duplicate Protection: Check if vehicle is already inside this organization
    const existingActive = await this.prisma.vehicleEntry.findFirst({
      where: {
        plateNumber: dto.plateNumber,
        organizationId,
        status: EntryStatus.IN,
      },
    });

    if (existingActive) {
      throw new ConflictException(`Vehicle ${dto.plateNumber} is already inside`);
    }

    // 3. Resolve Device ID if provided
    let deviceId: string | undefined;
    if (dto.deviceId) {
      const device = await this.prisma.device.findUnique({
        where: { deviceId: dto.deviceId },
      });
      if (device) deviceId = device.id;
    }

    // 4. Create Entry
    const entry = await this.prisma.vehicleEntry.create({
      data: {
        plateNumber: dto.plateNumber,
        phoneNumber: dto.phoneNumber,
        notes: dto.notes,
        status: EntryStatus.IN,
        organizationId,
        branchId: gate.branchId,
        checkInGateId: gate.id,
        checkInStaffId: staffId,
        deviceId,
      },
      include: {
        branch: true,
        checkInStaff: true,
        checkInGate: true,
      },
    });

    return {
      id: entry.id,
      plateNumber: entry.plateNumber,
      phoneNumber: entry.phoneNumber,
      notes: entry.notes,
      status: entry.status,
      checkInTime: entry.checkInTime,
      branchName: entry.branch.name,
      checkInStaffName: entry.checkInStaff.email,
      checkInGateName: entry.checkInGate.name,
      createdAt: entry.createdAt,
    };
  }

  /**
   * Complete a vehicle entry (Check-Out).
   */
  async checkout(
    id: string,
    dto: CheckoutEntryDto,
    organizationId: string,
    staffId: string,
  ): Promise<EntryResponseDto> {
    const entry = await this.prisma.vehicleEntry.findFirst({
      where: { id, organizationId },
    });

    if (!entry) {
      throw new NotFoundException(`Entry with ID ${id} not found`);
    }

    if (entry.status === EntryStatus.OUT) {
      throw new ConflictException('Vehicle has already checked out');
    }

    const gate = await this.prisma.gate.findFirst({
      where: { 
        id: dto.gateId,
        branch: {
          organizationId
        }
      },
    });

    if (!gate) {
      throw new NotFoundException('Gate not found or access denied');
    }

    const updated = await this.prisma.vehicleEntry.update({
      where: { id },
      data: {
        status: EntryStatus.OUT,
        checkOutTime: new Date(),
        checkOutStaffId: staffId,
        checkOutGateId: gate.id,
      },
      include: {
        branch: true,
        checkInStaff: true,
        checkOutStaff: true,
        checkInGate: true,
        checkOutGate: true,
      },
    });

    return {
      id: updated.id,
      plateNumber: updated.plateNumber,
      phoneNumber: updated.phoneNumber,
      notes: updated.notes,
      status: updated.status,
      checkInTime: updated.checkInTime,
      checkOutTime: updated.checkOutTime,
      branchName: updated.branch.name,
      checkInStaffName: updated.checkInStaff.email,
      checkOutStaffName: updated.checkOutStaff?.email || null,
      checkInGateName: updated.checkInGate.name,
      checkOutGateName: updated.checkOutGate?.name || null,
      imagePath: updated.imagePath,
      createdAt: updated.createdAt,
    };
  }
}
