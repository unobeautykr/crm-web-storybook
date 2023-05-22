import PropTypes from "prop-types";
import { Dialog, DialogContent, DialogActions } from "@mui/material";
import { Button } from "~/components/Button";

export function AlertModal({ children, onClose, open }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { minWidth: "378px", minHeight: "164px" } }}
      scroll="paper"
    >
      <DialogContent
        sx={{
          fontSize: "14px",
          padding: "40px 27px 24px !important",
        }}
      >
        {children}
      </DialogContent>
      <DialogActions sx={{ padding: "0 24px 16px 24px" }}>
        <Button onClick={onClose}>확인</Button>
      </DialogActions>
    </Dialog>
  );
}

AlertModal.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
