import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { Button } from '~/components/Button';

export function ConfirmModal({
  children,
  confirmText,
  cancelText,
  onClose,
  onConfirm,
  open,
  buttonDisabled,
}) {
  return (
    <Dialog
      open={open}
      onClose={() => {
        if (open) onClose();
      }}
      PaperProps={{ sx: { minWidth: '378px', minHeight: '164px' } }}
      disableEnforceFocus
      scroll="paper"
    >
      <DialogContent
        sx={{
          fontSize: '14px',
          padding: '40px 27px 24px !important',
        }}
      >
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: '0 24px 16px 24px' }}>
        <Button
          styled="outline"
          onClick={() => {
            if (open) onClose();
          }}
          color="mix"
          disabled={buttonDisabled}
        >
          {cancelText ?? '취소'}
        </Button>
        <Button
          onClick={() => {
            if (open) onConfirm();
          }}
          disabled={buttonDisabled}
        >
          {confirmText ?? '확인'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmModal.propTypes = {
  children: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  open: PropTypes.bool,
  buttonDisabled: PropTypes.bool,
};
