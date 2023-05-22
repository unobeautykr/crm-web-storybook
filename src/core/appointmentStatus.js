export const AppointmentStatus = {
  none: 'NONE',
  scheduled: 'SCHEDULED',
  noShow: 'NO_SHOW',
  canceled: 'CANCELED',
  registered: 'REGISTERED',
  consultingWaiting: 'CONSULTING_WAITING',
  consultingDuring: 'CONSULTING_DURING',
  consultingDone: 'CONSULTING_DONE',
  treatmentWaiting: 'TREATMENT_WAITING',
  treatmentDuring: 'TREATMENT_DURING',
  treatmentDone: 'TREATMENT_DONE',
  surgeryWaiting: 'SURGERY_WAITING',
  surgeryDuring: 'SURGERY_DURING',
  surgeryDone: 'SURGERY_DONE',
  paymentWaiting: 'PAYMENT_WAITING',
  complete: 'COMPLETE',
  leave: 'LEAVE',
  registrationCanceled: 'REGISTRATION_CANCELED',

  getName: (status) => {
    switch (status) {
      case AppointmentStatus.scheduled:
        return '예약';
      case AppointmentStatus.registered:
        return '접수';
      case AppointmentStatus.noShow:
        return '미방문';
      case AppointmentStatus.canceled:
        return '예약취소';
      case AppointmentStatus.consultingWaiting:
        return '상담대기';
      case AppointmentStatus.consultingDuring:
        return '상담중';
      case AppointmentStatus.consultingDone:
        return '상담완료';
      case AppointmentStatus.treatmentWaiting:
        return '진료대기';
      case AppointmentStatus.treatmentDuring:
        return '진료중';
      case AppointmentStatus.treatmentDone:
        return '진료완료';
      case AppointmentStatus.surgeryWaiting:
        return '시수술대기';
      case AppointmentStatus.surgeryDuring:
        return '시수술중';
      case AppointmentStatus.surgeryDone:
        return '시수술완료';
      case AppointmentStatus.paymentWaiting:
        return '수납대기';
      case AppointmentStatus.complete:
        return '완료';
      case AppointmentStatus.leave:
        return '퇴원';
      case AppointmentStatus.registrationCanceled:
        return '접수취소';
      default:
        throw new Error(`Invalid status type ${status}`);
    }
  },
};

export const AppointmentStatusGroup = [
  AppointmentStatus.scheduled,
  AppointmentStatus.noShow,
  AppointmentStatus.canceled,
];

export const RegistrationStatusGroup = [
  AppointmentStatus.consultingWaiting,
  AppointmentStatus.consultingDuring,
  AppointmentStatus.consultingDone,
  AppointmentStatus.treatmentWaiting,
  AppointmentStatus.treatmentDuring,
  AppointmentStatus.treatmentDone,
  AppointmentStatus.surgeryWaiting,
  AppointmentStatus.surgeryDuring,
  AppointmentStatus.surgeryDone,
  AppointmentStatus.paymentWaiting,
  AppointmentStatus.complete,
  AppointmentStatus.leave,
  AppointmentStatus.registrationCanceled,
];
