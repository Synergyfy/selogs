import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionsService } from './subscriptions.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaystackService } from '../paystack/paystack.service';
import { PlansService } from '../plans/plans.service';
import { NotFoundException } from '@nestjs/common';

describe('SubscriptionsService', () => {
  let service: SubscriptionsService;
  let prisma: PrismaService;

  const mockPrisma: any = {
    organization: {
      findUnique: jest.fn(),
    },
    branch: {
      count: jest.fn(),
    },
    user: {
      count: jest.fn(),
    },
    device: {
      count: jest.fn(),
    },
    subscription: {
      upsert: jest.fn(),
    },
    invoice: {
      create: jest.fn(),
    },
    $transaction: jest.fn((cb: any) => cb(mockPrisma)),
  };

  const mockPaystack = {
    initializeTransaction: jest.fn(),
    verifyTransaction: jest.fn(),
  };

  const mockPlans = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: PaystackService, useValue: mockPaystack },
        { provide: PlansService, useValue: mockPlans },
      ],
    }).compile();

    service = module.get<SubscriptionsService>(SubscriptionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrgSubscription', () => {
    it('should throw NotFoundException if organization does not exist', async () => {
      mockPrisma.organization.findUnique.mockResolvedValue(null);
      await expect(service.getOrgSubscription('org-1')).rejects.toThrow(NotFoundException);
    });

    it('should return usage summary correctly', async () => {
      const mockOrg = {
        id: 'org-1',
        plan: { id: 'plan-1', branchLimit: 5, staffLimit: 10, deviceLimit: 3 },
        subscription: null,
      };
      mockPrisma.organization.findUnique.mockResolvedValue(mockOrg);
      mockPrisma.branch.count.mockResolvedValue(2);
      mockPrisma.user.count.mockResolvedValue(4);
      mockPrisma.device.count.mockResolvedValue(1);

      const result = await service.getOrgSubscription('org-1');

      expect(result.usage.branches.used).toBe(2);
      expect(result.usage.branches.limit).toBe(5);
      expect(result.usage.staff.used).toBe(4);
      expect(result.usage.staff.limit).toBe(10);
      expect(result.usage.devices.used).toBe(1);
      expect(result.usage.devices.limit).toBe(3);
    });
  });
});
