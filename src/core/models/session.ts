export enum SessionProgress {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  COMPLETE = 'COMPLETE',
}

export enum SessionStatus {
  NONE = 'NONE',
  SCHEDULED = 'SCHEDULED',
  NO_SHOW = 'NO_SHOW',
  CANCELED = 'CANCELED',
  REGISTERED = 'REGISTERED',
  REGISTRATION_CANCELED = 'REGISTRATION_CANCELED',
  CONSULTING_WAITING = 'CONSULTING_WAITING',
  CONSULTING_DURING = 'CONSULTING_DURING',
  CONSULTING_DONE = 'CONSULTING_DONE',
  TREATMENT_WAITING = 'TREATMENT_WAITING',
  TREATMENT_DURING = 'TREATMENT_DURING',
  TREATMENT_DONE = 'TREATMENT_DONE',
  SURGERY_WAITING = 'SURGERY_WAITING',
  SURGERY_DURING = 'SURGERY_DURING',
  SURGERY_DONE = 'SURGERY_DONE',
  PAYMENT_WAITING = 'PAYMENT_WAITING',
  LEAVE = 'LEAVE',
}

export enum SessionCategory {
  NONE = 'NONE',
  CONSULTING = 'CONSULTING',
  TREATMENT = 'TREATMENT',
  SURGERY = 'SURGERY',
}

export enum SessionType {
  APPOINTMENT = 'APPOINTMENT',
  REGISTRATION = 'REGISTRATION',
}