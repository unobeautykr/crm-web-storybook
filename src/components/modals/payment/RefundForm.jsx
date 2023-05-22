import { useForm, useFormState, Controller } from 'react-hook-form';
import { useFetch } from 'use-http';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { observer } from 'mobx-react';
import update from 'immutability-helper';

import Layout from '../Layout';
import Label, { LabelWrapper } from '~/components/Label2';
import DateSelect from '~/components/DateSelect';
import CreatedSelect from '~/components/crm/customer-chart/CreatedSelect';
import Memo from '~/components/crm/customer-chart/Memo';
import RefundDetail from '~/components/crm/customer-chart/payment/RefundDetail';
import { toHexColorHtml } from '~/components/quill/quillUtil';
import { PaymentType } from '~/core/PaymentUtil';
import { Button } from '~/components/Button';

import { useSnackbarContext } from '~/components/providers/SnackbarProvider';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  width: 800px;
  padding: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 8px;
`;

function getTransactionItems(payment, paymentTypes) {
  return payment.transactions
    .filter((v) => !v.canceledAt)
    .filter((t) => paymentTypes.includes(t.type))
    .map((t) => t.items)
    .flat();
}

function sortToTheBackCash(targets) {
  let items = targets;
  if (targets.filter((f) => f.method === 'CASH').length > 0) {
    const cashTargets = targets.filter((f) => f.method === 'CASH');
    items = targets.filter((f) => f.method !== 'CASH').concat([...cashTargets]);
  }

  return items;
}

function getRefundTargets(payment) {
  const paymentItems = sortToTheBackCash(
    getTransactionItems(payment, [
      PaymentType.payment,
      PaymentType.payment_modification,
    ])
  );

  const refundItems = sortToTheBackCash(
    getTransactionItems(payment, [
      PaymentType.refund,
      PaymentType.refund_modification,
    ])
  );

  let targets = [];

  function findTarget(vatFree, method, companyName) {
    let found = targets.find(
      (t) =>
        t.vatFree === vatFree &&
        t.method === method &&
        t.companyName === companyName
    );

    if (!found) {
      found = {
        vatFree,
        method,
        companyName,
        amount: 0,
        refundAmount: 0,
        cashReceiptAmount: 0,
      };

      targets.push(found);
    }

    return found;
  }

  for (const pi of paymentItems) {
    const target = findTarget(pi.vatFree, pi.method, pi.companyName);
    target.amount += pi.amount;
    if (pi.cashReceipt) target.cashReceiptAmount += pi.amount;
  }
  for (const pi of refundItems) {
    const target = findTarget(pi.vatFree, pi.method, pi.companyName);
    target.amount -= pi.amount;
    if (pi.cashReceipt) target.cashReceiptAmount -= pi.amount;
  }

  return targets;
}

const RefundForm = ({ options, close, payment }) => {
  const snackbar = useSnackbarContext();
  const { paymentId } = options;
  const { put: putPayment } = useFetch(`/payments/${paymentId}`);
  const { post: postPayouts } = useFetch('/payment_transactions');

  const { user } = { user: {} };

  const { control, getValues, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      paidAt: moment(),
      manager: user.id,
      memo: payment.memo ?? '',
      refunds: getRefundTargets(payment),
    },
  });

  const { isSubmitting } = useFormState({
    control,
  });

  const watchRefunds = watch('refunds');

  const onReset = () => {
    setValue('refunds', getRefundTargets(payment));
    setValue('paidAt', moment());
    setValue('manager', payment.creator?.id);
    setValue('memo', payment.memo);
  };

  const convertRefuntData = (refunds) => {
    let totalCashReceiptAmount = refunds.reduce(
      (a, b) => a + b.cashReceiptAmount,
      0
    );
    return refunds
      .filter((v) => v.refundAmount)
      .map((r) => {
        // 현금영수증 총 발행금보다 환불액이 큰 경우, 쪼개서 환불
        let cashReceiptAmount = totalCashReceiptAmount;
        let diffCashReceiptAmount = r.refundAmount - cashReceiptAmount;
        if (
          r.method !== 'CARD' &&
          cashReceiptAmount > 0 &&
          diffCashReceiptAmount > 0
        ) {
          totalCashReceiptAmount = 0;
          return [
            {
              vatFree: r.vatFree,
              method: r.method,
              companyName: r.companyName,
              amount: cashReceiptAmount,
              cashReceipt: true,
            },
            {
              vatFree: r.vatFree,
              method: r.method,
              companyName: r.companyName,
              amount: diffCashReceiptAmount,
              cashReceipt: false,
            },
          ];
        } else {
          if (r.method !== 'CARD') {
            totalCashReceiptAmount -= r.refundAmount;
          }
          return {
            vatFree: r.vatFree,
            method: r.method,
            companyName: r.companyName,
            amount: r.refundAmount,
            cashReceipt:
              r.method === 'CARD'
                ? false
                : r.refundAmount && r.refundAmount <= cashReceiptAmount,
          };
        }
      })
      .flat();
  };

  const onSave = async () => {
    const data = getValues();
    if (data.refunds.every((refund) => refund.refundAmount === 0)) {
      snackbar.open('alert', '환불액을 입력해주세요.');
      return;
    }

    if (
      data.refunds.filter((v) => v.vatFree).reduce((a, b) => a + b.amount, 0) <
        data.refunds
          .filter((v) => v.vatFree)
          .reduce((a, b) => a + b.refundAmount, 0) ||
      data.refunds.filter((v) => !v.vatFree).reduce((a, b) => a + b.amount, 0) <
        data.refunds
          .filter((v) => !v.vatFree)
          .reduce((a, b) => a + b.refundAmount, 0)
    ) {
      snackbar.open('alert', '총 수납액을 초과하여 환불할 수 없습니다.');
      return;
    }

    await putPayment({
      managerId: data.manager,
      memo: toHexColorHtml(data.memo),
    });
    if (convertRefuntData(data.refunds).length > 0) {
      await postPayouts({
        items: convertRefuntData(data.refunds),
        memo: toHexColorHtml(data.memo),
        paidAt: moment(data.paidAt).format('YYYY-MM-DD'),
        paymentId: paymentId,
        type: 'REFUND',
      });
    }

    options.onUpdate();
    close();
  };

  function onChangeRefund(refund, v) {
    const index = watchRefunds.indexOf(refund);
    if (index === -1) {
      setValue(
        'refunds',
        watchRefunds.concat({
          ...refund,
          refundAmount: v,
        })
      );
    } else {
      setValue(
        'refunds',
        update(watchRefunds, { [index]: { refundAmount: { $set: v } } })
      );
    }
  }

  return (
    <>
      <Layout title="환불" close={() => close()}>
        <Body>
          <RefundDetail refunds={watchRefunds} onChange={onChangeRefund} />
          <LabelWrapper column={4}>
            <Label text="환불일" isRequire>
              <Controller
                name="paidAt"
                control={control}
                render={({ field }) => (
                  <DateSelect
                    value={field.value}
                    onChange={field.onChange}
                    isRequire
                  />
                )}
              />
            </Label>
            <Label text="담당자">
              <Controller
                name="manager"
                control={control}
                render={({ field }) => <CreatedSelect {...field} />}
              />
            </Label>
          </LabelWrapper>
          <Label text="수납메모">
            <Controller
              name="memo"
              control={control}
              render={({ field }) => (
                <Memo
                  value={field.value}
                  onChange={field.onChange}
                  tabName="payments"
                />
              )}
            />
          </Label>

          <ButtonWrapper>
            <Button styled="outline" color="secondary" onClick={onReset}>
              초기화
            </Button>
            <Button styled="outline" color="mix" onClick={() => close()}>
              취소
            </Button>
            <Button onClick={handleSubmit(onSave)} disabled={isSubmitting}>
              환불완료
            </Button>
          </ButtonWrapper>
        </Body>
      </Layout>
    </>
  );
};

RefundForm.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
  payment: PropTypes.object,
};

export default observer(RefundForm);
