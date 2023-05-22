import PropTypes from 'prop-types';
import { useFetch } from 'use-http';
import { buildUrl } from '~/utils/url';
import { NativeSelect } from '~/components/NativeSelect';
import { forwardRef } from 'react';
import { getOptions } from '~/hooks/useFormSelect';

const ConsultingResultSelect = forwardRef(
  ({ originValue, value, onChange }, ref) => {
    const { data: resultList } = useFetch(
      buildUrl('/consultings/results', {
        limit: 300,
        visible: true,
      }),
      []
    );

    return (
      <NativeSelect
        ref={ref}
        value={value}
        onChange={(v) => onChange(v ? Number(v) : null)}
        options={getOptions(resultList?.data ?? [], originValue)}
        placeholder="-"
      />
    );
  }
);

export default ConsultingResultSelect;

ConsultingResultSelect.propTypes = {
  originValue: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onChange: PropTypes.func,
};
