import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const Wrapper = styled('div')`
  position: relative;
`;

const LabelDom = styled('label')(
  (props) => `
  display: inline-block;
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  margin-bottom: 4px;
  ${
    props.$isRequire
      ? `
      &::after {
        content: ' *';
        color: #eb5757;
      }
    `
      : ''
  }
`
);

export const LabelWrapper = styled('div')`
  display: grid;
  grid-template-columns: repeat(${(props) => props.column ?? 2}, 1fr);
  column-gap: 8px;
`;

export const InnerBoxStyle = `
  width: 100%;
  height: 29px;
  border: 1px solid #dee2ec;
  box-sizing: border-box;
  border-radius: 3px;
  padding: 0 8px;
  font-size: 12px;
  transition: border-color 0.1s;
  &:focus {
    border-color: #2c62f6;
  }
`;

const InnerWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 29px;
`;

export const Label = ({ isRequire, text, children }) => {
  return (
    <Wrapper>
      {text && (
        <LabelDom $isRequire={isRequire} htmlFor={text}>
          {text}
        </LabelDom>
      )}
      {children && <InnerWrapper>{children}</InnerWrapper>}
    </Wrapper>
  );
};

Label.propTypes = {
  isRequire: PropTypes.bool,
  text: PropTypes.string,
  children: PropTypes.node,
};

export default Label;
