import FormChart from '~/components/crm/customer-chart/formchart/FormChart';

export default {
  title: 'CustomerChart/Form/SkinCareForm',
  component: FormChart,
  parameters: {
    element: true,
  },
};

const Template = () => {
  return <FormChart />;
};

export const Default = Template.bind();
