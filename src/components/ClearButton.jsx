import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';

const IconWrapper = styled('div')`
  svg {
    font-size: 11px;
  }
  margin-right: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const ClearButton = ({ onClick }) => {
  return (
    <IconWrapper onClick={onClick}>
      <CloseIcon />
    </IconWrapper>
  );
};

ClearButton.propTypes = {
  onClick: PropTypes.func,
};
