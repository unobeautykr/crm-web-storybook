import * as $http from 'axios';

const nurse = {};

const models = ['operations', 'cares'];

models.forEach((modelName) => {
  nurse[modelName] = {
    all: (params) => $http.get(`nurse_${modelName}`, { params }),
    delete: (model) => $http.delete(`nurse_${modelName}/${model}`),
    update: (model) => $http.put(`nurse_${modelName}/${model.id}`, model),
    create: (model) => $http.post(`nurse_${modelName}`, model),
  };
});

nurse.skins = {
  all: (params) => $http.get(`skincares`, { params }),
  delete: (model) => $http.delete(`skincares/${model}`),
  update: (model) => $http.put(`skincares/${model.id}`, model),
  create: (model) => $http.post(`skincares`, model),
};

export default nurse;
