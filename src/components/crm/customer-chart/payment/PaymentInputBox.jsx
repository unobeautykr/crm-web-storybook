import { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import update from 'immutability-helper';

import { Checkbox } from '~/components/Checkbox';
import CardInput from './CardInput';
import TextInput from '~/components/TextInput2';
import PriceInput from '~/components/PriceInput';
import { PaymentMethod } from '~/core/PaymentUtil';
import { payoutCards, payoutBankTransfers } from '~/utils/filters';

const InputWrapper = styled.div`
  &&& input {
    color: ${({ color }) => color};
  }
`;

const Title = styled.p`
  font-size: 13px;
  font-weight: bold;
`;

const DetailTitle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  ${({ disabled }) =>
    disabled &&
    css`
      ${Title} {
        color: #bbb;
      }
    `};
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 48px;
  ul {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
    li {
      display: grid;
      grid-template-columns: 1.2fr 2fr 2.5fr;
      grid-column-gap: 8px;
      align-items: center;
      font-size: 11px;
      line-height: 16px;
    }
  }

  ${({ disabled }) =>
    disabled &&
    css`
      p {
        color: #bbb;
      }
      select,
      input {
        background: #edeff1 !important;
        color: #bbb !important;
      }
      #add,
      #remove {
        background: #bbb !important;
      }
    `};
`;

const getCashReceiptText = (price) => {
  if (price <= 0) return '';
  return `(*현금영수증 ${price.toLocaleString()})`;
};

const PaymentTitleControl = ({
  disabled,
  title,
  cashReceipt,
  updateReceipt,
}) => {
  return (
    <DetailTitle disabled={disabled}>
      <Title>{title}</Title>
      <Checkbox
        label="현금영수증(계좌이체, 현금)"
        checked={cashReceipt}
        onChange={(e) => updateReceipt(e.target.checked)}
        disabled={disabled}
      />
    </DetailTitle>
  );
};

PaymentTitleControl.propTypes = {
  disabled: PropTypes.bool,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  cashReceipt: PropTypes.bool,
  updateReceipt: PropTypes.func,
};

const PaymentInputBox = ({
  disabled,
  readOnly,
  title = '',
  max = 0,
  totalPaid = 0,
  totalRefund = 0,
  totalCashReceipt = 0,
  // depositAmount = 0,
  cashReceipt = false,
  refundData = [],
  payoutData = [],
  updateReceipt = () => {},
  updateRefundData = () => {},
  updatePayoutData = () => {},
  deletePayoutData = () => {},
  vatFree,
  showPayoutAmount,
  status,
  queued,
  reset,
  allowNegative,
}) => {
  const defaultValue = (method) => {
    return {
      amount: 0,
      refundAmount: 0,
      companyName: '',
      method,
      vatFree,
    };
  };

  const totalUnpaid = useMemo(
    () => max - totalPaid + totalRefund,
    [max, totalPaid, totalRefund]
  );

  const payouts = useMemo(
    () => ({
      card: payoutData.find((v) => v.method === PaymentMethod.card)
        ? payoutData.filter((v) => v.method === PaymentMethod.card)
        : [defaultValue(PaymentMethod.card)],
      bank: payoutData.find((v) => v.method === PaymentMethod.bank)
        ? payoutData.filter((v) => v.method === PaymentMethod.bank)
        : [defaultValue(PaymentMethod.bank)],
      cash:
        payoutData.find((v) => v.method === PaymentMethod.cash) ??
        defaultValue(PaymentMethod.cash),
      deposit:
        payoutData.find((v) => v.method === PaymentMethod.deposit) ??
        defaultValue(PaymentMethod.deposit),
    }),
    [payoutData]
  );

  const updateInput = useCallback(
    (data) => {
      updatePayoutData(data?.idx, { ...data });
      const before = payoutData[data.idx];
      // companyName를 변경한 경우
      if (before && before.companyName !== data.companyName) {
        const matchIndex = refundData.findIndex(
          (v) =>
            v.method === before.method && v.companyName === before.companyName
        );
        if (matchIndex > -1) syncRefundData(matchIndex, data);
      }
    },
    [payouts]
  );

  const resetPayoutData = useCallback(() => {
    payoutData.forEach((v) => {
      updatePayoutData(v.idx, { ...v, amount: 0, refundAmount: 0 });
    });
  }, [payoutData]);

  useEffect(() => {
    if (queued || reset) resetPayoutData();
  }, [queued, reset]);

  const syncRefundData = (targetIndex, syncData) => {
    updateRefundData(
      update(refundData, {
        [targetIndex]: {
          $merge: {
            companyName: syncData.companyName,
          },
        },
      })
    );
  };

  const addInput = (type) => {
    if (disabled || readOnly) return;
    let update = defaultValue(type);
    updateInput(update);
  };

  const removeInput = (idx) => {
    if (disabled || readOnly) return;
    deletePayoutData(idx);
  };

  const payoutCardOptions = useMemo(() => {
    return [...payoutCards, '직접입력'];
  }, []);

  const payoutBankTransferOptions = useMemo(() => {
    return [...payoutBankTransfers, '직접입력'];
  }, []);

  const getUnpaidAmount = () => {
    // 전체환불일 경우
    return status === 'full_refund'
      ? reset || totalUnpaid !== max
        ? totalUnpaid
        : 0
      : queued || status === 'canceled'
      ? reset
        ? totalUnpaid
        : 0
      : totalUnpaid;
  };

  return (
    <>
      <PaymentTitleControl
        title={title}
        cashReceipt={cashReceipt}
        updateReceipt={updateReceipt}
        disabled={disabled}
      />
      <Wrapper disabled={disabled}>
        <ul>
          {payouts.card.map((v, i) => {
            return (
              <CardInput
                key={i}
                type="card"
                label={i === 0 && '카드'}
                value={v}
                selectOptions={payoutCardOptions}
                onEdit={(obj) => {
                  updateInput({ ...v, ...obj });
                }}
                onAdd={
                  payouts.card.length - 1 === i
                    ? () => addInput(PaymentMethod.card)
                    : undefined
                }
                onRemove={
                  payouts.card.length - 1 > i
                    ? () => removeInput(v.idx)
                    : undefined
                }
                max={totalUnpaid}
                disabled={disabled}
                readOnly={readOnly}
              />
            );
          })}
          {payouts.bank.map((v, i) => {
            return (
              <CardInput
                key={i}
                type="bank"
                label={i === 0 && '계좌이체'}
                value={v}
                selectOptions={payoutBankTransferOptions}
                onEdit={(obj) => updateInput({ ...v, ...obj })}
                onAdd={
                  payouts.bank.length - 1 === i
                    ? () => addInput(PaymentMethod.bank)
                    : undefined
                }
                onRemove={
                  payouts.bank.length - 1 > i
                    ? () => removeInput(v.idx)
                    : undefined
                }
                max={totalUnpaid}
                disabled={disabled}
                readOnly={readOnly}
              />
            );
          })}
          <li
            style={{
              gridTemplateColumns: '1.2fr 3fr 1.5fr',
            }}
          >
            {showPayoutAmount ? (
              <>
                <p>총 수납액</p>
                <InputWrapper color="#293142">
                  <TextInput
                    value={`${(
                      totalPaid + totalRefund
                    ).toLocaleString()} ${getCashReceiptText(
                      totalCashReceipt
                    )}`}
                    disabled
                  />
                </InputWrapper>
              </>
            ) : (
              <>
                <p>매출액</p>
                <InputWrapper color={!disabled && '#293142'}>
                  <TextInput
                    value={`${(
                      totalPaid - totalRefund
                    ).toLocaleString()} ${getCashReceiptText(
                      totalCashReceipt
                    )}`}
                    disabled
                  />
                </InputWrapper>
              </>
            )}
          </li>
        </ul>
        <ul
          style={{
            // 예치금 삭제로 인한 임시 스타일: 예치금 추가시 해당 스타일 제거해주세요
            justifyContent: 'flex-end',
          }}
        >
          <li>
            <p>현금</p>
            <PriceInput
              showButton={!readOnly}
              disabled={disabled}
              readOnly={readOnly}
              allowNegative={allowNegative}
              value={payouts.cash.amount - payouts.cash.refundAmount}
              onChange={(v) => {
                let update = {
                  ...payouts.cash,
                  amount: v + payouts.cash.refundAmount,
                };
                updateInput(update);
              }}
              max={
                payouts.cash.amount - payouts.cash.refundAmount + totalUnpaid
              }
              aria-label="CashPaymentField"
            />
          </li>
          {/* <li>
            <p>예치금</p>
            <PriceInput
              value={payouts.deposit.amount}
              onChange={(v) => {
                let update = { ...payouts.deposit, amount: v };
                updateInput(update);
              }}
              max={Math.min(
                depositAmount,
                Math.sign(max - totalPaid) === -1 ? 0 : max - totalPaid
              )}
              readOnly={max + totalPaid <= 0}
              showButton={max + totalPaid > 0}
            />
            <DepositText>
              잔여 예치금: {depositAmount.toLocaleString()}원
            </DepositText>
          </li> */}
          <li>
            <p>미수액</p>
            <InputWrapper color={!disabled && '#ff0000'}>
              <PriceInput value={getUnpaidAmount()} disabled />
            </InputWrapper>
          </li>
        </ul>
      </Wrapper>
    </>
  );
};

PaymentInputBox.propTypes = {
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  title: PropTypes.string,
  max: PropTypes.number,
  depositAmount: PropTypes.number,
  totalPaid: PropTypes.number,
  totalRefund: PropTypes.number,
  totalCashReceipt: PropTypes.number,
  cashReceipt: PropTypes.bool,
  refundData: PropTypes.array,
  payoutData: PropTypes.array,
  updateReceipt: PropTypes.func,
  updateRefundData: PropTypes.func,
  updatePayoutData: PropTypes.func,
  deletePayoutData: PropTypes.func,
  vatFree: PropTypes.bool,
  showPayoutAmount: PropTypes.bool,
  status: PropTypes.string,
  queued: PropTypes.bool,
  reset: PropTypes.bool,
  allowNegative: PropTypes.bool,
};

export default PaymentInputBox;
