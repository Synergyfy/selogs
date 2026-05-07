import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = app.get(PrismaService);
  });

  beforeEach(async () => {
    // Cleanup test data in correct order
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test-',
        },
      },
    });
    await prisma.organization.deleteMany({
      where: {
        name: {
          contains: 'Test Org',
        },
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/signup (POST)', () => {
    it('should fail to create super_admin with wrong secret', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test-super@example.com',
          password: 'password123',
          role: Role.super_admin,
          superAdminSecret: 'wrong-secret',
        })
        .expect(403);
    });

    it('should create super_admin with correct secret', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test-super-success@example.com',
          password: 'password123',
          role: Role.super_admin,
          superAdminSecret: 'vguard-super-secret-code',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.get('Set-Cookie')).toBeDefined();
        });
    });

    it('should create admin and organization', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test-admin@example.com',
          password: 'password123',
          role: Role.admin,
          organizationName: 'Test Org 1',
        })
        .expect(201)
        .then((res) => {
          expect(res.body.access_token).toBeDefined();
        });
    });

    it('should fail admin signup without organization name', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test-admin-fail@example.com',
          password: 'password123',
          role: Role.admin,
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login successfully', async () => {
      // First ensure user exists
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send({
          email: 'test-login@example.com',
          password: 'password123',
          role: Role.guard,
        })
        .expect(201);

      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'password123',
        })
        .expect(200)
        .then((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.get('Set-Cookie')).toBeDefined();
        });
    });

    it('should fail login with wrong password', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'wrongpassword',
        })
        .expect(403);
    });
  });
});
