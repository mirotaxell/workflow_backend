// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// eslint-disable-next-line node/no-extraneous-import
import expect from 'expect';
import {ProjectTest} from '../src/interfaces/interfaces';

const createProject = (
  url: string | Function,
  project: ProjectTest,
  companyId: string,
  token: string
): Promise<ProjectTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($projectName: String!, $companyId: ID!) {
            addProject(project_name: $projectName, company_id: $companyId) {
              id
              project_name
              supervisor {
                full_name
                email
                id
              }
              company {
                company_name
                id
              }
            }
          }`,
        variables: {
          projectName: project.project_name,
          companyId: companyId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('project creation response', response.body);
          expect(response.body.data.addProject).toHaveProperty('id');
          expect(response.body.data.addProject).toHaveProperty('project_name');
          expect(response.body.data.addProject).toHaveProperty('supervisor');
          expect(response.body.data.addProject.supervisor).toHaveProperty('id');
          expect(response.body.data.addProject.supervisor).toHaveProperty(
            'full_name'
          );
          expect(response.body.data.addProject.supervisor).toHaveProperty(
            'email'
          );
          expect(response.body.data.addProject).toHaveProperty('company');
          expect(response.body.data.addProject.company).toHaveProperty('id');
          expect(response.body.data.addProject.company).toHaveProperty(
            'company_name'
          );
          resolve(response.body.data);
        }
      });
  });
};

export {createProject};
