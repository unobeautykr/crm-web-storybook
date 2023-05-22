import { Checkbox as MuiCheckbox } from '@mui/material';
import { withStyles } from 'tss-react/mui';
import { ReactComponent as Unchecked } from '@ic/checkbox.svg';
import { ReactComponent as Checked } from '@ic/checkbox-checked.svg';

export const Checkbox = withStyles(MuiCheckbox, (theme, props) => ({
  root: {
    padding: '4px',
  },
}));

Checkbox.defaultProps = {
  icon: <Unchecked />,
  checkedIcon: <Checked />,
  size: 'small',
  color: 'primary',
};
