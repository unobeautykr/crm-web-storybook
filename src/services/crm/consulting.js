import * as $http from 'axios';
import { $case, pluralize } from '~/utils/filters';

const consulting = {
  create: (consulting) => $http.post('consultings', consulting),
  create_v2: (consulting) => $http.post('consultings', consulting),
  all: (params) => $http.get('/consultings', { params }),
  all_v2: (params) => $http.get('/consultings', { params }),
  detail: (consultingId) => $http.get(`consultings/${consultingId}`),
  update: (consulting) => $http.put(`consultings/${consulting.id}`, consulting),
  update_v2: (consulting) =>
    $http.put(`consultings/${consulting.id}`, consulting),
  delete: (consultingId) => $http.delete(`consultings/${consultingId}`),
  delete_v2: (consultingId) => $http.delete(`consultings/${consultingId}`),
};

const models = ['result'];

const foo = (str) => $case.toSnake(pluralize(str));

models.forEach((modelName) => {
  consulting[modelName] = {
    create: (model) => $http.post(`consultings/${foo(modelName)}`, model),
    all: (params) => $http.get(`consultings/${foo(modelName)}`, { params }),
    detail: (modelId) => $http.get(`consultings/${foo(modelName)}/${modelId}`),
    update: (model) =>
      $http.put(`consultings/${foo(modelName)}/${model.id}`, model),
    delete: (modelId) =>
      $http.delete(`consultings/${foo(modelName)}/${modelId}`),
  };
});

export default consulting;
