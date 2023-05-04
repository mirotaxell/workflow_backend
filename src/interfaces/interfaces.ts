import {Document, Types} from 'mongoose';
import {User, UserIdWithToken} from './User';

export interface Company extends Document {
  company_name: string;
  owner: Types.ObjectId;
  employees: Types.ObjectId[];
}

export interface CompanyTest {
  id?: string;
  company_name?: string;
  owner?: Types.ObjectId | User;
  employees?: Types.ObjectId[] | User[];
}

export interface Project extends Document {
  project_name: string;
  supervisor: Types.ObjectId;
  company: Types.ObjectId;
  employees: Types.ObjectId[];
}

export interface ProjectTest {
  id?: string;
  project_name?: string;
  supervisor?: Types.ObjectId | User;
  company?: Types.ObjectId | Company;
  employees?: Types.ObjectId[] | User[];
}

export interface Item extends Document {
  item_name: string;
  amount: string;
  posted_at: Date;
}

export interface ItemTest {
  id?: string;
  item_name?: string;
  amount?: string;
  posted_at?: Date;
}

export interface Inventory extends Document {
  project: Types.ObjectId;
  items: Types.ObjectId[];
}

export interface InventoryTest {
  id?: string;
  project?: Types.ObjectId | Project;
  items?: Types.ObjectId[] | Item[];
}

export interface HourReport extends Document {
  task: string;
  project: Types.ObjectId;
  employee: Types.ObjectId;
  time_worked: string;
  posted_at: Date;
}

export interface HourReportTest {
  id?: string;
  task?: string;
  project?: Types.ObjectId | Project;
  employee?: Types.ObjectId | User;
  time_worked?: string;
  posted_at?: Date;
}

export interface TextReport extends Document {
  project: Types.ObjectId;
  employee: Types.ObjectId;
  title: string;
  text: string;
  posted_at: Date;
}

export interface TextReportTest {
  id?: string;
  project?: Types.ObjectId | Project;
  employee?: Types.ObjectId | User;
  title?: string;
  text?: string;
  posted_at?: Date;
}

export interface DBMessageResponse {
  message: string;
  result: string;
}

export interface MessageResponse {
  message: string;
  id?: number;
}

export interface LoginMessageResponse {
  token?: string;
  message: string;
  user: User;
}

export interface ErrorResponse extends MessageResponse {
  stack?: string;
}

export interface ServerResponse extends Record<string, unknown> {
  data: {};
}

export interface MyContext {
  userIdWithToken?: UserIdWithToken;
}
