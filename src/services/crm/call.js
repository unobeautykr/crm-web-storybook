import * as $http from 'axios';

// https://docs.google.com/spreadsheets/d/1JYCtl4NKTEDloZRmE_HRrjmWp6XzLTE3_SPr7sp_-nE/edit#gid=1339444833

const call = {
  list: (params) => $http.get('/centrex/calls', { params }),
  get: (callId) => $http.get(`/centrex/calls/${callId}`),
  update: (id, params) => $http.put(`/centrex/calls/${id}`, params),
  cancel: (id) => $http.post(`/centrex/calls/${id}/cancel`),
};

export default call;
