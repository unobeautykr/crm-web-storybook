import {
  styled,
  Tooltip as MuiTooltip,
  tooltipClasses,
  TooltipProps,
} from '@mui/material';

type Props = TooltipProps & {
  backgroundColor?: string;
  color?: string;
};

const StyledTooltip = styled(
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  ({ backgroundColor, className, ...props }: Props) => (
    <MuiTooltip {...props} classes={{ popper: className }} />
  )
)(({ backgroundColor, color }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 1000,
    backgroundColor: backgroundColor ?? '#293142',
    padding: '3px 8px',
    border: `1px solid ${backgroundColor ?? '#293142'}`,
    fontSize: 11,
    fontWeight: 500,
    color: color ?? '#ffffff',
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: backgroundColor ?? '#293142',
  },
}));

export const Tooltip = (props: Props) => {
  return (
    <StyledTooltip
      placement="top-start"
      PopperProps={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -6],
            },
          },
        ],
      }}
      arrow
      {...props}
    />
  );
};
