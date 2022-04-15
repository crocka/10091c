const globals = require('@jest/globals');
const request = require('supertest');
const app = require('../src/app');

const { describe, it, expect } = globals;

describe('POST /api/login', () => {
  it('should allow login request from thomas.', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'thomas', password: '123456' });
    expect(res.body.username).toEqual('thomas');
    expect(res.body.id).toEqual(1);
    expect(res.status).toEqual(200);
  });
});
