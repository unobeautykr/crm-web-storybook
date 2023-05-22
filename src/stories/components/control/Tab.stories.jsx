import { useArgs } from '@storybook/client-api';
import { Tab } from '~/components/Tab';

export default {
  title: 'Component/Control/Tab',
  component: Tab,
  parameters: {
    element: true,
  },
};

const list = ['예약부서 설정', '예약상태 설정'];
const Template = (args) => {
  const [{ value }, updateArgs] = useArgs();
  const handleChange = (v) => {
    updateArgs({ value: v });
  };

  return <Tab {...args} value={value ?? list[0]} onChange={handleChange} />;
};

export const Default = Template.bind();
Default.args = {
  list,
};
