import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new plan with automated pricing logic
   */
  async create(createPlanDto: CreatePlanDto) {
    const existing = await this.prisma.plan.findUnique({
      where: { name: createPlanDto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Plan with name ${createPlanDto.name} already exists`,
      );
    }

    const pricing = this.calculatePricing(createPlanDto);

    return this.prisma.plan.create({
      data: {
        ...createPlanDto,
        ...pricing,
      },
    });
  }

  /**
   * List all plans
   */
  async findAll() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { monthlyPrice: 'asc' },
    });
  }

  /**
   * Get a plan by ID
   */
  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  /**
   * Update a plan
   */
  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);

    // Re-calculate pricing if monthly price or discounts change
    const pricing = this.calculatePricing({
      ...plan,
      ...updatePlanDto,
      description: updatePlanDto.description ?? (plan.description || undefined),
    } as CreatePlanDto);

    return this.prisma.plan.update({
      where: { id },
      data: {
        ...updatePlanDto,
        ...pricing,
      },
    });
  }

  /**
   * Soft delete (deactivate) a plan
   */
  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.plan.update({
      where: { id },
      data: { isActive: false },
    });
  }

  /**
   * Helper to calculate quarterly and yearly prices based on discounts
   */
  private calculatePricing(dto: CreatePlanDto) {
    const monthlyPrice = dto.monthlyPrice;
    const qDiscount = dto.quarterlyDiscount || 0;
    const yDiscount = dto.yearlyDiscount || 0;

    const quarterlyPrice =
      dto.quarterlyPrice ?? monthlyPrice * 3 * (1 - qDiscount / 100);

    const yearlyPrice =
      dto.yearlyPrice ?? monthlyPrice * 12 * (1 - yDiscount / 100);

    return {
      quarterlyPrice,
      yearlyPrice,
    };
  }
}
