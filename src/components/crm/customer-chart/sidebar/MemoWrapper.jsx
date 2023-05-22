import styled, { css } from 'styled-components';
import { TabType } from '~/core/TabUtil';

export const MemoWrapper = styled.div`
  margin-top: 5px;
  ${({ type }) =>
    type === TabType.appointment &&
    css`
      background-color: rgba(251, 205, 177, 0.1);
      border-radius: 4px;
      padding: 10px 14px;
    `}
  ${({ type }) =>
    type === TabType.registration &&
    css`
      background-color: rgba(171, 192, 251, 0.1);
      border-radius: 4px;
      padding: 10px 14px;
    `}
`;
