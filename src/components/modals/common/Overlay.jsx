import PropTypes from "prop-types";
import { withStyles } from "tss-react/mui";
import { Dialog } from "@mui/material";

const StyledDialog = withStyles(Dialog, (theme) => ({
  root: {
    "& .MuiBackdrop-root": {
      background: "rgba(0, 0, 0, 0.2) !important",
    },
  },
  paper: {
    boxShadow: "none",
    maxWidth: "1300px",
  },
}));

export const OverlayWrapper = ({ open = true, onClose, children }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      {children}
    </StyledDialog>
  );
};

OverlayWrapper.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
