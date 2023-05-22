import {
  ApiDataResponse,
  PaginationParams,
  PaginationResponse,
} from '../apiClient';
import { ApiResource } from './apiResource';

interface ConfigData {
  key: string;
  value: string;
}

interface GetUserListParams extends PaginationParams {
  duty?: string[];
}

interface GetUserDutyParams extends PaginationParams {
  userStatus?: string;
  limit?: number;
}

interface UserData {
  id: number;
  name: string;
}

interface SigninData {
  accessToken: string;
  refreshToken: string;
}

export class UserApi extends ApiResource {
  async signin(email: string, password: string) {
    return this.client.post<SigninData>(
      '/users/sign_in',
      { email, password },
      {
        retry: false,
      }
    );
  }

  async me() {
    return this.client.get('/users/me');
  }

  async duty(params: GetUserDutyParams) {
    return this.client.get<PaginationResponse<UserData[]>>('/users', {
      ...params,
    });
  }

  async list(params: GetUserListParams) {
    return this.client.get<PaginationResponse<UserData[]>>('/users', {
      ...params,
      duty: params.duty?.join(','),
    });
  }

  async getConfig(key: string) {
    return this.client.get<ApiDataResponse<ConfigData>>('/users/config', {
      key,
    });
  }

  async updateConfig(key: string, value: boolean) {
    //api 상으로 value가 string으로 정의되어 있음
    return this.client.put<ApiDataResponse<ConfigData>>('/users/config', {
      key,
      value: String(value),
    });
  }
}
