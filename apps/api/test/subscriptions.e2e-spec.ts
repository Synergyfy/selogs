import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Subscriptions (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
  let organizationId: string;

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

    // Create a test admin user and organization
    const signupRes = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'test-billing-admin@example.com',
        password: 'password123',
        role: Role.admin,
        organizationName: 'Billing Test Org',
      });
    
    accessToken = signupRes.body.access_token;
    
    const user = await prisma.user.findUnique({
      where: { email: 'test-billing-admin@example.com' },
    });
    organizationId = user.organizationId;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.invoice.deleteMany({ where: { organizationId } });
    await prisma.subscription.deleteMany({ where: { organizationId } });
    await prisma.user.deleteMany({ where: { organizationId } });
    await prisma.organization.delete({ where: { id: organizationId } });
    await app.close();
  });

  describe('/subscriptions/me (GET)', () => {
    it('should return subscription status and usage', () => {
      return request(app.getHttpServer())
        .get('/subscriptions/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.usage).toBeDefined();
          expect(res.body.usage.branches).toBeDefined();
          expect(res.body.usage.staff).toBeDefined();
          expect(res.body.usage.devices).toBeDefined();
        });
    });
  });

  describe('/billing/invoices (GET)', () => {
    it('should return an empty list of invoices initially', () => {
      return request(app.getHttpServer())
        .get('/billing/invoices')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)
        .then((res) => {
          expect(res.body.items).toBeInstanceOf(Array);
          expect(res.body.total).toBe(0);
        });
    });
  });
});
