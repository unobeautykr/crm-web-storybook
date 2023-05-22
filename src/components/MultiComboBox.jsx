import { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { withStyles } from 'tss-react/mui';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Chip } from '~/components/Chip';
import { NoOptionsText } from '~/components/NoOptionsText';
import { Checkbox } from '~/components/Checkbox';

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
      marginRight: '20px',
    },
    '& .MuiOutlinedInput-root': {
      position: 'absolute',
      padding: '0 !important',
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
  root: {},
  input: {
    fontSize: fontSize,
  },
  noOptions: {
    fontSize: fontSize,
    padding: '10px !important',
    minHeight: '100px',
  },
  endAdornment: {
    right: ' 4px !important',
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

export const MultiComboBox = ({
  options = [],
  onChange,
  value = [],
  placeholder = '',
  size = 'large',
  limit,
  getOptionLabel,
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
      style={{
        background: 'white',
      }}
      open={isOpen}
      options={options}
      onChange={(event, v, reason, detail) => {
        if (!detail.option.id) return;
        onChange(v);
      }}
      value={value}
      disableCloseOnSelect
      getOptionLabel={getOptionLabel}
      noOptionsText={
        <>
          <SelectLabel>{SelectLabelText}</SelectLabel>
          <NoOptionsText />
        </>
      }
      onOpen={() => {
        setIsOpen(true);
      }}
      onClose={() => {
        setIsOpen(false);
      }}
      renderOption={(props, option) => (
        <div {...props}>
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
        return tags.map((option, index) => (
          <Chip
            key={index}
            style={{
              maxWidth: getChipSize,
            }}
            onClick={() => setIsOpen(true)}
            showClosedButton={isOpen}
            value={option.label}
            onDelete={() => {
              onChange(value.filter((f) => f.id !== option.id));
            }}
          />
        ));
      }}
      renderInput={(params) => {
        return (
          <Input
            {...params}
            placeholder={value.length === 0 ? placeholder : ''}
            inputProps={{
              ...params.inputProps,
              readOnly: limit > 0 && value.length >= limit,
            }}
          />
        );
      }}
      disableClearable={true}
      popupIcon={
        <IconWrapper>
          <KeyboardArrowDownRoundedIcon />
        </IconWrapper>
      }
      {...props}
    />
  );
};

MultiComboBox.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.array,
  placeholder: PropTypes.string,
  'data-option-index': PropTypes.number,
  size: PropTypes.oneOf(['large', 'medium']),
  limit: PropTypes.number,
  getOptionLabel: PropTypes.func,
};
