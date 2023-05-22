import * as $http from 'axios';

export default {
  balance: {
    all: () => $http.get('/balance'),
    request: (params) => $http.get('/balance/requests', { params }),
    request_create: (payload) => $http.post('/balance/requests', payload),
    request_update: (payload) =>
      $http.put(
        `/balance/requests/${payload.id || payload.get('id')}`,
        payload
      ),
    histories: (params) => $http.get('/balance/histories', { params }),
  },
  account_issue: {
    create: (payload) => $http.post('/account_issue', payload),
  },
  sms_notifications: {
    all: (params) => $http.get('/sms_send_task', { params }),
  },
};
