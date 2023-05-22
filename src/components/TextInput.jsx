import { forwardRef } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CloseIcon from '@mui/icons-material/Close';

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 2px;
  width: 100%;
`;

const StyledInput = styled(TextField)`
  border: 0;
  width: 100%;
  height: 100%;
  > * {
    padding-right: 0 !important;
  }
  input {
    font-size: 12px;
    height: 29px;
    padding: 0 8px;
  }
`;

const ResetButton = styled('button')`
  svg {
    font-size: 11px;
  }
  position: absolute;
  right: 10px;
  color: #a1b1ca;
  height: 100%;
  &:hover {
    color: #4a4e70;
  }
`;

const StyledInputAdornment = styled(InputAdornment)`
  p {
    font-size: 11px;
    padding-right: 8px;
  }
`;

export const TextInput = forwardRef(
  (
    {
      defaultValue,
      value,
      onClick,
      onChange,
      onEnter,
      onReset,
      placeholder,
      endAdornment,
      disabled,
      style,
      autoComplete,
      type,
    },
    ref
  ) => {
    const handleChange = (e) => {
      onChange(e.target.value);
    };

    return (
      <Wrapper style={style}>
        <StyledInput
          inputRef={ref}
          variant="outlined"
          defaultValue={defaultValue}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.keyCode == 13 && onEnter && onEnter()}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete ?? 'false'}
          InputProps={{
            endAdornment: endAdornment && (
              <StyledInputAdornment position="end">
                {endAdornment}
              </StyledInputAdornment>
            ),
            style: { paddingRight: '8px' },
          }}
          onClick={onClick}
          type={type}
        />
        {onReset && (
          <ResetButton aria-label="reset" onClick={onReset}>
            <CloseIcon />
          </ResetButton>
        )}
      </Wrapper>
    );
  }
);

TextInput.propTypes = {
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onReset: PropTypes.func,
  placeholder: PropTypes.string,
  endAdornment: PropTypes.string,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
};

export default TextInput;
