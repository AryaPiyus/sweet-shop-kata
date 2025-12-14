import request from 'supertest';
import app from '../app';
import { cleanDb } from './setup';
import prisma from '../db/client';
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
        name: 'Gulab Jamun',
        price: 15.00,
        category: 'Syrup Based',
        quantity: 100
      });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Gulab Jamun');
    expect(res.body.category).toBe('Syrup Based');
    expect(res.body).toHaveProperty('id');
    expect(typeof res.body.id).toBe('number'); 
  });
  it('GET /api/sweets should return a list of sweets', async () => {
    await prisma.sweet.deleteMany(); 
    
    await prisma.sweet.create({
      data: {
        name: 'Rasgulla',
        price: 12.00,
        category: 'Syrup Based',
        quantity: 50
      }
    });

    const res = await request(app).get('/api/sweets');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    
    const rasgulla = res.body.find((s: any) => s.name === 'Rasgulla');
    expect(rasgulla).toBeDefined();
    expect(rasgulla).toHaveProperty('price', 12.00);
  });

  it('PATCH /api/sweets/:id should update an existing sweet', async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      email: 'manager@example.com',
      password: 'password123'
    });
    
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'manager@example.com',
      password: 'password123'
    });
    const token = loginRes.body.token;

    const sweet = await prisma.sweet.create({
      data: {
        name: 'Kaju Katli',
        price: 20.00,
        category: 'Dry Fruit',
        quantity: 50
      }
    });

    const res = await request(app)
      .patch(`/api/sweets/${sweet.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        price: 25.00
      });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(25.00);
    expect(res.body.name).toBe('Kaju Katli');
  });

  it('DELETE /api/sweets/:id should delete a sweet', async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      email: 'deleter@example.com',
      password: 'password123'
    });
    
    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'deleter@example.com',
      password: 'password123'
    });
    const token = loginRes.body.token;

    const sweet = await prisma.sweet.create({
      data: { name: 'Barfi', price: 8.00, category: 'Milk Based', quantity: 20 }
    });

    const res = await request(app)
      .delete(`/api/sweets/${sweet.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);

    const checkDb = await prisma.sweet.findUnique({ where: { id: sweet.id } });
    expect(checkDb).toBeNull();
  });
});
