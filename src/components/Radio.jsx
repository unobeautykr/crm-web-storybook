import PropTypes from "prop-types";
import { withStyles } from "tss-react/mui";
import {
  Radio as RadioIcon,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const RadioWrapper = withStyles(RadioGroup, (theme, props) => ({
  root: {
    height: "100%",
  },
}));

const RadioButton = withStyles(FormControlLabel, (theme, props) => ({
  root: {
    minWidth: 40,
    marginLeft: "0px",
    fontSize: "11px",
  },
  label: {
    fontSize: "inherit",
    lineHeight: "1",
  },
}));

const Icon = withStyles(RadioIcon, (theme, props) => ({
  root: {
    padding: "0",
    paddingRight: "4px",
    "& .MuiSvgIcon-root": { fontSize: "15px" },
  },
}));

const Radio = ({ options = [], value, onChange, disabled, style }) => {
  return (
    <RadioWrapper
      row
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
    >
      {options.map((v, i) => (
        <RadioButton
          key={i}
          value={v.value}
          label={v.label}
          control={<Icon color="primary" />}
          disabled={disabled || v.disabled}
        />
      ))}
    </RadioWrapper>
  );
};

Radio.propTypes = {
  options: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  style: PropTypes.object,
};

export default Radio;
