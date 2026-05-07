import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('BranchesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;

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

    // Signup an admin to get a token
    const res = await request(app.getHttpServer()).post('/auth/signup').send({
      email: 'branch-admin@example.com',
      password: 'password123',
      role: Role.admin,
      organizationName: 'Branch Test Org',
    });

    accessToken = res.body.access_token;
  });

  afterAll(async () => {
    // Cleanup in order
    await prisma.vehicleEntry.deleteMany({});
    await prisma.shift.deleteMany({});
    await prisma.device.deleteMany({});
    await prisma.gate.deleteMany({});
    await prisma.branch.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.organization.deleteMany({});
    await app.close();
  });

  describe('/branches (POST)', () => {
    it('should create a new branch', () => {
      return request(app.getHttpServer())
        .post('/branches')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Main Warehouse',
          address: '123 Test St',
          code: 'BR001',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.name).toBe('Main Warehouse');
          expect(res.body.code).toBe('BR001');
          expect(res.body.id).toBeDefined();
        });
    });

    it('should fail with duplicate branch code', async () => {
      await request(app.getHttpServer())
        .post('/branches')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Branch A',
          code: 'DUP01',
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/branches')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          name: 'Branch B',
          code: 'DUP01',
        })
        .expect(409);
    });
  });

  describe('/branches (GET)', () => {
    it('should list all branches for the organization', async () => {
      const res = await request(app.getHttpServer())
        .get('/branches')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('/branches/:id (PATCH)', () => {
    it('should update branch details', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/branches')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'Old Name', code: 'UPD01' });

      const branchId = createRes.body.id;

      return request(app.getHttpServer())
        .patch(`/branches/${branchId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ name: 'New Name' })
        .expect(200)
        .then((res) => {
          expect(res.body.name).toBe('New Name');
        });
    });
  });
});
