import { forwardRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { TextField as MuiTextField, Fade, InputAdornment } from '@mui/material';
import { ClearButton } from './ClearButton';

const Wrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 2px;
  width: 100%;
`;

const StyledInput = styled(MuiTextField)(
  ({ type2: $type, active, border, theme }) => `
  background: white;
  border: 0;
  width: 100%;
  > * {
    padding-left: 0 !important;
    padding-right: 0 !important;
    height: 29px;
  }
  input {
    font-size: 12px;
    height: 29px;
    text-overflow: ellipsis;
    ${
      $type !== 'search'
        ? `
            padding: 0 8px;
          `
        : `
            padding: 0 4px 0 0;
          `
    }
  }

  .MuiOutlinedInput-notchedOutline {
    ${
      $type === 'search'
        ? `
        border: none !important;
        border-radius: 0 !important;
      `
        : ''
    }
    ${
      active
        ? `
        border: solid 1px ${theme.palette.primary.unoblue} !important;
      `
        : ''
    }

    ${
      border
        ? `
        border: solid 1px ${theme.palette.bluegrey[600]};
      `
        : ''
    }
}
`
);

const EndAdornmentWrapper = styled('div')(
  ({ $disabled, theme }) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  ${
    $disabled
      ? `
      background-color: ${theme.palette.bluegrey[200]};
    `
      : ''
  }
`
);

const InputStartAdornment = withStyles(InputAdornment, (theme, props) => ({
  outlined: {
    '& p': {
      fontSize: '12px',
      width: '64px',
      paddingLeft: '8px',
      wordBreak: 'keep-all',
      lineHeight: 1,
      color: '#2D2D2D',
    },
  },
}));

const InputEndAdornment = withStyles(InputAdornment, (theme, props) => ({
  outlined: {
    marginLeft: '0px !important',
    marginRight: '4px !important',
  },
}));

export const TextField = ({
  type = 'default',
  defaultValue,
  value,
  onClick,
  onChange,
  onEnter,
  placeholder,
  startAdornment,
  endAdornment,
  disabled,
  maxLength,
  style,
  ref,
  onClear,
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  const handleChange = (e) => {
    onChange(e.target.value, e);
  };

  const onKeyDown = (e) => {
    if (e.keyCode == 13 && onEnter) {
      onEnter();
    }
  };

  return (
    <Wrapper style={style}>
      <StyledInput
        type2={type}
        active={focused.toString()}
        inputRef={ref}
        variant="outlined"
        defaultValue={defaultValue}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        inputProps={{
          maxLength,
        }}
        InputProps={{
          startAdornment: startAdornment && (
            <InputStartAdornment position="start">
              {startAdornment}
            </InputStartAdornment>
          ),
          endAdornment: (
            <EndAdornmentWrapper $disabled={disabled}>
              <Fade in={focused && value.length > 0}>
                <InputEndAdornment position="end">
                  <ClearButton
                    onClick={(e) => {
                      onClear ? onClear() : onChange('', e);
                    }}
                  />
                </InputEndAdornment>
              </Fade>
              {endAdornment ? endAdornment : ''}
            </EndAdornmentWrapper>
          ),
        }}
        onClick={onClick}
        {...props}
      />
    </Wrapper>
  );
};

TextField.propTypes = {
  type: PropTypes.oneOf(['default', 'search']),
  defaultValue: PropTypes.any,
  value: PropTypes.any,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  onClear: PropTypes.func,
  placeholder: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  maxLength: PropTypes.number,
};

export default TextField;
