import { useArgs } from '@storybook/client-api';
import { Checkbox } from '~/components/Checkbox';

export default {
  title: 'Component/Control/Checkbox',
  component: Checkbox,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [{ checked }, updateArgs] = useArgs();
  const handleChange = () => {
    updateArgs({ checked: !checked });
  };

  return <Checkbox {...args} checked={checked} onChange={handleChange} />;
};
export const Default = Template.bind();
Default.args = {
  checked: true,
  disabled: false,
};

export const WithLabel = Template.bind();
WithLabel.args = {
  checked: true,
  disabled: false,
  label: '설정',
};
