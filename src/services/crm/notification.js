import * as $http from 'axios';
import { $case } from '~/utils/filters';
import { objectToFormData } from 'object-to-formdata';

const notification = {};

const models = [
  'callerNumbers',
  'boilerplateMessages',
  'alimtalk',
  'smsSearch',
  'smsSearchResult',
  'balance',
  'smsNotifications',
  'sendNotifications',
  'boilerplateMap',
];

const foo = (str) => $case.toSnake(str);

models.forEach((modelName) => {
  notification[modelName] = {
    create: (model) => $http.post(`${foo(modelName)}`, model),
    all: (params) => $http.get(`${foo(modelName)}`, { params }),
    detail: (modelId) => $http.get(`${foo(modelName)}/${modelId}`),
    update: (model) => $http.put(`${foo(modelName)}/${model.id}`, model),
    visible: (model) =>
      $http.put(`${foo(modelName)}/visible/${model.id}`, model),
    delete: (modelId) => $http.delete(`${foo(modelName)}/${modelId}`),
  };
});

notification.callerNumbers.auth = ({ params, callback }) => {
  // ARS요청 도중. 유저가 탈출 시(언마운트. 모달종료 등) 연결을 끊습니다.
  const cancelSource = $http.CancelToken.source();
  callback(cancelSource);
  return $http
    .post(
      `caller_numbers/auth`,
      {
        phoneNumber: params.phoneNumber,
      },
      {
        cancelToken: cancelSource.token,
      }
    )
    .then((payload) => {
      callback(null);
      return payload;
    })
    .catch((error) => {
      console.error('[error]', error);
    });
};

notification.callerNumbers.verify = (model) =>
  $http.put(`caller_numbers/verify`, model);
notification.boilerplateMessages.create = (model) =>
  $http.post(
    `boilerplate_messages`,
    objectToFormData(model, { indices: true })
  );
notification.boilerplateMessages.update = (model) =>
  $http.put(
    `boilerplate_messages/${model.id}`,
    objectToFormData(model, { indices: true })
  );

notification.smsNotifications.cancel = (params) =>
  $http.post(`/sms_send_task/cancel`, params);

notification.alimtalk.all = (params) => $http.get(`alimtalk`, { params });
notification.alimtalk.delete = () => $http.delete(`alimtalk`);
notification.alimtalk.authCode = (params) =>
  $http.post('alimtalk/auth_code', params);
notification.alimtalk.create = (params) => $http.post('alimtalk', params); // API확인/UI변경사항이 잦아, 개발을 위해 임시 분리함. 추후 제거

notification.smsNotifications.create = (model) =>
  $http.post(`sms_send_task`, objectToFormData(model, { indices: true }));
notification.smsSearchResult.create = (model) =>
  $http.post(`sms_search_result`, model);
notification.smsSearchResult.detail = (params) =>
  $http.get(`sms_search_result/${params.id}`, { params });

notification.smsNotifications.history = {
  all: (params) => $http.get(`/sms_send_task`, { params }),
};

notification.smsConfig = {
  all: (params) => $http.get(`sms/configs`, { params }),
};

notification.boilerplateMap.create = (model) =>
  $http.post(`boilerplate_map`, objectToFormData(model, { indices: true }));
notification.boilerplateMap.update = (model) =>
  $http.put(
    `boilerplate_map/${model.id}`,
    objectToFormData(model, { indices: true })
  );

notification.priceTables = {
  all: (params) => $http.get(`/price_tables`, { params }),
};

export default notification;
