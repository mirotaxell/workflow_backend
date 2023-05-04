import {Inventory, Item} from '../../interfaces/interfaces';
import itemModel from '../models/itemModel';
import {GraphQLError} from 'graphql';
import {UserIdWithToken} from '../../interfaces/User';
import inventoryModel from '../models/inventoryModel';

export default {
  Inventory: {
    items: async (parent: Inventory) => {
      // return array of items that match the id of items in the inventory Items array
      return await itemModel.find({
        _id: {$in: parent.items},
      });
    },
  },
  Query: {
    items: async () => {
      return await itemModel.find();
    },
  },
  Mutation: {
    addItem: async (
      _parent: undefined,
      args: {
        item_name: string;
        amount: string;
      },
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const timestamp = new Date();
      const item = new itemModel({
        item_name: args.item_name,
        amount: args.amount,
        posted_at: timestamp,
      });
      const result = await item.save();
      return result;
    },
    addItemAndAddToInventory: async (
      _parent: undefined,
      args: {
        item_name: string;
        amount: string;
        inventoryId: string;
      },
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      const timestamp = new Date();
      const item = new itemModel({
        item_name: args.item_name,
        amount: args.amount,
        posted_at: timestamp,
      });
      const itemResult = await item.save();

      const inventory = await inventoryModel.findById(args.inventoryId);
      if (!inventory) {
        throw new GraphQLError('inventory does not exist', {
          extensions: {code: 'inventory does not exist'},
        });
      }

      inventory.items.push(itemResult._id);
      await inventory.save();

      return itemResult;
    },
    updateItem: async (
      _parent: undefined,
      args: Item,
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }

      return await itemModel.findByIdAndUpdate(args.id, args, {
        new: true,
      });
    },
    deleteItem: async (
      _parent: undefined,
      args: Item,
      user: UserIdWithToken
    ) => {
      if (!user.token) {
        throw new GraphQLError('Not authorized', {
          extensions: {code: 'NOT_AUTHORIZED'},
        });
      }
      return await itemModel.findByIdAndDelete(args.id);
    },
  },
};
