import { MenuItem } from '@mui/material';
import { withStyles } from 'tss-react/mui';

export const ContextMenuItem = withStyles(MenuItem, (theme, props) => ({
  root: {
    fontFamily: 'Noto Sans KR',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '11px',
    textAlign: 'center',
    color: '#000',
    padding: '12px 14px',
    width: '180px',
    '& svg:first-child': {
      width: '14px',
    },
    '&:not(:last-child)': {
      borderBottom: ({ noneborder }) =>
        noneborder ? 'none' : '1px solid #e9e9ed',
    },
  },
}));

export const ContextMenuItemSmall = withStyles(MenuItem, (theme, props) => ({
  root: {
    fontFamily: 'Noto Sans KR',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '11px',
    letterSpacing: '0em',
    textAlign: 'center',
    // color: '#000',
    padding: '6px 8px',
    '&:not(:last-child)': {
      borderBottom: ({ noneborder }) =>
        noneborder ? 'none' : '1px solid #e9e9ed',
    },
  },
}));
