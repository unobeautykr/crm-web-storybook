import { AppointmentStatus } from '~/core/appointmentStatus';
import { useFetch } from 'use-http';
import * as $http from 'axios';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { useApi } from '~/components/providers/ApiProvider';
import { SmsSituation } from '~/core/models/smsRule';
import { useImperativeModal } from '~/components/providers/ImperativeModalProvider';
import { ImmediateSmsConfirmModal } from '~/components/modals/ImmediateSmsConfirmModal';

export const useUpdateStatus = () => {
  const { user } = { user: {} };
  const snackbar = useSnackbarContext();
  const imperativeModal = useImperativeModal();

  const {
    post: postAppointment,
    put: putAppointment,
    response: putAppointmentResp,
  } = useFetch(`/appointments`);
  const { put: putRegistration, response: putRegistrationResp } =
    useFetch(`/registrations`);
  const { post: postCancel, response: cancelResp } = useFetch(`/sessions`);

  const { smsRuleApi } = useApi();

  const openConfirmImmediateSmsModal = async (
    smsData,
    params = {},
    smsConfirmData = {}
  ) => {
    const confirmed = await imperativeModal.open((close) => (
      <ImmediateSmsConfirmModal
        appointment={smsConfirmData}
        smsRules={smsData.filter((f) => f.smsScheduleType === 'immediate')}
        onConfirm={() => close(true)}
        onCancel={() => close(false)}
      />
    ));

    if (confirmed) {
      params.sendSms = smsData.map((v) => v.id);
    } else {
      params.sendSms = smsData
        .filter((f) => f.smsScheduleType !== 'immediate')
        .map((v) => v.id);
    }
    return params;
  };

  // 접수 취소
  const updateRegistrationCancelStatus = async (ids = []) => {
    await postCancel(`/${ids}/cancel`);
    return cancelResp;
  };

  // 접수 퇴원
  const updateRegistrationLeaveStatus = async (appointment) => {
    const smsRules = (
      await smsRuleApi.list({
        departmentId: appointment.department.id,
        situations: [SmsSituation.leave],
        visible: true,
      })
    ).data;

    const params =
      smsRules.length > 0
        ? await openConfirmImmediateSmsModal(smsRules, {}, appointment)
        : undefined;

    const resp = await updateRegistrationStatus(
      appointment.id,
      AppointmentStatus.leave,
      params
    );

    return resp;
  };

  // 예약 취소
  const updateAppointmentCancelStatus = async (appointment) => {
    const smsRules = (
      await smsRuleApi.list({
        departmentId: appointment.department.id,
        situations: [SmsSituation.cancel],
        visible: true,
      })
    ).data;

    const params =
      smsRules.length > 0
        ? await openConfirmImmediateSmsModal(smsRules, {}, appointment)
        : undefined;
    await postCancel(`/${appointment.id}/cancel`, { ...params });
    return cancelResp;
  };

  const updateUnvisitedStatus = async (appointment, status, params = {}) => {
    const smsRules = (
      await smsRuleApi.list({
        departmentId: appointment.department.id,
        situations: [SmsSituation.unvisited],
        visible: true,
      })
    ).data;

    if (smsRules.length > 0) {
      params = {
        ...(await openConfirmImmediateSmsModal(smsRules, params, appointment)),
      };
    }

    await postAppointment(`/${appointment.id}/restore`, {
      status,
      ...params,
    });
  };

  const updateAppointmentRestoreSMS = async (appointment, params = {}) => {
    let msg;

    const smsRules = (
      await smsRuleApi.list({
        departmentId: appointment.department.id,
        situations: [SmsSituation.reserved],
        visible: true,
      })
    ).data;

    if (
      smsRules.filter((f) => f.smsScheduleType === 'immediate').length > 0 &&
      new Date(appointment.startAt) > new Date()
    ) {
      params = {
        ...(await openConfirmImmediateSmsModal(smsRules, params, appointment)),
      };
    }
    msg = '예약으로 업데이트 되었습니다.';
    await postAppointment(`/${appointment.id}/restore`, {
      status: AppointmentStatus.scheduled,
      ...params,
    });
    return { ...putAppointmentResp, msg };
  };

  const updateAppointmentStatus = async (appointment, status, params = {}) => {
    if (
      // 예약취소, 미방문 -> 예약
      (appointment.status === AppointmentStatus.canceled ||
        appointment.status === AppointmentStatus.noShow) &&
      status === AppointmentStatus.scheduled
    ) {
      return await updateAppointmentRestoreSMS(appointment, params);
    } else if (status === AppointmentStatus.noShow) {
      await updateUnvisitedStatus(appointment, status, params);
      return { ...putAppointmentResp };
    } else {
      await putAppointment(`/${appointment.id}`, { status, ...params });
    }
    return putAppointmentResp;
  };

  // 접수 상태 변경
  const updateRegistrationStatus = async (
    registrationId,
    status,
    params = {}
  ) => {
    await putRegistration(`/${registrationId}`, { status, ...params });
    return putRegistrationResp;
  };

  // 고객통합차트, 캘린더 > 접수상태로 변경 > 해당 예약 데이터와 동일한 접수 데이터를 (복사)생성 (*메모제외)
  const copyRegistration = async (appointmentId, status, params = {}) => {
    const appointment = await $http.get(`/appointments/${appointmentId}`);
    const data = appointment.data;
    const {
      acquisitionChannel,
      assist,
      department,
      customer,
      counselor,
      doctor,
    } = data;
    const payload = {
      appointmentId,
      status,
      date: data.date,
      category: data.category,
      acquisitionChannelId: acquisitionChannel && acquisitionChannel?.id,
      assistId: assist && assist?.id,
      departmentId: department && department?.id,
      customerId: customer && customer?.id,
      counselorId: counselor && counselor?.id,
      createdBy: user.id,
      doctorId: doctor && doctor?.id,
      startAt: data.startAt,
      endAt: data.endAt,
      treatmentItemIds: data.treatmentItems.map((v) => v.id),
      ...params,
    };
    try {
      const resp = await $http.post('/registrations', payload);
      return resp.data;
    } catch (e) {
      if (e.description === 'Department not found') {
        snackbar.alert('부서 정보를 확인하세요.');
      }
    }
  };

  return {
    updateAppointmentCancelStatus,
    updateRegistrationCancelStatus,
    updateUnvisitedStatus,
    copyRegistration,
    updateRegistrationStatus,
    updateAppointmentStatus,
    updateRegistrationLeaveStatus,
  };
};
