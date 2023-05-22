import { CustomerChartHistory } from '~/components/crm/customer-chart/sidebar/CustomerChartHistory';

export default {
  title: 'CustomerChart/SideBar/CustomerChartHistory',
  component: CustomerChartHistory,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  return <CustomerChartHistory {...args} />;
};

export const Default = Template.bind();
