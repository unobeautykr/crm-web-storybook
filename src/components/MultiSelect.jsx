import { useMemo } from 'react';
import PropTypes from 'prop-types';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const arraysEqual = (a1, a2) => {
  return JSON.stringify(a1.sort()) == JSON.stringify(a2.sort());
};

export const MultiSelect = ({
  value = [],
  placeholder,
  onChange,
  options = [],
  // options = [{id: 1, name: "val1"}]
  optionValue = 'id',
  optionLabel = 'name',
  selectAllLabel,
  ...props
}) => {
  const allSelectValue = useMemo(() => {
    return options.map((o) => o[optionValue]);
  }, [optionValue, options]);
  const allSelected = useMemo(() => {
    return arraysEqual(allSelectValue, value);
  }, [allSelectValue, value]);

  const handleChange = (event, selected) => {
    const changeValue = event.target.value;
    if (changeValue.includes('all')) {
      if (allSelected) onChange([], selected.props.value);
      else onChange(allSelectValue, selected.props.value);
    } else {
      onChange(
        typeof changeValue === 'string' ? changeValue.split(',') : changeValue,
        selected.props.value
      );
    }
  };

  return (
    <Select
      multiple
      displayEmpty
      value={value}
      onChange={handleChange}
      input={<OutlinedInput />}
      IconComponent={KeyboardArrowDownRoundedIcon}
      renderValue={(selected) =>
        selected.length > 0 ? (
          allSelected && selectAllLabel ? (
            selectAllLabel
          ) : (
            selected
              .map(
                (v) => options.find((o) => o[optionValue] === v)[optionLabel]
              )
              .join(', ')
          )
        ) : (
          <em>{placeholder}</em>
        )
      }
      {...props}
    >
      {selectAllLabel && (
        <MenuItem value="all" className={allSelected ? 'Mui-selected' : ''}>
          <Checkbox checked={allSelected} />
          <ListItemText
            primary={selectAllLabel}
            primaryTypographyProps={{
              style: { fontWeight: 'bold' },
            }}
          />
        </MenuItem>
      )}
      {options.map((v) => (
        <MenuItem key={v[optionValue]} value={v[optionValue]}>
          <Checkbox
            checked={Boolean(value.find((o) => o === v[optionValue]))}
          />
          <ListItemText primary={v[optionLabel]} />
        </MenuItem>
      ))}
    </Select>
  );
};

MultiSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  options: PropTypes.array,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  selectAllLabel: PropTypes.string,
};
