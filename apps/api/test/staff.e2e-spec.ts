import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('StaffController (e2e)', () => {
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

    // Setup Admin and Organization
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'staff-admin@example.com',
        password: 'password123',
        role: Role.admin,
        organizationName: 'Staff Test Org',
      });

    accessToken = signupRes.body.access_token;

    // Create a branch and gate for shift tests
    const branch = await prisma.branch.create({
      data: {
        name: 'Test Branch',
        code: 'SB01',
        organizationId: (await prisma.organization.findFirst({
          where: { name: 'Staff Test Org' },
        }))!.id,
      },
    });
    branchId = branch.id;

    const gate = await prisma.gate.create({
      data: {
        name: 'Main Gate',
        branchId: branch.id,
      },
    });
    gateId = gate.id;

    await prisma.device.create({
      data: {
        deviceId: 'DEV-STAFF-1',
        organizationId: branch.organizationId,
        branchId: branch.id,
        gateId: gate.id,
      },
    });
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

  describe('/staff (POST)', () => {
    it('should onboard a new guard', () => {
      return request(app.getHttpServer())
        .post('/staff')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: 'guard1@example.com',
          password: 'password123',
          fullName: 'Guard One',
          staffId: 'G001',
          role: Role.guard,
          branchId,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.email).toBe('guard1@example.com');
          expect(res.body.staffId).toBe('G001');
          expect(res.body.role).toBe(Role.guard);
        });
    });

    it('should fail if email is taken', () => {
      return request(app.getHttpServer())
        .post('/staff')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: 'staff-admin@example.com',
          password: 'password123',
          fullName: 'Dup',
          staffId: 'D001',
          role: Role.guard,
        })
        .expect(409);
    });
  });

  describe('Shift Lifecycle', () => {
    it('should start a shift (Check-In)', () => {
      return request(app.getHttpServer())
        .post('/staff/checkin')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          staffId: 'G001',
          deviceId: 'DEV-STAFF-1',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.startTime).toBeDefined();
          expect(res.body.staffId).toBe('G001');
        });
    });

    it('should fail to check in twice', () => {
      return request(app.getHttpServer())
        .post('/staff/checkin')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          staffId: 'G001',
          deviceId: 'DEV-STAFF-1',
        })
        .expect(409);
    });

    it('should end a shift (Check-Out)', () => {
      return request(app.getHttpServer())
        .post('/staff/checkout/G001')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.endTime).toBeDefined();
        });
    });
  });
});
