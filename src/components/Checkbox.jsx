import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { FormControlLabel, Checkbox as CheckboxIcon } from '@mui/material';
import { ReactComponent as Unchecked } from '@ic/checkbox.svg';
import { ReactComponent as Checked } from '@ic/checkbox-checked.svg';

const Wrapper = styled(FormControlLabel)`
  &&& {
    column-gap: 4px;
    margin: 0;
    flex: 0 0 auto;
  }
  .MuiFormControlLabel-label {
    font-size: 11px;
    font-weight: 500;
  }
`;

const StyledCheckbox = styled(CheckboxIcon)`
  &&& {
    padding: 0;
    border: 0;
    width: auto;
    height: auto;
    svg {
      font-size: 18px;
    }
  }
`;

export const Checkbox = ({ label = '', checked, onChange, disabled }) => {
  return (
    <Wrapper
      control={
        <StyledCheckbox
          color="primary"
          checked={checked}
          onChange={onChange}
          icon={<Unchecked />}
          checkedIcon={<Checked color={disabled ? '#BBBBBB' : '#2C62F6'} />}
        />
      }
      label={label}
      disabled={disabled}
    />
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  disabled: PropTypes.bool,
};
