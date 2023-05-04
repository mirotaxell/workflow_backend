import {GraphQLError} from 'graphql';
import {Inventory} from '../../interfaces/interfaces';
import projectModel from '../models/projectModel';
import {UserIdWithToken} from '../../interfaces/User';
import {Types} from 'mongoose';
import fetch from 'node-fetch';
import companyModel from '../models/companyModel';

export default {
  Inventory: {
    project: async (parent: Inventory) => {
      return await projectModel.findById(parent.project);
    },
  },
  Query: {
    projectsByCompany: async (
      _parent: undefined,
      args: {company_id: string},
      user: UserIdWithToken
    ) => {
      if (user.token) {
        return await projectModel.find({company: args.company_id});
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    projects: async (user: UserIdWithToken) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await projectModel.find();
    },
    projectById: async (
      _parent: undefined,
      args: {projectId: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await projectModel.findById(args.projectId);
    },
  },
  Mutation: {
    addProject: async (
      _parent: undefined,
      args: {project_name: string; company_id: string},
      user: UserIdWithToken
    ) => {
      const company = await companyModel.findById(args.company_id);
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      if (
        user.token &&
        (company?.owner.toString() === user.id || _user.role === 'admin')
      ) {
        console.log(args, user.id);
        const supervisor = user.id as unknown as Types.ObjectId;
        const project = new projectModel({
          project_name: args.project_name,
          supervisor: supervisor,
          company: company,
        });
        const result = await project.save();

        return result;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    addEmployeeToProject: async (
      _parent: undefined,
      args: {project_id: string; user_id: string},
      user: UserIdWithToken
    ) => {
      const project = await projectModel.findById(args.project_id);
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      console.log(
        'permission check',
        project?.supervisor.toString() === user.id,
        _user
      );

      // Check if the user is authorized and is the supervisor of the project, or if the user is an admin
      if (
        user.token &&
        (project?.supervisor.toString() === user.id || _user.role === 'admin')
      ) {
        // Check if the project exists
        if (!project) {
          console.log("project doesn't exist");
          throw new GraphQLError('project does not exist', {
            extensions: {code: 'project does not exist'},
          });
        }

        // Check if the user exists
        const newEmployee = await fetch(
          `${process.env.AUTH_URL}/users/${args.user_id}`
        );
        if (!newEmployee) {
          throw new GraphQLError('Employee does not exist', {
            extensions: {code: 'Employee does not exist'},
          });
        }

        // Add the employee ID to the employees array of the project
        const employee = await newEmployee.json();
        project.employees.push(employee._id);
        console.log('employee', employee);

        // Save the project document
        await project.save();
        return project;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    removeEmployeeFromProject: async (
      _parent: undefined,
      args: {project_id: string; user_id: string},
      user: UserIdWithToken
    ) => {
      // Check if the project exists
      const project = await projectModel.findById(args.project_id);
      if (!project) {
        throw new GraphQLError('Project does not exist', {
          extensions: {code: 'Project does not exist'},
        });
      }
      // Check if the user is authorized to remove the employee
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      if (
        user.token &&
        (project.supervisor.toString() === user.id || _user.role === 'admin')
      ) {
        // Check if the employee exists
        const fetchedUser = await fetch(
          `${process.env.AUTH_URL}/users/${args.user_id}`
        );
        if (!fetchedUser) {
          throw new GraphQLError('User does not exist', {
            extensions: {code: 'User does not exist'},
          });
        }

        // Remove the employee ID from the employees array of the project
        const employee = await fetchedUser.json();
        const index = project.employees.indexOf(employee._id);
        if (index > -1) {
          project.employees.splice(index, 1);
        }

        // Save the project document
        await project.save();
        return project;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
  },
};
