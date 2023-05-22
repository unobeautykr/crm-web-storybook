import * as $http from 'axios';

export default {
  organ: {
    all: (params) => $http.get(`/organizations`, { params }),
    get: (id) => $http.get(`/organizations/${id}`),
    create: (payload) => $http.post(`/organizations`, payload),
    update: (payload) => $http.put(`/organizations/${payload.id}`, payload),
    delete: (id) => $http.delete(`/organizations/${id}`),
  },
  list: {
    all: (params) => $http.get('/organizations/list', { params }),
  },
  owner: {
    change_password: (payload) =>
      $http.put('/users/owner/change_password', payload),
  },
};
