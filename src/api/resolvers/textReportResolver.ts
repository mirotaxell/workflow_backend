import {GraphQLError} from 'graphql';
import textReportModel from '../models/textReportModel';
import {UserIdWithToken} from '../../interfaces/User';
import projectModel from '../models/projectModel';

export default {
  Query: {
    textReports: async () => {
      return await textReportModel.find();
    },
    textReport: async (_parent: undefined, args: {id: string}) => {
      return await textReportModel.findById(args.id);
    },
    textReportsByProject: async (
      _parent: undefined,
      args: {projectId: string}
    ) => {
      return await textReportModel.find({project: args.projectId});
    },
  },
  Mutation: {
    addTextReport: async (
      _parent: undefined,
      args: {title: string; text: string; projectId: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const project = await projectModel.findById(args.projectId);
      const timestamp = new Date();
      const textReport = new textReportModel({
        title: args.title,
        text: args.text,
        project: project,
        employee: user.id,
        posted_at: timestamp,
      });
      const result = await textReport.save();

      return result;
    },
    deleteTextReport: async (
      _parent: undefined,
      args: {id: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const result = await textReportModel.findByIdAndDelete(args.id);
      return result;
    },
  },
};
