import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { IconButton } from '~/components/IconButton';
import { ReactComponent as Edit } from '@ic/edit.svg';

const Button = styled(IconButton)`
  width: 16px;
  height: 16px;
  padding: 2px;
  margin: 0 auto;
  color: #a1b1ca;
  svg {
    width: 100%;
    height: 100%;
  }
`;

const EditIcon = styled(Edit)(
  ({ disabled }) => `
  ${
    disabled
      ? `
      path {
        fill: currentColor;
        color: #d7e3f1;
      }
    `
      : ''
  }
`
);

export const EditButton = ({ onClick, disabled }) => {
  return (
    <Button variant="transparent" onClick={onClick}>
      <EditIcon disabled={disabled} />
    </Button>
  );
};

EditButton.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
