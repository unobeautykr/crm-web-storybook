import { useState } from 'react';
import PriceInput from '~/components/PriceInput';

export default {
  title: 'Component/Input/PriceInput',
  component: PriceInput,
  decorators: [(Story) => <Story />],
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [input, setInput] = useState(0);
  return (
    <PriceInput
      value={input}
      onChange={(v) => {
        setInput(v);
      }}
      {...args}
    />
  );
};

export const Default = Template.bind();

Default.args = {
  prefix: '₩',
  style: {
    width: '80px',
  },
};
