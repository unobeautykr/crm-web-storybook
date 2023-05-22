import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { TextField } from '@mui/material';

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 2px;
  width: 100%;
  height: 100%;
`;

const Input = withStyles(TextField, (theme, props) => ({
  root: {
    width: '100%',
    height: '100%',
    paddingLeft: '0',
    '& input': {
      height: '100%',
      minHeight: 28,
      boxSizing: 'border-box',
      padding: '4px 8px',
      fontSize: '12px',
      textAlign: 'left',
      lineHeight: 1,
    },
    '& .MuiOutlinedInput-root': {
      height: '100%',
    },
    '& .MuiInputBase-input.Mui-disabled': {
      background: '#EDEFF1',
      color: 'rgba(45, 45, 45, 0.4)',
    },
  },
}));

const TextInput = ({
  defaultValue,
  value,
  onChange,
  placeholder,
  disabled,
  readOnly,
  style,
}) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Wrapper style={{ ...style }}>
      <Input
        variant="outlined"
        id="outlined-number"
        defaultValue={defaultValue}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        InputProps={{
          readOnly: readOnly,
        }}
      />
    </Wrapper>
  );
};

TextInput.propTypes = {
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  style: PropTypes.object,
};

export default TextInput;
