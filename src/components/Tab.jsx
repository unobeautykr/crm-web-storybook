import { styled, css } from "@mui/material/styles";
import PropTypes from "prop-types";

const Wrapper = styled("div")`
  display: flex;
  column-gap: 20px;
`;

const CustomTab = styled("div")(
  ({ active }) => `
    font-weight: 500;
    font-size: 13px;
    line-height: 19px;
    color: #273142;
    border-bottom: 2px solid;
    padding-bottom: 8px;
    cursor: pointer;
    color: ${active ? "#2C62F6" : "#273142b3"};
    border-color: ${active ? "#2C62F6" : "#F3F8FF"};
    font-weight: ${active ? "700" : "500"};
    &:hover {
      color: #2c62f6;
      border-color: currentColor;
    }
`
);

export const Tab = ({ value, onChange, list = [] }) => {
  return (
    <Wrapper>
      {list.map((v, i) => (
        <CustomTab key={i} active={value === v} onClick={() => onChange(v)}>
          {v}
        </CustomTab>
      ))}
    </Wrapper>
  );
};

Tab.propTypes = {
  list: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
