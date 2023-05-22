import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  row-gap: 4px;
  ${({ disabled }) =>
    disabled &&
    css`
      label {
        color: #bbbbbb;
      }
      select,
      input {
        background: #edeff1 !important;
        color: #a1b1ca !important;
      }
    `}
`;

const LabelDom = styled.label`
  display: inline-block;
  font-weight: 500;
  font-size: 11px;
  line-height: 16px;
  ${({ isRequire }) =>
    isRequire &&
    css`
      &::after {
        content: ' *';
        color: #eb5757;
      }
    `}
`;

export const LabelWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ column }) => column ?? 2}, 1fr);
  column-gap: 8px;
`;

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  min-height: 29px;
`;

const LabelDomWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ConnectChip = styled.div`
  width: 10px;
  height: 10px;
  background: #2c62f6;
  border-radius: 50%;
`;

const Label = ({ isRequire, disabled, text, connect, children }) => {
  return (
    <Wrapper disabled={disabled}>
      {text && (
        <LabelDomWrapper>
          <LabelDom isRequire={isRequire} htmlFor={text}>
            {text}
          </LabelDom>
          {connect && <ConnectChip />}
        </LabelDomWrapper>
      )}
      {children && <InnerWrapper>{children}</InnerWrapper>}
    </Wrapper>
  );
};

Label.propTypes = {
  isRequire: PropTypes.bool,
  disabled: PropTypes.bool,
  text: PropTypes.string,
  children: PropTypes.node,
  labelChildren: PropTypes.node,
  disabledStyle: PropTypes.object,
  connect: PropTypes.bool,
};

export default Label;
