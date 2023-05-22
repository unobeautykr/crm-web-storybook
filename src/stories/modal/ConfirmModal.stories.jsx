import { useDialog } from '~/hooks/useDialog';
import { Button } from '~/components/Button';
import { ConfirmModal } from '~/components/modals/common/ConfirmModal';

export default {
  title: 'Component/Modal/ConfirmModal',
  component: ConfirmModal,
  id: 'component-modal-confirmmodal',
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const modal = useDialog();

  return (
    <>
      <Button onClick={modal.open}>open</Button>
      <ConfirmModal
        {...args}
        open={modal.opened}
        onClose={modal.close}
        onConfirm={modal.close}
      >
        내용
      </ConfirmModal>
    </>
  );
};

export const Default = Template.bind();

export const CustomConfirmText = Template.bind();
CustomConfirmText.args = {
  confirmText: '수정',
};
