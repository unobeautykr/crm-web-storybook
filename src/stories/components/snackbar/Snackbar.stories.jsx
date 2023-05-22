import { SnackBar } from '~/components/modals/common/Snackbar';

export default {
  title: 'Component/Snackbar/Default',
  component: SnackBar,
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  return (
    <div>
      <SnackBar {...args} />
    </div>
  );
};
export const Default = Template.bind();
Default.args = {
  show: true,
  color: 'unoblue',
  message: '5초후에 자동으로 닫힙니다.',
  actionItems: <div>스낵바</div>,
  leadingItems: <div>icon</div>,
};
