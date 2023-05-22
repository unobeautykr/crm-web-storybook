/* eslint-disable @typescript-eslint/no-explicit-any */

import { SessionSmsApi } from './resources/sessionSmsApi';
import { SessionApi } from './resources/sessionApi';
import { DriveApi } from './resources/driveApi';
import { UserApi } from './resources/userApi';
import { FileApi } from './resources/fileApi';

export class ApiException extends Error {
  constructor(
    public code: number | null,
    public name: string,
    message?: string
  ) {
    super(message);
  }

  get isAuthOrNetworkError() {
    return (
      this.code === 401 ||
      this.code === 403 ||
      this.name === ApiExceptionName.FAILED_TO_FETCH
    );
  }
}

export enum ApiExceptionName {
  FAILED_TO_FETCH = 'FAILED_TO_FETCH',
  IMAGE_UPLOAD_FAILED = 'IMAGE_UPLOAD_FAILED',
}

export interface ApiDataResponse<T> {
  data: T;
  pagination?: {
    pages: number;
    perPage: number;
    total: number;
  };
}
export interface PaginationResponse<T> {
  data: T;
  pagination: {
    pages: number;
    perPage: number;
    total: number;
  };
}

export type ApiEmptyResponse = null;

export interface PaginationParams {
  page?: number;
  limit?: number;
  orderBy?: string;
}

enum ApiClientEvent {
  ACCESS_DENIED = 'ACCESS_DENIED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  TOKEN_CHANGE = 'TOKEN_CHANGE',
}

function stripUndefined(
  obj: Record<string, any> | null | undefined,
  stripEmptyString = false
) {
  const stripped: Record<string, any> = {};

  if (!obj) return stripped;

  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined) return;
    if (stripEmptyString && obj[key] === '') return;

    stripped[key] = obj[key];
  });

  return stripped;
}

export class ApiClient extends EventTarget {
  static Event = ApiClientEvent;

  private endpoint: string;
  private accessToken?: string | null;
  private refreshToken?: string | null;
  public sessionApi: SessionApi;
  public sessionSmsApi: SessionSmsApi;
  public driveApi: DriveApi;
  public userApi: UserApi;
  public fileApi: FileApi;

  constructor({ endpoint }: { endpoint: string }) {
    super();
    this.endpoint = endpoint;
    this.sessionApi = new SessionApi(this);
    this.sessionSmsApi = new SessionSmsApi(this);
    this.userApi = new UserApi(this);
    this.driveApi = new DriveApi(this);
    this.fileApi = new FileApi(this);
  }

  setTokens(accessToken: string | null, refreshToken: string | null) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;

    this._dispatch(ApiClient.Event.TOKEN_CHANGE, {
      accessToken,
      refreshToken,
    });
  }

  buildHeaders(userOptions: unknown = {}) {
    const defaultArgs = {
      contentType: 'application/json',
      refresh: false,
    };

    const options = Object.assign(defaultArgs, userOptions);

    const headers: { [key: string]: string } = {};

    if (options.contentType) {
      headers['Content-Type'] = options.contentType;
    }

    if (options.refresh) {
      headers['Authorization'] = `Bearer ${this.refreshToken}`;
    } else {
      if (this.accessToken) {
        headers['Authorization'] = `Bearer ${this.accessToken}`;
      }
    }

    return headers;
  }

  on(type: string, listener: (arg: any) => void) {
    const handler = async (e: Event) => listener((e as CustomEvent).detail);
    this.addEventListener(type, handler);
    return () => {
      this.removeEventListener(type, handler);
    };
  }

  _dispatch(eventName: string, payload?: unknown) {
    this.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
  }

  async request<T>(request_func: () => Promise<Response>) {
    let res: Response;
    try {
      res = await request_func();
    } catch (e) {
      if (
        e instanceof Error &&
        e.name === 'TypeError' &&
        e.message === 'Failed to fetch'
      ) {
        throw new ApiException(
          null,
          ApiExceptionName.FAILED_TO_FETCH,
          e.message
        );
      }
      throw e;
    }

    if (res.ok) {
      try {
        return (await res.json()) as T;
      } catch {
        return null as T;
      }
    }

    let errorObject = '';
    await res.text().then((text) => (errorObject = text));
    const { description: message, name } = JSON.parse(errorObject) ?? {};

    if (res.status === 401) {
      this._dispatch(ApiClient.Event.UNAUTHORIZED);
    }

    if (res.status === 403 && name === 'ACCESS_RESTRICTED') {
      this._dispatch(ApiClient.Event.ACCESS_DENIED);
    }
    throw new ApiException(res.status, name, message);
  }

  async get<T>(
    path: string,
    params?: Record<string, any>,
    options?: Record<string, unknown>
  ) {
    return this.request<T>(() => {
      return fetch(
        `${this.endpoint}${path}?` +
          new URLSearchParams(stripUndefined(params, true)),
        {
          method: 'GET',
          headers: this.buildHeaders(options?.headers),
        }
      );
    });
  }

  async post<T>(
    path: string,
    payload: Record<string, any>,
    options?: Record<string, unknown>
  ) {
    return this.request<T>(() =>
      fetch(`${this.endpoint}${path}`, {
        method: 'POST',
        headers: this.buildHeaders(options?.headers),
        body: payload ? JSON.stringify(payload) : payload,
      })
    );
  }

  async put<T>(
    path: string,
    payload: Record<string, any>,
    options?: Record<string, unknown>
  ) {
    return this.request<T>(() =>
      fetch(`${this.endpoint}${path}`, {
        method: 'PUT',
        headers: this.buildHeaders(options?.headers),
        body: JSON.stringify(payload),
      })
    );
  }

  async delete<T>(
    path: string,
    payload?: Record<string, any>,
    options?: Record<string, unknown>
  ) {
    return this.request<T>(() =>
      fetch(`${this.endpoint}${path}`, {
        method: 'DELETE',
        headers: this.buildHeaders(options?.headers),
        body: JSON.stringify(payload),
      })
    );
  }

  async multipart<T>(
    path: string,
    payload: Record<string, any>,
    options?: Record<string, unknown>
  ) {
    return this.request<T>(async () => {
      const formData = new FormData();

      for (const name in payload) {
        formData.append(name, payload[name] as Blob);
      }

      return await fetch(`${this.endpoint}${path}`, {
        method: 'POST',
        headers: this.buildHeaders({
          ...(options?.headers as object),
          contentType: null,
        }),
        body: formData,
      });
    });
  }
}
