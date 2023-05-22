import { useState } from 'react';
import styled from 'styled-components';
import { NativeSelect } from '~/components/NativeSelect';
import { Label } from '~/components/Label';

export default {
  title: 'Component/Input/NativeSelect',
  component: NativeSelect,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [value, setValue] = useState(null);
  return (
    <Label text="혈액형">
      <NativeSelect {...args} value={value} onChange={setValue} />
    </Label>
  );
};

export const Default = Template.bind();
Default.args = {
  options: [
    { label: 'A', value: 'a' },
    { label: 'B', value: 'b' },
    { label: 'AB', value: 'ab' },
    { label: 'O', value: 'o' },
  ],
  optionLabel: 'label',
  optionValue: 'value',
  placeholder: '혈액형을 선택하세요.',
  disabled: false,
  isRequire: false,
};

const Wrapper = styled.div`
  &&& {
    width: 64px;
    select {
      font-size: 11px;
      height: 24px;
    }
  }
`;
const Template2 = (args) => {
  const [value, setValue] = useState(20);

  return (
    <Wrapper>
      <NativeSelect {...args} value={value} onChange={setValue} />
    </Wrapper>
  );
};

export const CustomSize = Template2.bind();
CustomSize.args = {
  options: [
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
  ],
  optionLabel: 'label',
  optionValue: 'value',
  style: {
    select: {
      width: '64px',
    },
  },
};
