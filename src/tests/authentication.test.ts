import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';


/* Connecting to the database before each test. */
beforeEach(async () => {
  await connectDB()
});

/* Closing database connection after each test. */
afterEach(async () => {
  await disconnectDB();
  await new Promise((resolve) => {
    server.close(resolve);
  });
});

describe('POST /users/register', () => {
  test('should return 400 if user already exists', async () => {
    const existingUser = {
      username: 'richotaru123',
      email: 'malish@indicina.co',
      password: '12345',
    };

    await request(app)
      .post('/api/v1/users/register')
      .send(existingUser)
      .set('Accept', 'application/json');

    const response = await request(app)
      .post('/api/v1/users/register')
      .send(existingUser)
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Email already exist');
  });

  test('should create a new user and return 201 status code', async () => {
    const newUser = {
      username: 'richotaru1234',
      email: 'richotaru@itana.co',
      password: '12345',
    };

    const response = await request(app)
      .post('/api/v1/users/register')
      .send(newUser)
      .set('Accept', 'application/json');

    /** Skip checks if user already exist */
    if (response.status !== 400) {
      /** Validate status code and return payload */
      expect(response.status).toBe(201);
      expect(response.body.message).toEqual('User registered successfully');
    }
  });
});


describe('POST /users/login', () => {
  test('Should login the user and return 200 status code', async () => {
    const user = {
      email: 'malish@indicina.co',
      password: '12345',
    }
    const response = await request(app)
      .post('/api/v1/users/login')
      .send(user);

    /** Validate status code and cookie */
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toHaveLength(184);
  });
});

