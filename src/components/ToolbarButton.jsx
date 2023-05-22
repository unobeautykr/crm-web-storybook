import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

export const ToolbarButton = styled('button')(
  ({ paddingSize, active }) => `
  font-size: 12px;
  font-weight: 700;
  line-height: 17px;
  text-align: center;

  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;

  padding: 0 ${paddingSize ? paddingSize : 8}px;
  height: 100%;
  min-width: 30px;

  border: 1px solid rgba(222, 226, 236, 1);
  background: rgba(255, 255, 255, 1);
  color: rgba(32, 32, 32, 1);

  ${
    active
      ? `
          background: rgba(41, 49, 66, 1);
          color: rgba(255, 255, 255, 1);
        `
      : `
          border: 1px solid rgba(222, 226, 236, 1);
          background: rgba(255, 255, 255, 1);
          color: rgba(32, 32, 32, 1);
        `
  }
`
);

ToolbarButton.propTypes = {
  active: PropTypes.bool,
};
