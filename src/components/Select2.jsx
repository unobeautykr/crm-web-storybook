import { Select as MuiSelect, MenuItem, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { styled, css } from '@mui/material/styles';

const fieldSizeStyles = {
  default: css`
    padding: 5px 12px;
    height: 26px;
  `,
  small: css`
    padding: 0 8px;
    padding-right: 24px;
    height: 24px;
  `,
  xsmall: css`
    padding: 2px 8px;
    padding-right: 32px;
    height: 24px;
  `,
};

const CustomSelect = styled(MuiSelect)(
  ({ fieldsize2 }) => `
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .MuiSelect-root {
    display: flex;
    align-items: center;
    background: #fff;
    ${fieldSizeStyles[fieldsize2]}
  }

  .MuiSelect-icon {
    top: 50%;
    transform: translate(0, -50%);
    ${
      fieldsize2 === 'small'
        ? `
          right: 0;
        `
        : ''
    }

  .MuiSelect-nativeInput {
    padding: 0px !important;
    background: none;
  }
`
);

const CustomMenuItem = withStyles(MenuItem, (theme, props) => ({
  root: {
    height: '30px',
  },
}));

const CustomListItemText = withStyles(ListItemText, (theme, props) => ({
  primary: {
    fontFamily: 'Noto Sans KR',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineWeight: '17px',
    letterSpacing: '0em',
    textAlign: 'center',
  },
}));

export const Select2 = ({
  onChange,
  value,
  options,
  placeholder,
  fieldSize,
  ...props
}) => {
  return (
    <CustomSelect
      variant="outlined"
      value={value}
      onChange={onChange}
      fieldsize2={fieldSize}
      placeholder={placeholder}
      MenuProps={{
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right',
        },
        transformOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        getContentAnchorEl: null,
      }}
      {...props}
    >
      {options.map((option) => (
        <CustomMenuItem key={option.value} value={option.value}>
          <CustomListItemText primary={option.label} />
        </CustomMenuItem>
      ))}
    </CustomSelect>
  );
};

Select2.defaultProps = {
  fieldSize: 'default',
};

Select2.propTypes = {
  value: PropTypes.any,
  options: PropTypes.array,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  fieldSize: PropTypes.oneOf(['default', 'small', 'xsmall']),
};
