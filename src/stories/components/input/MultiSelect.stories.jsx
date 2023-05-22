import { useState } from 'react';
import { MultiSelect } from '~/components/MultiSelect';

export default {
  title: 'Component/Input/MultiSelect',
  component: MultiSelect,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [value, setValue] = useState([]);
  return <MultiSelect {...args} value={value} onChange={setValue} />;
};

export const Default = Template.bind();
Default.args = {
  selectAllLabel: 'all',
  placeholder: '선택하세요.',
  options: [
    { label: 'option1', value: '1' },
    { label: 'option2', value: '2' },
  ],
  optionValue: 'value',
  optionLabel: 'label',
  style: { width: '140px' },
};
