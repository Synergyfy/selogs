import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrganizationResponseDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<OrganizationResponseDto[]> {
    const orgs = await this.prisma.organization.findMany({
      include: {
        plan: true,
        _count: {
          select: {
            branches: true,
            users: true,
            devices: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orgs.map((org) => ({
      id: org.id,
      name: org.name,
      code: org.code || '',
      industry: org.industry || '',
      createdAt: org.createdAt,
      planName: org.plan?.name,
      branchCount: org._count.branches,
      staffCount: org._count.users,
      deviceCount: org._count.devices,
    }));
  }

  async findOne(id: string): Promise<any> {
    const org = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        plan: true,
        subscription: true,
        branches: true,
        _count: {
          select: {
            users: true,
            devices: true,
            entries: true,
          },
        },
      },
    });

    if (!org) throw new NotFoundException('Organization not found');

    return org;
  }

  async update(id: string, dto: UpdateOrganizationDto) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!org) throw new NotFoundException('Organization not found');

    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const org = await this.prisma.organization.findUnique({
      where: { id },
    });

    if (!org) throw new NotFoundException('Organization not found');

    // Instead of deleting, we might want to suspend or deactivate.
    // For now, let's just delete for Super Admin.
    return this.prisma.organization.delete({
      where: { id },
    });
  }
}
