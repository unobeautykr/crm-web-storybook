import { useState } from 'react';
import Radio from '~/components/Radio';

export default {
  title: 'Component/Button/Radio',
  component: Radio,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [value, setValue] = useState(false);

  return (
    <Radio
      {...args}
      value={String(value)}
      onChange={(v) => setValue(JSON.parse(v))}
    />
  );
};
export const Default = Template.bind();

Default.args = {
  options: [
    { label: '라디오 선택 1', value: 'false' },
    { label: '라디오 선택 2', value: 'true' },
  ],
};
