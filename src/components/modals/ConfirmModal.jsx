import { Dialog, DialogActions, DialogContent } from '@mui/material';
import { Button } from '../Button';

export const ConfirmModal = ({
  onConfirm,
  onCancel,
  children,
  cancelText,
  confirmText,
  variant,
}) => {
  return (
    <Dialog open onClose={onCancel}>
      <DialogContent
        sx={{
          fontSize: '14px',
          padding: '40px 27px 24px !important',
        }}
      >
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: '0 24px 16px 24px' }}>
        <Button styled="outline" onClick={onCancel} color="mix">
          {cancelText ?? '취소'}
        </Button>
        <Button
          color={variant === 'warning' ? 'alert' : 'primary'}
          onClick={onConfirm}
        >
          {confirmText ?? '확인'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
