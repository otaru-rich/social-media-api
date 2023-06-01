import request from 'supertest';
import { connectDB, disconnectDB } from '../config/database'
import { app, server } from '..'
import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';

import * as User from '../services/user.services'
import { IUser } from '../models/user.model'
import * as Follow from '../services/follow.service'


describe('Follow API', () => {
  let token: string = '';
  let userFollowed: IUser ;
  let userFollowing: IUser;

  // Simulate user authentication
  beforeAll(async () => {

    // Connect to the database
    await connectDB()

    const agent = request.agent(app);

    // Register two new user
    await agent.post('/api/v1/users/register').send({
      username: 'testuserfollowed',
      email: 'testfollowed@example.com',
      password: 'password123',
    });
    await agent.post('/api/v1/users/register').send({
      username: 'testuserfollowing',
      email: 'testfollowing@example.com',
      password: 'password123',
    });

    // Login the user that is following
    const response = await agent.post('/api/v1/users/login').send({
      email: 'testfollowing@example.com',
      password: 'password123',
    });

    token = response.body.token;
    userFollowed = await  User.getUserByEmail('testfollowed@example.com') as IUser;
    userFollowing = await  User.getUserByEmail('testfollowing@example.com') as IUser;
  });

  afterAll(async () => {
    // Clean up any test data after testing
    await User.clearUsers();
    await Follow.clearFollows();

    // Close the database connection
    await disconnectDB();
    await new Promise((resolve) => {
      server.close(resolve);
    });
  });

  test('should follow another user', async () => {
    const targetUserId = userFollowed._id;
    const response = await request(app)
      .post(`/api/v1/users/${targetUserId}/follow`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userFollowing._id });

    expect(response.status).toBe(200);
    expect(response.body.success).toBeTruthy();
    expect(response.body).toHaveProperty('message', 'User followed successfully');
  });

  test('should return a 400 status code with already followed user', async () => {
    const targetUserId = userFollowed._id;
    const response = await request(app)
      .post(`/api/v1/users/${targetUserId}/follow`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userFollowing._id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'User is already being followed');
  });

  test('should unfollow another user', async () => {
    const targetUserId = userFollowed._id;
    const response = await request(app)
      .delete(`/api/v1/users/${targetUserId}/unfollow`)
      .set('Authorization', `Bearer ${token}`)
      .send({ userId: userFollowing._id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'User unfollowed successfully');
  });
});
