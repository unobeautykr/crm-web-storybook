import PropTypes from 'prop-types';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { NativeSelect } from '~/components/NativeSelect';
import { forwardRef } from 'react';
import { getOptions } from '~/hooks/useFormSelect';

const CounselorSelect = forwardRef(({ originValue, value, onChange }, ref) => {
  const { data: counselorList } = useFetch(
    buildUrl('/users/duty', {
      userStatus: 'active',
      limit: 300,
      duty: '상담사',
    }),
    []
  );

  return (
    <NativeSelect
      ref={ref}
      value={value}
      onChange={(v) => onChange(v ? Number(v) : null)}
      options={getOptions(counselorList?.data ?? [], originValue)}
      placeholder="상담사를 선택하세요."
    />
  );
});

export default CounselorSelect;

CounselorSelect.propTypes = {
  originValue: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
};
