import * as $http from 'axios';
import { $case } from '~/utils/filters';

const customer = {
  create: (customer) => $http.post('customers', customer),
  all: (params) => $http.get('customers', { params }),
  detail: (customerId) => $http.get(`customers/${customerId}`),
  update: (customer) => $http.put(`customers/${customer.id}`, customer),
  update_id: (id, customer) => $http.put(`customers/${id}`, customer),
  delete: (customerId) => $http.delete(`customers/${customerId}`),
  convertTime: () => $http.get('customers/convert/time'),
  all_memo: (params) => $http.get('customers/memos', { params }),
};

const models = [
  'acquisitionChannel',
  'complaint',
  'region',
  'level',
  'job',
  'account',
  'accountVersion',
];

models.forEach((modelName) => {
  customer[modelName] = {
    create: (model) =>
      $http.post(`customers/${$case.toSnake(modelName)}s`, model),
    all: (params) =>
      $http.get(`customers/${$case.toSnake(modelName)}s`, { params }),
    detail: (modelId) =>
      $http.get(`customers/${$case.toSnake(modelName)}s/${modelId}`),
    update: (model) =>
      $http.put(`customers/${$case.toSnake(modelName)}s/${model.id}`, model),
    delete: (modelId) =>
      $http.delete(`customers/${$case.toSnake(modelName)}s/${modelId}`),
  };
});

export default customer;
