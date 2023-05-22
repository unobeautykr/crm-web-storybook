import moment from 'moment';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import DateInput from './DateInput';
import '~/assets/styles/output/datepicker.css';

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  column-gap: 6px;
`;

const Separator = styled('div')`
  display: flex;
  background: #dee2ec;
  width: 8px;
  height: 1px;
  flex: 0 0 auto;
`;

const DateRangeInput = ({ value, onChange, placeholder, ...props }) => {
  const onChangeDate = (start, end) => {
    onChange(start, end);
  };

  return (
    <Wrapper>
      <DateInput
        value={value?.start}
        onChange={(start) =>
          onChangeDate(
            start,
            value.end && moment(start).isAfter(value.end, 'd')
              ? start
              : value.end
          )
        }
        placeholder={placeholder?.start ?? placeholder}
        {...props}
      />
      <Separator />
      <DateInput
        value={value?.end}
        onChange={(end) =>
          onChangeDate(
            value.start && moment(end).isBefore(value.start, 'd')
              ? end
              : value.start,
            end
          )
        }
        placeholder={placeholder?.end ?? placeholder}
        {...props}
      />
    </Wrapper>
  );
};

DateRangeInput.propTypes = {
  value: PropTypes.shape({
    start: PropTypes.any,
    end: PropTypes.any,
  }),
  onChange: PropTypes.func,
  placeholder: PropTypes.shape({
    start: PropTypes.string,
    end: PropTypes.string,
  }),
};

export default observer(DateRangeInput);
