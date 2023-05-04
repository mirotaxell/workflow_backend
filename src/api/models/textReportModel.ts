import mongoose from 'mongoose';
import {TextReport} from '../../interfaces/interfaces';

const textReportSchema = new mongoose.Schema<TextReport>({
  title: {
    type: String,
    required: true,
    minlength: 2,
  },
  text: {
    type: String,
    required: true,
    minlength: 2,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  posted_at: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<TextReport>('TextReport', textReportSchema);
