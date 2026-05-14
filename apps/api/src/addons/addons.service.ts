import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../paystack/paystack.service';
import { CreateAddonDto, UpdateAddonDto } from './dto';

@Injectable()
export class AddonsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paystack: PaystackService,
  ) {}

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

  /**
   * Purchase an add-on standalone using saved authorization
   */
  async purchaseAddonStandalone(organizationId: string, email: string, addonId: string) {
    const addon = await this.findOne(addonId);
    if (!addon.isActive) {
      throw new BadRequestException('Addon is currently not active');
    }

    const sub = await this.prisma.subscription.findUnique({
      where: { organizationId },
    });

    if (!sub || sub.status !== 'active') {
      throw new BadRequestException('An active subscription is required to purchase standalone add-ons');
    }

    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { organizationId, isDefault: true },
    });

    if (!paymentMethod) {
      throw new BadRequestException('No default payment method found for organization');
    }

    // Determine prorated amount or just full amount for next cycle.
    // For simplicity, we charge the full monthly amount for the rest of the cycle, 
    // or multiply by cycle months. Here we multiply by the subscription's cycle.
    let months = 1;
    if (sub.billingCycle === 'QUARTERLY') months = 3;
    if (sub.billingCycle === 'YEARLY') months = 12;

    const amount = addon.monthlyPrice * months;

    const metadata = {
      organizationId,
      addonId: addon.id,
      type: 'addon_purchase',
    };

    // Charge the authorization
    const chargeResult = await this.paystack.chargeAuthorization(email, amount, paymentMethod.authorizationCode, metadata);

    if (chargeResult.data.status !== 'success') {
      throw new BadRequestException('Failed to charge payment method');
    }

    // Assign add-on
    return this.prisma.organizationAddon.upsert({
      where: { organizationId_addonId: { organizationId, addonId: addon.id } },
      update: {},
      create: { organizationId, addonId: addon.id },
    });
  }
}
