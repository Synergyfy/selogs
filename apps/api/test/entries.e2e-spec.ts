import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { Role } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

describe('EntriesController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let accessToken: string;
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
        email: 'entry-admin@example.com',
        password: 'password123',
        role: Role.admin,
        organizationName: 'Entry Test Org',
      });

    accessToken = signupRes.body.access_token;

    const orgId = (await prisma.organization.findFirst({
      where: { name: 'Entry Test Org' },
    }))!.id;
    const branch = await prisma.branch.create({
      data: { name: 'Entry Branch', code: 'EB01', organizationId: orgId },
    });
    const gate = await prisma.gate.create({
      data: { name: 'Entry Gate', branchId: branch.id },
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

  describe('Vehicle Lifecycle', () => {
    it('should check in a vehicle', () => {
      return request(app.getHttpServer())
        .post('/entries/checkin')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          plateNumber: 'ABC-123',
          phoneNumber: '08012345678',
          gateId,
        })
        .expect(201)
        .then((res) => {
          expect(res.body.plateNumber).toBe('ABC-123');
          expect(res.body.status).toBe('IN');
        });
    });

    it('should prevent checking in the same vehicle twice', () => {
      return request(app.getHttpServer())
        .post('/entries/checkin')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          plateNumber: 'ABC-123',
          gateId,
        })
        .expect(409);
    });

    it('should check out a vehicle', async () => {
      const entries = await request(app.getHttpServer())
        .get('/entries')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const entryId = entries.body.data[0].id;

      return request(app.getHttpServer())
        .patch(`/entries/${entryId}/checkout`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ gateId })
        .expect(200)
        .then((res) => {
          expect(res.body.status).toBe('OUT');
          expect(res.body.checkOutTime).toBeDefined();
        });
    });
  });
});
