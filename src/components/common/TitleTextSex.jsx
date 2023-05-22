import styled, { css } from 'styled-components';

export const TitleTextSex = styled.span`
  font-family: Noto Sans KR;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: center;

  color: ${({ sex }) => (sex === 'male' ? '#005DFF' : '#EB5757')};
  ${({ size }) => {
    if (size === 'small') {
      return css`
        font-size: 12px;
      `;
    }
    if (size === 'medium') {
      return css`
        font-size: 14px;
      `;
    }
  }}
`;
