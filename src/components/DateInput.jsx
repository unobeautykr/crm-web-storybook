import { useEffect, useCallback, forwardRef } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { InnerBoxStyle } from './Label';
import { ToolbarButton } from './ToolbarButton';
import NativeSelect from './NativeSelect2';
import { useHoliday } from '~/store/holiday';
import '../assets/styles/output/datepicker.css';
import { ChevronRightIcon } from '~/icons/ChevronRight';
import { ChevronLeftIcon } from '~/icons/ChevronLeft';

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  column-gap: 8px;
  justify-content: center;
  height: 29px;
  margin-bottom: 10px;
`;

const DatePickerWrapper = styled('div')`
  .react-datepicker-wrapper {
    width: 100%;
    height: 100%;
  }
  input {
    ${InnerBoxStyle}
    height: 29px;
    &::placeholder {
      color: #a1b1ca !important;
    }
    &:disabled {
      background-color: #f3f8ff;
      color: #4a4e70;
    }

    ${({ error }) =>
      error &&
      css`
        border-color: #f7685b !important;
      `}
  }
`;

const DateText = styled('div')`
  font-size: 15px;
  font-weight: 700;
  line-hieght: 22px;
`;

function range(start, end) {
  return Array(end - start + 1)
    .fill()
    .map((_, idx) => start + idx);
}
const years = range(1900, 2100);
const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const DateInput = forwardRef(
  (
    {
      className,
      placeholder,
      dateFormat = 'yyyy년 MM월 dd일',
      value,
      onChange,
      disabled,
      maxDate,
      minDate,
      width,
      error,
      autoFocus,
      ...props
    },
    ref
  ) => {
    const holiday = useHoliday();

    const getHoliday = useCallback(
      async (date) => {
        (await holiday) && holiday.load(date ?? new Date());
      },
      [holiday]
    );

    useEffect(() => {
      if (value) getHoliday(value);
    }, [getHoliday, value]);

    useEffect(() => {
      if (autoFocus && ref?.current) {
        ref.current.setFocus();
      }
    }, [ref, autoFocus]);

    const getDayName = (date) => {
      return date.toLocaleDateString('ko-KR', { weekday: 'long' }).substr(0, 1);
    };

    const getDayClassName = useCallback(
      (date) => {
        return (holiday?.holidays ?? []).some(
          (v) => v.locdate === moment(date).format('yyyy-MM-dd')
        )
          ? 'holiday'
          : getDayName(date) === '토'
          ? 'saturday'
          : getDayName(date) === '일'
          ? 'sunday'
          : undefined;
      },
      [holiday]
    );

    const onChangeDate = (v, e) => {
      // 년도 자릿수로 정상데이터 체크
      // 정상값 일 경우에만 onChange
      if (!v || String(moment(v).year()).length === 4)
        onChange && onChange(v, e);
    };

    const onClickPrevMonth = (e, func) => {
      e.preventDefault();
      func();
    };

    const onClickNextMonth = (e, func) => {
      e.preventDefault();

      func();
    };

    return (
      <DatePickerWrapper
        // 스타일이 통일되지 않은 곳이 많아서 통일되기 전까지 사용
        style={{
          width: width ? width : 'auto',
          ...props?.style,
        }}
        error={error}
      >
        <DatePicker
          ref={ref}
          showYearDropdown
          showMonthDropdown
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled,
          }) => (
            <div>
              <Wrapper>
                <ToolbarButton
                  data-testid="previous-month"
                  onClick={(e) => onClickPrevMonth(e, decreaseMonth)}
                  disabled={prevMonthButtonDisabled}
                >
                  <ChevronLeftIcon fontSize="small" />
                </ToolbarButton>

                <DateText>{moment(date).format('yyyy.MM.dd (E)')}</DateText>
                <ToolbarButton
                  data-testid="next-month"
                  onClick={(e) => onClickNextMonth(e, increaseMonth)}
                  disabled={nextMonthButtonDisabled}
                >
                  <ChevronRightIcon fontSize="small" />
                </ToolbarButton>
              </Wrapper>
              <Wrapper>
                <div>
                  <NativeSelect
                    value={moment(date).year()}
                    onChange={(v) => changeYear(Number(v))}
                    optionLabel="label"
                    optionValue="value"
                    options={years.map((v) => ({ label: `${v}년`, value: v }))}
                  />
                </div>
                <div>
                  <NativeSelect
                    value={months[moment(date).month()]}
                    onChange={(v) => changeMonth(months.indexOf(v))}
                    optionLabel="label"
                    optionValue="value"
                    options={months.map((v) => ({ label: `${v}월`, value: v }))}
                  />
                </div>
              </Wrapper>
            </div>
          )}
          dropdownMode="select"
          className={className}
          placeholderText={placeholder ?? '날짜선택'}
          dateFormat={dateFormat}
          selected={value ? new Date(value) : null}
          onChange={onChangeDate}
          onYearChange={getHoliday}
          onMonthChange={getHoliday}
          dayClassName={getDayClassName}
          popperProps={{
            positionFixed: true,
          }}
          disabled={disabled}
          maxDate={maxDate && new Date(maxDate)}
          minDate={minDate && new Date(minDate)}
          {...props}
        />
      </DatePickerWrapper>
    );
  }
);

DateInput.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  dateFormat: PropTypes.string,
  value: PropTypes.any,
  maxDate: PropTypes.any,
  minDate: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  width: PropTypes.string,
  style: PropTypes.object,
  error: PropTypes.string,
  autoFocus: PropTypes.bool,
};

export default observer(DateInput);
