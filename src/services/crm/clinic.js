import * as $http from 'axios';

export default {
  detail: (clinicId) => $http.get(`clinics/${clinicId}`),
  configs_create: (payload) => $http.post(`/clinics/configs`, payload),
  configs_update: (payload, id) => $http.put(`/clinics/configs/${id}`, payload),
  configs_multi: (payload) => $http.post(`/clinics/configs/multi`, payload),
  configs: (params) => $http.get(`/clinics/configs`, { params }),
  update: (clinicId, params) => $http.put(`/clinics/${clinicId}`, params),
  chart_no: () => $http.get(`clinics/v2/chart_no`),
};
