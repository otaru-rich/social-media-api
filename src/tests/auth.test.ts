import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '../..'
import { describe, expect, test } from '@jest/globals';

import * as User from '../services/user.service'


describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to the database
    await connectDB()
  });

  afterAll(async () => {
    // Clean up any test data after testing
    await User.clearUsers();

    // Close the database connection
    await disconnectDB();
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('should register a new user', async () => {
    const response = await request(app).post('/api/v1/users/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Skip if user already exist.
    if (response.status < 300) {
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'User registered successfully');
    } else if (response.status > 300) {
      expect(response.status).toBe(409)
      expect(response.body).toHaveProperty('message', 'Email already exist');
    }
  });

  test('should login with valid credentials', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toHaveLength(184);
  });

  test('should return an error with invalid credentials', async () => {
    const response = await request(app).post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });
});
