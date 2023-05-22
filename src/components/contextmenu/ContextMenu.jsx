import { useCallback } from 'react';
import { Menu } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import PropTypes from 'prop-types';

const CustomMenu = withStyles(Menu, () => ({
  paper: {
    minWidth: 0,
    minHeight: 0,
    width: 'auto',
    border: '1px solid #DEE2EC',
    boxShadow: 'none',
    filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.05))',
  },
  list: {
    padding: '0px',
  },
}));

export const WithContextMenuProps = {
  anchorEl: PropTypes.object,
  anchorPosition: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  position: PropTypes.object,
  action: PropTypes.object,
};

export const withContextMenu = (Comp) => {
  const WrappedComp = ({
    anchorEl,
    open,
    onClose,
    position,
    action,
    ...props
  }) => {
    return (
      <ContextMenu
        anchorEl={anchorEl}
        open={open}
        action={action}
        onClose={onClose}
        position={position}
      >
        <div>
          <Comp onClose={onClose} {...props} />
        </div>
      </ContextMenu>
    );
  };

  WrappedComp.propTypes = WithContextMenuProps;

  return WrappedComp;
};

export const ContextMenu = ({
  anchorEl,
  open,
  onClose,
  position,
  ...props
}) => {
  const onContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <CustomMenu
      anchorReference={position != null ? 'anchorPosition' : 'anchorEl'}
      anchorPosition={position}
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right',
        vertical: 'top',
      }}
      getContentAnchorEl={null}
      BackdropProps={{
        invisible: true,
        onContextMenu: (e) => {
          e.preventDefault();
          e.stopPropagation();

          onClose();
        },
      }}
      onContextMenu={onContextMenu}
      open={open}
      onClose={onClose}
      {...props}
    />
  );
};

ContextMenu.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  position: PropTypes.object,
};
