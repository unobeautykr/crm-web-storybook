import { forwardRef } from 'react';
import { withStyles } from 'tss-react/mui';
import PropTypes from 'prop-types';
import { TextField, Autocomplete, createFilterOptions } from '@mui/material';

const fontSize = '12px';
const Select = withStyles(Autocomplete, (theme, props) => ({
  root: {
    width: '100%',
    '& input::placeholder': {
      color: '#A1B1CA !important',
      fontWeight: 400,
    },
  },
  listbox: {
    padding: 0,
    border: '1px solid #DEE2EC',
  },
  input: {
    padding: '0 !important',
    fontSize: fontSize,
    lineHeight: 1,
  },
  inputRoot: {
    height: '29px',
    boxSizing: 'border-box',
    paddingLeft: '8px !important',
    paddingTop: '6px !important',
    paddingBottom: '6px !important',
  },
  option: {
    fontSize: fontSize,
    '&:not(:last-child)': {
      borderBottom: '1px solid #DEE2EC',
    },
  },
  noOptions: {
    fontSize: fontSize,
  },
}));

const SearchInput = withStyles(TextField, (theme, props) => ({
  root: {
    width: '100%',
  },
}));

export const AutoCompleteSelect = forwardRef(
  (
    {
      freeSolo,
      value,
      onChange,
      onEnter,
      placeholder,
      options = [],
      defaultOptions = [],
      disableClearable,
      inputRef,
      ...props
    },
    ref
  ) => {
    const handleChange = (e, v) => {
      if (!v?.unselectable) onChange(v);
      if (v?.onClick) v.onClick();
    };

    const _filterOptions = createFilterOptions();
    const filterOptions = (options, state) => {
      const results = _filterOptions(options, state);
      results.push(...defaultOptions);
      return results;
    };

    return (
      <>
        <Select
          ref={ref}
          freeSolo={freeSolo}
          size="small"
          options={options}
          value={value}
          onChange={handleChange}
          onKeyDown={(e) => e.keyCode == 13 && onEnter && onEnter()}
          disableClearable={disableClearable}
          filterOptions={filterOptions}
          renderOption={(props, option) => (
            <div style={props.style} {...props}>
              {props.name}
            </div>
          )}
          getOptionLabel={(option) => option.name ?? ''}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <SearchInput
              {...params}
              ref={inputRef}
              variant="outlined"
              placeholder={placeholder}
            />
          )}
          {...props}
        />
      </>
    );
  }
);

AutoCompleteSelect.propTypes = {
  freeSolo: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  onEnter: PropTypes.func,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  defaultOptions: PropTypes.array,
  disableClearable: PropTypes.bool,
  inputRef: PropTypes.node,
};
