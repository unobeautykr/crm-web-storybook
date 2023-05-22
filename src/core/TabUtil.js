export const TabType = {
  appointment: 'APPOINTMENT',
  registration: 'REGISTRATION',
  consulting: 'CONSULTING',
  treatment: 'TREATMENT',
  surgery: 'SURGERY',
  nurseOperation: 'NURSE_OPERATION',
  nurseCare: 'NURSE_CARE',
  skinCare: 'SKINCARE',
  payment: 'PAYMENT',
  penchart: 'PENCHART',
  sms: 'SMS',
  callHistory: 'CALL_HISTORY',
  prescriptions: 'PRESCRIPTIONS',

  getName: (tabType) => {
    switch (tabType) {
      case TabType.appointment:
        return '예약';
      case TabType.registration:
        return '접수';
      case TabType.consulting:
        return '상담';
      case TabType.treatment:
        return '진료';
      case TabType.surgery:
        return '시/수술';
      case TabType.nurseOperation:
        return '수술간호';
      case TabType.nurseCare:
        return '간호';
      case TabType.skinCare:
        return '피부관리';
      case TabType.payment:
        return '수납';
      case TabType.penchart:
        return '펜차트';
      case TabType.sms:
        return '문자';
      case TabType.callHistory:
        return '통화';
      case TabType.prescriptions:
        return '처방전';
    }
  },

  getCountTabName: (tabType) => {
    switch (tabType) {
      case TabType.appointment:
        return 'appointmentCount';
      case TabType.registration:
        return 'registrationCount';
      case TabType.consulting:
        return 'consultingCount';
      case TabType.treatment:
        return 'treatmentCount';
      case TabType.surgery:
        return 'surgeryCount';
      case TabType.nurseOperation:
        return 'nurseOperationCount';
      case TabType.nurseCare:
        return 'nurseCareCount';
      case TabType.skinCare:
        return 'skincareCount';
      case TabType.payment:
        return 'paymentCount';
      case TabType.penchart:
        return 'fileCount';
      case TabType.sms:
        return 'smsCount';
      case TabType.callHistory:
        return 'callCount';
      case TabType.prescriptions:
        return 'prescriptionCount';
      default:
        return null;
    }
  },

  getTabHeaderTitleName: (tabType) => {
    switch (tabType) {
      case TabType.appointment:
        return '예약차트';
      case TabType.registration:
        return '접수차트';
      case TabType.consulting:
        return '상담차트';
      case TabType.treatment:
        return '진료차트';
      case TabType.surgery:
        return '시/수술차트';
      case TabType.nurseOperation:
        return '수술간호차트';
      case TabType.nurseCare:
        return '간호차트';
      case TabType.skinCare:
        return '피부관리차트';
      case TabType.payment:
        return '수납차트';
      case TabType.penchart:
        return '펜차트';
      case TabType.sms:
        return '문자전송내역';
      case TabType.callHistory:
        return '통화내역';
      case TabType.prescriptions:
        return '처방전';
      default:
        return null;
    }
  },
};

export const DefaultTabSetting = {
  [TabType.appointment]: { visible: true, pinned: false, order: 1 },
  [TabType.registration]: { visible: true, pinned: false, order: 2 },
  [TabType.consulting]: { visible: true, pinned: true, order: 3 },
  [TabType.treatment]: { visible: true, pinned: false, order: 4 },
  [TabType.surgery]: { visible: true, pinned: false, order: 5 },
  [TabType.nurseOperation]: { visible: true, pinned: false, order: 6 },
  [TabType.nurseCare]: { visible: true, pinned: false, order: 7 },
  [TabType.skinCare]: { visible: true, pinned: false, order: 8 },
  [TabType.payment]: { visible: true, pinned: false, order: 9 },
  [TabType.penchart]: { visible: true, pinned: false, order: 10 },
  [TabType.sms]: { visible: true, pinned: false, order: 11 },
  [TabType.callHistory]: { visible: true, pinned: false, order: 12 },
  [TabType.prescriptions]: { visible: true, pinned: false, order: 13 },
};
