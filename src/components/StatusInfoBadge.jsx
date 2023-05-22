import { styled, css } from "@mui/material/styles";
import PropTypes from "prop-types";
import { hexToRgb } from "~/utils/colorUtil";
import { StatusColor } from "~/core/statusColor";

function formatCount(num) {
  if (num < 10) return `0${num}`;
  return num;
}

const Wrapper = styled("button")(({ backgroundColor, selected }) => {
  const rgb = hexToRgb(backgroundColor);
  return `
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  height: 22px;
  padding: 0 4px;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  background: ${`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`};

  border: 1px solid
    ${`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`};

  border-radius: 3px;
  ${
    !selected
      ? `
          opacity: 0.3;
        `
      : ""
  }
`;
});

export const StatusInfoBadge = ({ status, onClickStatus, selected }) => {
  return (
    <Wrapper
      backgroundColor={status.backgroundColor}
      textColor={status.textColor}
      onClick={onClickStatus}
      selected={selected}
    >
      {StatusColor.getName(status.id)}
      {status.count > 0 && <span>&nbsp;({formatCount(status.count)})</span>}
    </Wrapper>
  );
};

StatusInfoBadge.propTypes = {
  status: PropTypes.object,
  onClickStatus: PropTypes.func,
  selected: PropTypes.bool,
};
