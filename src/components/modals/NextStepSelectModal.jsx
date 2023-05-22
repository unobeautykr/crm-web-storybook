import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '~/components/Button';
import { Select } from '~/components/Select';
import { Label } from '~/components/Label';
import { NormalModal } from './common/NormalModal';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';

const LabelWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const NextStepSelectModal = ({
  open,
  onClose,
  onCancel,
  onConfirm,
  type,
  registration,
}) => {
  const [doctorId, setDoctorId] = useState(null);
  const [counselorId, setCounselorId] = useState(null);
  const [assistId, setAssistId] = useState(null);

  const { data: doctorList } = useFetch(
    buildUrl('/users/duty', {
      userStatus: 'active',
      limit: 300,
      duty: '의사',
    }),
    []
  );

  const { data: counselorList } = useFetch(
    buildUrl('/users/duty', {
      userStatus: 'active',
      limit: 300,
      duty: '상담사',
    }),
    []
  );

  const { data: assistList } = useFetch(
    buildUrl('/users/duty', {
      userStatus: 'active',
      limit: 300,
      duty: '피부관리사,간호사,간호조무사',
    }),
    []
  );

  useEffect(() => {
    if (registration?.doctor) {
      setDoctorId(registration.doctor.id);
    }
    if (registration?.counselor) {
      setCounselorId(registration.counselor.id);
    }
    if (registration?.assist) {
      setAssistId(registration.assist.id);
    }

    return () => {
      setDoctorId(null);
      setCounselorId(null);
      setAssistId(null);
    };
  }, [type, registration]);

  const getTitle = () => {
    switch (type) {
      case 'CONSULTING_WAITING':
        return '상담대기 상담사를 선택하세요.';
      case 'TREATMENT_WAITING':
        return '진료대기 의사를 선택하세요.';
      case 'SURGERY_WAITING':
        return '시/수술대기 의사 및 어시스트를 선택하세요.';
      default:
        return '';
    }
  };

  const Contents = () => {
    switch (type) {
      case 'CONSULTING_WAITING':
        return (
          <Label text="상담사">
            <Select
              style={{ width: '100%' }}
              options={counselorList?.data}
              optionLabel="name"
              optionValue="id"
              placeholder="상담사를 선택하세요."
              value={counselorId}
              onChange={(v) => {
                let value = v === '' ? null : v;
                setCounselorId(value);
              }}
            />
          </Label>
        );
      case 'TREATMENT_WAITING':
        return (
          <Label text="의사">
            <Select
              style={{ width: '100%' }}
              options={doctorList?.data}
              optionLabel="name"
              optionValue="id"
              placeholder="의사를 선택하세요."
              value={doctorId}
              onChange={(v) => {
                let value = v === '' ? null : v;
                setDoctorId(value);
              }}
            />
          </Label>
        );
      case 'SURGERY_WAITING':
        return (
          <LabelWrapper>
            <Label text="의사">
              <Select
                style={{ width: '100%' }}
                options={doctorList?.data}
                optionLabel="name"
                optionValue="id"
                placeholder="의사를 선택하세요."
                value={doctorId}
                onChange={(v) => {
                  let value = v === '' ? null : v;
                  setDoctorId(value);
                }}
              />
            </Label>
            <Label text="어시스트">
              <Select
                style={{ width: '100%' }}
                options={assistList?.data}
                optionLabel="name"
                optionValue="id"
                placeholder="어시스트를 선택하세요."
                value={assistId}
                onChange={(v) => {
                  let value = v === '' ? null : v;
                  setAssistId(value);
                }}
              />
            </Label>
          </LabelWrapper>
        );
      default:
        return null;
    }
  };

  const onClickSave = () => {
    let payload = {};
    switch (type) {
      case 'CONSULTING_WAITING':
        payload.counselorId = counselorId;
        break;
      case 'TREATMENT_WAITING':
        payload.doctorId = doctorId;
        break;
      case 'SURGERY_WAITING':
        payload.doctorId = doctorId;
        payload.assistId = assistId;
        break;
    }
    onConfirm(payload);
  };

  return (
    <NormalModal
      title={getTitle()}
      open={open}
      onClose={() => onClose()}
      footer={
        <>
          <Button styled="outline" onClick={onCancel} color="mix">
            취소
          </Button>
          <Button onClick={onClickSave}>확인</Button>
        </>
      }
    >
      <Contents />
    </NormalModal>
  );
};

NextStepSelectModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  type: PropTypes.string,
  registration: PropTypes.object,
};
