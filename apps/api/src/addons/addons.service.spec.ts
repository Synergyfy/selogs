import { Test, TestingModule } from '@nestjs/testing';
import { AddonsService } from './addons.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('AddonsService', () => {
  let service: AddonsService;
  let prisma: PrismaService;

  const mockPrisma = {
    addon: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddonsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AddonsService>(AddonsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new addon', async () => {
      const dto = { name: 'Test Addon', monthlyPrice: 1000 };
      mockPrisma.addon.findUnique.mockResolvedValue(null);
      mockPrisma.addon.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto as any);
      expect(result.name).toBe(dto.name);
      expect(mockPrisma.addon.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if addon exists', async () => {
      const dto = { name: 'Existing', monthlyPrice: 1000 };
      mockPrisma.addon.findUnique.mockResolvedValue({ id: '1', ...dto });

      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return an addon if found', async () => {
      mockPrisma.addon.findUnique.mockResolvedValue({ id: '1', name: 'Test' });
      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrisma.addon.findUnique.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });
});
