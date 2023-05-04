import mongoose from 'mongoose';
import {
  deleteNewUser,
  loginWithNewUser,
  registerNewUser,
  updateNewUser,
} from './userFunctions';
import app from '../src/app';
import randomstring from 'randomstring';
import {UserTest} from '../src/interfaces/User';
import {
  CompanyTest,
  LoginMessageResponse,
  ProjectTest,
} from '../src/interfaces/interfaces';
import {createCompany} from './companyFunctions';
import {createProject} from './projectFunctions';
import {createHourReport} from './hourReportFunctions';
import {createTextReport} from './textReportFunctions';
import {
  addItemToInventory,
  createInventory,
  createItem,
} from './inventoryFunctions';
import {getNotFound} from './testFunctions';

describe('test', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE_URL as string);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // test not found
  it('responds with a not found message', async () => {
    await getNotFound(app);
  });

  const newUser: UserTest = {
    full_name: 'Test User ' + randomstring.generate(7),
    email: randomstring.generate(9) + '@user.fi',
    password: 'qwert',
  };

  const newCompany: CompanyTest = {
    company_name: 'Test Company ' + randomstring.generate(7),
  };

  const newProject: ProjectTest = {
    project_name: 'Test Project ' + randomstring.generate(7),
  };

  const newHourReport = {
    task: 'Test Task ' + randomstring.generate(7),
    time_worked: '07:00-16:00',
  };

  const newTextReport = {
    title: 'Test Title ' + randomstring.generate(7),
    text: 'Test Text ' + randomstring.generate(7),
  };

  const newItem = {
    item_name: 'Test Item ' + randomstring.generate(7),
    amount: '10',
  };
  /*

  // register a new user
  it('should register a new user', async () => {
    await registerNewUser(app, newUser);
  });

  // login as the new user
  let userData: LoginMessageResponse;
  it('should login with the new user', async () => {
    userData = await loginWithNewUser(app, newUser);
  });

  // update the new user
  it('should update the new user', async () => {
    await updateNewUser(app, userData.token!);
  });

  // add a new company
  let companyData: any;
  it('should add a new company', async () => {
    companyData = await createCompany(app, newCompany, userData.token!);
  });

  // edit the company
  it('should edit the company', async () => {
    // TODO
  });

  let projectData: any;
  // add a new project to the new company
  it('should add a new project', async () => {
    console.log('companyData', companyData);
    projectData = await createProject(
      app,
      newProject,
      companyData.addCompany.id,
      userData.token!
    );
  });

  // edit the project
  it('should edit the project', async () => {
    // TODO
  });

  // add a new hour report to the project
  let hourReportData: any;
  it('should add a new hour report to the project', async () => {
    hourReportData = await createHourReport(
      app,
      newHourReport,
      projectData.addProject.id,
      userData.token!
    );
  });

  // edit the hour report
  it('should edit the hour report', async () => {
    // TODO
  });

  // delete the hour report
  it('should delete the hour report', async () => {
    // TODO
  });

  // add a new text report to the project
  let textReportData: any;
  it('should add a new text report to the project', async () => {
    textReportData = await createTextReport(
      app,
      newTextReport,
      projectData.addProject.id,
      userData.token!
    );
  });

  // edit the text report
  it('should edit the text report', async () => {
    // TODO
  });

  // delete the text report
  it('should delete the text report', async () => {
    // TODO
  });

  // create inventory for the project
  let inventoryData: any;
  it('should create inventory for the project', async () => {
    inventoryData = await createInventory(
      app,
      projectData.addProject.id,
      userData.token!
    );
  });

  // add a new item
  let itemData: any;
  it('should add a new item', async () => {
    itemData = await createItem(app, newItem, userData.token!);
  });

  // add the item to the inventory
  it('should add a new item to the inventory', async () => {
    await addItemToInventory(
      app,
      itemData.addItem.id,
      inventoryData.addInventory.id,
      userData.token!
    );
  });

  // edit the item
  it('should edit the item', async () => {
    // TODO
  });

  // delete the item
  it('should delete the item', async () => {
    // TODO
  });

  // delete the new user
  it('should delete the new user', async () => {
    await deleteNewUser(app, userData.token!);
  });
  */
});
