import { useRef } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { NumericFormat } from 'react-number-format';
import { withStyles } from 'tss-react/mui';
import { OutlinedInput, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const ButtonWrapper = styled('span')(
  ({ disabled }) => `
  display: flex;
  align-items: center;
  column-gap: 5px;
  position: absolute;
  height: 100%;
  right: 5px;

  ${
    disabled
      ? `
          button {
            cursor: default;
          }
        `
      : `
          button {
            &:hover: {
              color: #4a4e70;
            }
            transition: color 0.1s;
          }
          ${SetMaxButton} {
            &:hover {
              text-decoration-line: underline;
            }
          }
        `
  };
`
);

const ResetButton = styled('button')`
  color: #a1b1ca;
  svg {
    font-size: 11px;
  }
`;

const SetMaxButton = styled('button')`
  font-size: 10px;
  color: #dee2ec;
`;

const Input = withStyles(OutlinedInput, (theme, props) => ({
  root: {
    fontSize: '12px',
    width: '100%',
    height: '100%',
  },
  disabled: {
    background: '#EDEFF1',
    '& .MuiInputBase-input': {
      color: 'rgba(45, 45, 45, 0.4)',
    },
  },
  input: {
    height: '21px',
    padding: '4px 8px',
    color: '#293142',
    '&:read-only': {
      color: '#A1B1CA',
    },
    '&:read-only + fieldset': {
      borderColor: '#DEE2EC !important',
    },
  },
}));

const PriceInput = ({
  value = 0,
  onChange,
  disabled,
  readOnly,
  prefix,
  showButton,
  allowNegative,
  max,
  fullWidth,
  ...props
}) => {
  const inputRef = useRef();
  const onReset = () => {
    if (disabled) return;
    onChange(0);
  };

  const onChangeMax = () => {
    if (!max || disabled) return;
    if (max > 0) onChange(max);
    else onChange(0);
  };

  return (
    <FormControl
      variant="outlined"
      sx={{
        width: fullWidth ? '100%' : 'auto',
        display: 'flex',
        fontSize: '12px',
      }}
    >
      <NumericFormat
        customInput={Input}
        value={value}
        allowNegative={allowNegative}
        prefix={prefix && `${prefix} `}
        onValueChange={(values, sourceInfo) => {
          if (sourceInfo.source === 'prop') return;
          let v = values.value;
          if (!allowNegative && v.includes('-')) v.replace('-', '');
          onChange && onChange(Number(v));
        }}
        getInputRef={(ref) => {
          if (ref && !ref.onkeypress) {
            ref.onkeypress = (e) => {
              if (allowNegative && e.keyCode === 45) return;
              if (e.keyCode < 48 || e.keyCode > 57) e.returnValue = false;
            };
            inputRef.current = ref;
          }
        }}
        thousandSeparator
        disabled={disabled}
        readOnly={readOnly}
        inputProps={props}
      />
      {showButton && (
        <ButtonWrapper disabled={disabled}>
          <ResetButton onClick={onReset}>
            <CloseIcon />
          </ResetButton>
          <SetMaxButton onClick={onChangeMax}>전액</SetMaxButton>
        </ButtonWrapper>
      )}
    </FormControl>
  );
};

PriceInput.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  prefix: PropTypes.string,
  showButton: PropTypes.bool,
  max: PropTypes.number,
  allowNegative: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default PriceInput;
