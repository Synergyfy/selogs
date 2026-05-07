import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('DevicesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
  let branchId: string;
  let gateId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    prisma = app.get(PrismaService);

    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'device-admin@example.com',
        password: 'password123',
        role: Role.admin,
        organizationName: 'Device Test Org',
      });

    accessToken = signupRes.body.access_token;

    const orgId = (await prisma.organization.findFirst({
      where: { name: 'Device Test Org' },
    }))!.id;
    const branch = await prisma.branch.create({
      data: { name: 'Device Branch', code: 'DB01', organizationId: orgId },
    });
    branchId = branch.id;

    const gate = await prisma.gate.create({
      data: { name: 'Device Gate', branchId: branch.id },
    });
    gateId = gate.id;
  });

  afterAll(async () => {
    await prisma.shift.deleteMany({});
    await prisma.vehicleEntry.deleteMany({});
    await prisma.device.deleteMany({});
    await prisma.gate.deleteMany({});
    await prisma.branch.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.organization.deleteMany({});
    await app.close();
  });

  describe('/devices (POST)', () => {
    it('should register a new device', () => {
      return request(app.getHttpServer())
        .post('/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          deviceId: 'HANDHELD-001',
          name: 'Main Gate Scanner',
          branchId,
          gateId,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.deviceId).toBe('HANDHELD-001');
          expect(res.body.gateName).toBe('Device Gate');
        });
    });

    it('should fail with cross-tenant gate (hypothetically)', async () => {
      // Create another org and branch
      const otherOrg = await prisma.organization.create({
        data: { name: 'Other Org' },
      });
      const otherBranch = await prisma.branch.create({
        data: {
          name: 'Other Branch',
          code: 'OB01',
          organizationId: otherOrg.id,
        },
      });
      const otherGate = await prisma.gate.create({
        data: { name: 'Other Gate', branchId: otherBranch.id },
      });

      return request(app.getHttpServer())
        .post('/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          deviceId: 'HANDHELD-FAIL',
          branchId: otherBranch.id,
          gateId: otherGate.id,
        })
        .expect(404); // Service throws NotFound if gate doesn't belong to org
    });
  });

  describe('/devices (GET)', () => {
    it('should list all registered devices', () => {
      return request(app.getHttpServer())
        .get('/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
        });
    });
  });
});
