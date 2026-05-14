import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { Role, GateType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('GatesController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;
  let configService: ConfigService;
  
  let adminToken: string;
  let orgId: string;
  let branchId: string;
  let gateId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
    configService = app.get<ConfigService>(ConfigService);

    // Setup DB state
    const org = await prisma.organization.create({
      data: { name: 'E2E Test Org', code: 'E2ETST' }
    });
    orgId = org.id;

    const branch = await prisma.branch.create({
      data: { name: 'HQ', code: 'E2EHQ', organizationId: orgId }
    });
    branchId = branch.id;

    const admin = await prisma.user.create({
      data: {
        email: 'admin_gate_e2e@test.com',
        passwordHash: 'hash',
        role: Role.admin,
        organizationId: orgId,
      }
    });

    adminToken = await jwtService.signAsync(
      { sub: admin.id, email: admin.email, role: admin.role, organizationId: orgId },
      { secret: configService.get('JWT_SECRET'), expiresIn: '1h' }
    );
  });

  afterAll(async () => {
    await prisma.gate.deleteMany({ where: { branch: { organizationId: orgId } } });
    await prisma.branch.deleteMany({ where: { organizationId: orgId } });
    await prisma.user.deleteMany({ where: { email: 'admin_gate_e2e@test.com' } });
    await prisma.organization.deleteMany({ where: { id: orgId } });
    await app.close();
  });

  it('/gates (POST)', () => {
    return request(app.getHttpServer())
      .post('/gates')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Main Gate',
        type: GateType.BOTH,
        branchId: branchId,
      })
      .expect(201)
      .expect((res: any) => {
        expect(res.body.name).toBe('Main Gate');
        gateId = res.body.id;
      });
  });

  it('/gates (GET)', () => {
    return request(app.getHttpServer())
      .get('/gates')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res: any) => {
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].id).toBe(gateId);
      });
  });

  it('/gates/:id (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/gates/${gateId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Updated Gate' })
      .expect(200)
      .expect((res: any) => {
        expect(res.body.name).toBe('Updated Gate');
      });
  });

  it('/gates/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/gates/${gateId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
