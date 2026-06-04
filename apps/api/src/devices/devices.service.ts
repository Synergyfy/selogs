import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDeviceDto,
  UpdateDeviceDto,
  DeviceResponseDto,
} from './dto/device.dto';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Register a new device.
   */
  async create(
    dto: CreateDeviceDto,
    organizationId: string,
  ): Promise<DeviceResponseDto> {
    // 1. Check if deviceId already exists
    const existing = await this.prisma.device.findUnique({
      where: { deviceId: dto.deviceId },
    });

    if (existing) {
      throw new ConflictException(
        `Device with ID ${dto.deviceId} is already registered`,
      );
    }

    // 2. Validate branch and gate belong to the organization
    const gate = await this.prisma.gate.findFirst({
      where: {
        id: dto.gateId,
        branchId: dto.branchId,
        branch: { organizationId },
      },
      include: { branch: true },
    });

    if (!gate) {
      throw new NotFoundException(
        'Gate not found or does not belong to this organization',
      );
    }

    // 3. Create device
    const device = await this.prisma.device.create({
      data: {
        deviceId: dto.deviceId,
        name: dto.name,
        branchId: dto.branchId,
        gateId: dto.gateId,
        organizationId,
      },
      include: {
        branch: true,
        gate: true,
      },
    });

    return {
      id: device.id,
      deviceId: device.deviceId,
      name: device.name || undefined,
      branchId: device.branchId,
      branchName: device.branch.name,
      gateId: device.gateId,
      gateName: device.gate.name,
      lastActive: device.lastActive || undefined,
      createdAt: device.createdAt,
    };
  }

  /**
   * List all devices in an organization.
   */
  async findAll(organizationId: string): Promise<DeviceResponseDto[]> {
    const devices = await this.prisma.device.findMany({
      where: { organizationId },
      include: {
        branch: true,
        gate: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return devices.map((d) => ({
      id: d.id,
      deviceId: d.deviceId,
      name: d.name || undefined,
      branchId: d.branchId,
      branchName: d.branch.name,
      gateId: d.gateId,
      gateName: d.gate.name,
      lastActive: d.lastActive || undefined,
      createdAt: d.createdAt,
    }));
  }

  /**
   * Get a single device by ID.
   */
  async findOne(
    id: string,
    organizationId: string,
  ): Promise<DeviceResponseDto> {
    const device = await this.prisma.device.findFirst({
      where: { id, organizationId },
      include: {
        branch: true,
        gate: true,
      },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    return {
      id: device.id,
      deviceId: device.deviceId,
      name: device.name || undefined,
      branchId: device.branchId,
      branchName: device.branch.name,
      gateId: device.gateId,
      gateName: device.gate.name,
      lastActive: device.lastActive || undefined,
      createdAt: device.createdAt,
    };
  }

  /**
   * Update a device.
   */
  async update(
    id: string,
    dto: UpdateDeviceDto,
    organizationId: string,
  ): Promise<DeviceResponseDto> {
    const device = await this.prisma.device.findFirst({
      where: { id, organizationId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    // If gateId or branchId is being updated, validate ownership
    if (dto.gateId || dto.branchId) {
      const targetGateId = dto.gateId || device.gateId;
      const targetBranchId = dto.branchId || device.branchId;

      const gate = await this.prisma.gate.findFirst({
        where: {
          id: targetGateId,
          branchId: targetBranchId,
          branch: { organizationId },
        },
      });

      if (!gate) {
        throw new NotFoundException(
          'Target Gate or Branch not found or access denied',
        );
      }
    }

    const updated = await this.prisma.device.update({
      where: { id },
      data: {
        name: dto.name,
        branchId: dto.branchId,
        gateId: dto.gateId,
      },
      include: {
        branch: true,
        gate: true,
      },
    });

    return {
      id: updated.id,
      deviceId: updated.deviceId,
      name: updated.name || undefined,
      branchId: updated.branchId,
      branchName: updated.branch.name,
      gateId: updated.gateId,
      gateName: updated.gate.name,
      lastActive: updated.lastActive || undefined,
      createdAt: updated.createdAt,
    };
  }

  /**
   * Remove a device.
   */
  async remove(id: string, organizationId: string): Promise<void> {
    const device = await this.prisma.device.findFirst({
      where: { id, organizationId },
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${id} not found`);
    }

    await this.prisma.device.delete({
      where: { id },
    });
  }

  /**
   * Validate organization code for device pairing.
   */
  async validateOrganizationCode(code: string) {
    const org = await this.prisma.organization.findUnique({
      where: { code },
    });

    if (!org) {
      throw new NotFoundException(`Organization with code ${code} not found`);
    }

    return {
      id: org.id,
      name: org.name,
      code: org.code,
    };
  }
}
