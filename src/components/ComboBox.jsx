import { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import { withStyles } from 'tss-react/mui';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { ClearButton } from '~/components/ClearButton';
import { NoOptionsText } from '~/components/NoOptionsText';

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

const AutoCompleteSelect = withStyles(Autocomplete, (theme, props) => ({
  root: {
    width: '100%',
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
  },
  clearIndicator: {
    marginRight: '-10px !important',
  },
  paper: {
    boxShadow: 'none !important',
    border: '1px solid #DEE2EC',
    borderRadius: 'initial !important',
  },
}));

const SelectLabel = styled('div')(
  ({ theme }) => `
    display: flex;
    align-items: center;
    width: 100%;
    height: 29px;
    cursor: default;
    font-size: 11px;
    color: ${theme ? theme.palette.bluegrey[600] : ''};
    padding: 0 10px;
`
);
const SelectLabelText = '직접 검색 또는 선택해주세요.';

export const ComboBox = ({
  options = [],
  onChange,
  value = null,
  placeholder = '',
  getOptionLabel,
  ...props
}) => {
  const [isClose, setIsClose] = useState(true);

  return (
    <AutoCompleteSelect
      style={{
        background: 'white',
      }}
      options={options}
      onChange={(event, value) => {
        onChange(value);
      }}
      value={value}
      getOptionLabel={getOptionLabel}
      noOptionsText={
        <>
          <SelectLabel>{SelectLabelText}</SelectLabel>
          <NoOptionsText />
        </>
      }
      onOpen={() => {
        setIsClose(false);
      }}
      onClose={() => {
        setIsClose(true);
      }}
      renderOption={(props, option) => (
        <div {...props}>
          {props['data-option-index'] === 0 && (
            <SelectLabel>{SelectLabelText}</SelectLabel>
          )}
          <Li {...props}>
            <div>{option.label}</div>
          </Li>
        </div>
      )}
      renderInput={(params) => {
        return <Input {...params} placeholder={placeholder ?? ''} />;
      }}
      disableClearable={isClose}
      clearIcon={<ClearButton />}
      popupIcon={
        <IconWrapper>
          <KeyboardArrowDownRoundedIcon />
        </IconWrapper>
      }
      {...props}
    />
  );
};

ComboBox.propTypes = {
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  'data-option-index': PropTypes.number,
  getOptionLabel: PropTypes.func,
};
