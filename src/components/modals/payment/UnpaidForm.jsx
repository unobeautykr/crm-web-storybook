import { useEffect } from 'react';
import { useForm, useFormState, Controller } from 'react-hook-form';
import { useFetch } from 'use-http';
import { observer } from 'mobx-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';

import Layout from '../Layout';
import PaymentDetail from '~/components/crm/customer-chart/payment/PaymentDetail';
import Label, { LabelWrapper } from '~/components/Label2';
import DateSelect from '~/components/DateSelect';
import CreatedSelect from '~/components/crm/customer-chart/CreatedSelect';
import Memo from '~/components/crm/customer-chart/Memo';
import { usePayout } from '~/hooks/usePayout';
import { toHexColorHtml } from '~/components/quill/quillUtil';
import { useDataEvent } from '~/hooks/useDataEvent';
import { EventType } from '~/store/dataEvent';
import { Button } from '~/components/Button';

const Body = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
  padding: 16px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 8px;
`;

const UnpaidForm = ({ options, close, payment }) => {
  const { paymentId } = options;

  const {
    setInit: setOriginalInit,
    payoutList: originalPayoutList,
    refundList: originalRefundList,
  } = usePayout();
  const {
    setInit,
    payoutList,
    cashReceiptAmount,
    updatePayoutList,
    deletePayoutList,
    cashReceipt,
    updateReceipt,
    getResult,
  } = usePayout();

  useEffect(() => {
    if (payment) {
      setOriginalInit(payment.transactions);
      setInit([]);
    }
  }, [payment]);

  const { user } = { user: {} };
  const snackbar = useSnackbarContext();
  const dataEvent = useDataEvent();

  const { control, getValues, handleSubmit } = useForm({
    defaultValues: Object.assign({
      paidAt: moment(),
      manager: user.id,
      memo: payment.memo ?? '',
    }),
  });

  const { isSubmitting } = useFormState({
    control,
  });

  const { put: putPayment } = useFetch(`/payments/${paymentId}`);
  const { post: postPayouts } = useFetch('/payment_transactions');

  // 미수금액 계산
  const getTotalData = () => {
    const items = payment.items;
    const total = {
      vat: items
        .filter((v) => !v.vatFree)
        .map((v) => v.price - (v.discountAmount ?? 0))
        .reduce((a, b) => a + b, 0),
      vatFree: items
        .filter((v) => v.vatFree)
        .map((v) => v.price - (v.discountAmount ?? 0))
        .reduce((a, b) => a + b, 0),
    };

    const paid = {
      vat: (originalPayoutList?.vat ?? []).reduce((a, b) => a + b.amount, 0),
      vatFree: (originalPayoutList?.vatFree ?? []).reduce(
        (a, b) => a + b.amount,
        0
      ),
    };

    const refund = {
      vat: (originalRefundList?.vat ?? []).reduce(
        (a, b) => a + b.amount + (b.refundAmount ?? 0),
        0
      ),
      vatFree: (originalRefundList?.vatFree ?? []).reduce(
        (a, b) => a + b.amount + (b.refundAmount ?? 0),
        0
      ),
    };

    return {
      vat: total.vat - paid.vat + refund.vat,
      vatFree: total.vatFree - paid.vatFree + refund.vatFree,
    };
  };

  const validator = () => {
    let total = getTotalData();
    let payoutTotal = getResult().payout.reduce((a, b) => a + b.amount, 0);
    if (total.vat + total.vatFree < payoutTotal) {
      snackbar.open('alert', '청구 금액 초과');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validator()) return;
    let { manager, memo, paidAt } = getValues();
    await putPayment({
      managerId: manager,
      memo: toHexColorHtml(memo),
    });
    if (getResult().payout.length > 0) {
      await postPayouts({
        items: getResult().payout,
        memo: toHexColorHtml(memo),
        paidAt: moment(paidAt).format('YYYY-MM-DD'),
        paymentId: paymentId,
        type: 'PAYMENT',
      });
    }
    dataEvent.emit(EventType.PAYMENT_SUMMARY_API);

    close();
    options.onUpdate();
  };

  return (
    <Layout title="미수수납" width={820} close={() => close()}>
      <Body>
        <PaymentDetail
          customerId={payment.customer.id}
          items={payment.items}
          cashReceipt={cashReceipt}
          refundData={{ vat: [], vatFree: [] }}
          payoutData={payoutList}
          cashReceiptData={cashReceiptAmount}
          totalData={getTotalData()}
          updateReceipt={updateReceipt}
          updatePayoutData={updatePayoutList}
          deletePayoutData={deletePayoutList}
          showPayoutAmount
        />
        <LabelWrapper column={5}>
          <Label text="수납일" isRequire>
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
          <Button styled="outline" color="mix" onClick={() => close()}>
            취소
          </Button>
          <Button onClick={handleSubmit(onSave)} disabled={isSubmitting}>
            수납완료
          </Button>
        </ButtonWrapper>
      </Body>
    </Layout>
  );
};

UnpaidForm.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
  payment: PropTypes.object,
};

export default observer(UnpaidForm);
