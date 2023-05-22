import { useMemo } from 'react';
import PropTypes from 'prop-types';
import ButtonGroup from './ButtonGroup';
import Label from '~/components/Label2';

const NextStepButton = ({ tabName, value, onChange, valueList = [] }) => {
  const buttonDataOriginal = useMemo(() => [
    {
      name: '선택안함',
      value: '',
    },
    {
      name: '진료대기',
      value: 'TREATMENT_WAITING',
    },
    {
      name: '상담대기',
      value: 'CONSULTING_WAITING',
    },
    {
      name: '수납대기',
      value: 'PAYMENT_WAITING',
    },
    {
      name: '시/수술대기',
      value: 'SURGERY_WAITING',
    },
    {
      name: '퇴원',
      value: 'LEAVE',
    },
    {
      name: '완료',
      value: 'CONSULTING_DONE',
    },
    {
      name: '완료',
      value: 'TREATMENT_DONE',
    },
    {
      name: '완료',
      value: 'SURGERY_DONE',
    },
    {
      name: '완료',
      value: `${tabName}_done`,
    },
  ]);

  // valueList 순서대로 정렬 및 데이터 필터링
  const buttonData = useMemo(() => {
    return valueList.map((v) => {
      v = buttonDataOriginal.find((o) => o.value === v);
      return v;
    });
  }, [valueList]);

  return (
    <>
      <Label text="다음진행">
        <ButtonGroup
          value={value}
          onChange={onChange}
          buttonData={buttonData}
        />
      </Label>
    </>
  );
};

NextStepButton.propTypes = {
  tabName: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  valueList: PropTypes.array,
};

export default NextStepButton;
