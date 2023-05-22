import { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { withStyles } from 'tss-react/mui';
import { TextField, Autocomplete } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Chip } from './Chip';
import { NoOptionsText } from './NoOptionsText';
import { Checkbox } from './Checkbox';
import CloseIcon from '@mui/icons-material/Close';

const fontSize = '12px';

const Input = withStyles(TextField, (theme, props) => ({
  root: {
    width: '100%',
    height: '29px',
    paddingLeft: '0',
    '& input': {
      height: '29px',
      boxSizing: 'border-box',
      padding: '4px 8px',
      fontSize: fontSize,
      textAlign: 'left',
      lineHeight: 1,
      marginLeft: ({ startadornment }) => startadornment && '64px',
      marginRight: '20px',
    },
    '& .MuiOutlinedInput-root': {
      position: 'absolute',
      display: 'flex',
      flexDirection: 'row',
      height: ({ isOpen }) => !isOpen && '29px',
      overflow: ({ isOpen }) => !isOpen && 'clip',
    },
    '& .MuiInputBase-root.Mui-focused': {
      zIndex: 2,
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

const AutoCompleteSelect = withStyles(Autocomplete, (theme, props) => ({
  root: {
    '& .MuiOutlinedInput-notchedOutline': {
      border: ({ variant, active }) =>
        active
          ? 'solid 1px #2C62F6 !important'
          : variant === 'search' && 'none !important',
      borderRadius: ({ variant }) => variant === 'search' && 0,
    },
    '& .MuiOutlinedInput-root': {
      padding: '0 !important',
      backgroundColor: 'white',
    },
    '& .MuiInputBase-root.Mui-disabled': {
      backgroundColor: '#F1F1F1 !important',
      color: '#273142 !important',
    },
    '& .MuiInputBase-root.Mui-disabled input': {
      backgroundColor: '#F1F1F1 !important',
      color: '#BBBBBB !important',
    },
  },
  input: {
    fontSize: fontSize,
  },
  noOptions: {
    fontSize: fontSize,
    padding: '10px !important',
    minHeight: '100px',
  },
  endAdornment: {
    right: '4px !important',
    top: '0 !important',
  },
  clearIndicator: {
    marginRight: 8,
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
}));

const SelectLabel = styled('div')(
  ({ theme }) => `
  width: 100%;
  cursor: default;
  font-size: 11px;
  color: ${theme.palette.bluegrey[600]};
`
);

const SelectLabelText = '직접 검색 또는 선택해주세요.';

const Total = styled('span')`
  font-size: ${fontSize};
  color: #a1b1ca;
`;

export const UnlimitedMultiComboBox = ({
  variant = 'default',
  options = [],
  onChange,
  value = [],
  placeholder = '',
  size = 'large',
  noOptionsText = '',
  style,
  startAdornment,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getChipSize = () => {
    switch (size) {
      case 'medium':
        return isOpen ? '52px' : '38px';
      case 'large':
      default:
        return isOpen ? '104px' : '76px';
    }
  };

  return (
    <AutoCompleteSelect
      multiple
      variant={variant}
      open={isOpen}
      options={options}
      onChange={(event, v) => {
        onChange(v);
      }}
      value={value}
      disableCloseOnSelect
      selectOnFocus={true}
      noOptionsText={
        noOptionsText ? (
          <NoOptionsText value={noOptionsText} />
        ) : (
          <>
            <SelectLabel>{SelectLabelText}</SelectLabel>
            <NoOptionsText />
          </>
        )
      }
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
      renderOption={(props, option) => (
        <div key={option.id} {...props}>
          {props['data-option-index'] === 0 && (
            <div style={{ marginLeft: '10px' }}>
              <SelectLabel>{SelectLabelText}</SelectLabel>
            </div>
          )}
          <Li {...props}>
            <Checkbox
              checked={
                value.find((f) => f.id === option.id) != undefined
                  ? true
                  : false
              }
            />
            {option.label}
          </Li>
        </div>
      )}
      renderTags={(tags) => {
        let items = [tags[0]];
        return (
          <div
            style={
              startAdornment
                ? { width: 'calc(100% - 64px)' }
                : { width: '100%' }
            }
            onClick={() => setIsOpen(true)}
          >
            {items.map((option, index) => (
              <Chip
                key={index}
                style={{
                  maxWidth: getChipSize,
                }}
                onClick={() => setIsOpen(true)}
                showClosedButton={false}
                value={option.label}
              />
            ))}
            {tags.length > 1 && <Total>+{tags.length - 1}</Total>}
          </div>
        );
      }}
      renderInput={(params) => {
        return (
          <Input
            style={{
              background: 'white',
              ...style,
            }}
            startadornment={startAdornment && value.length}
            {...params}
            placeholder={value.length === 0 ? placeholder : ''}
            inputProps={{
              ...params.inputProps,
            }}
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
      disableClearable={!isOpen}
      clearIcon={<CloseIcon sx={{ fontSize: 11 }} />}
      popupIcon={
        <IconWrapper>
          <KeyboardArrowDownRoundedIcon />
        </IconWrapper>
      }
      {...props}
    />
  );
};

UnlimitedMultiComboBox.propTypes = {
  variant: PropTypes.oneOf(['default', 'search']),
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  'data-option-index': PropTypes.number,
  size: PropTypes.oneOf(['large', 'medium']),
  noOptionsText: PropTypes.string,
  style: PropTypes.object,
  startAdornment: PropTypes.node,
};
