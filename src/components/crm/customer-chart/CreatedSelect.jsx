import PropTypes from 'prop-types';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { NativeSelect } from '~/components/NativeSelect';
import { forwardRef } from 'react';
import { getOptions } from '~/hooks/useFormSelect';

const CreatedSelect = forwardRef(
  ({ disabled, originValue, value, onChange }, ref) => {
    const { data: createdList } = useFetch(
      buildUrl('/users/duty', { userStatus: 'active', limit: 300 }),
      []
    );

    return (
      <NativeSelect
        ref={ref}
        value={value}
        onChange={(v) => onChange(v ? Number(v) : null)}
        options={getOptions(createdList?.data ?? [], originValue)}
        placeholder="작성자를 선택하세요."
        disabled={disabled}
        isRequire
      />
    );
  }
);

export default CreatedSelect;

CreatedSelect.propTypes = {
  disabled: PropTypes.bool,
  originValue: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
};
