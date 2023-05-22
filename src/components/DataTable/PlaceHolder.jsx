import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const borderColor = '#dee2ec';
const PlaceHolderCell = styled('tr')(
  ({ styleType }) => `
  height: 42px;
  background: #f9fbff;
  color: #a1b1ca;
  font-size: 11px;
  text-align: center;
  ${
    styleType === 'chart'
      ? `
      border-top: 1px solid;
      border-bottom: 1px solid;
      border-left: 0;
      border-color: ${borderColor};
    `
      : styleType === 'statistics'
      ? `
    height: 110px;
    border-top: 1px solid;
    border-bottom: 1px solid;
    border-left: 0;
    border-color: ${borderColor};
  `
      : styleType === 'default'
      ? `
    font-size: 14px;
    font-weight: 700;
    background-color: #fff;
    color: #9cb2cd;
    border: 1px solid;
    border-color: ${borderColor};
    `
      : ''
  }

  &&& td {
    padding: ${
      styleType === 'chart' || styleType === 'statistics' ? '9px' : '60px 0'
    };
  }
`
);

export const PlaceHolder = ({ styleType, children }) => {
  return (
    <PlaceHolderCell styleType={styleType}>
      <td colSpan="100%">{children}</td>
    </PlaceHolderCell>
  );
};

PlaceHolder.propTypes = {
  styleType: PropTypes.string,
  children: PropTypes.node,
};
