import mongoose from 'mongoose';
import {Company} from '../../interfaces/interfaces';

const companySchema = new mongoose.Schema<Company>({
  company_name: {
    type: String,
    required: true,
    minlength: 2,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

export default mongoose.model<Company>('Company', companySchema);
