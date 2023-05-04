import {GraphQLError} from 'graphql';
import hourReportModel from '../models/hourReportModel';
import {UserIdWithToken} from '../../interfaces/User';
import {Types} from 'mongoose';
import projectModel from '../models/projectModel';

export default {
  Query: {
    hourReports: async (user: UserIdWithToken) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await hourReportModel.find();
    },
    hourReportsByProject: async (
      _parent: undefined,
      args: {projectId: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const hourReports = await hourReportModel.find({
        project: args.projectId,
      });
      console.log(hourReports);
      return hourReports;
    },
  },
  Mutation: {
    addHourReport: async (
      _parent: undefined,
      args: {task: string; projectId: string; time_worked: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const project = await projectModel.findById(args.projectId);
      const timestamp = new Date();
      const employee = user.id as unknown as Types.ObjectId;
      const hourReport = new hourReportModel({
        task: args.task,
        project: project,
        employee: employee,
        time_worked: args.time_worked,
        posted_at: timestamp,
      });
      const result = await hourReport.save();

      return result;
    },
    deleteHourReport: async (
      _parent: undefined,
      args: {id: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const result = await hourReportModel.findByIdAndDelete(args.id);
      return result;
    },
  },
};
