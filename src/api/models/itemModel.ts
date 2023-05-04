import mongoose from 'mongoose';
import {Item} from '../../interfaces/interfaces';

const itemSchema = new mongoose.Schema<Item>({
  item_name: {
    type: String,
    required: true,
    minlength: 2,
  },
  amount: {
    type: String,
    required: true,
  },
  posted_at: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<Item>('Item', itemSchema);
