import {GraphQLError} from 'graphql';
import inventoryModel from '../models/inventoryModel';
import {UserIdWithToken} from '../../interfaces/User';
import projectModel from '../models/projectModel';
import itemModel from '../models/itemModel';

export default {
  Query: {
    inventories: async (user: UserIdWithToken) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await inventoryModel.find();
    },
    inventoryByProjectId: async (
      _parent: undefined,
      args: {projectId: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const inventory = await inventoryModel.findOne({
        project: args.projectId,
      });
      if (!inventory) {
        throw new GraphQLError('inventory does not exist', {
          extensions: {code: 'inventory does not exist'},
        });
      }

      return inventory;
    },
  },
  Mutation: {
    addInventory: async (
      _parent: undefined,
      args: {projectId: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const project = await projectModel.findById(args.projectId);
      if (!project) {
        throw new GraphQLError('project does not exist', {
          extensions: {code: 'project does not exist'},
        });
      }

      const inventory = new inventoryModel({
        project: project,
        items: [],
      });

      const result = await inventory.save();

      return result;
    },
    addItemToInventory: async (
      _parent: undefined,
      args: {inventoryId: string; itemId: string},
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      const inventory = await inventoryModel.findById(args.inventoryId);
      if (!inventory) {
        throw new GraphQLError('inventory does not exist', {
          extensions: {code: 'inventory does not exist'},
        });
      }

      const item = await itemModel.findById(args.itemId);
      if (!item) {
        throw new GraphQLError('item does not exist', {
          extensions: {code: 'item does not exist'},
        });
      }

      inventory.items.push(item._id);
      const result = await inventory.save();

      return result;
    },
  },
};
