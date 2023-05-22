import { ConfirmModal } from '~/components/modals/ConfirmModal';
import { ImmediateSmsConfirmPopup } from './ImmediateSmsConfirmPopup';

export const ImmediateSmsConfirmModal = ({
  appointment,
  smsRules,
  onConfirm,
  onCancel,
}) => {
  return (
    <ConfirmModal
      onConfirm={() => onConfirm()}
      onCancel={() => onCancel()}
      cancelText="미전송"
      confirmText="즉시전송"
    >
      <ImmediateSmsConfirmPopup appointment={appointment} smsRules={smsRules} />
    </ConfirmModal>
  );
};
