import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { withStyles } from "tss-react/mui";
import { CloseIcon } from "~/icons/Close";

const Head = styled("div")`
  display: flex;
  align-items: center;
  height: 52px;
  padding: 16px;
  border-bottom: 1px solid #dee2ec;
  top: 0;
  background: #fff;
  h1 {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
  }
`;

const CloseButton = withStyles(Button, (theme) => ({
  root: {
    padding: 0,
    minWidth: "24px",
    width: "24px",
    height: "24px",
    background: "#fff",
    marginLeft: "auto",
    color: "#202020",
  },
  label: {
    width: "10px",
    height: "10px",
  },
}));

const TitleWrapper = styled("div")`
  display: flex;
  align-items: center;
  gap: 5px;
`;

export const ModalHeader = ({ title, titleNode, onClose }) => {
  return (
    <Head>
      <TitleWrapper>
        <h1>{title}</h1>
        {titleNode}
      </TitleWrapper>
      <CloseButton onClick={() => onClose()}>
        <CloseIcon />
      </CloseButton>
    </Head>
  );
};

ModalHeader.propTypes = {
  title: PropTypes.string,
  titleNode: PropTypes.node,
  onClose: PropTypes.func,
};
