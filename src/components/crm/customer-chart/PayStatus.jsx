import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

const Label = styled("span")(
  ({ type }) => `
    display: inline-block;
    min-width: 48px;
    padding: 4px;
    font-size: 11px;
    line-height: 1;
    text-align: center;
    border-radius: 2px;
    flex: 0 0 auto;

    ${
      type === "canceled"
        ? `
        background: #7189c5;
        color: #fff;
    `
        : type === "queued"
        ? `
        background: #b7e4b0;
        color: #2d2d2d;
    `
        : type === "paid"
        ? `
        background: #e6eef8;
        color: #4a4e70;
    `
        : type === "part_refund" || type === "full_refund"
        ? `
        background: #fcf1ef;
        color: #eb5757;
    `
        : type === "unpaid"
        ? `
        background: #eb5757;
        color: #fff;
    `
        : ""
    }

`
);

const getName = (type) => {
  switch (type) {
    case "canceled":
      return "수납취소";
    case "queued":
      return "수납대기";
    case "paid":
      return "완납";
    case "unpaid":
      return "미수";
    case "part_refund":
      return "부분환불";
    case "full_refund":
      return "전체환불";

    default:
      break;
  }
};

const PayStatus = ({ type }) => {
  return <Label type={type}>{getName(type)}</Label>;
};

PayStatus.propTypes = {
  type: PropTypes.oneOf([
    "paid",
    "unpaid",
    "part_refund",
    "full_refund",
    "queued",
    "cancel",
  ]),
};

export default PayStatus;
