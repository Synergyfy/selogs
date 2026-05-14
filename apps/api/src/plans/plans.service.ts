import {
  Injectable,
  NotFoundException,
  ConflictException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { BillingCycle } from '@prisma/client';

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

    let { monthlyPrice, isFree, trialEnabled } = createPlanDto;
    
    if (isFree) {
      monthlyPrice = 0;
      trialEnabled = false;
    }

    const settings = await this.prisma.globalSettings.findUnique({ where: { id: 'global' } });
    const qDiscount = settings?.quarterlyDiscount || 0;
    const yDiscount = settings?.yearlyDiscount || 0;

    const pricing = this.calculatePricing(monthlyPrice, qDiscount, yDiscount);

    return this.prisma.plan.create({
      data: {
        ...createPlanDto,
        monthlyPrice,
        isFree: isFree ?? false,
        trialEnabled: trialEnabled ?? true,
        ...pricing,
        customFeatures: createPlanDto.customFeatures?.filter(f => f.trim() !== '') || [],
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

    let monthlyPrice = updatePlanDto.monthlyPrice ?? plan.monthlyPrice;
    let isFree = updatePlanDto.isFree ?? plan.isFree;
    let trialEnabled = updatePlanDto.trialEnabled ?? plan.trialEnabled;

    if (isFree) {
      monthlyPrice = 0;
      trialEnabled = false;
    }

    const settings = await this.prisma.globalSettings.findUnique({ where: { id: 'global' } });
    const qDiscount = settings?.quarterlyDiscount || 0;
    const yDiscount = settings?.yearlyDiscount || 0;

    const pricing = this.calculatePricing(monthlyPrice, qDiscount, yDiscount);

    return this.prisma.plan.update({
      where: { id },
      data: {
        ...updatePlanDto,
        monthlyPrice,
        isFree,
        trialEnabled,
        ...pricing,
        customFeatures: updatePlanDto.customFeatures?.filter(f => f.trim() !== '') || plan.customFeatures,
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
  private calculatePricing(monthlyPrice: number, qDiscount: number, yDiscount: number) {
    return {
      quarterlyPrice: +(monthlyPrice * 3 * (1 - qDiscount / 100)).toFixed(2),
      yearlyPrice: +(monthlyPrice * 12 * (1 - yDiscount / 100)).toFixed(2),
    };
  }

  /**
   * Recompute prices for all plans based on global discounts.
   */
  async recomputeAllPlanPrices() {
    const settings = await this.prisma.globalSettings.findUnique({ where: { id: 'global' } });
    const qDiscount = settings?.quarterlyDiscount || 0;
    const yDiscount = settings?.yearlyDiscount || 0;

    const plans = await this.prisma.plan.findMany({ where: { isFree: false } });

    if (plans.length === 0) return;

    await this.prisma.$transaction(
      plans.map(plan => {
        const pricing = this.calculatePricing(plan.monthlyPrice, qDiscount, yDiscount);
        return this.prisma.plan.update({
          where: { id: plan.id },
          data: pricing,
        });
      })
    );
  }
}
