import request from 'supertest';
import app from '../app';
import { cleanDb } from './setup';

describe('Auth Endpoints', () => {
  // 1. Clean the DB before running tests so we don't get "User already exists" errors
  beforeAll(async () => {
    await cleanDb();
  });

  // 2. Clean up after we are done
  afterAll(async () => {
    await cleanDb();
  });

  it('POST /api/auth/register should create a new user', async () => {
    // Act: Send a registration request
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    // Assert: We expect success (201 Created)
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
    expect(res.body).toHaveProperty('userId');
  });
  it('POST /api/auth/login should return a JWT token', async () => {
    await request(app).post('/api/auth/register').send({
      email: 'login@example.com',
      password: 'password123'
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'login@example.com',
      password: 'password123'
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
