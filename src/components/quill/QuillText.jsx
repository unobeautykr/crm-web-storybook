import "./quill.css";
import { useState, useEffect, useRef } from "react";
import { styled } from "@mui/material/styles";
import sanitizeHtml from "sanitize-html";
import PropTypes from "prop-types";
import ShowMorePopover from "./ShowMorePopover";

const QuillWrapper = styled("div")(
  ({ maxLine }) => `
    height: auto;
    overflow: hidden;

    div {
    display: -webkit-box;
    -webkit-line-clamp: ${maxLine};
    -webkit-box-orient: vertical;
    white-space: pre-line;
    width: max-content;
    max-width: -webkit-fill-available;
    word-break: break-word;
    }
`
);

const MoreMemoButton = styled("span")`
  color: #a1b1ca;
  cursor: pointer;
  text-align: left;
`;

export default function QuillText({ value, style, maxLine }) {
  const memoRef = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showMoreMemoText, setShowMoreMemoText] = useState(false);
  const textClass = /^<p>[\s\S]*<\/p>$/.test(value)
    ? "quill-text"
    : "quill-plain-text";

  const getText = (str) => {
    if (!str) return "";
    let arr = str
      .split("</p>")
      .map((v) => v && `${v}</p>`)
      .filter((v) => v.length);

    return arr.join("");
  };

  const openPopover = (e) => {
    setAnchorEl(e.target);
  };

  const closePopover = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    let element = memoRef.current;
    if (element.scrollHeight > element.offsetHeight + 1) {
      setShowMoreMemoText(true);
    } else {
      setShowMoreMemoText(false);
    }
  }, [value]);

  return (
    <>
      <QuillWrapper maxLine={maxLine} ref={memoRef}>
        <div
          className={textClass}
          style={{ textAlign: "left", ...style }}
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(getText(value) ?? "", {
              allowedAttributes: false,
            }),
          }}
        />
      </QuillWrapper>
      {maxLine && showMoreMemoText && (
        <>
          <MoreMemoButton onClick={(e) => openPopover(e)}>
            [더보기]
          </MoreMemoButton>
          <ShowMorePopover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closePopover}
            value={value}
          />
        </>
      )}
    </>
  );
}

QuillText.propTypes = {
  value: PropTypes.string,
  style: PropTypes.object,
  maxLine: PropTypes.number,
};
