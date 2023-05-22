import styled from 'styled-components';

const Badge = styled.div`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  color: #ffffff;
  background-color: #427cde;
  border-radius: 2px;

  font-family: Noto Sans KR;
  font-size: 10px;
  font-style: normal;
  font-weight: 500;
  line-height: 10px;
  letter-spacing: 0em;
  text-align: center;
`;

export const NewBadge = () => <Badge>신</Badge>;
