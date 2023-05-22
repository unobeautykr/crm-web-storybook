import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@mui/material';

const getColor = (type) => {
  switch (type) {
    case 'primary':
      return theme.palette.primary.unoblue;
    case 'secondary':
      return theme.palette.bluegrey[700];
    case 'alert':
      return theme.palette.common.red;
    case 'mix':
      return theme.palette.primary.deepblue;
    case 'grey':
      return theme.palette.common.line;
    default:
      break;
  }
};

const StyledButton = styled(MuiButton)(
  ({ $size, type, styled, theme }) => `
  flex: 0 0 auto;
  min-width: auto;
  height: 28px;
  font-weight: bold;
  font-size: 14px;
  padding: 0px 16px;
  border-radius: 4px;
  border: 1px solid;
  transition: 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  ${
    $size === 'l'
      ? `
      padding: 0px 32px;
      `
      : $size === 'm'
      ? `
      padding: 0px 16px;
    `
      : $size === 's'
      ? `
      height: 24px;
      padding: 0px 8px;
      font-size: 12px;
  `
      : $size === 'xs'
      ? `
      height: 18px;
      padding: 0px 4px;
      font-size: 12px;
`
      : ''
  }
  ${
    styled === 'fill'
      ? `
        color: #fff;
        background: ${getColor(type)};
        border-color: ${getColor(type)};
        background: ${getColor(type)};
        &:hover {
          background: ${getColor(type)};
          filter: brightness(0.9);
        }
        &:disabled {
          color: #fff;
          border-color: ${theme.palette.bluegrey[500]};
          background-color: ${theme.palette.bluegrey[500]} !important;
          opacity: 1 !important;
        }
      `
      : styled === 'outline'
      ? `
      color: ${getColor(type)};
      border-color: ${
        type === 'mix' ? theme.palette.common.line : getColor(type)
      };
      background: #fff;
      &:hover {
        background: rgba(255, 255, 255, 0.8);
      }
      &:disabled {
        color: ${theme.palette.bluegrey[500]};
        border-color: ${theme.palette.bluegrey[500]};
        background-color: #fff !important;
        opacity: 1 !important;
      }
    `
      : styled === 'text'
      ? `
    height: auto;
    padding: 0;
    border: 0;
    color: ${getColor(type)};
    text-decoration-line: underline;
    &:hover {
      text-decoration-line: underline;
      background-color: transparent;
    }
    &:disabled {
      border: 0;
      color: ${getColor(type)};
      background-color: transparent !important;
      opacity: 1 !important;
    }
  `
      : ''
  }
`
);

const Button = ({
  size = 'm',
  styled = 'fill',
  type = 'primary',
  name,
  onClick,
  disabled,
  children,
}) => {
  return (
    <StyledButton
      name={name}
      $size={size}
      type={type}
      styled={styled}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(['xs', 's', 'm', 'l']),
  styled: PropTypes.oneOf(['fill', 'outline', 'text']),
  type: PropTypes.oneOf(['primary', 'secondary', 'alert', 'mix', 'grey']),
  name: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default Button;
