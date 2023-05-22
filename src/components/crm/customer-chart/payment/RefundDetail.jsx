import PropTypes from 'prop-types';
import styled from 'styled-components';

import { PaymentMethod } from '~/core/PaymentUtil';
import Label from '~/components/Label2';
import TextInput from '~/components/TextInput2';
import PriceInput from '~/components/PriceInput';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`;

const Detail = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: rgba(237, 239, 241, 0.2);
  border: 1px solid #dee2ec;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 12px;
`;

const Title = styled.p`
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: bold;
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto 1fr;
  gap: 8px;
  .MuiFormControl-root {
    height: 27px;
  }
`;

const getCashReceiptText = (price) => {
  return `(*현금영수증 ${price.toLocaleString()})`;
};

const RefundTable = ({ refunds = [], onChange }) => {
  return (
    <Table>
      <Label text="결제수단" />
      <Label text="수납액" />
      <Label text="" />
      <Label text="환불액" />
      {refunds.map((refund, i) => (
        <>
          <TextInput
            value={`${PaymentMethod.getName(refund.method)} ${
              refund.companyName ? `- ${refund.companyName}` : ''
            }`}
            disabled
          />
          <TextInput value={`${refund.amount.toLocaleString()}`} disabled />
          -
          <PriceInput
            data-testid={`price-${i}`}
            value={refund.refundAmount}
            onChange={(v) => {
              onChange(
                refund,
                refund.method === PaymentMethod.cash
                  ? v
                  : Math.max(Math.min(v, refund.amount), 0)
              );
            }}
            max={refund.amount}
            showButton
          />
        </>
      ))}
      <Label text="총 수납액" />
      <TextInput
        value={`${refunds
          .reduce((a, b) => a + b.amount, 0)
          .toLocaleString()} ${getCashReceiptText(
          refunds.reduce((a, b) => a + b.cashReceiptAmount, 0)
        )}`}
        disabled
      />
      -
      <TextInput
        value={`${refunds
          .reduce((a, b) => a + b.refundAmount, 0)
          .toLocaleString()} ${getCashReceiptText(
          refunds
            .filter((v) => v.refundAmount && v.method !== 'CARD')
            .reduce((a, b) => {
              return a + b.refundAmount <=
                refunds.reduce((a, b) => a + b.cashReceiptAmount, 0)
                ? a + b.refundAmount
                : refunds.reduce((a, b) => a + b.cashReceiptAmount, 0);
            }, 0)
        )}`}
        readOnly
      />
    </Table>
  );
};

RefundTable.propTypes = {
  refunds: PropTypes.array,
  cashRefunds: PropTypes.array,
  onChange: PropTypes.func,
};

const RefundDetail = ({ refunds, onChange }) => {
  const vatRefunds = refunds.filter((r) => !r.vatFree);
  const vatFreeRefunds = refunds.filter((r) => r.vatFree);

  return (
    <Wrapper>
      {vatRefunds.length > 0 && (
        <Detail>
          <Title>과세</Title>
          <RefundTable
            refunds={
              vatRefunds.filter((f) => f.method === 'CASH').length > 0
                ? vatRefunds
                : vatRefunds.concat({
                    method: 'CASH',
                    companyName: '',
                    amount: 0,
                    cashReceiptAmount: 0,
                    refundAmount: 0,
                    vatFree: false,
                  })
            }
            onChange={onChange}
          />
        </Detail>
      )}
      {vatFreeRefunds.length > 0 && (
        <Detail>
          <Title>비과세</Title>
          <RefundTable
            refunds={
              vatFreeRefunds.filter((f) => f.method === 'CASH').length > 0
                ? vatFreeRefunds
                : vatFreeRefunds.concat({
                    method: 'CASH',
                    companyName: '',
                    amount: 0,
                    cashReceiptAmount: 0,
                    refundAmount: 0,
                    vatFree: true,
                  })
            }
            onChange={onChange}
          />
        </Detail>
      )}
    </Wrapper>
  );
};

RefundDetail.propTypes = {
  refunds: PropTypes.array,
  onChange: PropTypes.func,
};

export default RefundDetail;
