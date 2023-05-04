import {GraphQLError} from 'graphql';
import {Company, Project} from '../../interfaces/interfaces';
import companyModel from '../models/companyModel';
import {UserIdWithToken} from '../../interfaces/User';
import {Types} from 'mongoose';
import fetch from 'node-fetch';

export default {
  Project: {
    company: async (parent: Project) => {
      return await companyModel.findById(parent.company);
    },
  },
  Query: {
    companies: async (
      _parent: undefined,
      _args: undefined,
      user: UserIdWithToken
    ) => {
      // Check if the user is authorized to view all companies
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      // Get companies where the user is the owner or an employee
      const companies = await companyModel.find({
        $or: [{owner: user.id}, {employees: user.id}],
      });
      return companies;
    },
    companyById: async (_parent: undefined, args: Company) => {
      return await companyModel.findById(args.id);
    },
  },
  Mutation: {
    addCompany: async (
      _parent: undefined,
      args: Company,
      user: UserIdWithToken
    ) => {
      // Check if the user is authorized to add a company
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      // Create a new company document
      args.owner = user.id as unknown as Types.ObjectId;
      const company = new companyModel(args);

      // Save the company document
      const result = await company.save();
      return result;
    },
    updateCompany: async (
      _parent: undefined,
      args: Company,
      user: UserIdWithToken
    ) => {
      // Check if the company exists
      const company = await companyModel.findById(args.id);
      if (!company) {
        throw new GraphQLError('Company does not exist', {
          extensions: {code: 'Company does not exist'},
        });
      }

      // Check if the user is authorized to update the company
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      if (
        user.token &&
        (company.owner.toString() === user.id || _user.role === 'admin')
      ) {
        // Update the company document
        return await companyModel.findByIdAndUpdate(args.id, args, {
          new: true,
        });
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    addEmployeeToCompany: async (
      _parent: undefined,
      args: {company_id: string; user_id: string},
      user: UserIdWithToken
    ) => {
      // Check if the company exists
      const company = await companyModel.findById(args.company_id);
      if (!company) {
        throw new GraphQLError('Company does not exist', {
          extensions: {code: 'Company does not exist'},
        });
      }

      // Check if the user is authorized to add an employee to the company
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      if (
        user.token &&
        (company.owner.toString() === user.id || _user.role === 'admin')
      ) {
        // Check if the employee exists
        const newEmployee = await fetch(
          `${process.env.AUTH_URL}/users/${args.user_id}`
        );
        if (!newEmployee) {
          throw new GraphQLError('Employee does not exist', {
            extensions: {code: 'Employee does not exist'},
          });
        }

        // Add the employee ID to the employees array of the company
        const employee = await newEmployee.json();
        company.employees.push(employee._id);
        console.log('employee', employee);

        // Save the company document
        await company.save();
        return company;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    removeEmployeeFromCompany: async (
      _parent: undefined,
      args: {company_id: string; user_id: string},
      user: UserIdWithToken
    ) => {
      // Check if the company exists
      const company = await companyModel.findById(args.company_id);
      if (!company) {
        throw new GraphQLError('Company does not exist', {
          extensions: {code: 'Company does not exist'},
        });
      }
      // Check if the user is authorized to remove the employee
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      if (
        user.token &&
        (company.owner.toString() === user.id || _user.role === 'admin')
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

        // Remove the employee ID from the employees array of the company
        const employee = await fetchedUser.json();
        const index = company.employees.indexOf(employee._id);
        if (index > -1) {
          company.employees.splice(index, 1);
        }

        // Save the company document
        await company.save();
        return company;
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
    deleteCompany: async (
      _parent: undefined,
      args: Company,
      user: UserIdWithToken
    ) => {
      // Check if the company exists
      const company = await companyModel.findById(args.id);
      if (!company) {
        throw new GraphQLError('Company does not exist', {
          extensions: {code: 'Company does not exist'},
        });
      }
      // Check if the user is authorized to delete the company
      const _user = await (
        await fetch(`${process.env.AUTH_URL}/users/${user.id}`)
      ).json();
      if (
        user.token &&
        (company?.owner.toString() === user.id || _user.role === 'admin')
      ) {
        // Delete the company
        return await companyModel.findByIdAndDelete(args.id);
      } else {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
    },
  },
};
