import request from 'supertest';
import { describe, it, expect, beforeAll } from 'vitest';

let app;

beforeAll(async () => {
  process.env.AUTH_USER = 'admin_test';
  process.env.AUTH_PASS = 'adminpass_test';
  process.env.JWT_SECRET = 'test_secret';
  const mod = await import('../../index.js');
  app = mod.default;
});

describe('Auth routes', () => {
  it('POST /auth/login devuelve token con credenciales válidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'admin_test', password: 'adminpass_test' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.token.startsWith('Bearer ')).toBeTruthy();
  });

  it('POST /auth/login falla con credenciales inválidas', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ username: 'bad', password: 'bad' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});