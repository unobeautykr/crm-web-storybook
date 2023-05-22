export const EventType = {
  APPOINTMENT: 'APPOINTMENT',
  REGISTRATION: 'REGISTRATION',
  PENCHART: 'PENCHART',
  CALL: 'CALL',
  ABSENCE: 'ABSENCE',
  ABSENCE_MODIFICATION: 'ABSENCE_MODIFICATION',
  WS_DATA: 'WS_DATA',
  CALL_API: 'CALL_API',
  COUNT_CALL_API: 'COUNT_CALL_API',
  REMAINING_COUNT_CALL_API: 'REMAINING_COUNT_CALL_API',
  CUSTOMER_LOAD_API: 'CUSTOMER_LOAD_API',
  TREE_CALL_API: 'TREE_CALL_API',
  APPOINTMENT_COMPLETE: 'APPOINTMENT_COMPLETE',
  DELETE_API: 'DELETE_API',
  DAILY_APPOINTMENT_API: 'DAILY_APPOINTMENT_API',
  PAYMENT_SUMMARY_API: 'PAYMENT_SUMMARY_API',
  SAVE_API: 'SAVE_API',
  SMS_BALANCE: 'SMS_BALANCE',
  ORGANIZATIONS_API: 'ORGANIZATIONS_API',
  OPEN_FORM_SETTING_API: 'OPEN_FORM_SETTING_API',
  AUTO_SMS_RULES_API: 'AUTO_SMS_RULES_API',
  SURGERY_PERIOD_SMS_RULES_API: 'SURGERY_PERIOD_SMS_RULES_API',
  PAYMENT_API: 'PAYMENT_API',
};

export class DataEvent extends EventTarget {
  emit(type: string, args?: any) {
    this.dispatchEvent(
      new CustomEvent(type, {
        detail: args,
      })
    );
  }

  on(type: string, callback: (data: any) => void) {
    const handler = async (e: Event) => callback((e as CustomEvent).detail);
    this.addEventListener(type, handler);
    return () => {
      this.removeEventListener(type, handler);
    };
  }
}

export default new DataEvent();
