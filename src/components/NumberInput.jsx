import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { TextField } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  width: 16px;
  height: 23px;
  background: #dee2ec;
  color: ${({ theme }) => theme.color.bluegrey[600]};
  &[name='minus'] {
    border-radius: 2px 0px 0px 2px !important;
  }
  &[name='plus'] {
    border-radius: 0px 2px 2px 0px !important;
  }
`;

const Unit = styled.span`
  margin-left: 2px;
`;

const Input = withStyles(TextField, () => ({
  root: {
    width: '30px',
    height: '23px',
    '& input': {
      padding: '6px',
      fontSize: '12px',
      textAlign: 'center',
      lineHeight: 1,
    },
    '& .MuiOutlinedInput-root': {
      height: '100%',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderRadius: 0,
    },
  },
}));

const NumberInput = ({
  unit,
  value,
  onChange,
  min = 0,
  max = 100,
  disabled = false,
}) => {
  const handleChange = (e) => {
    let value = Number(e.target.value.replace(/[^\d]/, ''));
    if (value >= min && value <= max) onChange(value);
  };

  return (
    <Wrapper>
      <Button
        disabled={disabled}
        name="minus"
        onClick={() => onChange(Math.max(value - 1, min))}
      >
        -
      </Button>
      <Input
        disabled={disabled}
        variant="outlined"
        value={value}
        onChange={handleChange}
      />
      <Button
        disabled={disabled}
        name="plus"
        onClick={() => onChange(Math.min(value + 1, max))}
      >
        +
      </Button>
      {unit && <Unit>{unit}</Unit>}
    </Wrapper>
  );
};

NumberInput.propTypes = {
  unit: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  disabled: PropTypes.bool,
};

export default NumberInput;
