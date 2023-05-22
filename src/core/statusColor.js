export const StatusColor = {
  scheduled: 'SCHEDULED',
  no_show: 'NO_SHOW',
  consulting_waiting: 'CONSULTING_WAITING',
  consulting_during: 'CONSULTING_DURING',
  consulting_done: 'CONSULTING_DONE',
  treatment_waiting: 'TREATMENT_WAITING',
  treatment_during: 'TREATMENT_DURING',
  treatment_done: 'TREATMENT_DONE',
  surgery_waiting: 'SURGERY_WAITING',
  surgery_during: 'SURGERY_DURING',
  surgery_done: 'SURGERY_DONE',
  payment_waiting: 'PAYMENT_WAITING',
  complete: 'COMPLETE',
  canceled: 'CANCELED',
  leave: 'LEAVE',
  absence: 'ABSENCE',
  registration_canceled: 'REGISTRATION_CANCELED',
  unknown: 'UNKNOWN',

  getName: (statusColor) => {
    switch (statusColor) {
      case StatusColor.scheduled:
        return '예약';
      case StatusColor.no_show:
        return '미방문';
      case StatusColor.consulting_waiting:
        return '상담대기';
      case StatusColor.consulting_during:
        return '상담중';
      case StatusColor.treatment_waiting:
        return '진료대기';
      case StatusColor.treatment_during:
        return '진료중';
      case StatusColor.surgery_waiting:
        return '시수술대기';
      case StatusColor.surgery_during:
        return '시수술중';
      case StatusColor.payment_waiting:
        return '수납대기';
      case StatusColor.complete:
        return '완료';
      case StatusColor.canceled:
        return '예약취소';
      case StatusColor.leave:
        return '퇴원';
      case StatusColor.absence:
        return '휴진';
      case StatusColor.registration_canceled:
        return '접수취소';
      case StatusColor.unknown:
        return '미지원';
    }
  },

  fromStatus: (status) => {
    switch (status) {
      case StatusColor.consulting_done:
      case StatusColor.treatment_done:
      case StatusColor.surgery_done:
        return StatusColor.complete;
      default:
        return status;
    }
  },
};
