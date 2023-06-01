import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';
import { IUser } from '../models/user.model'

import * as User from '../services/user.services'
import * as Post from '../services/post.service'
import * as Comment from '../services/comment.service'


describe('Comment API', () => {
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
    await Comment.clearComments();

    // Close the database connection
    await disconnectDB();
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('should create a new comment', async () => {
    const post = await Post.create({
      title: 'Comment Test Post',
      content: 'This is a comment test post',
      user: user._id.toString()
    })
    const response = await request(app)
      .post(`/api/v1/posts/${post._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: 'Test comment',
        userId: user._id
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toEqual('Comment added successfully');
    expect(response.body.data).toHaveProperty('content', 'Test comment');
  });

  test('should retrieve comments for a post', async () => {
    const posts = await Post.getPostsByUserId(user._id.toString())
    const response = await request(app)
      .get(`/api/v1/posts/${posts[0]._id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('should delete a comment for a post', async () => {
    const posts = await Post.getPostsByUserId(user._id.toString())
    const comments = await Comment.getComments(posts[0]._id)
    const response = await request(app)
      .delete(`/api/v1/posts/${comments[0]._id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
  });
});
