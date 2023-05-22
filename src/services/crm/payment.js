import * as $http from 'axios';
import { $case } from '~/utils/filters';

const payment = {
  create: (payment) => $http.post('payments', payment),
  all: (params) => $http.get('payments', { params }),
  detail: (paymentId) => $http.get(`payments/${paymentId}`),
  update: (payment) => $http.put(`payments/${payment.id}`, payment),
  delete: (paymentId) => $http.delete(`payments/${paymentId}`),
  summary: (params) => $http.get(`payments/summary`, { params }),
};

const models = ['refundReason', 'product'];

models.forEach((modelName) => {
  payment[modelName] = {
    create: (model) => $http.post(`${$case.toSnake(modelName)}s`, model),
    all: (params) => $http.get(`${$case.toSnake(modelName)}s`, { params }),
    detail: (modelId) => $http.get(`${$case.toSnake(modelName)}s/${modelId}`),
    update: (model) =>
      $http.put(`${$case.toSnake(modelName)}s/${model.id}`, model),
    delete: (modelId) =>
      $http.delete(`${$case.toSnake(modelName)}s/${modelId}`),
  };
});

payment.discountReason = {
  all: (params) => $http.get('/discount_reasons', { params }),
  create: (model) => $http.post(`/discount_reasons`, model),
  detail: (modelId) => $http.get(`/discount_reasons/${modelId}`),
  update: (model) => $http.put(`/discount_reasons/${model.id}`, model),
  delete: (modelId) => $http.delete(`/discount_reasons/${modelId}`),
};

export default payment;
