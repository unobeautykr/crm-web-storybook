import * as $http from 'axios';

const vital = {};

const models = ['operations', 'cares'];

models.forEach((modelName) => {
  vital[modelName] = {
    all: (params) => $http.get(`nurse_${modelName}/vitalitems`, { params }),
    delete: (model) => $http.delete(`nurse_${modelName}/vitalitems/${model}`),
    update: (model) => $http.put(`nurse_${modelName}/vitalitems/multi`, model),
    visible: (model) =>
      $http.put(`nurse_${modelName}/vitalitems/${model.id}`, model),
  };
});

export default vital;
