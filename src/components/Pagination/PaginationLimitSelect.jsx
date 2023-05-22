import PropTypes from 'prop-types';
import { Select2 } from '~/components/Select2';

export const PaginationLimitSelect = ({
  value,
  onChange,
  fieldSize,
  options,
}) => {
  const defaultOptions = [
    {
      label: '10개씩',
      value: 10,
    },
    {
      label: '15개씩',
      value: 15,
    },
    {
      label: '20개씩',
      value: 20,
    },
    {
      label: '50개씩',
      value: 50,
    },
  ];
  return (
    <Select2
      fieldSize={fieldSize ?? 'small'}
      value={value}
      options={options ?? defaultOptions}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

PaginationLimitSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  fieldSize: PropTypes.string,
  options: PropTypes.array,
};
