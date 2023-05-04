// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// eslint-disable-next-line node/no-extraneous-import
import expect from 'expect';
import randomstring from 'randomstring';
import {LoginMessageResponse} from '../src/interfaces/interfaces';
import {UserTest} from '../src/interfaces/User';

const getUsers = (url: string | Function): Promise<UserTest[]> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + process.env.TEST_TOKEN)
      .send({
        query: '{users{id full_name email}}',
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const users = response.body.data.users;
          console.log('users', users);
          expect(users).toBeInstanceOf(Array);
          expect(users[0]).toHaveProperty('id');
          expect(users[0]).toHaveProperty('full_name');
          expect(users[0]).toHaveProperty('email');
          resolve(response.body.data.users);
        }
      });
  });
};

const registerNewUser = (
  url: string | Function,
  user: UserTest
): Promise<UserTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($fullName: String!, $email: String!, $password: String!) {
          register(full_name: $fullName, email: $email, password: $password) {
            message
            user {
              id
              full_name
              email
            }
          }
        }`,
        variables: {
          fullName: user.full_name,
          email: user.email,
          password: user.password,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('register response', response.body);
          const data = response.body.data.register;
          expect(data).toHaveProperty('message');
          expect(data).toHaveProperty('user');
          expect(data.user).toHaveProperty('id');
          expect(data.user.full_name).toBe(user.full_name);
          expect(data.user.email).toBe(user.email);
          resolve(response.body.data);
        }
      });
  });
};

const loginWithNewUser = (
  url: string | Function,
  user: UserTest
): Promise<LoginMessageResponse> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .send({
        query: `mutation Mutation($username: String!, $password: String!) {
          login(username: $username, password: $password) {
            message
            token
            user {
              email
              full_name
              id
            }
          }
        }`,
        variables: {
          username: user.email,
          password: user.password,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('login response', response.body);
          const data = response.body.data.login;
          expect(data).toHaveProperty('message');
          expect(data).toHaveProperty('token');
          expect(data).toHaveProperty('user');
          expect(data.user).toHaveProperty('id');
          expect(data.user.email).toBe(user.email);
          resolve(response.body.data.login);
        }
      });
  });
};

const updateNewUser = (url: string | Function, token: string) => {
  return new Promise((resolve, reject) => {
    const newName = 'test' + randomstring.generate(7);
    const newEmail = randomstring.generate(9) + '@test.fi';
    console.log(token);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation Mutation($user: UserModify!) {
          updateUser(user: $user) {
            message
            token
            user {
              email
              full_name
              id
            }
          }
        }`,
        variables: {
          user: {
            full_name: newName,
            email: newEmail,
          },
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const data = response.body.data.updateUser;
          expect(data).toHaveProperty('message');
          expect(data).toHaveProperty('user');
          expect(data.user).toHaveProperty('id');
          expect(data.user.full_name).toBe(newName);
          expect(data.user.email).toBe(newEmail);
          resolve(response.body.data);
        }
      });
  });
};

const deleteNewUser = (url: string | Function, token: string) => {
  return new Promise((resolve, reject) => {
    console.log(token);
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', 'Bearer ' + token)
      .send({
        query: `mutation DeleteUser {
          deleteUser {
            token
            message
            user {
              full_name
              id
              email
            }
          }
        }`,
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          const data = response.body.data.deleteUser;
          expect(data).toHaveProperty('message');
          expect(data).toHaveProperty('user');
          resolve(response.body.data.deleteUser);
        }
      });
  });
};

export {
  getUsers,
  loginWithNewUser,
  registerNewUser,
  updateNewUser,
  deleteNewUser,
};
