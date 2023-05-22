import SmsDetailButton from '~/components/crm/customer-chart/SmsDetailButton';

export default {
  title: 'SMS/SmsDetailButton',
  component: SmsDetailButton,
  parameters: {
    element: true,
  },
};

const Template = (args) => <SmsDetailButton {...args} />;
export const Default = Template.bind();
Default.args = {
  smsSent: true,
};
