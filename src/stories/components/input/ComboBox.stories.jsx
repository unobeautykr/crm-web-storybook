import { useState } from 'react';
import { ComboBox } from '~/components/ComboBox';

export default {
  title: 'Component/Input/ComboBox',
  component: ComboBox,
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
  const [value, setValue] = useState();

  return (
    <ComboBox
      options={testData}
      value={value}
      onChange={setValue}
      placeholder={'placeholder'}
    />
  );
};
export const Default = Template.bind();
