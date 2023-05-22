import { CustomerVisitType } from '~/core/models/customer';
import {
  SessionCategory,
  SessionStatus,
  SessionType,
} from '~/core/models/session';
import { ApiDataResponse } from '../apiClient';
import { ApiResource } from './apiResource';

interface GetSessionsDaily {
  startAt: string;
  endAt: string;
  lastUpdatedAt: string;
}

interface GetSessionStats {
  startAt: string;
  endAt: string;
}

interface getSessionsOccupations {
  date: string;
  departmentId: number;
}

interface DailySessionData {
  id: number;
  date: string;
  type: SessionType;
  status: SessionStatus;
  category: SessionCategory;
  visitType: CustomerVisitType;
  startAt: string;
  endAt: string;
  startHour: string;
  endHour: string;
  deletedAt: string;
  customer: any;
  counselor: any;
  doctor: any;
  assist: any;
  department: any;
  treatmentItems: any;
  statusChangedAt: string;
  creator: any;
}

interface SessionData {
  id: number;
  date: string;
  type: SessionType;
  status: SessionStatus;
  category: SessionCategory;
  visitType: CustomerVisitType;
  startAt: string;
  endAt: string;
  startHour: string;
  endHour: string;
  deletedAt: string;
  customer: any;
  counselor: any;
  doctor: any;
  assist: any;
  department: any;
  treatmentItems: any;
  statusChangedAt: string;
  creator: any;
}

interface SessionsOccupationsData {
  items: [
    {
      count: number;
      time: string;
    }
  ];
}

interface SessionStatsData {
  new: number;
  total: number;
  established: number;
  canceled: number;
}

export class SessionApi extends ApiResource {
  async daily(params: GetSessionsDaily) {
    return this.client.get<ApiDataResponse<DailySessionData[]>>(
      '/sessions/daily',
      params
    );
  }

  async getStats(params: GetSessionStats) {
    return this.client.get<ApiDataResponse<SessionStatsData>>(
      '/sessions/stats',
      params
    );
  }

  async get(id: number) {
    return this.client.get<ApiDataResponse<SessionData>>(`/sessions/${id}`);
  }

  async occupations(params: getSessionsOccupations) {
    return this.client.get<ApiDataResponse<SessionsOccupationsData>>(
      '/sessions/occupations',
      params
    );
  }
}
