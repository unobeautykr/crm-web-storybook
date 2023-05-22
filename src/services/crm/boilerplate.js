import * as $http from 'axios';

const memo = {
  all: (params) => $http.get(`/boilerplate_memos`, { params }),
  create: (payload) => $http.post(`/boilerplate_memos`, payload),
  multi_update: (payload) => $http.put(`/batch/boilerplate_memos`, payload),
  update: (id, payload) => $http.put(`/boilerplate_memos/${id}`, payload),
  delete: (id) => $http.delete(`/boilerplate_memos/${id}`),
};

export default { memo };
