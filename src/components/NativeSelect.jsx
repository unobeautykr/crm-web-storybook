import PropTypes from 'prop-types';
import { Select } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

const StyledSelect = styled(Select)(
  ({ invalid }) => `
  border: 0;
  width: 100%;
  select {
    color: ${invalid ? '#a1b1ca' : 'inherit'} !important;
    font-size: 12px;
    height: 29px;
    padding: 0 8px;
    text-overflow: ellipsis;
    word-break: normal;
  }
  &::placeholder {
    color: #a1b1ca;
  }
  svg {
    font-size: 1em;
  }
`
);

export const NativeSelect = forwardRef(
  (
    {
      value,
      onChange,
      placeholder,
      isRequire,
      options = [],
      // options = [{id: 1, name: "val1"}]
      optionValue = 'id',
      optionLabel = 'name',
      disabled,
    },
    ref
  ) => {
    const handleChange = (e) => {
      const value = e.target.value;
      if (value === placeholder) onChange(null);
      else onChange(value);
    };

    return (
      <StyledSelect
        ref={ref}
        value={value || placeholder}
        onChange={handleChange}
        invalid={Number(
          (typeof value !== 'number' && !value) || value === placeholder
        )}
        disabled={disabled}
        IconComponent={KeyboardArrowDownRoundedIcon}
        native
      >
        {placeholder && (
          <option type="placeholder" value={placeholder} disabled={isRequire}>
            {placeholder}
          </option>
        )}
        {options.map((v) => (
          <option key={v[optionValue]} value={v[optionValue]}>
            {v[optionLabel]}
          </option>
        ))}
      </StyledSelect>
    );
  }
);

NativeSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  isRequire: PropTypes.bool,
  options: PropTypes.array,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

export default NativeSelect;
