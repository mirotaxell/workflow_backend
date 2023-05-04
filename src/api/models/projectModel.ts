import mongoose from 'mongoose';
import {Project} from '../../interfaces/interfaces';

const projectSchema = new mongoose.Schema<Project>({
  project_name: {
    type: String,
    required: true,
    minlength: 2,
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model<Project>('Project', projectSchema);
