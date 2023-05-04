import mongoose from 'mongoose';
import {Inventory} from '../../interfaces/interfaces';

const inventorySchema = new mongoose.Schema<Inventory>({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
    unique: true,
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
});

export default mongoose.model<Inventory>('Inventory', inventorySchema);
