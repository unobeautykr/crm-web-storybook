import * as $http from 'axios';

export default {
  settlements: {
    all: (params) => $http.get('/settlements', { params }),
    detail: (params) => $http.get('/settlements/detail', { params }),
    monthly: (params) => $http.get('/settlements/monthly', { params }),
  },
};
