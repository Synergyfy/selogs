import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGateDto, GateResponseDto, UpdateGateDto } from './dto/gate.dto';

@Injectable()
export class GatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all gates for a given organization.
   */
  async findAll(organizationId: string): Promise<GateResponseDto[]> {
    const gates = await this.prisma.gate.findMany({
      where: {
        branch: {
          organizationId,
        },
      },
      include: {
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return gates.map((g) => ({
      id: g.id,
      name: g.name,
      type: g.type,
      branchId: g.branchId,
      branchName: g.branch.name,
      createdAt: g.createdAt,
    }));
  }

  /**
   * Retrieves a single gate by ID.
   */
  async findOne(id: string, organizationId: string): Promise<GateResponseDto> {
    const gate = await this.prisma.gate.findFirst({
      where: {
        id,
        branch: { organizationId },
      },
      include: { branch: true },
    });

    if (!gate) {
      throw new NotFoundException(`Gate with ID ${id} not found`);
    }

    return {
      id: gate.id,
      name: gate.name,
      type: gate.type,
      branchId: gate.branchId,
      branchName: gate.branch.name,
      createdAt: gate.createdAt,
    };
  }

  /**
   * Creates a new gate.
   */
  async create(dto: CreateGateDto, organizationId: string): Promise<GateResponseDto> {
    // Validate branch ownership
    const branch = await this.prisma.branch.findFirst({
      where: { id: dto.branchId, organizationId },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found or access denied');
    }

    const gate = await this.prisma.gate.create({
      data: {
        name: dto.name,
        type: dto.type,
        branchId: dto.branchId,
      },
      include: { branch: true },
    });

    return {
      id: gate.id,
      name: gate.name,
      type: gate.type,
      branchId: gate.branchId,
      branchName: gate.branch.name,
      createdAt: gate.createdAt,
    };
  }

  /**
   * Updates an existing gate.
   */
  async update(id: string, dto: UpdateGateDto, organizationId: string): Promise<GateResponseDto> {
    const gate = await this.prisma.gate.findFirst({
      where: { id, branch: { organizationId } },
    });

    if (!gate) {
      throw new NotFoundException(`Gate with ID ${id} not found`);
    }

    if (dto.branchId) {
      const branch = await this.prisma.branch.findFirst({
        where: { id: dto.branchId, organizationId },
      });
      if (!branch) throw new NotFoundException('Branch not found or access denied');
    }

    const updated = await this.prisma.gate.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        branchId: dto.branchId,
      },
      include: { branch: true },
    });

    return {
      id: updated.id,
      name: updated.name,
      type: updated.type,
      branchId: updated.branchId,
      branchName: updated.branch.name,
      createdAt: updated.createdAt,
    };
  }

  /**
   * Deletes a gate.
   */
  async remove(id: string, organizationId: string): Promise<void> {
    const gate = await this.prisma.gate.findFirst({
      where: { id, branch: { organizationId } },
    });

    if (!gate) {
      throw new NotFoundException(`Gate with ID ${id} not found`);
    }

    await this.prisma.gate.delete({
      where: { id },
    });
  }
}
