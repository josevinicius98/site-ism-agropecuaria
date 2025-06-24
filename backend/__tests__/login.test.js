import request from 'supertest';
import app from '../server.js';

describe('POST /api/login', () => {
  const login = process.env.TEST_LOGIN;
  const senha = process.env.TEST_PASSWORD;

  const testFn = login && senha ? it : it.skip;

  testFn('should return token and user data for valid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ login, senha });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('login', login);
  });
});
