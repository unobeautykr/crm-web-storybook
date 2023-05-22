import PropTypes from 'prop-types';
import moment from 'moment';
import DateInput from '~/components/DateInput';
import { forwardRef } from 'react';

const DateSelect = forwardRef(
  ({ value, placeholderText, onChange, disabled, ...props }, ref) => {
    const handleChange = (v) => v && onChange(moment(v).format('YYYY-MM-DD'));

    return (
      <DateInput
        value={value}
        onChange={handleChange}
        dateFormat="yyyy/MM/dd"
        placeholder={placeholderText}
        disabled={disabled}
        width="100%"
        {...props}
      />
    );
  }
);

DateSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholderText: PropTypes.string,
  disabled: PropTypes.bool,
};

export default DateSelect;
