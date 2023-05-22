import * as $http from 'axios';

export default {
  list: () => $http.get(`/doctors`), // 의사 리스트
  detail: (resourceId) => $http.get(`/doctors/${resourceId}`), // 의사 상세 데이터
};
