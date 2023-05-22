import PropTypes from 'prop-types';

import { withStyles } from 'tss-react/mui';
import { Autocomplete, TextField } from '@mui/material';
import { NoOptionsText } from '~/components/NoOptionsText';

const fontSize = '12px';
const AutoCompleteSelect = withStyles(Autocomplete, (theme, props) => ({
  input: {
    padding: '0 !important',
    fontSize: fontSize,
    lineHeight: 1,
  },
  noOptions: {
    fontSize: fontSize,
    padding: '4px 10px !important',
    minHeight: '100px',
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

const SearchInput = withStyles(TextField, (theme, props) => ({
  root: {
    width: '100%',
    '& .Mui-disabled': {
      backgroundColor: '#f3f8ff',
      color: '#a1b1ca',
    },
    '& .MuiAutocomplete-inputRoot': {
      padding: '6px 8px !important',
    },
  },
}));

export const AutoComplete = ({
  sx,
  options,
  onChange,
  value,
  inputValue,
  ListboxProps,
  noOptionsText,
  PopperComponent,
  renderOption,
  onChangeInput,
  placeholder,
  inputProps,
  disabled,
  ...props
}) => {
  return (
    <AutoCompleteSelect
      sx={sx}
      options={options}
      getOptionLabel={(option) => option.searchOption ?? ''}
      onChange={onChange}
      value={value}
      inputValue={inputValue}
      ListboxProps={ListboxProps}
      noOptionsText={<NoOptionsText value={noOptionsText} />}
      PopperComponent={PopperComponent}
      renderOption={(props, option) => renderOption(props, option)}
      renderInput={(params) => (
        <SearchInput
          {...params}
          variant="outlined"
          onChange={onChangeInput}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            ...inputProps,
          }}
        />
      )}
      disabled={disabled}
      {...props}
    />
  );
};

AutoComplete.propTypes = {
  sx: PropTypes.object,
  options: PropTypes.array,
  onChange: PropTypes.func,
  value: PropTypes.any,
  inputValue: PropTypes.string,
  ListboxProps: PropTypes.object,
  noOptionsText: PropTypes.string,
  PopperComponent: PropTypes.node,
  renderOption: PropTypes.any,
  onChangeInput: PropTypes.func,
  placeholder: PropTypes.string,
  inputProps: PropTypes.node,
  disabled: PropTypes.bool,
};
