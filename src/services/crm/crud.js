import * as $http from 'axios';
import { $case, pluralize } from '~/utils/filters';

const crud = {};

const models = [
  'appointment',
  'registration',
  'boilerplateMessage',
  'callerNumber',
  'department',
  'doctor',
  'treatmentItem',
  'treatmentItemCategory',
  'smsSearch',
];

const foo = (str) =>
  $case.toSnake(['smsSearch'].indexOf(str) === -1 ? pluralize(str) : str);

models.forEach((modelName) => {
  crud[modelName] = {
    create: (model) => $http.post(`${foo(modelName)}`, model),
    all: (params) => $http.get(`${foo(modelName)}`, { params }),
    detail: (modelId) => $http.get(`${foo(modelName)}/${modelId}`),
    update: (model) =>
      $http.put(`${foo(modelName)}/${model.id || model.get('id')}`, model),
    delete: (modelId) => $http.delete(`${foo(modelName)}/${modelId}`),
    list: (params) => $http.get(`${foo(modelName)}/list`, { params }),
    count: (params) => $http.get(`${foo(modelName)}/count`, { params }),
    monthly: (params) => $http.get(`${foo(modelName)}/monthly`, { params }),
    multi_update: (payload) => $http.put(`${foo(modelName)}/multi`, payload),
    excel_download: (params) =>
      $http.get(`${foo(modelName)}/excel`, { params, responseType: 'blob' }),
  };
});

crud.department = {
  delete: (modelId) => $http.delete(`/departments/${modelId}`),
};

crud.alimtalk = {
  all: () => $http.get('alimtalk'),
  authCode: ({ channelId, category, phoneNumber }) =>
    $http.get('alimtalk/auth_code', {
      params: { channelId, category, phoneNumber },
    }),
  create: (alimtalk) => $http.post('alimtalk', alimtalk),
  delete: () => $http.delete('alimtalk'),
};

crud.appointment.configs_v2 = {
  create: (request) => $http.post(`/appointments/v2/calendar/configs`, request),
  all: (params) => $http.get(`/appointments/v2/calendar/configs`, { params }),
};

crud.appointment.time_count = (params) =>
  $http.get(`/appointments/time/v2`, { params });

crud.departmentCategory = {
  create: (model) => $http.post(`departments/categories`, model),
  all: (params) => $http.get(`departments/categories`, { params }),
  detail: (modelId) => $http.get(`departments/categories/${modelId}`),
  update: (model) =>
    $http.put(`departments/categories/${model.id || model.get('id')}`, model),
  delete: (modelId) => $http.delete(`departments/categories/${modelId}`),
  multi_update: (payload) => $http.put(`departments/categories/multi`, payload),
};

export default crud;
