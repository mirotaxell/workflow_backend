import {GraphQLError} from 'graphql';
import {User, UserIdWithToken} from '../../interfaces/User';
import {LoginMessageResponse} from '../../interfaces/interfaces';
import fetch from 'node-fetch';
import {
  Company,
  HourReport,
  Project,
  TextReport,
} from '../../interfaces/interfaces';

export default {
  Project: {
    supervisor: async (parent: Project) => {
      const response = await fetch(
        `${process.env.AUTH_URL}/users/${parent.supervisor}`
      );
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
  },
  Company: {
    owner: async (parent: Company) => {
      console.log('owner', parent.owner);
      const response = await fetch(
        `${process.env.AUTH_URL}/users/${parent.owner}`
      );
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
    employees: async (parent: Company) => {
      console.log('employees', parent.employees);
      const employees: Promise<unknown>[] = [];
      parent.employees.forEach((employee) => {
        const response = fetch(
          `${process.env.AUTH_URL}/users/${employee}`
        ).then((res) => {
          if (!res.ok) {
            throw new GraphQLError(res.statusText, {
              extensions: {code: 'NOT_FOUND'},
            });
          }
          return res.json();
        });
        employees.push(response);
      });
      return employees;
    },
  },
  HourReport: {
    employee: async (parent: HourReport) => {
      const response = await fetch(
        `${process.env.AUTH_URL}/users/${parent.employee}`
      );
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
  },
  TextReport: {
    employee: async (parent: TextReport) => {
      const response = await fetch(
        `${process.env.AUTH_URL}/users/${parent.employee}`
      );
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
  },
  Query: {
    users: async (_parent: unknown, _args: unknown, user: UserIdWithToken) => {
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();

      if (user.token && _user.role === 'admin') {
        const response = await fetch(`${process.env.AUTH_URL}/users`);
        if (!response.ok) {
          throw new GraphQLError(response.statusText, {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        const users = (await response.json()) as User[];
        return users;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    userById: async (_parent: unknown, args: {id: string}) => {
      const response = await fetch(`${process.env.AUTH_URL}/users/${args.id}`);
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const user = (await response.json()) as User;
      return user;
    },
    checkToken: async (
      _parent: unknown,
      _args: unknown,
      user: UserIdWithToken
    ) => {
      console.log(user);

      const response = await fetch(`${process.env.AUTH_URL}/users/token`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const userFromAuth = await response.json();
      return userFromAuth;
    },
  },
  Mutation: {
    login: async (
      _parent: unknown,
      args: {username: string; password: string}
    ) => {
      const response = await fetch(`${process.env.AUTH_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'NOT_FOUND'},
        });
      }
      const user = (await response.json()) as LoginMessageResponse;
      return user;
    },
    register: async (
      _parent: unknown,
      args: {full_name: string; email: string; password: string}
    ) => {
      console.log('register', args);
      const response = await fetch(`${process.env.AUTH_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
      });
      if (!response.ok) {
        throw new GraphQLError(response.statusText, {
          extensions: {code: 'VALIDATION_ERROR'},
        });
      }
      const user = (await response.json()) as LoginMessageResponse;
      return user;
    },
    updateUser: async (
      _parent: unknown,
      args: {user: User},
      user: UserIdWithToken
    ) => {
      if (user.token) {
        const response = await fetch(`${process.env.AUTH_URL}/users`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(args.user),
        });
        if (!response.ok) {
          throw new GraphQLError(response.statusText, {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        const userFromPut = (await response.json()) as LoginMessageResponse;
        return userFromPut;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    deleteUser: async (
      _parent: unknown,
      _args: unknown,
      user: UserIdWithToken
    ) => {
      if (user.token) {
        const response = await fetch(`${process.env.AUTH_URL}/users`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (!response.ok) {
          throw new GraphQLError(response.statusText, {
            extensions: {code: 'NOT_FOUND'},
          });
        }
        const deletedUser = (await response.json()) as LoginMessageResponse;
        return deletedUser;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
  },
};
