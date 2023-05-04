// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// eslint-disable-next-line node/no-extraneous-import
import expect from 'expect';
import {TextReportTest} from '../src/interfaces/interfaces';

const createTextReport = (
  url: string | Function,
  textReport: TextReportTest,
  projectId: string,
  token: string
): Promise<TextReportTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($projectId: ID!, $title: String!, $text: String!) {
            addTextReport(projectId: $projectId, title: $title, text: $text) {
              posted_at
              project {
                id
              }
              text
              title
              id
              employee {
                id
              }
            }
          }`,
        variables: {
          projectId: projectId,
          title: textReport.title,
          text: textReport.text,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('textReport creation response', response.body);
          expect(response.body.data.addTextReport).toHaveProperty('id');
          expect(response.body.data.addTextReport).toHaveProperty('posted_at');
          expect(response.body.data.addTextReport).toHaveProperty('project');
          expect(response.body.data.addTextReport.project).toHaveProperty('id');
          expect(response.body.data.addTextReport).toHaveProperty('title');
          expect(response.body.data.addTextReport).toHaveProperty('text');
          expect(response.body.data.addTextReport).toHaveProperty('employee');
          expect(response.body.data.addTextReport.employee).toHaveProperty(
            'id'
          );
          resolve(response.body.data);
        }
      });
  });
};

export {createTextReport};
