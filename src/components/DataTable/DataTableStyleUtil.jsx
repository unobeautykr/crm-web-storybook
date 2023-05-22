import styled, { css } from 'styled-components';
import { CircularProgress } from '@mui/material';
import { withStyles } from 'tss-react/mui';

const borderColor = '#dee2ec';
// table body
export const cellCommonStyle = css`
  position: relative;
  padding: 4px 8px;
  border: 1px solid ${borderColor};
  max-width: 320px;
  white-space: pre;
  > * {
    font-size: inherit;
    line-height: inherit;
  }
`;

export const TableStyle = css`
  position: relative;
  background: #fff;
  font-size: 12px;
  text-align: center;
  border-collapse: collapse;
  overflow: auto;
  color: #2d2d2d;
  thead {
    border-bottom: 1px solid ${borderColor};
  }
`;

export const TbodyDefaultStyle = css`
  td {
    border: 1px solid #dee2ec;
  }
`;

export const TbodyStyle = css`
  td {
    padding: 4px 8px;
    border-right: 1px solid;
    border-color: ${borderColor};
    white-space: pre;
    min-width: 25px;
    font-size: 12px;
    line-height: 16px;
    &:last-child {
      border-right: 0;
    }
  }
`;

export const TdStyle = css`
  position: relative;
  border: 1px solid ${borderColor};
  max-width: 320px;
  white-space: pre;
  padding: 4px 8px;
  > * {
    font-size: inherit;
    line-height: inherit;
  }
`;

export const ColumnValue = styled.div`
  display: inline-block;
  text-align: inherit;
  text-decoration: inherit;
  vertical-align: middle;
  min-height: 12px;
`;

// table head
export const ThStyle = css`
  ${cellCommonStyle}
  position: relative;
  font-weight: 700;
  word-break: keep-all;
  ${({ grow, resizable }) =>
    grow
      ? css`
          width: auto;
        `
      : css`
          ${!resizable && 'width: 1%'};
          white-space: pre;
          min-width: 25px;
        `}
  ${({ styleType }) =>
    (styleType === 'chart' || styleType === 'statistics') &&
    css`
      line-height: 1.2;
      padding: 6px;
      border: none;
      position: sticky;
      top: 0;
      z-index: 1;
      background: #fff;

      button[name='sort'] {
        margin-left: 8px;
        padding: 0;
      }
    `};
`;

export const ThCell = styled.span`
  display: inline-block;
`;

export const LoadingIcon = withStyles(CircularProgress, () => ({
  root: {
    color: '#2C62F6',
  },
}));
