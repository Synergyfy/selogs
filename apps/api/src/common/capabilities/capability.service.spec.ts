import { Test, TestingModule } from '@nestjs/testing';
import { CapabilityService } from './capability.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscriptionStatus } from '@prisma/client';
import { CapabilitySnapshot } from './capability.types';

/** Minimal typed mock for PrismaService */
type DeepPartialPrisma = {
  organization: {
    findUnique: jest.Mock;
  };
};

const makePrismaMock = (): DeepPartialPrisma => ({
  organization: {
    findUnique: jest.fn(),
  },
});

/** Factory for a base plan with generous defaults */
const basePlan = (overrides: Partial<{
  branchLimit: number;
  staffLimit: number;
  deviceLimit: number;
  hasOcr: boolean;
  hasAnalytics: boolean;
  hasExport: boolean;
}> = {}) => ({
  branchLimit: 2,
  staffLimit: 10,
  deviceLimit: 5,
  hasOcr: false,
  hasAnalytics: false,
  hasExport: false,
  ...overrides,
});

/** Factory for an active subscription */
const activeSubscription = (planOverrides = {}) => ({
  status: SubscriptionStatus.active,
  endDate: null,
  plan: basePlan(planOverrides),
});

/** Factory for an org result returned by findUnique */
const makeOrgResult = (subscriptionOverride: unknown, addons: unknown[] = []) => ({
  subscription: subscriptionOverride,
  plan: null,
  addons,
});

describe('CapabilityService', () => {
  let service: CapabilityService;
  let prismaMock: DeepPartialPrisma;

  beforeEach(async () => {
    prismaMock = makePrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CapabilityService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CapabilityService>(CapabilityService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('resolve()', () => {
    it('returns isSubscriptionActive=true for an active subscription', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(
        makeOrgResult(activeSubscription()),
      );

      const snapshot: CapabilitySnapshot = await service.resolve('org-1');

      expect(snapshot.isSubscriptionActive).toBe(true);
      expect(snapshot.branchLimit).toBe(2);
      expect(snapshot.staffLimit).toBe(10);
      expect(snapshot.deviceLimit).toBe(5);
    });

    it('returns isSubscriptionActive=true for a trialing subscription', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(
        makeOrgResult({
          status: SubscriptionStatus.trialing,
          endDate: null,
          plan: basePlan(),
        }),
      );

      const snapshot = await service.resolve('org-1');

      expect(snapshot.isSubscriptionActive).toBe(true);
    });

    it('returns isSubscriptionActive=false when endDate is in the past', async () => {
      const yesterday = new Date(Date.now() - 86_400_000);
      prismaMock.organization.findUnique.mockResolvedValue(
        makeOrgResult({
          status: SubscriptionStatus.active,
          endDate: yesterday,
          plan: basePlan(),
        }),
      );

      const snapshot = await service.resolve('org-1');

      expect(snapshot.isSubscriptionActive).toBe(false);
    });

    it('returns isSubscriptionActive=false for canceled status', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(
        makeOrgResult({
          status: SubscriptionStatus.canceled,
          endDate: null,
          plan: basePlan(),
        }),
      );

      const snapshot = await service.resolve('org-1');

      expect(snapshot.isSubscriptionActive).toBe(false);
    });

    it('returns isSubscriptionActive=false when no subscription exists', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(
        makeOrgResult(null),
      );

      const snapshot = await service.resolve('org-1');

      expect(snapshot.isSubscriptionActive).toBe(false);
      expect(snapshot.branchLimit).toBe(0);
    });

    it('returns inactive snapshot when org is not found', async () => {
      prismaMock.organization.findUnique.mockResolvedValue(null);

      const snapshot = await service.resolve('nonexistent');

      expect(snapshot.isSubscriptionActive).toBe(false);
      expect(snapshot.branchLimit).toBe(0);
    });

    it('accumulates numeric limits from active add-ons', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        ...makeOrgResult(activeSubscription()),
        addons: [
          {
            quantity: 2,
            addon: {
              branchLimitInc: 1,
              staffLimitInc: 5,
              deviceLimitInc: 0,
              grantsOcr: false,
              grantsAnalytics: false,
              grantsExport: false,
            },
          },
        ],
      });

      const snapshot = await service.resolve('org-1');

      // plan has branchLimit=2, addon adds 1×2 = 2 extra
      expect(snapshot.branchLimit).toBe(4);
      // plan has staffLimit=10, addon adds 5×2 = 10 extra
      expect(snapshot.staffLimit).toBe(20);
      // deviceLimit unchanged
      expect(snapshot.deviceLimit).toBe(5);
    });

    it('grants boolean features from active add-ons', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        ...makeOrgResult(activeSubscription()),
        addons: [
          {
            quantity: 1,
            addon: {
              branchLimitInc: 0,
              staffLimitInc: 0,
              deviceLimitInc: 0,
              grantsOcr: true,
              grantsAnalytics: false,
              grantsExport: true,
            },
          },
        ],
      });

      const snapshot = await service.resolve('org-1');

      expect(snapshot.hasOcr).toBe(true);
      expect(snapshot.hasAnalytics).toBe(false);
      expect(snapshot.hasExport).toBe(true);
    });

    it('falls back to org-level plan when no subscription record exists', async () => {
      prismaMock.organization.findUnique.mockResolvedValue({
        subscription: null,
        plan: basePlan({ branchLimit: 3, hasAnalytics: true }),
        addons: [],
      });

      const snapshot = await service.resolve('org-1');

      // No subscription record — isActive returns false, limits still read from org.plan
      expect(snapshot.isSubscriptionActive).toBe(false);
      expect(snapshot.branchLimit).toBe(3);
      expect(snapshot.hasAnalytics).toBe(true);
    });
  });
});
