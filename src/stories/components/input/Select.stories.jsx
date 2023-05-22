import { useState } from 'react';
import { Select } from '~/components/Select';
import { Label } from '~/components/Label';

export default {
  title: 'Component/Input/Select',
  component: Select,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [value, setValue] = useState('');
  return (
    <Label text="혈액형">
      <Select {...args} value={value} onChange={setValue} />
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
  style: { width: '100%' },
};

const CustomSizeTemplate = (args) => {
  const [value, setValue] = useState(20);

  return <Select {...args} value={value} onChange={setValue} />;
};

export const CustomSize = CustomSizeTemplate.bind();
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
  style: { width: 'auto', height: '24px' },
};
