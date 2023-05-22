import { TimeDurationField } from '~/components/TimeDurationField';

export default {
  title: 'Component/Input/TimeDurationField',
  component: TimeDurationField,
  parameters: {
    element: true,
  },
};

const Template = () => {
  return <TimeDurationField options={[]} onChange={() => {}} />;
};
export const Default = Template.bind();
