export const AppointmentType = {
  consulting: 'CONSULTING',
  treatment: 'TREATMENT',
  surgery: 'SURGERY',

  getName(type) {
    switch (type) {
      case AppointmentType.consulting:
        return '상담예약';
      case AppointmentType.treatment:
        return '진료예약';
      case AppointmentType.surgery:
        return '시/수술예약';
    }

    return '유효하지 않은 예약 종류';
  },
};

export const AppointmentTypeGroup = [
  AppointmentType.consulting,
  AppointmentType.treatment,
  AppointmentType.surgery,
];
