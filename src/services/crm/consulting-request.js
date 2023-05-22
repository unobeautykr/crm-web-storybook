import * as $http from 'axios';

export default {
  media: {
    all: (params) => $http.get(`/media`, { params }),
    create: (payload) => $http.post(`/media`, payload),
    update: (payload) => $http.put(`/media/${payload.id}`, payload),
    delete: (id) => $http.delete(`/media/${id}`),
  },

  event: {
    all: (params) => $http.get(`/events`, { params }),
    create: (payload) => $http.post(`/events`, payload),
    update: (payload) => $http.put(`/events/${payload.id}`, payload),
    excel_create: (payload) =>
      $http.post(`/events/excel`, payload, { responseType: 'blob' }),
    delete: (id) => $http.delete(`/events/${id}`),
  },

  connect: {
    all: (params) => $http.get(`/media/connects`, { params }),
    request_create: (payload) =>
      $http.post(`/media/connects/requests`, payload),
    delete: (id) => $http.delete(`/media/connects/${id}`),
  },

  requests: {
    all: (params) => $http.get(`/consulting/requests`, { params }),
    detail: (id, params) => $http.get(`/consulting/requests/${id}`, { params }),
    create: (payload) => $http.post(`/consulting/requests`, payload),
    update: (id, payload) => $http.put(`/consulting/requests/${id}`, payload),
    multi_update: (payload) => $http.put(`/consulting/requests/multi`, payload),
    excel_create: (payload) =>
      $http.post(`/consulting/requests/excel`, payload, {
        responseType: 'blob',
      }),
    count: (params) => $http.get('/consulting/requests/count', { params }),
    status: (params) => $http.get('/consulting/requests/status', { params }),
    status_delete: (id) => $http.delete(`/consulting/requests/status/${id}`),
    today_count: (params) =>
      $http.get('/consulting/requests/today/count', { params }),
  },

  requests_categories: {
    all: (params) =>
      $http.get('/consulting/requests/status/categories', { params }),
    update: (id, payload) =>
      $http.put(`/consulting/requests/status/categories/${id}`, payload),
    delete: (id) =>
      $http.delete(`/consulting/requests/status/categories/${id}`),
  },

  result: {
    all: (params) => $http.get(`/consulting/requests/results`, { params }),
    create: (payload) => $http.post(`/consulting/requests/results`, payload),
  },

  auto_assign: {
    create: (payload) => $http.post(`/consulting/requests/autoassign`, payload),
    all: (params) => $http.get(`/consulting/requests/autoassign`, { params }),
    users: (params) =>
      $http.get(`/consulting/requests/autoassign/users`, { params }),
  },
};
