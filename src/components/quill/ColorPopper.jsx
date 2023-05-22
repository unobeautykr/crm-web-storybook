import { styled } from '@mui/material/styles';
import { Fade, Paper, Popper } from '@mui/material';
import { ClickAwayListener } from '@mui/base';
import PropTypes from 'prop-types';

const defaultColors = [
  '#000000',
  '#e60000',
  '#ff9900',
  '#ffff00',
  '#008a00',
  '#0066cc',
  '#9933ff',

  '#ffffff',
  '#facccc',
  '#ffebcc',
  '#ffffcc',
  '#cce8cc',
  '#cce0f5',
  '#ebd6ff',

  '#bbbbbb',
  '#f06666',
  '#ffc266',
  '#ffff66',
  '#66b966',
  '#66a3e0',
  '#c285ff',

  '#888888',
  '#a10000',
  '#b26b00',
  '#b2b200',
  '#006100',
  '#0047b2',
  '#6b24b2',

  '#444444',
  '#5c0000',
  '#663d00',
  '#666600',
  '#003700',
  '#002966',
  '#3d1466',
];

const ColorItem = styled('button')(
  ({ color }) => `
  background-color: ${color};
  width: 16px;
  height: 16px;

  :hover {
    border: 1px solid black;
  }
`
);

export const ColorPopper = ({
  open,
  colors = defaultColors,
  onClose,
  onChange,
  ...props
}) => {
  const onClickColor = (c) => {
    onChange(c);
    onClose();
  };

  return (
    <Popper
      style={{ zIndex: 1300 }}
      open={open}
      onClose={onClose}
      transition
      placement="bottom-start"
      {...props}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={250}>
          <div>
            <ClickAwayListener onClickAway={onClose}>
              <Paper
                sx={{
                  display: 'grid',
                  padding: 1,
                  gridGap: 4,
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gridTemplateRows: 'repeat(5, 1fr)',
                }}
                elevation={2}
              >
                {colors.map((c, i) => (
                  <ColorItem
                    key={i}
                    color={c}
                    onClick={() => onClickColor(c)}
                  />
                ))}
              </Paper>
            </ClickAwayListener>
          </div>
        </Fade>
      )}
    </Popper>
  );
};

ColorPopper.propTypes = {
  open: PropTypes.bool,
  colors: PropTypes.array,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
};
