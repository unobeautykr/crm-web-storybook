import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { IconButton } from '~/components/IconButton';
import { ChevronUpIcon } from '~/icons/ChevronUp';

export const Button = styled(IconButton)(
  ({ collapsed2 }) => `
  &&& {
    margin: 0px auto;
    padding: 5px 4px;
  }
  width: 16px;
  height: 16px;
  border-radius: 50% !important;
  padding: 0;
  border: 0;
  color: #202020;
  background: transparent;
  ${
    collapsed2
      ? `
      transform: rotate(180deg);
    `
      : ''
  }
`
);

export const CollapseButton = ({ collapsed, onClick }) => {
  return (
    <Button collapsed2={collapsed.toString()} onClick={onClick}>
      <ChevronUpIcon />
    </Button>
  );
};

CollapseButton.propTypes = {
  collapsed: PropTypes.bool,
  onClick: PropTypes.func,
};
