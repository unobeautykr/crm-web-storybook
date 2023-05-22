import { useDialog } from '~/hooks/useDialog';
import { Button } from '~/components/Button';
import { NormalModal } from '~/components/modals/common/NormalModal';
import { PaginationLimitSelect } from '~/components/Pagination/PaginationLimitSelect';

export default {
  title: 'Component/Modal/NormalModal',
  component: NormalModal,
  id: 'component-modal-normalmodal',
  parameters: {
    element: true,
  },
};

const Template = (args) => {
  const modal = useDialog();

  return (
    <>
      <Button onClick={modal.open}>open</Button>
      <NormalModal
        {...args}
        title="제목"
        open={modal.opened}
        onClose={modal.close}
      >
        내용
      </NormalModal>
    </>
  );
};

export const Default = Template.bind();
export const WithFooter = Template.bind();
WithFooter.args = {
  footer: <PaginationLimitSelect value={10} />,
};
