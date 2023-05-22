import styled, { css } from 'styled-components';

const Mark = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
  border: solid 1px #2c62f6;
  text-align: center;
  border-radius: 10px;
  color: #2c62f6;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;

  ${({ color }) => {
    if (color === 'primary') {
      return css`
        border: solid 1px #2c62f6;
        color: #2c62f6;
      `;
    }
    if (color === 'black') {
      return css`
        border: solid 1px ${({ theme }) => theme.color.grey[700]};
        color: ${({ theme }) => theme.color.grey[700]};
      `;
    }
  }}

  ${({ size }) => {
    if (size === 'small') {
      return css`
        width: 14px;
        height: 14px;
        font-size: 10px;
      `;
    }
    if (size === 'medium') {
      return css`
        width: 16px;
        height: 16px;
        font-size: 10px;
      `;
    }
  }}
`;

export const QuestionMark = ({ color, size }) => {
  return (
    <Mark color={color} size={size}>
      ?
    </Mark>
  );
};
