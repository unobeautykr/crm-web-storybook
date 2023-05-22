import { useArgs } from '@storybook/client-api';
import { Switch } from '~/components/Switch';

export default {
  title: 'Component/Control/Switch',
  component: Switch,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const [{ checked }, updateArgs] = useArgs();

  const handleChange = () => {
    updateArgs({ checked: !checked });
  };

  return <Switch {...args} onChange={handleChange} />;
};

export const Default = Template.bind();
Default.args = {
  checked: true,
};
