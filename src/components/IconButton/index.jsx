import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

export const IconButton = styled('button')(
  ({ size, variant }) => `
  border: 1px solid rgba(222, 226, 236, 1);

  display: flex;
  justify-content: center;
  align-items: center;

  ${
    size === 'default'
      ? `
        padding: 4px 4px;

        svg {
          width: 10px;
          height: 10px;
        }
      `
      : ''
  }

  ${
    variant === 'transparent'
      ? `
      border: none;
    `
      : variant === 'default'
      ? `
      background: rgba(255, 255, 255, 1);
      color: rgba(32, 32, 32, 1);
    `
      : variant === 'dark'
      ? `
      background: rgba(41, 49, 66, 1);
      color: rgba(255, 255, 255, 1);
    `
      : variant === 'primary'
      ? `
      border: none;
      background: #2c62f6;
      color: white;
    `
      : ''
  }
`
);

IconButton.defaultProps = {
  variant: 'default',
  size: 'default',
};

IconButton.propTypes = {
  variant: PropTypes.oneOf(['transparent', 'default', 'dark', 'primary']),
  size: PropTypes.oneOf(['default', 'small']),
};
