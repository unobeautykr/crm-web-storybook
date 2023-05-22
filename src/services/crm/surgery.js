import * as $http from 'axios';

const surgery = {
  create: (payload) => $http.post('surgeries', payload),
  all: (params) => $http.get('surgeries', { params }),
  detail: (surgeryId) => $http.get(`surgeries/${surgeryId}`),
  update: (payload) => $http.put(`surgeries/${payload.id}`, payload),
  delete: (surgeryId) => $http.delete(`surgeries/${surgeryId}`),
};

export default surgery;
