import { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { within, userEvent } from '@storybook/testing-library';
import { HolidayProvider } from '~/store/holiday';
import DateInput from '~/components/DateInput';
import DateRangeInput from '~/components/DateRangeInput';
import { Label } from '~/components/Label';

export default {
  title: 'Component/Input/DateInput',
  component: DateInput,
  decorators: [
    (Story) => (
      <HolidayProvider>
        <Story />
      </HolidayProvider>
    ),
  ],
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [date, setDate] = useState(null);

  return (
    <Label text="생년월일">
      <DateInput {...args} value={date} onChange={setDate} />
    </Label>
  );
};

export const Default = Template.bind();
Default.args = {
  placeholder: 'ex)910826',
  dateFormat: 'yyMMdd',
  disabled: false,
};
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const inputEl = canvas.getByRole('textbox');

  // 직접입력 테스트 케이스
  await userEvent.clear(inputEl);
  await userEvent.type(inputEl, '221225', {
    delay: 100,
  });
  await userEvent.type(inputEl, '{enter}');
};

const RangeTemplate = (args) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const onChangeDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Label text="조회기간">
      <DateRangeInput
        {...args}
        value={{ start: startDate, end: endDate }}
        onChange={onChangeDateRange}
      />
    </Label>
  );
};

export const Range = RangeTemplate.bind();
Range.args = {
  placeholder: 'ex)910826',
  dateFormat: 'yyMMdd',
  disabled: false,
};

const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
  const Button = styled.a`
    font-size: 15px;
    font-weight: 700;
    line-height: 22px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
  `;

  return (
    <Button onClick={onClick} ref={ref}>
      {value}
    </Button>
  );
});

ExampleCustomInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
};

const CustomInputTemplate = (args) => {
  const [date, setDate] = useState(new Date());
  return (
    <DateInput
      {...args}
      value={date}
      onChange={setDate}
      customInput={<ExampleCustomInput />}
    />
  );
};

export const CustomInput = CustomInputTemplate.bind();
CustomInput.args = {
  dateFormat: 'yyyy.MM.dd(E)',
  disabled: false,
};
