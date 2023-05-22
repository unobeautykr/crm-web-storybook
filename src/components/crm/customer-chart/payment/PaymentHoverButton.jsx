import { useContext } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useFetch } from 'use-http';
import { useDialog } from '~/hooks/useDialog';
import { useModal } from '~/hooks/useModal';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { TabType } from '~/core/TabUtil';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { convertPaymentFormData } from '~/utils/convertFormData';
import { ConfirmModal } from '~/components/modals/common/ConfirmModal';
import UnpaidModal from '~/components/modals/payment/UnpaidModal';
import RefundModal from '~/components/modals/payment/RefundModal';
import { ReactComponent as CancelIcon } from '@ic/cancel.svg';
import { ReactComponent as EditIcon } from '@ic/edit.svg';
import { ReactComponent as RefundIcon } from '@ic/refund.svg';

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
  width: auto;
  height: 30px;
  background: rgba(58, 58, 58, 90%);
  border-radius: 4px;
  padding: 4px;
`;

const TextButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #fff;
  padding: 2px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-sizing: border-box;
  border-radius: 2px;
  font-size: 11px;
  font-weight: 500;
  svg {
    width: 13px;
    height: 13px;
  }
`;

const statusName = {
  full_refund: '전체환불',
  part_refund: '부분환불',
  canceled: '수납취소',
  queued: '수납대기',
  paid: '완납',
  unpaid: '미수',
};

export const PaymentHoverButton = ({ show, item }) => {
  const { openForm, reloadChart } = useContext(CustomerChartContext);
  const snackbar = useSnackbarContext();
  const confirmDialog = useDialog();
  const modal = useModal();
  const { put, response } = useFetch(`/payments/${item.id}`);

  const openUnpaidModal = () => {
    switch (item.status) {
      case 'part_refund':
      case 'full_refund':
      case 'canceled':
      case 'queued':
        snackbar.open(
          'alert',
          `${statusName[item.status]} 상태에서는 미수수납을 할 수 없습니다.`
        );
        return;

      case 'paid':
        snackbar.open('alert', '수납이 완료되어 미수수납을 할 수 없습니다.');
        return;

      default:
        break;
    }

    modal.custom({
      component: UnpaidModal,
      options: {
        paymentId: item.id,
        onUpdate: () => reloadChart(TabType.payment),
      },
    });
  };

  const openRefundModal = () => {
    if (item.status === 'canceled' || item.status === 'queued') {
      snackbar.alert('환불가능한 금액이 없습니다.');
      return;
    }

    //0원 완납, 전액미수, 전체환불 인 경우 환불 지원 불가
    if (
      (item.status === 'paid' && item.payoutAmount === 0) ||
      (item.status === 'unpaid' && item.unpaidAmount === item.requestAmount)
    ) {
      snackbar.alert('환불가능한 금액이 없어 수납취소로 처리하세요.');
      return;
    }
    if (item.status === 'full_refund') {
      if (
        moment(moment(item.registration.date).format('YYYY-MM-DD')).isBefore(
          moment().subtract(2, 'days'),
          'day'
        )
      ) {
        snackbar.alert('환불가능한 금액이 없습니다.');
        return;
      } else {
        snackbar.alert('환불가능한 금액이 없어 수납취소로 처리하세요.');
        return;
      }
    }

    //그 외 환불 지원
    modal.custom({
      component: RefundModal,
      options: {
        paymentId: item.id,
        onUpdate: () => reloadChart(TabType.payment),
      },
    });
  };

  const onClickCancel = () => {
    if (item.status === 'canceled' || item.status === 'queued') {
      snackbar.alert('수납취소할 내역이 없습니다.');
      return;
    }

    // 오늘을 포함한 3일이내 수납내역만 취소가능
    if (
      moment(moment(item.registration.date).format('YYYY-MM-DD')).isBefore(
        moment().subtract(2, 'days'),
        'day'
      )
    ) {
      //3일초과시 수납취소 불가
      //예외케이스 1. 0원 완납, 전액미수인 경우 수납취소 지원
      if (
        (item.status === 'paid' && item.payoutAmount === 0) ||
        (item.status === 'unpaid' && item.unpaidAmount === item.requestAmount)
      ) {
        confirmDialog.open();
        return;
      }

      //예외케이스 2. 전체환불인 경우
      if (item.status === 'full_refund') {
        snackbar.alert('수납취소할 내역이 없습니다.');
        return;
      }

      //그 외에는 불가
      snackbar.alert('환불 후 수납처리하세요.');
    } else {
      confirmDialog.open();
    }
  };

  const onCancel = async () => {
    confirmDialog.close();
    await put({
      status: 'canceled',
    });
    if (response.ok) {
      snackbar.success('수납취소 처리되었습니다.');
      reloadChart(TabType.payment);
    }
  };

  if (!show) return null;
  return (
    <>
      <ConfirmModal
        open={confirmDialog.opened}
        onClose={confirmDialog.close}
        onConfirm={onCancel}
      >
        전체 수납(미수)취소 처리됩니다.
      </ConfirmModal>

      <ButtonWrapper>
        <TextButton
          onClick={() => openForm(convertPaymentFormData(item), item)}
        >
          <EditIcon />
          수납처리
        </TextButton>
        <TextButton onClick={onClickCancel}>
          <CancelIcon />
          수납취소
        </TextButton>
        <TextButton onClick={openRefundModal}>
          <RefundIcon />
          환불
        </TextButton>
        <TextButton onClick={openUnpaidModal}>
          <EditIcon />
          미수수납
        </TextButton>
      </ButtonWrapper>
    </>
  );
};

PaymentHoverButton.propTypes = {
  show: PropTypes.bool,
  item: PropTypes.object,
};
