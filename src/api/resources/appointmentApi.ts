import { CustomerVisitType } from '~/core/models/customer';
import {
  SessionCategory,
  SessionStatus,
  SessionType,
} from '~/core/models/session';
import {
  PaginationParams,
  PaginationResponse,
  ApiEmptyResponse,
} from '../apiClient';
import { ApiResource } from './apiResource';

interface GetAppointmentListParams extends PaginationParams {
  dateStart?: string;
  dateEnd?: string;
  customerName?: string;
  customerChartNo?: string;
  phoneNumberLast?: string;
  status?: SessionStatus[];
  category?: SessionCategory[];
  minStart?: number;
  minEnd?: number;
  startHour?: any;
  departmentCategoryId?: number[];
  departmentId?: number[];
  acquisitionChannelId?: (number | null)[];
  doctorId?: (number | null)[];
  counselorId?: (number | null)[];
  assistId?: (number | null)[];
  treatmentItemCategoryId?: (number | null)[];
  treatmentItemId?: (number | null)[];
  customerCreatedAtStart?: string;
  customerCreatedAtEnd?: string;
  visitType?: string[] | undefined;
}

export interface AppointmentData {
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
  charts: any[];
}

type DeleteAppointmentBatchParams = number[];

export class AppointmentApi extends ApiResource {
  async getConfig(key: string) {
    return this.client.get('/appointments/v2/calendar/configs', {
      configKey: key,
    });
  }

  async create(params: any) {
    return this.client.post(`/appointments`, params);
  }

  async update(id: number, params: any) {
    return this.client.put(`/appointments/${id}`, params);
  }

  async getAppointment(id: number) {
    return this.client.get(`/appointments/${id}`);
  }

  async batchAppointments(ids: Array<number>) {
    return this.client.delete('/batch/appointments', { ids: ids });
  }

  async list(params: GetAppointmentListParams) {
    return this.client.get<PaginationResponse<AppointmentData[]>>(
      '/appointments',
      {
        ...params,
        counselorId: this.arrayToQueryParam(params.counselorId),
        assistId: this.arrayToQueryParam(params.assistId),
        doctorId: this.arrayToQueryParam(params.doctorId),
        acquisitionChannelId: this.arrayToQueryParam(
          params.acquisitionChannelId
        ),
        treatmentItemId: this.arrayToQueryParam(params.treatmentItemId),
        treatmentItemCategoryId: this.arrayToQueryParam(
          params.treatmentItemCategoryId
        ),
        status: this.arrayToQueryParam(params.status),
        visitType: this.arrayToQueryParam(params.visitType),
      }
    );
  }

  async deleteBatch(params: DeleteAppointmentBatchParams) {
    return this.client.delete<ApiEmptyResponse>(`/batch/appointments`, {
      ids: params,
    });
  }
}
