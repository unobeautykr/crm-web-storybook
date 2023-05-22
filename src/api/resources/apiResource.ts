/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiClient } from '../apiClient';

export class ApiResource {
  constructor(protected client: ApiClient) {
    for (const prop of Object.getOwnPropertyNames(
      Object.getPrototypeOf(this)
    )) {
      if (prop === 'constructor' || typeof (this as any)[prop] !== 'function')
        continue;

      (this as any)[prop] = (this as any)[prop].bind(this);
      (this as any)[prop].apiKey = `${this.constructor.name}.${prop}`;
    }
  }

  arrayToQueryParam(items?: any[]) {
    return items?.map((v) => String(v)).join(',');
  }
}
