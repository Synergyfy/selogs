import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddonDto, UpdateAddonDto } from './dto';

@Injectable()
export class AddonsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new SaaS addon.
   */
  async create(createAddonDto: CreateAddonDto) {
    const existing = await this.prisma.addon.findUnique({
      where: { name: createAddonDto.name },
    });

    if (existing) {
      throw new ConflictException(`Addon with name ${createAddonDto.name} already exists`);
    }

    return this.prisma.addon.create({
      data: createAddonDto,
    });
  }

  /**
   * Lists all addons.
   */
  async findAll() {
    return this.prisma.addon.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lists only active addons.
   */
  async findAllActive() {
    return this.prisma.addon.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  /**
   * Gets an addon by ID.
   */
  async findOne(id: string) {
    const addon = await this.prisma.addon.findUnique({
      where: { id },
    });

    if (!addon) {
      throw new NotFoundException(`Addon with ID ${id} not found`);
    }

    return addon;
  }

  /**
   * Updates an addon.
   */
  async update(id: string, updateAddonDto: UpdateAddonDto) {
    await this.findOne(id);
    return this.prisma.addon.update({
      where: { id },
      data: updateAddonDto,
    });
  }

  /**
   * Deletes an addon.
   */
  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.addon.delete({
      where: { id },
    });
  }
}
