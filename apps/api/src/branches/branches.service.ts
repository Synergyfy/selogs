import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto, BranchResponseDto } from './dto/branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  /**
   * List all branches for an organization.
   */
  async findAll(organizationId: string): Promise<BranchResponseDto[]> {
    return this.prisma.branch.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get a single branch by ID.
   */
  async findOne(id: string, organizationId: string): Promise<BranchResponseDto> {
    const branch = await this.prisma.branch.findFirst({
      where: { id, organizationId },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return branch;
  }

  /**
   * Create a new branch.
   */
  async create(dto: CreateBranchDto, organizationId: string): Promise<BranchResponseDto> {
    let code = dto.code;

    if (!code) {
      // Generate a unique 8-character code if not provided
      code = Math.random().toString(36).substring(2, 10).toUpperCase();
    }

    const existing = await this.prisma.branch.findUnique({
      where: { code },
    });

    if (existing) {
      if (dto.code) {
        throw new ConflictException(`Branch code ${dto.code} already exists`);
      }
      // If auto-generated code exists (unlikely), try again or just throw for simplicity now
      throw new ConflictException(`Generated branch code conflict. Please try again.`);
    }

    return this.prisma.branch.create({
      data: {
        ...dto,
        code: code!,
        organizationId,
      },
    });
  }

  /**
   * Update a branch.
   */
  async update(id: string, dto: UpdateBranchDto, organizationId: string): Promise<BranchResponseDto> {
    await this.findOne(id, organizationId);

    return this.prisma.branch.update({
      where: { id },
      data: dto,
    });
  }

  /**
   * Delete a branch.
   */
  async remove(id: string, organizationId: string): Promise<void> {
    await this.findOne(id, organizationId);

    await this.prisma.branch.delete({
      where: { id },
    });
  }
}
