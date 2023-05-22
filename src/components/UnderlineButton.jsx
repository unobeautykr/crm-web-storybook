import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { color as colorTheme } from '~/themes/styles';

const getColor = (color) => {
  switch (color) {
    case 'primary':
      return colorTheme.primary.unoblue;
    case 'secondary':
      return colorTheme.bluegrey[700];
    case 'alert':
      return colorTheme.alert;
    default:
      break;
  }
};

const StyledButton = styled.button`
  display: flex;
  align-items: center;
  column-gap: 4px;
  flex: 0 0 auto;
  transition: color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  background: transparent;
  cursor: pointer;
  svg {
    font-size: 120%;
  }
  ${({ size }) => {
    if (size === 'l') {
      return css`
        font-size: 14px;
        line-height: 20px;
        font-weight: bold;
      `;
    }
    if (size === 'm') {
      return css`
        font-size: 13px;
        line-height: 18px;
        font-weight: bold;
      `;
    }
    if (size === 's') {
      return css`
        font-size: 12px;
        line-height: 16px;
        font-weight: 500;
      `;
    }
    if (size === 'xs') {
      return css`
        font-size: 12px;
        line-height: 14px;
        font-weight: 500;
      `;
    }
  }}
  ${({ $color }) => {
    return css`
      height: auto;
      padding: 0;
      border: 0;
      color: ${getColor($color)};
      text-decoration-line: underline;
      &:hover {
        text-decoration-line: underline;
        background-color: transparent;
      }
      &:disabled {
        border: 0;
        color: ${getColor($color)};
        background-color: transparent !important;
        opacity: 1 !important;
      }
    `;
  }};
`;

export const UnderlineButton = ({
  icon,
  size = 'm',
  color = 'primary',
  name,
  onClick,
  children,
  ...props
}) => {
  return (
    <StyledButton
      name={name}
      size={size}
      $color={color}
      onClick={onClick}
      {...props}
    >
      {icon && icon}
      {children}
    </StyledButton>
  );
};

UnderlineButton.propTypes = {
  icon: PropTypes.node,
  size: PropTypes.oneOf(['l', 'm', 's', 'xs']),
  color: PropTypes.oneOf(['primary', 'secondary', 'alert']),
  name: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node,
};
