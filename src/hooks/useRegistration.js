import { useFetch } from 'use-http';
import { AppointmentStatus } from '~/core/appointmentStatus';

export const useRegistration = ({ registrationId } = {}) => {
  const { get: getRegistration } = useFetch(
    `/registrations/${registrationId}`,
    {
      onNewData: (old, updates) => {
        return updates.data;
      },
    }
  );
  const { post: postRegistration } = useFetch(`/registrations`, {
    onNewData: (old, updates) => {
      return updates.data.id;
    },
  });
  const { put: putRegistration } = useFetch(
    `/registrations/${registrationId}`,
    {
      onNewData: (old, updates) => {
        return updates.data.id;
      },
    }
  );

  // 고객통합차트 > 상담/진료/시수술.... > 연동된 접수 생성/수정
  const updateRegistration = async (data, invalid) => {
    if (!registrationId) {
      return await postRegistration({
        ...data,
        open: false,
      });
    } else {
      const registration = await getRegistration();
      if (invalid === true && registration.date !== data.date) {
        // 통합차트 수정시 접수연동과 상관없이 날짜 변경이 가능해야함.
        // progress: "CLOSED" 접수인데 날짜가 변경되는 경우
        // 접수를 새로 생성하도록 Invalid 값을 체크
        return await postRegistration({
          ...data,
          open: false,
        });
      }
      if (registration.status === AppointmentStatus.registrationCanceled) {
        return AppointmentStatus.registrationCanceled;
      } else {
        return await putRegistration(data);
      }
    }
  };

  const isOpenNextSelectModal = (type, registration) => {
    if (type === 'CONSULTING_WAITING') {
      return Boolean(!registration.counselor);
    } else if (type === 'TREATMENT_WAITING') {
      return Boolean(!registration.doctor);
    } else if (type === 'SURGERY_WAITING') {
      return Boolean(!registration.doctor || !registration.assist);
    } else {
      return false;
    }
  };

  const registrationValidate = (registration) => {
    let message = null;
    if (registration === AppointmentStatus.registrationCanceled) {
      message = '선택된 접수는 취소 건입니다. 접수정보를 확인하세요.';
    }
    return message;
  };

  return {
    getRegistration,
    updateRegistration,
    isOpenNextSelectModal,
    registrationValidate,
  };
};
