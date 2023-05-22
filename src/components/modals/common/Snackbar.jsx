import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Snackbar from '@mui/material/Snackbar';
import { ReactComponent as CloseIcon } from '~/assets/images/icon/close.svg';
import { ReactComponent as CheckMark } from '~/assets/images/icon/ico_check_mark.svg';
import { IconButton } from '~/components/IconButton';
import { color as colorTheme } from '~/themes/styles';

const ColorType = {
  getColor(type) {
    switch (type) {
      case 'unoblue':
        return colorTheme.primary.unoblue;
      case 'alert':
      default:
        return colorTheme.alert;
    }
  },
};

const SnackbarComponent = styled(Snackbar)`
  min-width: 430px;
  background-color: #ffffff;
  border: 1px solid ${({ color }) => ColorType.getColor(color)};
  border-radius: 4px;

  & .MuiSnackbarContent-root {
    min-width: 430px;
    background-color: #ffffff;
  }

  div {
    font-size: 12px;
    color: ${({ color }) => ColorType.getColor(color)};
    box-shadow: none;
  }
`;

const Mark = styled('div')`
  width: 15px;
  height: 15px;
  border: 1px solid ${({ color }) => ColorType.getColor(color)};
  text-align: center;
  border-radius: 16px;
  color: ${({ color }) => ColorType.getColor(color)};
  font-size: 11px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
`;

const LeftSection = styled('div')`
  display: flex;
  align-items: center;
`;

const Message = styled('div')`
  margin-left: 5px;
`;

const RightSection = styled('div')`
  display: flex;
  gap: 8px;
`;

export const SnackBar = ({
  show,
  color = 'unoblue',
  message,
  onClosed,
  actionItems,
  leadingItems,
}) => {
  const action = (
    <RightSection>
      {actionItems && actionItems}
      <IconButton variant="transparent" onClick={onClosed}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </RightSection>
  );

  return (
    show && (
      <SnackbarComponent
        color={color}
        open={show}
        autoHideDuration={5000}
        onClose={onClosed}
        message={
          <LeftSection>
            {leadingItems ? (
              leadingItems
            ) : (
              <>
                {color === 'unoblue' && <CheckMark />}
                {color === 'alert' && <Mark color="alert">!</Mark>}
              </>
            )}
            <Message>{message}</Message>
          </LeftSection>
        }
        action={action}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    )
  );
};

SnackBar.propTypes = {
  show: PropTypes.bool,
  color: PropTypes.oneOf(['unoblue', 'alert']),
  message: PropTypes.string,
  onClosed: PropTypes.func,
  actionItems: PropTypes.node,
  leadingItems: PropTypes.node,
};
