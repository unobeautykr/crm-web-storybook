import { ApiResource } from './apiResource';

interface CreateSessionSmsParams {
  ruleId: number;
  sessionId: number;
}

interface SessionSmsData {
  contents: string;
  createdAt: string;
  id: number;
  imageUrl: string;
  notification: {
    callerNumber: string;
    channel: string;
    contents: string;
    customerName: string;
    failReason: string;
    id: number;
    imageUrl: string;
    phoneNumber: string;
    scheduledAt: string;
    status: string;
    title: string;
  };
  ruleHistory: {
    daysOffset: number;
    id: number;
    latest: boolean;
    ruleId: number;
    scheduledTime: string;
    smsScheduleType: string;
  };
  task: {
    creator: {
      id: number;
      name: string;
    };
    id: number;
    scheduledAt: string;
    status: string;
  };
  title: string;
}

export class SessionSmsApi extends ApiResource {
  async getSessionHistories(id: number, params: object) {
    return this.client.get(`/sessions/${id}/histories`, params);
  }

  async getSessionSms(params: object) {
    return this.client.get('/session_smses', params);
  }

  async createSessionSms(params: CreateSessionSmsParams) {
    return this.client.post<SessionSmsData>(`/session_smses`, params);
  }
}
