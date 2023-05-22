import { ApiDataResponse, ApiEmptyResponse } from '../apiClient';
import { ApiResource } from './apiResource';

interface FileData {
  createdAt: string;
  creator: {
    id: number;
    name: string;
  };
  favoritedAt: string;
  id: number;
  image: {
    id: number;
    originalUrl?: string;
    thumbnailUrl?: string;
    thumbnailStatus?: 'CREATING' | 'FAILED';
  };
  memo: string;
  modifier: {
    id: number;
    name: string;
  };
  name: string;
  parent: {
    id: number;
    name: string;
  };
  updatedAt: string;
}

interface CreateFileParams {
  favorite: boolean;
  imageId: number;
  name: string;
  parentId: number;
}

interface CreateFileDraftParams {
  name: string;
  imageId: number;
}

interface UpdateFileParams {
  favorite?: boolean;
  imageId?: number;
  memo?: string;
  name?: string;
  parentId?: number;
}

interface ListFileParams {
  parentId?: number;
}

export class FileApi extends ApiResource {
  async list(params: ListFileParams) {
    return this.client.get<ApiDataResponse<FileData[]>>(`/files`, params);
  }

  async getFile(id: number) {
    return this.client.get<ApiDataResponse<FileData>>(`/files/${id}`);
  }

  async createFile(params: CreateFileParams) {
    return this.client.post<FileData>(`/files`, params);
  }

  async updateFile(id: number, params: UpdateFileParams) {
    return this.client.put<ApiDataResponse<FileData>>(`/files/${id}`, params);
  }

  async deleteFile(id: number) {
    return this.client.delete<ApiEmptyResponse>(`/files/${id}`);
  }

  async createFileDraft(params: CreateFileDraftParams) {
    return this.client.post<FileData>(`/file_drafts`, params);
  }
}
