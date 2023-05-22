import { useDialog } from '~/hooks/useDialog';
import { Button } from '~/components/Button';
import { AlertModal } from '~/components/modals/common/AlertModal';

export default {
  title: 'Component/Modal/AlertModal',
  component: AlertModal,
  id: 'component-modal-alertmodal',
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const modal = useDialog();

  return (
    <>
      <Button onClick={modal.open}>open</Button>
      <AlertModal {...args} open={modal.opened} onClose={modal.close}>
        내용
      </AlertModal>
    </>
  );
};

export const Default = Template.bind();
