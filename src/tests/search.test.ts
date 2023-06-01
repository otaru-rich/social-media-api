import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';

import * as User from '../services/user.services';
import * as Post from '../services/post.service';
import { IUser } from '../models/user.model';


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

describe('Search API', () => {
  let token: string = '';
  let user: IUser ;

  // Simulate user authentication
  beforeAll(async () => {

    const agent = request.agent(app);

    // Register a new user
    await agent.post('/api/v1/users/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    });

    // Login the user
    const response = await agent.post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = response.body.token;
    user = await  User.getUserByEmail('test@example.com') as IUser;
  });

  test('should search for posts based on title', async () => {
    // Create test posts
    await Post.create({ title: 'First post', content: 'This is the first post', user: user._id });
    await Post.create({ title: 'Second post', content: 'This is the second post', user: user._id });
    await Post.create({ title: 'Third post', content: 'This is the third post', user: user._id });

    const response = await request(app)
      .get('/api/v1/search/posts')
      .set('Authorization', `Bearer ${token}`)
      .query({ title: 'first', content: ''});

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data[0]).toHaveProperty('title', 'First post');
    expect(response.body.data[0]).toHaveProperty('content', 'This is the first post');
  });

  test('should search for posts based on content', async () => {
    // Create test posts
    await Post.create({ title: 'Post 1', content: 'This is post 1', user: user._id });
    await Post.create({ title: 'Post 2', content: 'This is post 2', user: user._id });
    await Post.create({ title: 'Post 3', content: 'This is post 3', user: user._id });

    const response = await request(app)
      .get('/api/v1/search/posts')
      .set('Authorization', `Bearer ${token}`)
      .query({ title: '', content: 'This is post' });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data[0]).toHaveProperty('title', 'Post 1');
    expect(response.body.data[1]).toHaveProperty('title', 'Post 2');
  });
});
