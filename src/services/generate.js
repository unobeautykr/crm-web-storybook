import * as $http from 'axios';

const generate = {
  customers: (clinidId, customerCount) =>
    $http.post('dev/customers/generate', { clinidId, customerCount }),
  clinics: (ownerEmail, tempPassword, ownerCount) =>
    $http.post('dev/clinics/generate', {
      ownerEmail,
      tempPassword,
      ownerCount,
    }),
  users: (tempPassword, clinicId, authorityGroupId, type, userCount) =>
    $http.post('dev/users/generate', {
      tempPassword,
      clinicId,
      authorityGroupId,
      type,
      userCount,
    }),
  admin: (email, password) =>
    $http.post('dev/admin/generate', { email, password }),
};

export default generate;
