import PropTypes from "prop-types";
import { ReactComponent as Icon } from "@ic/close.svg";
import { withStyles } from "tss-react/mui";
import { styled, css } from "@mui/material/styles";
import { Chip as MuiChip } from "@mui/material";

const ChipButton = withStyles(MuiChip, (theme, props) => ({
  root: {
    height: "20px !important",
    fontSize: "12px !important",
    backgroundColor: "#F3F8FF !important",
    color: "#2D2D2D !important",
    margin: "4px !important",
  },
  deleteIcon: {
    display: "flex",
    margin: "0 !important",
  },
  disabled: {
    backgroundColor: "#F1F1F1 !important",
    color: "#bbbbbb !important",
    opacity: "1 !important",
  },
}));

const Closed = styled(Icon)(
  ({ theme, disabled }) => `
    width: 8px;
    height: 8px;
    path {
      fill: ${
        disabled ? theme.palette.grey[300] : theme.palette.bluegrey[600]
      } !important;
    }
`
);

const Label = styled("div")(
  ({ style }) => `
    text-overflow: ellipsis;
    overflow: hidden;
    ${
      style
        ? css`
            ${style}
          `
        : ""
    }
`
);

const IconWrapper = styled("div")(
  ({ disabled }) => `
  padding: 0;
  min-width: 24px;
  cursor: ${disabled ? "initial" : "pointer"};
`
);

export const Chip = ({
  disabled,
  value,
  onDelete,
  onClick,
  style,
  showClosedButton = true,
}) => {
  return (
    <ChipButton
      disabled={disabled}
      label={<Label style={{ ...style }}>{value}</Label>}
      onClick={onClick}
      onDelete={() => !disabled && onDelete()}
      deleteIcon={
        showClosedButton ? (
          <IconWrapper disabled={disabled}>
            <Closed disabled={disabled} />
          </IconWrapper>
        ) : (
          <></>
        )
      }
    />
  );
};

Chip.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  showClosedButton: PropTypes.bool,
};
