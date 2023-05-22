import * as $http from 'axios';

const treatment = {
  create: (treatment) => $http.post('treatments', treatment),
  create_v2: (treatment) => $http.post('treatments', treatment),
  all: (params) => $http.get('treatments', { params }),
  all_v2: (params) => $http.get('treatments', { params }),
  detail: (treatmentId) => $http.get(`treatments/${treatmentId}`),
  update: (treatment) => $http.put(`treatments/${treatment.id}`, treatment),
  update_v2: (treatment) => $http.put(`treatments/${treatment.id}`, treatment),
  delete: (treatmentId) => $http.delete(`treatments/${treatmentId}`),
  delete_v2: (treatmentId) => $http.delete(`treatments/${treatmentId}`),
};

treatment.items = {
  create: (model) => $http.post(`treatment_items`, model),
  all: (params) => $http.get(`treatment_items`, { params }),
  all_v2: (params) => $http.get(`treatment_items`, { params }),
  delete: (modelId) => $http.delete(`treatment_items/${modelId}`),
  delete_v2: (modelId) => $http.delete(`treatment_items/${modelId}`),
  visible_v2: (model) => $http.put(`treatment_items/${model.id}`, model),
};

treatment.categories = {
  create: (model) => $http.post(`treatment_items/legacy/categories`, model),
  create_v2: (model) => $http.post(`treatment_items/categories`, model),
  all: (params) => $http.get(`treatment_items/legacy/categories`, { params }),
  items_categories: (params) =>
    $http.get('treatments_items/categories', { params }),
  items_categories_v2: (params) =>
    $http.get('treatment_items/categories', { params }),
  detail: (modelId) =>
    $http.get(`treatment_items/legacy/categories/${modelId}`),
  update: (model) =>
    $http.put(`treatment_items/legacy/categories/${model.id}`, model),
  update_v2: (model) =>
    $http.put(`treatment_items/categories/${model.id}`, model),
  multi_update: (payload) =>
    $http.put(`treatment_items/categories/multi`, payload),
  multi_update_v2: (payload) =>
    $http.put(`treatment_items/categories/multi`, payload),
  delete: (modelId) =>
    $http.delete(`treatment_items/legacy/categories/${modelId}`),
  delete_v2: (modelId) => $http.delete(`treatment_items/categories/${modelId}`),
  visible_v2: (model) =>
    $http.put(`treatment_items/categories/${model.id}`, model),
  // new batch
  edit_items: (model) => $http.put(`batch/treatment_items`, model, model),
};

export default treatment;
