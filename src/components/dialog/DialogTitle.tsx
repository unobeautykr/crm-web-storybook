import { styled } from '@mui/material/styles';
import {
  Box,
  DialogTitle as MuiDialogTitle,
  DialogTitleProps,
  IconButton,
} from '@mui/material';
import { color } from '~/themes/styles';
import { CloseIcon } from '~/icons/Close';
import { ReactNode } from 'react';

type Prop = DialogTitleProps & {
  divider?: boolean;
};

export const StyledDialogTitle = styled(MuiDialogTitle, {
  shouldForwardProp: (prop) => prop !== 'divider',
})<Prop>(({ divider }) => ({
  borderBottom: divider ? `1px solid ${color.line}` : undefined,
}));

export const DialogTitle = ({
  onClose,
  divider,
  children,
}: {
  onClose?: () => void;
  divider?: boolean;
  children: ReactNode;
}) => {
  return (
    <StyledDialogTitle
      sx={{ display: 'flex', alignItems: 'center' }}
      divider={divider}
    >
      <Box sx={{ flexGrow: 1, fontSize: 14 }}>{children}</Box>
      {onClose && (
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </StyledDialogTitle>
  );
};
