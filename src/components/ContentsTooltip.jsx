import { styled, Tooltip, tooltipClasses } from '@mui/material';
import PropTypes from 'prop-types';

const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[6],
    fontSize: 11,
    border: '1px solid #6C5FFA',
    maxWidth: 340,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
    fontSize: 16,
    '&::before': {
      border: '1px solid #6C5FFA',
      backgroundColor: '#fff',
      boxSizing: 'border-box',
    },
  },
}));

export const ContentsTooltip = ({
  title,
  arrow = true,
  placement = 'right',
  disableInteractive = true,
  children,
  ...props
}) => {
  return (
    <StyledTooltip
      title={title}
      arrow={arrow}
      placement={placement}
      disableInteractive={disableInteractive}
      {...props}
    >
      {children}
    </StyledTooltip>
  );
};

ContentsTooltip.propTypes = {
  title: PropTypes.node,
  arrow: PropTypes.bool,
  disableInteractive: PropTypes.bool,
  placement: PropTypes.string,
  children: PropTypes.node,
};
