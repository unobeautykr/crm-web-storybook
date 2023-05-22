import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFetch } from 'use-http';
import PaymentInputBox from './PaymentInputBox';

const PayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.color.grey[700]};
  width: 100%;
  overflow: auto;
  flex: 0 0 auto;
  column-gap: 14px;
  row-gap: 8px;
  > div {
    display: flex;
    flex-direction: column;
    width: 100%;
    background: rgba(237, 239, 241, 0.2);
    border: 1px solid #dee2ec;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 12px;
    min-width: 700px;
  }
`;

const Detail = styled.div``;
const PaymentDetail = ({
  disabled,
  readOnly,
  customerId,
  items = [],
  totalData,
  cashReceipt,
  refundData,
  payoutData,
  cashReceiptData,
  updateReceipt,
  updateRefundData,
  updatePayoutData,
  deletePayoutData,
  showPayoutAmount,
  status,
  queued,
  reset,
  allowNegative,
}) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const { get } = useFetch(
    `/deposits/${customerId}`,
    {
      onNewData: (old, updates) => {
        if (updates.data) {
          const { cash, points } = updates.data;
          setDepositAmount(cash + points);
        }
        return updates.data;
      },
    },
    []
  );

  const totalPrice = useMemo(
    () => ({
      vat:
        totalData?.vat ??
        items
          .filter((v) => !v.vatFree)
          .map((v) => v.price - (v.discountAmount ?? 0))
          .reduce((a, b) => a + b, 0),
      vatFree:
        totalData?.vatFree ??
        items
          .filter((v) => v.vatFree)
          .map((v) => v.price - (v.discountAmount ?? 0))
          .reduce((a, b) => a + b, 0),
    }),
    [items, totalData]
  );

  const totalRefund = useMemo(
    () => ({
      vat: refundData.vat.map((v) => v.amount).reduce((a, b) => a + b, 0),
      vatFree: refundData.vatFree
        .map((v) => v.amount)
        .reduce((a, b) => a + b, 0),
    }),
    [refundData]
  );

  const totalPaid = useMemo(
    () => ({
      vat: payoutData.vat.map((v) => v.amount).reduce((a, b) => a + b, 0),
      vatFree: payoutData.vatFree
        .map((v) => v.amount)
        .reduce((a, b) => a + b, 0),
    }),
    [payoutData]
  );

  return (
    <div>
      <PayoutWrapper>
        {!items.length && (
          <Detail>
            <PaymentInputBox disabled />
          </Detail>
        )}
        {Boolean(items.filter((v) => !v.vatFree).length) && (
          <Detail>
            <PaymentInputBox
              disabled={disabled}
              readOnly={readOnly}
              title={items.filter((v) => v.vatFree).length ? '과세' : ''}
              max={totalPrice.vat}
              totalPaid={totalPaid.vat}
              totalRefund={totalRefund.vat}
              totalCashReceipt={cashReceiptData.vat}
              depositAmount={depositAmount}
              refundData={refundData.vat.map((v, i) => {
                v.idx = i;
                return v;
              })}
              payoutData={payoutData.vat.map((v, i) => {
                v.idx = i;
                return v;
              })}
              cashReceipt={cashReceipt.vat}
              updateReceipt={(checked) => updateReceipt(false, checked)}
              updateRefundData={(data) => updateRefundData(false, data)}
              updatePayoutData={(idx, data) =>
                updatePayoutData(false, idx, data)
              }
              deletePayoutData={(idx) => deletePayoutData(false, idx)}
              vatFree={false}
              showPayoutAmount={showPayoutAmount}
              status={status}
              queued={queued}
              reset={reset}
              allowNegative={allowNegative}
            />
          </Detail>
        )}
        {Boolean(items.filter((v) => v.vatFree).length) && (
          <Detail>
            <PaymentInputBox
              disabled={disabled}
              readOnly={readOnly}
              title={items.filter((v) => !v.vatFree).length ? '비과세' : ''}
              max={totalPrice.vatFree}
              totalPaid={totalPaid.vatFree}
              totalRefund={totalRefund.vatFree}
              totalCashReceipt={cashReceiptData.vatFree}
              depositAmount={depositAmount}
              refundData={refundData.vatFree.map((v, i) => {
                v.idx = i;
                return v;
              })}
              payoutData={payoutData.vatFree.map((v, i) => {
                v.idx = i;
                return v;
              })}
              cashReceipt={cashReceipt.vatFree}
              updateReceipt={(checked) => updateReceipt(true, checked)}
              updateRefundData={(data) => updateRefundData(true, data)}
              updatePayoutData={(idx, data) =>
                updatePayoutData(true, idx, data)
              }
              deletePayoutData={(idx) => deletePayoutData(true, idx)}
              vatFree={true}
              showPayoutAmount={showPayoutAmount}
              status={status}
              queued={queued}
              reset={reset}
              allowNegative={allowNegative}
            />
          </Detail>
        )}
      </PayoutWrapper>
    </div>
  );
};

PaymentDetail.propTypes = {
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  customerId: PropTypes.number,
  items: PropTypes.array,
  cashReceipt: PropTypes.object,
  refundData: PropTypes.object,
  payoutData: PropTypes.object,
  cashReceiptData: PropTypes.object,
  totalData: PropTypes.object,
  updateReceipt: PropTypes.func,
  updateRefundData: PropTypes.func,
  updatePayoutData: PropTypes.func,
  deletePayoutData: PropTypes.func,
  showPayoutAmount: PropTypes.bool,
  status: PropTypes.string,
  queued: PropTypes.bool,
  reset: PropTypes.bool,
  allowNegative: PropTypes.bool,
};

export default PaymentDetail;
