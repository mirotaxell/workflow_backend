// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// eslint-disable-next-line node/no-extraneous-import
import expect from 'expect';
import {CompanyTest} from '../src/interfaces/interfaces';

const createCompany = (
  url: string | Function,
  company: CompanyTest,
  token: string
): Promise<CompanyTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($companyName: String!) {
            addCompany(company_name: $companyName) {
              company_name
              id
              owner {
                id
                full_name
                email
              }
            }
          }`,
        variables: {
          companyName: company.company_name,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('company creation response', response.body);
          expect(response.body.data.addCompany).toHaveProperty('id');
          expect(response.body.data.addCompany).toHaveProperty('company_name');
          expect(response.body.data.addCompany).toHaveProperty('owner');
          expect(response.body.data.addCompany.owner).toHaveProperty('id');
          expect(response.body.data.addCompany.owner).toHaveProperty(
            'full_name'
          );
          expect(response.body.data.addCompany.owner).toHaveProperty('email');
          resolve(response.body.data);
        }
      });
  });
};

export {createCompany};
