import { useState } from 'react';
import { MultiComboBox } from '~/components/MultiComboBox';

export default {
  title: 'Component/Input/MultiComboBox',
  component: MultiComboBox,
  parameters: {
    element: true,
  },
};

const testData = [
  { id: 1, label: '첫번째' },
  { id: 2, label: '두번째' },
  { id: 3, label: '세번째' },
  { id: 4, label: '네번째' },
  { id: 5, label: '다섯번째' },
];

const Template = () => {
  const [value, setValue] = useState([]);

  return (
    <MultiComboBox
      options={testData}
      value={value}
      onChange={setValue}
      placeholder="placeholder"
      size="medium"
    />
  );
};
export const Default = Template.bind();

const LimitTemplate = () => {
  const limit = 3;
  const [value, setValue] = useState([]);

  return (
    <MultiComboBox
      options={testData}
      value={value}
      onChange={(v) => {
        if (v.length > limit) {
          return;
        }
        setValue(v);
      }}
      placeholder="placeholder"
      limit={limit}
      size="large"
    />
  );
};

export const Limit = LimitTemplate.bind();
