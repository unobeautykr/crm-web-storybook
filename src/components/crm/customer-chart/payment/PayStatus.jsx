import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';

const Label = styled.span`
  display: inline-block;
  min-width: 48px;
  padding: 4px;
  font-size: 11px;
  line-height: 1;
  text-align: center;
  border-radius: 2px;
  flex: 0 0 auto;

  ${({ type }) =>
    type === 'canceled' &&
    css`
      background: #7189c5;
      color: #fff;
    `}

  ${({ type }) =>
    type === 'queued' &&
    css`
      background: #b7e4b0;
      color: #2d2d2d;
    `}

  ${({ type }) =>
    type === 'paid' &&
    css`
      background: #e6eef8;
      color: #4a4e70;
    `}

  ${({ type }) =>
    (type === 'part_refund' || type === 'full_refund') &&
    css`
      background: #fcf1ef;
      color: #eb5757;
    `}

  ${({ type }) =>
    type === 'unpaid' &&
    css`
      background: #eb5757;
      color: #fff;
    `}
`;

const getName = (type) => {
  switch (type) {
    case 'canceled':
      return '수납취소';
    case 'queued':
      return '수납대기';
    case 'paid':
      return '완납';
    case 'unpaid':
      return '미수';
    case 'part_refund':
      return '부분환불';
    case 'full_refund':
      return '전체환불';

    default:
      break;
  }
};

const PayStatus = ({ type }) => {
  return <Label type={type}>{getName(type)}</Label>;
};

PayStatus.propTypes = {
  type: PropTypes.oneOf([
    'paid',
    'unpaid',
    'part_refund',
    'full_refund',
    'queued',
    'cancel',
  ]),
};

export default PayStatus;
