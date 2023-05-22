import { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { withStyles } from 'tss-react/mui';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { ClearButton } from '~/components/ClearButton';

const fontSize = '12px';

const Input = withStyles(TextField, (theme, props) => ({
  root: {
    width: '100%',
    height: '100%',
    paddingLeft: '0',
    '& input': {
      height: '29px',
      boxSizing: 'border-box',
      padding: '4px 8px',
      fontSize: '12px',
      textAlign: 'left',
      lineHeight: 1,
      cursor: 'pointer',
    },
    '& .MuiOutlinedInput-root': {
      height: '100%',
      padding: '0 !important',
    },
  },
}));

const Li = styled('li')`
  height: 29px;
  font-size: ${fontSize};
  padding: 0 10px !important;
`;

const IconWrapper = styled('div')`
  display: flex;
  align-items: center;
  svg {
    width: 16px;
    height: 16px;
  }
`;

const AutoCompleteSelect = withStyles(
  Autocomplete,
  (theme, { variant, active }) => ({
    root: {
      width: '100%',
      '& .MuiOutlinedInput-notchedOutline': {
        border:
          variant === 'none'
            ? 'none !important'
            : active
            ? 'solid 1px #2C62F6 !important'
            : variant === 'search' && 'none !important',
        borderRadius: variant === 'search' && 0,
      },
    },
    input: {
      fontSize: fontSize,
    },
    noOptions: {
      fontSize: fontSize,
      padding: '4px 10px !important',
      minHeight: '100px',
    },
    endAdornment: {
      right: '4px !important',
      position: 'relative !important',
      top: '0 !important',
      display: 'flex',
      alignItems: 'center',
    },
    listbox: {
      padding: '4px 0 !important',
      maxHeight: '406px !important',
    },
    clearIndicator: {
      marginRight: '-10px !important',
    },
    paper: {
      boxShadow: 'none !important',
      border: '1px solid #DEE2EC',
      borderRadius: 'initial !important',
    },
    option: {
      background: 'none !important',
      '&.Mui-focused': {
        backgroundColor: '#F1F1F1 !important',
      },
    },
  })
);

export const DropdownList = ({
  variant,
  options,
  onChange,
  value,
  placeholder,
  startAdornment,
  useClearIcon,
  autoFocus,
  ...props
}) => {
  const [isClose, setIsClose] = useState(true);

  return (
    <AutoCompleteSelect
      variant={variant}
      active={(!isClose).toString()}
      options={options}
      onChange={(event, value) => {
        onChange(value);
      }}
      value={value}
      onOpen={() => {
        setIsClose(false);
      }}
      onClose={() => {
        setIsClose(true);
      }}
      renderOption={(props, option) => (
        <div {...props}>
          <Li {...props}>
            <div>{option.label}</div>
          </Li>
        </div>
      )}
      renderInput={(params) => {
        return (
          <Input
            {...params}
            autoFocus={autoFocus}
            placeholder={placeholder ?? ''}
            inputProps={{ ...params.inputProps, readOnly: true }}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  {startAdornment && startAdornment}
                  {params.InputProps.startAdornment}
                </>
              ),
            }}
          />
        );
      }}
      disableClearable={isClose}
      clearIcon={useClearIcon && <ClearButton />}
      popupIcon={
        <IconWrapper>
          <KeyboardArrowDownRoundedIcon />
        </IconWrapper>
      }
      {...props}
    />
  );
};

DropdownList.propTypes = {
  variant: PropTypes.oneOf(['default', 'search', 'none']),
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  'data-option-index': PropTypes.number,
  startAdornment: PropTypes.node,
  useClearIcon: PropTypes.bool,
  autoFocus: PropTypes.bool,
};
