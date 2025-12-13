import request from 'supertest';
import app from '../app';
import { cleanDb } from './setup';

describe('Sweet Endpoints', () => {
  beforeAll(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await cleanDb();
  });

  it('POST /api/sweets should create a new sweet (Authorized)', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'admin@example.com',
      password: 'password123'
    });

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123'
    });

    const token = loginRes.body.token;

    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`) 
      .send({
        name: 'Chocolate Lava Cake',
        price: 5.99,
        description: 'Gooey chocolate goodness',
        imageUrl: 'http://example.com/cake.jpg'
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Chocolate Lava Cake');
    expect(res.body).toHaveProperty('id');
  });
});
