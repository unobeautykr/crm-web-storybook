import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const Wrapper = withStyles(ToggleButtonGroup, () => ({
  root: {
    width: '100%',
    background: '#F9FBFF',
    borderRadius: '3px',
    padding: '2px',
  },
}));

const Button = withStyles(ToggleButton, () => ({
  root: {
    flexGrow: 1,
    fontSize: '12px',
    color: '#4A4E70',
    border: 'none',
    padding: '6px',
    width: '100%',
    '&:hover': {
      background: 'rgb(255 255 255 / 30%)',
    },
    '&.Mui-selected': {
      color: '#293142',
      background: '#fff !important',
      border: 'solid 1px #3A3A3A',
      borderRadius: '4px',
    },
  },
  label: {
    wordBreak: 'keep-all',
    lineHeight: '17px',
  },
}));

const ButtonGroup = ({ buttonData = [], value, onChange }) => {
  const handleChange = (e, newAlignment) => {
    onChange(newAlignment ?? '');
  };

  return (
    <Wrapper
      color="primary"
      value={value || ''}
      exclusive
      onChange={handleChange}
    >
      {buttonData.map((v) => (
        <Button key={v.value} value={v.value || ''} onClick={v.onClick}>
          {v.name}
        </Button>
      ))}
    </Wrapper>
  );
};

ButtonGroup.propTypes = {
  buttonData: PropTypes.array,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

export default ButtonGroup;
