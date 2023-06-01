import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import * as User from '../services/user.services'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';
import { IUser } from '../models/user.model'
import { getPostsByUserId } from '../services/post.service'
import { getComments } from '../services/comment.service'


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

describe('Comment API', () => {
  let token: string = '';
  let user: IUser ;
  beforeAll(async () => {
    /** Simulate user authentication */
    const agent = request.agent(app);
    const response = await agent.post('/api/v1/users/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    token = response.body.token;
    user = await  User.getUserByEmail('test@example.com') as IUser;
  });

  test('should create a new comment', async () => {
    const posts = await getPostsByUserId(user._id.toString())
    const response = await request(app)
      .post(`/api/v1/posts/${posts[0]._id}/comments`)
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
    const posts = await getPostsByUserId(user._id.toString())
    const response = await request(app)
      .get(`/api/v1/posts/${posts[0]._id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body.data).toBeInstanceOf(Array);
  });

  test('should delete a comment for a post', async () => {
    const posts = await getPostsByUserId(user._id.toString())
    const comments = await getComments(posts[0]._id)
    const response = await request(app)
      .delete(`/api/v1/posts/${comments[0]._id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body).toHaveProperty('message', 'Comment deleted successfully');
  });
});
