import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import * as User from '../services/user.services'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';
import { IUser } from '../models/user.model'
import { getPostsByUserId } from '../services/post.service'


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

describe('Post API', () => {
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
    const posts = await getPostsByUserId(user._id.toString())
    const response = await request(app)
      .post(`/api/v1/posts/${posts[0]._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send({userId: user._id});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post liked successfully');
  });

  // Test case for unliking a post
  test('should unlike a post', async () => {
    const posts = await getPostsByUserId(user._id.toString())
    const response = await request(app)
      .delete(`/api/v1/posts/${posts[0]._id}/like`)
      .set('Authorization', `Bearer ${token}`)
      .send({userId: user._id});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Post unliked successfully');
  });
});
