// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// eslint-disable-next-line node/no-extraneous-import
import expect from 'expect';
import {HourReportTest} from '../src/interfaces/interfaces';

const createHourReport = (
  url: string | Function,
  hourReport: HourReportTest,
  projectId: string,
  token: string
): Promise<HourReportTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($task: String!, $projectId: ID!, $timeWorked: String!) {
            addHourReport(task: $task, projectId: $projectId, time_worked: $timeWorked) {
              id
              posted_at
              project {
                id
              }
              task
              time_worked
              employee {
                id
              }
            }
          }`,
        variables: {
          task: hourReport.task,
          projectId: projectId,
          timeWorked: hourReport.time_worked,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('hourReport creation response', response.body);
          expect(response.body.data.addHourReport).toHaveProperty('id');
          expect(response.body.data.addHourReport).toHaveProperty('posted_at');
          expect(response.body.data.addHourReport).toHaveProperty('project');
          expect(response.body.data.addHourReport.project).toHaveProperty('id');
          expect(response.body.data.addHourReport).toHaveProperty('task');
          expect(response.body.data.addHourReport).toHaveProperty(
            'time_worked'
          );
          expect(response.body.data.addHourReport).toHaveProperty('employee');
          expect(response.body.data.addHourReport.employee).toHaveProperty(
            'id'
          );
          resolve(response.body.data);
        }
      });
  });
};

export {createHourReport};
