import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '../..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';

import * as User from '../services/user.service';
import * as Post from '../services/post.service';
import { IUser } from '../models/user.model';


describe('Search API', () => {
  let token: string = '';
  let user: IUser ;

  // Simulate user authentication
  beforeAll(async () => {

    // Connect to the database
    await connectDB()

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

  afterAll(async () => {
    // Clean up any test data after testing
    await User.clearUsers();
    await Post.clearPosts();

    // Close the database connection
    await disconnectDB();
    await new Promise((resolve) => {
      server.close(resolve);
    });
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
    const response = await request(app)
      .get('/api/v1/search/posts')
      .set('Authorization', `Bearer ${token}`)
      .query({ title: '', content: 'This is post' });

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data[0]).toHaveProperty('title', 'First post');
    expect(response.body.data[1]).toHaveProperty('title', 'Second post');
  });
});
