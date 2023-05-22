export const smsInvalidReason = {
  APPOINTMENT_CHANGED: 'APPOINTMENT_CHANGED',
  APPOINTMENT_CANCELED: 'APPOINTMENT_CANCELED',
  NO_SHOW: 'NO_SHOW',
  DEPARTMENT_DELETED: 'DEPARTMENT_DELETED',
  SMS_RULE_DELETED: 'SMS_RULE_DELETED',
  CALLER_NUMBER_DELETED: 'CALLER_NUMBER_DELETED',

  getInvalidReason: (reason) => {
    switch (reason) {
      case smsInvalidReason.APPOINTMENT_CHANGED:
        return '예약 변경';
      case smsInvalidReason.APPOINTMENT_CANCELED:
        return '예약 취소';
      case smsInvalidReason.NO_SHOW:
        return '미방문';
      case smsInvalidReason.DEPARTMENT_DELETED:
        return '부서 삭제';
      case smsInvalidReason.SMS_RULE_DELETED:
        return '문자 자동 전송 삭제';
      case smsInvalidReason.CALLER_NUMBER_DELETED:
        return '발신번호 삭제';
    }
  },
};

export const smsFailReason = {
  InvalidVariable: 'InvalidVariable',
  InvalidPhoneNumber: 'InvalidPhoneNumber',
  UnknownException: 'UnknownException',
  SmsDisabled: 'SmsDisabled',
  NoReceptionPhoneNumber: 'NoReceptionPhoneNumber',

  getFailReason: (reason) => {
    switch (reason) {
      case smsFailReason.InvalidVariable:
        return '치환불가변수';
      case smsFailReason.InvalidPhoneNumber:
        return '유효하지않은번호';
      case smsFailReason.SmsDisabled:
        return '문자 수신 거부';
      case smsFailReason.NoReceptionPhoneNumber:
        return '수신 번호 없음';
      case smsFailReason.UnknownException:
      default:
        return '기타';
    }
  },
};
