export enum SmsRuleType {
  SESSION = 'SESSION',
  CUSTOMER = 'CUSTOMER',
  TREATMENT_ITEM = 'TREATMENT_ITEM',
}

export enum SmsSituation {
  reserved = 'reserved',
  cancel = 'cancel',
  register = 'register',
  treatment_item = 'treatment_item',
  unvisited = 'unvisited',
  leave = 'leave',
}

export enum SmsType {
  normal = 'normal',
  event = 'event',
}

export enum SmsScheduleType {
  scheduled = 'scheduled',
  immediate = 'immediate',
}
