import PropTypes from 'prop-types';
import {
  OutlinedInput,
  MenuItem,
  ListItemText,
  Select as MuiSelect,
} from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

export const Select = ({
  isRequire = false,
  placeholder,
  options = [],
  optionValue = 'id',
  optionLabel = 'name',
  value,
  onChange,
  ...props
}) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === placeholder) onChange(null);
    else onChange(value);
  };

  return (
    <MuiSelect
      displayEmpty
      value={value}
      onChange={handleChange}
      input={<OutlinedInput />}
      renderValue={(selected) => {
        if (!selected && placeholder)
          return <p style={{ color: '#adaebc' }}>{placeholder}</p>;
        return options.find((v) => v[optionValue] == selected)?.[optionLabel];
      }}
      IconComponent={KeyboardArrowDownRoundedIcon}
      autoWidth={false}
      {...props}
    >
      {placeholder && (
        <MenuItem disabled={isRequire} value="">
          <ListItemText>{placeholder}</ListItemText>
        </MenuItem>
      )}
      {options.map(
        (v) =>
          v[optionLabel] && (
            <MenuItem key={v[optionValue]} value={v[optionValue]}>
              <ListItemText>{v[optionLabel]}</ListItemText>
            </MenuItem>
          )
      )}
    </MuiSelect>
  );
};

Select.propTypes = {
  isRequire: PropTypes.bool,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
};
