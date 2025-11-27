import request from 'supertest';
import { describe, it, expect, vi, beforeAll } from 'vitest';

// mock del servicio de productos
vi.mock('../services/products.service.js', () => {
  return {
    getAllProducts: vi.fn(async () => [{ id: '1', name: 'p1', price: 10 }]),
    getProductById: vi.fn(async (id) => (id === '1' ? { id: '1', name: 'p1', price: 10 } : null)),
    createNewProduct: vi.fn(async (data) => ({ id: 'new-id', ...data })),
    removeProduct: vi.fn(async (id) => {
      if (id !== '1') {
        const err = new Error('Producto no encontrado');
        err.status = 404;
        throw err;
      }
      return true;
    })
  };
});

// mock del middleware auth para tests
vi.mock('../middleware/auth.middleware.js', () => {
  return { default: (req, res, next) => next() };
});

let app;
beforeAll(async () => {
  const mod = await import('../../index.js');
  app = mod.default;
});

describe('Products routes', () => {
  it('GET /api/products devuelve lista', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/products/:id devuelve producto existente', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', '1');
  });

  it('GET /api/products/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/api/products/unknown');
    expect(res.status).toBe(404);
  });

  it('POST /api/products/create crea producto (protegido, mock auth)', async () => {
    const res = await request(app)
      .post('/api/products/create')
      .send({ name: 'Nuevo', price: 50 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
  });

  it('DELETE /api/products/:id elimina producto existente', async () => {
    const res = await request(app).delete('/api/products/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /api/products/:id devuelve 404 si no existe', async () => {
    const res = await request(app).delete('/api/products/unknown');
    expect(res.status).toBe(404);
  });
});