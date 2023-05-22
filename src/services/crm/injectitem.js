import * as $http from 'axios';

const injectitem = {};

const models = ['operations', 'cares'];

models.forEach((modelName) => {
  injectitem[modelName] = {
    all: (params) => $http.get(`nurse_${modelName}/injectitems`, { params }),
    delete: (model) => $http.delete(`nurse_${modelName}/injectitems/${model}`),
    update: (model) => $http.put(`nurse_${modelName}/injectitems/multi`, model),
    visible: (model) =>
      $http.put(`nurse_${modelName}/injectitems/${model.id}`, model),
  };
});

export default injectitem;
