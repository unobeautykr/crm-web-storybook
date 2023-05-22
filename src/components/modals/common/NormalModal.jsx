import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import { CloseIcon } from '~/icons/Close';

export function NormalModal({
  title,
  children,
  footer,
  onClose,
  open,
  paperSx,
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      PaperProps={{
        sx: { minWidth: '350px', maxWidth: 'initial', ...paperSx },
      }}
      disableEnforceFocus
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          borderBottom: '1px solid #DEE2EC',
          padding: '16px',
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          color="inherit"
          sx={{ marginLeft: 'auto', svg: { width: '10px', height: '10px' } }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          fontSize: '14px',
          padding: '16px !important',
        }}
      >
        {open && children}
      </DialogContent>
      {footer && (
        <DialogActions sx={{ padding: '16px' }}>{footer}</DialogActions>
      )}
    </Dialog>
  );
}

NormalModal.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.node,
  footer: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  paperSx: PropTypes.object,
  dialogSx: PropTypes.object,
};
