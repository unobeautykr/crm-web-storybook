import * as $http from 'axios';
import { $case } from '~/utils/filters';
import { objectToFormData } from 'object-to-formdata';

const user = {
  all: (params) => $http.get('users', { params }),
  detail: (userId) => $http.get(`users/${userId}`),
  create: (user) => $http.post('users', user),
  update: (user) => $http.put(`users/${user.id}`, user),
  update_multipart: (user) =>
    $http.put(`users/${user.id}`, objectToFormData(user)),
  delete: (userId) => $http.delete(`users/${userId}`),
  me: () => $http.get('/users/me'),
  changePassword: (password) =>
    $http.put('users/change_password', { password }),
  duty: (params) => $http.get('users/duty', { params }),
};

const models = ['authorityGroup', 'role'];

models.forEach((modelName) => {
  user[modelName] = {
    create: (model) => $http.post(`users/${$case.toSnake(modelName)}s`, model),
    all: (params) =>
      $http.get(`users/${$case.toSnake(modelName)}s`, { params }),
    detail: (modelId) =>
      $http.get(`users/${$case.toSnake(modelName)}s/${modelId}`),
    update: (model) =>
      $http.put(`users/${$case.toSnake(modelName)}s/${model.id}`, model),
    delete: (modelId) =>
      $http.delete(`users/${$case.toSnake(modelName)}s/${modelId}`),
  };
});

export default user;
