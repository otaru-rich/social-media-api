import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';

import * as User from '../services/user.service'
import { IUser } from '../models/user.model'
import * as Post from '../services/post.service'
import * as Like from '../services/like.service'


describe('Post API', () => {
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
    await Like.clearLikes();
    await disconnectDB();
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  // Test case for creating a new post
  test('should create a new post', async () => {
    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Post',
        content: 'This is a test post.',
        userId: `${user._id}`
      });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty('title', 'Test Post');
    expect(response.body.data).toHaveProperty('content', 'This is a test post.');
  });

  // Test case for retrieving user posts
  test('should retrieve user posts', async () => {
    const response = await request(app)
      .get('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({userId: user._id});

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test case for retrieving posts from followed users
  test('should retrieve posts from followed users', async () => {
    const response = await request(app)
      .get('/api/v1/posts/following')
      .set('Authorization', `Bearer ${token}`)
      .send({userId: user._id});

    expect(response.status).toBe(200);
    expect(response.body.data).toBeInstanceOf(Array);
  });

  // Test case for liking a post
  test('should like a post', async () => {
    const page = 1
    const limit = 10
    const posts = await Post.getPostsByUserId(user._id.toString(), page, limit)
    const response = await request(app)
      .post(`/api/v1/posts/${posts[0]._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send({userId: user._id});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post liked successfully');
  });

  // Test case for unliking a post
  test('should unlike a post', async () => {
    const page = 1
    const limit = 10
    const posts = await Post.getPostsByUserId(user._id.toString(), page, limit)
    const response = await request(app)
      .delete(`/api/v1/posts/${posts[0]._id}/unlike`)
      .set('Authorization', `Bearer ${token}`)
      .send({userId: user._id});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post unliked successfully');
  });

  // Test case for unliking a non-existing post
  test('should return an error when liking a non-existing post', async () => {
    const response = await request(app)
      .post(`/api/v1/posts/${user._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: user._id });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Post not found');
  });

  // Test case for unliking a non-existing post
  test('should return an error when unliking a non-existing post', async () => {
    const response = await request(app)
      .delete(`/api/v1/posts/${user._id}/unlike`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: user._id });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Post not found');
  });
});
