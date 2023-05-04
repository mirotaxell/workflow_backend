import mongoose from 'mongoose';
import {HourReport} from '../../interfaces/interfaces';

const hourReportSchema = new mongoose.Schema<HourReport>({
  task: {
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
  time_worked: {
    type: String,
    required: true,
  },
  posted_at: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<HourReport>('HourReport', hourReportSchema);
