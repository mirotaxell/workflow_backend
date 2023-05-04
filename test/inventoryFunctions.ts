// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
// eslint-disable-next-line node/no-extraneous-import
import expect from 'expect';
import {InventoryTest, ItemTest} from '../src/interfaces/interfaces';

const createInventory = (
  url: string | Function,
  projectId: string,
  token: string
): Promise<InventoryTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($projectId: ID!) {
            addInventory(projectId: $projectId) {
              id
              project {
                id
              }
            }
          }`,
        variables: {
          projectId: projectId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('inventory creation response', response.body);
          expect(response.body.data.addInventory).toHaveProperty('id');
          expect(response.body.data.addInventory).toHaveProperty('project');
          expect(response.body.data.addInventory.project).toHaveProperty('id');
          resolve(response.body.data);
        }
      });
  });
};

const createItem = (
  url: string | Function,
  item: ItemTest,
  token: string
): Promise<InventoryTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($itemName: String!, $amount: String!) {
            addItem(item_name: $itemName, amount: $amount) {
              id
              posted_at
              item_name
              amount
            }
          }`,
        variables: {
          itemName: item.item_name,
          amount: item.amount,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('inventory creation response', response.body);
          expect(response.body.data.addItem).toHaveProperty('id');
          expect(response.body.data.addItem).toHaveProperty('posted_at');
          expect(response.body.data.addItem).toHaveProperty('item_name');
          expect(response.body.data.addItem).toHaveProperty('amount');
          resolve(response.body.data);
        }
      });
  });
};

const addItemToInventory = (
  url: string | Function,
  itemId: string,
  inventoryId: string,
  token: string
): Promise<InventoryTest> => {
  return new Promise((resolve, reject) => {
    request(url)
      .post('/graphql')
      .set('Content-type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `mutation Mutation($inventoryId: ID!, $itemId: ID!) {
            addItemToInventory(inventoryId: $inventoryId, itemId: $itemId) {
              id
              items {
                id
                item_name
                amount
              }
              project {
                id
                project_name
              }
            }
          }`,
        variables: {
          inventoryId: inventoryId,
          itemId: itemId,
        },
      })
      .expect(200, (err, response) => {
        if (err) {
          reject(err);
        } else {
          console.log('add item to inventory response', response.body);
          expect(response.body.data.addItemToInventory).toHaveProperty('id');
          expect(response.body.data.addItemToInventory).toHaveProperty('items');
          expect(response.body.data.addItemToInventory).toHaveProperty(
            'project'
          );
          expect(response.body.data.addItemToInventory.project).toHaveProperty(
            'id'
          );
          expect(response.body.data.addItemToInventory.project).toHaveProperty(
            'project_name'
          );
          resolve(response.body.data);
        }
      });
  });
};

export {createInventory, createItem, addItemToInventory};
