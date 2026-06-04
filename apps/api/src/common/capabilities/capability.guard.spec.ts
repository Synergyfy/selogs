import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';
import { CapabilityGuard } from './capability.guard';
import { CapabilityService } from './capability.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { CAPABILITY_KEY, CapabilitySnapshot } from './capability.types';


/** Build a mock ExecutionContext with the given user payload */
const makeContext = (
  user: { sub: string; role: Role; organizationId?: string },
  handler = () => {},
): ExecutionContext =>
  ({
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => handler,
    getClass: () => class {},
  } as unknown as ExecutionContext);

/** Active snapshot with comfortable headroom */
const activeSnapshot = (overrides: Partial<CapabilitySnapshot> = {}): CapabilitySnapshot => ({
  isSubscriptionActive: true,
  branchLimit: 5,
  staffLimit: 20,
  deviceLimit: 10,
  hasOcr: true,
  hasAnalytics: true,
  hasExport: true,
  ...overrides,
});

describe('CapabilityGuard', () => {
  let guard: CapabilityGuard;
  let reflector: { getAllAndOverride: jest.Mock };
  let capabilityService: {
    resolve: jest.Mock;
    getUsageCounts: jest.Mock;
  };
  const mockNotifications = { create: jest.fn() };

  beforeEach(async () => {
    reflector = { getAllAndOverride: jest.fn() };
    capabilityService = {
      resolve: jest.fn(),
      getUsageCounts: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CapabilityGuard,
        { provide: Reflector, useValue: reflector },
        { provide: CapabilityService, useValue: capabilityService },
        { provide: NotificationsService, useValue: mockNotifications },
      ],
    }).compile();

    guard = module.get<CapabilityGuard>(CapabilityGuard);
  });

  afterEach(() => jest.clearAllMocks());

  it('passes through when no @Capability() decorator is present', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);

    const result = await guard.canActivate(
      makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' }),
    );

    expect(result).toBe(true);
    expect(capabilityService.resolve).not.toHaveBeenCalled();
  });

  it('passes through for super_admin regardless of capability', async () => {
    reflector.getAllAndOverride.mockReturnValue('branch:create');

    const result = await guard.canActivate(
      makeContext({ sub: 'u1', role: Role.super_admin }),
    );

    expect(result).toBe(true);
    expect(capabilityService.resolve).not.toHaveBeenCalled();
  });

  it('throws ForbiddenException when organizationId is missing from JWT', async () => {
    reflector.getAllAndOverride.mockReturnValue('branch:create');

    await expect(
      guard.canActivate(makeContext({ sub: 'u1', role: Role.admin })),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException when subscription is inactive', async () => {
    reflector.getAllAndOverride.mockReturnValue('branch:create');
    capabilityService.resolve.mockResolvedValue(
      activeSnapshot({ isSubscriptionActive: false }),
    );

    await expect(
      guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
    ).rejects.toThrow(ForbiddenException);
  });

  describe('branch:create', () => {
    it('allows when branch count is below limit', async () => {
      reflector.getAllAndOverride.mockReturnValue('branch:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ branchLimit: 3 }));
      capabilityService.getUsageCounts.mockResolvedValue({ branches: 2, staff: 0, devices: 0 });

      const result = await guard.canActivate(
        makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' }),
      );

      expect(result).toBe(true);
    });

    it('throws when branch count equals the limit', async () => {
      reflector.getAllAndOverride.mockReturnValue('branch:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ branchLimit: 2 }));
      capabilityService.getUsageCounts.mockResolvedValue({ branches: 2, staff: 0, devices: 0 });

      await expect(
        guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('staff:create', () => {
    it('allows when staff count is below limit', async () => {
      reflector.getAllAndOverride.mockReturnValue('staff:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ staffLimit: 10 }));
      capabilityService.getUsageCounts.mockResolvedValue({ branches: 0, staff: 9, devices: 0 });

      const result = await guard.canActivate(
        makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' }),
      );

      expect(result).toBe(true);
    });

    it('throws when staff count equals the limit', async () => {
      reflector.getAllAndOverride.mockReturnValue('staff:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ staffLimit: 5 }));
      capabilityService.getUsageCounts.mockResolvedValue({ branches: 0, staff: 5, devices: 0 });

      await expect(
        guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('device:create', () => {
    it('allows when device count is below limit', async () => {
      reflector.getAllAndOverride.mockReturnValue('device:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ deviceLimit: 5 }));
      capabilityService.getUsageCounts.mockResolvedValue({ branches: 0, staff: 0, devices: 4 });

      const result = await guard.canActivate(
        makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' }),
      );

      expect(result).toBe(true);
    });

    it('throws when device count equals the limit', async () => {
      reflector.getAllAndOverride.mockReturnValue('device:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ deviceLimit: 2 }));
      capabilityService.getUsageCounts.mockResolvedValue({ branches: 0, staff: 0, devices: 2 });

      await expect(
        guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('gate:create', () => {
    it('passes through with an active subscription (no numeric cap)', async () => {
      reflector.getAllAndOverride.mockReturnValue('gate:create');
      capabilityService.resolve.mockResolvedValue(activeSnapshot());

      const result = await guard.canActivate(
        makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' }),
      );

      expect(result).toBe(true);
    });
  });

  describe('analytics:use', () => {
    it('allows when plan includes analytics', async () => {
      reflector.getAllAndOverride.mockReturnValue('analytics:use');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ hasAnalytics: true }));

      const result = await guard.canActivate(
        makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' }),
      );

      expect(result).toBe(true);
    });

    it('throws when plan does not include analytics', async () => {
      reflector.getAllAndOverride.mockReturnValue('analytics:use');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ hasAnalytics: false }));

      await expect(
        guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('ocr:use', () => {
    it('throws when plan does not include OCR', async () => {
      reflector.getAllAndOverride.mockReturnValue('ocr:use');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ hasOcr: false }));

      await expect(
        guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('export:use', () => {
    it('throws when plan does not include export', async () => {
      reflector.getAllAndOverride.mockReturnValue('export:use');
      capabilityService.resolve.mockResolvedValue(activeSnapshot({ hasExport: false }));

      await expect(
        guard.canActivate(makeContext({ sub: 'u1', role: Role.admin, organizationId: 'o1' })),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
