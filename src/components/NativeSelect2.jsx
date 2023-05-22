import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';
import { Select, FormControl } from '@mui/material';

const InnerBoxStyle = `
  width: 100%;
  height: 29px;
  border: 1px solid #dee2ec;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 12px;
  transition: border-color 0.1s;
  &:focus {
    border-color: #2c62f6;
  }
`;

export const SmallWrapper = styled('div')`
  &&& {
    select {
      height: 23px;
      padding: 4px;
      padding-right: 16px;
      line-height: 1;
    }
    svg {
      right: -3px;
      transform: scale(0.7);
    }
  }
`;

const Wrapper = withStyles(FormControl, (theme, props) => ({
  root: {
    width: '100%',
    background: '#fff',
    '& select': {
      padding: '0 8px',
    },
  },
}));

const SelectBox = withStyles(Select, (theme, { invalid, optioncolor }) => ({
  select: {
    InnerBoxStyle,
    border: 0,
    color: invalid ? '#a1b1ca' : 'inherit',
    '& > option': {
      color: !optioncolor && '#2D2D2D !important',
    },
  },
}));

const NativeSelect = ({
  value,
  onChange,
  placeholder,
  isRequire,
  options = [],
  // options = [{id: 1, name: "val1"}]
  optionValue = 'id',
  optionLabel = 'name',
  disabled,
}) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value === placeholder) onChange(null);
    else onChange(value);
  };

  return (
    <Wrapper variant="outlined">
      <SelectBox
        value={value || placeholder}
        onChange={handleChange}
        invalid={!value || value === placeholder ? true : undefined}
        disabled={disabled}
        native
        optioncolor={placeholder}
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
      </SelectBox>
    </Wrapper>
  );
};

NativeSelect.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  isRequire: PropTypes.bool,
  options: PropTypes.array,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

export default NativeSelect;
