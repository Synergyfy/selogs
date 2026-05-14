import { Test, TestingModule } from '@nestjs/testing';
import { GatesService } from './gates.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { GateType } from '@prisma/client';

describe('GatesService', () => {
  let service: GatesService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    gate: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    branch: {
      findFirst: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GatesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<GatesService>(GatesService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of gates', async () => {
      const gates = [{ id: '1', name: 'Main Gate', type: GateType.BOTH, branchId: 'b1', branch: { name: 'HQ' }, createdAt: new Date() }];
      mockPrismaService.gate.findMany.mockResolvedValue(gates);

      const result = await service.findAll('org1');
      expect(result).toHaveLength(1);
      expect(result[0].branchName).toBe('HQ');
    });
  });

  describe('findOne', () => {
    it('should return a single gate', async () => {
      const gate = { id: '1', name: 'Main Gate', type: GateType.BOTH, branchId: 'b1', branch: { name: 'HQ' }, createdAt: new Date() };
      mockPrismaService.gate.findFirst.mockResolvedValue(gate);

      const result = await service.findOne('1', 'org1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if gate not found', async () => {
      mockPrismaService.gate.findFirst.mockResolvedValue(null);

      await expect(service.findOne('1', 'org1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a gate', async () => {
      mockPrismaService.branch.findFirst.mockResolvedValue({ id: 'b1' });
      const gate = { id: '1', name: 'Main Gate', type: GateType.BOTH, branchId: 'b1', branch: { name: 'HQ' }, createdAt: new Date() };
      mockPrismaService.gate.create.mockResolvedValue(gate);

      const result = await service.create({ name: 'Main Gate', type: GateType.BOTH, branchId: 'b1' }, 'org1');
      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException if branch not found', async () => {
      mockPrismaService.branch.findFirst.mockResolvedValue(null);

      await expect(service.create({ name: 'Main Gate', type: GateType.BOTH, branchId: 'b1' }, 'org1'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a gate', async () => {
      const gate = { id: '1', name: 'Main Gate', type: GateType.BOTH, branchId: 'b1', branch: { name: 'HQ' }, createdAt: new Date() };
      mockPrismaService.gate.findFirst.mockResolvedValue(gate);
      mockPrismaService.branch.findFirst.mockResolvedValue({ id: 'b1' });
      mockPrismaService.gate.update.mockResolvedValue({ ...gate, name: 'Updated Gate' });

      const result = await service.update('1', { name: 'Updated Gate' }, 'org1');
      expect(result.name).toBe('Updated Gate');
    });
  });

  describe('remove', () => {
    it('should delete a gate', async () => {
      mockPrismaService.gate.findFirst.mockResolvedValue({ id: '1' });
      mockPrismaService.gate.delete.mockResolvedValue({});

      await expect(service.remove('1', 'org1')).resolves.not.toThrow();
    });
  });
});
