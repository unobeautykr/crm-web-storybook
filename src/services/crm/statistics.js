import * as $http from 'axios';

export default {
  statistics: {
    summarize_v2: (params) =>
      $http.get('/statistics/payments/summarize', { params }),
    monthly: (params) => $http.get('/statistics/payments/monthly', { params }),
    customers_count: (params) =>
      $http.get('/statistics/customers/count/monthly', { params }),
    sms_daily: (params) => $http.get('/statistics/sms/daily', { params }),
    counselor: (params, paramsId) =>
      $http.get(`/statistics/sales_by_counselor?${paramsId}`, { params }),
    doctor: (params, paramsId) =>
      $http.get(`/statistics/sales_by_doctor?${paramsId}`, { params }),
    customer: (params) =>
      $http.get('/statistics/sales_by_customer', { params }),
    customer_level: (params) =>
      $http.get('/statistics/sales_by_customer_level', { params }),
    treatment_category: (params, paramsId) =>
      $http.get(`/statistics/sales_by_treatment_category?${paramsId}`, {
        params,
      }),
    treatment_item: (params, paramsId) =>
      $http.get(`/statistics/sales_by_treatment_item?${paramsId}`, { params }),
    region: (params) =>
      $http.get('/statistics/sales_by_customer_region', { params }),
    prescription: (params) => $http.get('/statistics/prescription', { params }),
  },
};
