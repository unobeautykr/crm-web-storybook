import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { DepositsType } from './DepositsType';

const Label = styled('span')(
  ({ type }) => `
  display: inline-block;
  min-width: 48px;
  padding: 4px;
  font-size: 11px;
  line-height: 11px;
  text-align: center;
  border: 1px solid;
  border-radius: 2px;
  flex: 0 0 auto;

  ${
    type === DepositsType.refund
      ? `
      color: #4a4e70;
    `
      : type === DepositsType.charge
      ? `
      color: #2c62f6;
    `
      : type === DepositsType.cancel_use
      ? `
      color: #a1b1ca;
    `
      : type === DepositsType.use
      ? `
      color: #eb5757;
    `
      : type === DepositsType.modification
      ? `
      color: #16bba7;
    `
      : ''
  }
`
);

const getName = (type) => {
  switch (type) {
    case DepositsType.refund:
      return '환불';
    case DepositsType.use:
      return '사용';
    case DepositsType.cancel_use:
      return '사용취소';
    case DepositsType.charge:
      return '충전';
    case DepositsType.modification:
      return '수정';

    default:
      break;
  }
};

const StatusLabel = ({ type }) => {
  return <Label type={type}>{getName(type)}</Label>;
};

StatusLabel.propTypes = {
  type: PropTypes.oneOf(Object.values(DepositsType)),
};

export default StatusLabel;
