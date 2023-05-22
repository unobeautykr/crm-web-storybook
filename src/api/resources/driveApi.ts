import { ApiDataResponse, ApiEmptyResponse } from '../apiClient';
import { ApiResource } from './apiResource';

interface GetDriveEntityListParams {
  driveId?: number;
  parentId?: number;
  limit?: number;
  favorite?: boolean;
}

type CopyDriveEntityBatchParams = {
  items: {
    destId: number;
    srcId: number;
  }[];
  favorite?: boolean;
};

export type DirectoryData = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  parentId: number;
  type: 'DIR';
  favoritedAt: string;
  creator: any;
  modifier: any;
};

export type FileData = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  parentId: number;
  type: 'FILE';
  favoritedAt: string;
  image: {
    id: number;
    originalUrl?: string;
    thumbnailUrl?: string;
    thumbnailStatus?: 'CREATING' | 'FAILED';
  };
  creator: any;
  modifier: any;
};

export type DriveEntityData = DirectoryData | FileData;

interface DriveData {
  id: number;
  root: {
    id: number;
  };
}

export class DriveApi extends ApiResource {
  async getClinicDrive(clinicId: number) {
    return this.client.get<ApiDataResponse<DriveData>>(
      `/drives/clinics/${clinicId}`
    );
  }

  async getCustomerDrive(customerId: number) {
    return this.client.get<ApiDataResponse<DriveData>>(
      `/drives/customers/${customerId}`
    );
  }

  async driveEntityList(params: GetDriveEntityListParams) {
    return this.client.get<ApiDataResponse<DriveEntityData[]>>(
      '/drive_entities',
      params
    );
  }

  async copyDriveEntities(params: CopyDriveEntityBatchParams) {
    return this.client.post<ApiEmptyResponse>('/batch/drive_entities/copy', {
      ...params,
    });
  }
}
