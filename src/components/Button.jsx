import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Button as MuiButton } from '@mui/material';
import { color as colorTheme } from '~/themes/styles';

const getColor = (color) => {
  switch (color) {
    case 'primary':
      return {
        default: colorTheme.primary.unoblue,
        hover: { fill: '#234EC5', outline: colorTheme.bluegrey[200] },
      };
    case 'secondary':
      return {
        default: colorTheme.bluegrey[700],
        hover: { fill: '#212735', outline: colorTheme.grey[200] },
      };
    case 'alert':
      return {
        default: colorTheme.alert,
        hover: { fill: '#BC4646', outline: '#eb57570d' },
      };
    case 'mix':
      return {
        default: colorTheme.primary.deepblue,
        hover: { fill: colorTheme.primary.deepblue, outline: '#EDEFF133' },
      };
    case 'grey':
      return {
        default: colorTheme.line,
        hover: { fill: colorTheme.line, outline: '#EDEFF133' },
      };
    case 'green':
      return {
        default: '#68D083',
        hover: { fill: '#6CA97C', outline: '#EDEFF133' },
      };
    case 'black':
      return {
        default: '#3A3A3A',
        hover: { fill: '#454545', outline: colorTheme.grey[200] },
      };
    default:
      break;
  }
};

const StyledButton = styled(MuiButton)(
  ({ size, color2, styled: _styled }) => `
  &&& {
    flex: 0 0 auto;
    gap: 4px;
    min-width: auto;
    line-height: inherit;
    font-size: 14px;
    letter-spacing: normal;
    padding: 0px 16px;
    border: 1px solid;
    transition: all 250ms cubic-bezier(0.4, 0, 0.2, 1), width 0s;
    ${
      size === 'l'
        ? `
            min-height: 28px;
            padding: 0px 32px;
            border-radius: 4px;
            font-weight: bold;
          `
        : size === 'm'
        ? `
            min-height: 28px;
            padding: 0px 16px;
            border-radius: 4px;
            font-weight: bold;
          `
        : size === 's'
        ? `
            min-height: 24px;
            padding: 0px 8px;
            font-size: 12px;
            border-radius: 2px;
            font-weight: 500;
          `
        : size === 'xs'
        ? `
            min-height: 18px;
            padding: 0px 4px;
            font-size: 12px;
            border-radius: 2px;
            font-weight: 500;
          `
        : ''
    }
    ${
      _styled === 'fill'
        ? `
            color: #fff;
            background: ${getColor(color2).default};
            border-color: ${getColor(color2).default};
            &:hover {
              background: ${getColor(color2).hover.fill};
              border-color: ${getColor(color2).hover.fill};
            }
            &:disabled {
              color: #fff;
              border-color: ${colorTheme.bluegrey[500]};
              background-color: ${colorTheme.bluegrey[500]} !important;
              opacity: 1 !important;
            }
          `
        : _styled === 'outline'
        ? `
            color: ${getColor(color2).default};
            border-color: ${
              color2 === 'mix' ? colorTheme.line : getColor(color2).default
            };
            background: #fff;
            &:hover {
              background: ${getColor(color2).hover.outline};
            }
            &:disabled {
              color: ${
                color2 === 'primary'
                  ? colorTheme.bluegrey[500]
                  : colorTheme.line
              };
              border-color: ${
                color2 === 'primary'
                  ? colorTheme.bluegrey[500]
                  : colorTheme.line
              };
              background-color: #fff !important;
              opacity: 1 !important;
            }
          `
        : ''
    }
  }
`
);

export const Button = ({
  size = 'm',
  styled = 'fill',
  color = 'primary',
  onClick,
  disabled,
  children,
  icon,
  ...props
}) => {
  return (
    <StyledButton
      size={size}
      color2={color}
      styled={styled}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};

Button.propTypes = {
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  styled: PropTypes.oneOf(['fill', 'outline']),
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'alert',
    'mix',
    'grey',
    'green',
    'black',
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node,
  icon: PropTypes.node,
};
