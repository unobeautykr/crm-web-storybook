import { TabType } from '~/core/TabUtil';
import { removeEmpty } from '~/utils/objUtil';
import moment from 'moment';

export const convertFormData = (data) => {
  switch (data.type) {
    case TabType.appointment:
    case TabType.registration:
      return convertAppointmentFormData(data);
    case TabType.treatment:
      return convertTreatmentsFormData(data);
    case TabType.consulting:
      return convertConsultingFormData(data);
    case TabType.nurseOperation:
      return convertOperationNurseFormData(data);
    case TabType.nurseCare:
      return convertNurseFormData(data);
    case TabType.surgery:
      return convertSurgeryFormData(data);
    case TabType.skinCare:
      return convertSkincareFormData(data);
    case TabType.payment:
      return convertPaymentFormData(data);
    default:
      break;
  }
};

export const convertAppointmentFormData = (data) =>
  removeEmpty({
    ...data,
    department: data.department?.id,
    acquisitionChannel:
      data.acquisitionChannel && (data.acquisitionChannel?.id ?? null),
    assist: data.assist && (data.assist?.id ?? null),
    doctor: data.doctor && (data.doctor?.id ?? null),
    counselor: data.counselor && (data.counselor?.id ?? null),
    created: data.creator && (data.creator?.id ?? null),
    surgery: data.treatmentItems,
    sendSms: data.id ? false : true,
    time:
      moment(`${data.date} ${data.endHour}`).diff(
        moment(`${data.date} ${data.startHour}`),
        'minutes'
      ) ?? 30,
    departments: data.department,
  });

export const convertTreatmentsFormData = (data) =>
  removeEmpty({
    ...data,
    surgery: data.items,
    date: data.registration.date,
    doctor: data.registration.doctor && data.registration.doctor?.id,
  });

export const convertConsultingFormData = (data) =>
  removeEmpty({
    ...data,
    surgery: data.items,
    result: data.result && (data.result?.id ?? null),
    date: data.registration.date,
    counselor: data.registration.counselor && data.registration.counselor?.id,
  });

export const convertOperationNurseFormData = (data) =>
  removeEmpty({
    ...data,
    surgery: data.items,
    nurse: data.nurse && (data.nurse?.id ?? null),
    startHour: data.startAt ? data.startAt.split('T')[1].slice(0, 2) : null,
    startMinute: data.startAt ? data.startAt.split('T')[1].slice(3, 5) : null,
    endHour: data.endAt ? data.endAt.split('T')[1].slice(0, 2) : null,
    endMinute: data.endAt ? data.endAt.split('T')[1].slice(3, 5) : null,
    date: data.registration.date,
    doctor: data.registration.doctor && data.registration.doctor?.id,
  });

export const convertNurseFormData = (data) =>
  removeEmpty({
    ...data,
    surgery: data.items,
    nurse: data.nurse && (data.nurse?.id ?? null),
    date: data.registration.date,
    doctor: data.registration.doctor && data.registration.doctor?.id,
  });

export const convertSurgeryFormData = (data) =>
  removeEmpty({
    ...data,
    ticketUses:
      data.ticketUses && data.ticketUses.map((v) => ({ ...v, useCount: 0 })),
    surgery: data.items,
    date: data.registration.date,
    doctor: data.registration.doctor && data.registration.doctor?.id,
    assist: data.registration.assist && data.registration.assist?.id,
  });

export const convertSkincareFormData = (data) =>
  removeEmpty({
    ...data,
    ticketUses:
      data.ticketUses && data.ticketUses.map((v) => ({ ...v, useCount: 0 })),
    date: data.registration.date,
    facialist: data.facialist?.id,
    counselor: data.registration.counselor && data.registration.counselor?.id,
    doctor: data.registration.doctor && data.registration.doctor?.id,
  });

export const convertPaymentFormData = (data) =>
  removeEmpty({
    ...data,
    counselor: data.counselor && (data.counselor?.id ?? null),
    manager: data.manager && (data.manager?.id ?? null),
    paidDate: data.paidAt,
    date: data.registration.date,
  });
