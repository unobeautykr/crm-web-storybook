import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { PaymentMethod, PaymentType } from '~/core/PaymentUtil';
import QuillText from '~/components/quill/QuillText';
import PayStatus from './PayStatus';
import { PaymentHoverButton } from './PaymentHoverButton';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DataTable } from '~/components/DataTable/DataTable';
import { EditButton } from '~/components/EditButton';
import { useImperativeModal } from '~/components/providers/ImperativeModalProvider';
import PaymentEditModal from '~/components/modals/payment/PaymentEditModal';
import update from 'immutability-helper';

const InnerTableWrapper = styled.div`
  padding: 8px;
  > table {
    width: max-content;
    overflow: hidden;
    box-shadow: 0 0 5px 1px #dee2eb;
    border-radius: 4px;
    z-index: 0;
    > tr > td {
      padding: 0;
    }
  }
`;

const PaidAmount = styled.span`
  display: inline-block;
  min-width: 48px;
  padding: 4px;
  line-height: 1;
  text-align: center;
  border-radius: 2px;
  flex: 0 0 auto;
  background: #e6eef8;
`;

const ButtonWrapper = styled.div`
  opacity: 0;
  display: none;
  button {
    svg {
      color: #2D2D2D;
      font-size: 12px !important;
    }
`;

const TextWrapper = styled.div`
  display: flex;
  gap: 10px;

  &:hover {
    ${ButtonWrapper} {
      opacity: 1;
      display: contents;
    }
  }
`;
export function PaymentTable({
  loading,
  data,
  sorts,
  checked,
  checkedAll,
  onChangeChecked,
  onChangeSorts,
  onDoubleClickItem,
  collapsed,
  setCollapsed,
  updatePaymnetTableFold,
}) {
  const imperativeModal = useImperativeModal();

  const onChangeCollapsed = (v) => {
    let payload = {
      key: 'paymentTableFold',
    };
    if (v.length === data.length) payload.value = 'off';
    else payload.value = 'on';
    updatePaymnetTableFold(payload);
    setCollapsed(v);
  };

  const onClickEdit = async (item, focusValue) => {
    await imperativeModal.open((close) => {
      return (
        <PaymentEditModal
          id={item.id}
          focusValue={focusValue}
          paidAt={item.paidAt}
          receiver={item.receiver}
          items={item.items}
          onClose={() => {
            close(false);
          }}
        />
      );
    });
  };

  const innerSchema = useMemo(
    () => (cancel) => ({
      columns: [
        {
          id: 'paidAt',
          name: '수납일',
          value: (item) => {
            return (
              <TextWrapper key={item.id}>
                <span>{moment(item.paidAt).format('YYYY-MM-DD')}</span>
                {!item.canceledAt && (
                  <ButtonWrapper onClick={() => onClickEdit(item, 'paidAt')}>
                    <EditButton />
                  </ButtonWrapper>
                )}
              </TextWrapper>
            );
          },
        },
        {
          id: 'type',
          name: '구분',
          value: (item) => {
            const typeMethod = {
              PAYMENT: '수납',
              REFUND: '환불',
              CANCEL: '수납취소',
              CANCEL_PAYMENT: '수납',
              CANCEL_REFUND: '환불',
              PAYMENT_MODIFICATION: '수납수정',
              REFUND_MODIFICATION: '환불수정',
            };
            return typeMethod[item.type];
          },
        },
        {
          id: 'receiverName',
          name: '수납자',
          value: (item) => {
            return (
              <TextWrapper key={item.id}>
                <span>{item.receiver?.name ?? '-'}</span>
                {!item.canceledAt && (
                  <ButtonWrapper onClick={() => onClickEdit(item, 'receiver')}>
                    <EditButton />
                  </ButtonWrapper>
                )}
              </TextWrapper>
            );
          },
        },
        {
          id: 'paymentMethod',
          name: '결제',
          value: ({ items }) => {
            return items.map((v) => PaymentMethod.getName(v.method, true));
          },
        },
        {
          id: 'companyName',
          name: '카드사/은행명',
          value: (item) => {
            return item.items.map((v, i) => (
              <TextWrapper key={i}>
                <span>{v.companyName || '-'}</span>
                {!item.canceledAt && (
                  <ButtonWrapper
                    onClick={() => onClickEdit(item, `companyName-${i}`)}
                  >
                    <EditButton />
                  </ButtonWrapper>
                )}
              </TextWrapper>
            ));
          },
        },
        {
          id: 'amount',
          name: '금액',
          value: (item) => {
            return item.items.map((v) => {
              if (
                item.type === PaymentType.refund ||
                (item.type === PaymentType.refund_modification &&
                  v.amount >= 0) ||
                (item.type === PaymentType.payment_modification && v.amount < 0)
              )
                return (
                  <span
                    style={{
                      color: item.canceledAt ? '#bbb' : '#f7685b',
                      textDecorationLine: item.canceledAt
                        ? 'line-through'
                        : undefined,
                    }}
                  >
                    - {Math.abs(v.amount).toLocaleString()}
                  </span>
                );
              else
                return (
                  <span
                    style={{
                      color: item.canceledAt ? '#bbb' : '#0060ff',
                      textDecorationLine: item.canceledAt
                        ? 'line-through'
                        : undefined,
                    }}
                  >
                    + {Math.abs(v.amount).toLocaleString()}
                  </span>
                );
            });
          },
          style: {
            textAlign: 'left',
          },
        },
        {
          id: 'cashReceipt',
          name: '현금영수증',
          value: (item) => {
            return item.items.map((v, i) => {
              return (
                <TextWrapper key={item.id}>
                  <span>{v.cashReceipt ? '발행' : '미발행'}</span>
                  {!item.canceledAt && (
                    <ButtonWrapper
                      onClick={() => onClickEdit(item, `cashReceipt-${i}`)}
                    >
                      <EditButton />
                    </ButtonWrapper>
                  )}
                </TextWrapper>
              );
            });
          },
        },
        {
          id: 'createdAt',
          name: '생성일 / 작업자',
          sortable: true,
          value: (item) => {
            return `${moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss')} ${
              item.creator.name
            }`;
          },
        },
        {
          id: 'canceledAt',
          name: '취소일 / 작업자',
          value: (item) =>
            item.canceledAt
              ? `${moment(item.canceledAt).format('YYYY-MM-DD HH:mm:ss')} ${
                  item.canceler?.name ?? ''
                }`
              : '-',
        },
      ].filter((v) => (cancel ? v : v.id !== 'canceledAt')),
    }),
    []
  );

  const InnerTable = ({ item }) => {
    const schema = innerSchema(
      Boolean(item.transactions.filter((v) => v.canceledAt).length)
    );
    const [innerSorts, setInnerSorts] = useState({
      id: 'createdAt',
      value: 'desc',
    });

    const onChangeInnerSorts = (id, value) => {
      const sort = update(innerSorts, {
        $set: {
          id,
          value,
        },
      });
      setInnerSorts(sort);
    };

    return (
      <InnerTableWrapper>
        <DataTable
          styleType="chart"
          colorTheme="clear"
          data={item.transactions.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (innerSorts.value === 'asc') {
              return dateA - dateB;
            } else if (innerSorts.value === 'desc') {
              return dateB - dateA;
            } else {
              return 0;
            }
          })}
          schema={schema}
          sorts={[innerSorts]}
          onChangeSorts={onChangeInnerSorts}
        />
      </InnerTableWrapper>
    );
  };

  InnerTable.propTypes = {
    item: PropTypes.object,
  };

  const schema = useMemo(
    () => ({
      columns: [
        [
          {
            id: 'no',
            name: 'No.',
            value: (item) => item.rowIndex,
          },
          {
            id: 'status',
            name: '상태',
            component: (attr) => {
              const { item } = attr;
              return <PayStatus type={item.status} />;
            },
          },
          {
            id: 'date',
            name: '청구일',
            sortable: true,
            value: (item) =>
              moment(item.registration.date).format('YYYY-MM-DD'),
          },
          {
            id: 'categoryName',
            name: '카테고리',
            value: ({ items }) => {
              return items.map((v) =>
                v.type === 'treatment_item'
                  ? v.treatmentItem?.category.name
                  : ''
              );
            },
            style: {
              textAlign: 'left',
              minWidth: '150px',
              whiteSpace: 'initial',
            },
          },
          {
            id: 'name',
            name: '시/수술명(제품명)',
            value: ({ items }) => {
              return items.map((v) => (
                <>
                  {v.type === 'treatment_item'
                    ? v.treatmentItem?.name
                    : v.product?.name}
                  {v.isFree && <div className="ico-service" />}
                </>
              ));
            },
            style: {
              textAlign: 'left',
              minWidth: '200px',
              whiteSpace: 'initial',
            },
          },
          {
            id: 'treatmentCount',
            name: '회차(개수)',
            value: ({ items }) => {
              return items.map((v) =>
                v.type === 'treatment_item' ? v.treatmentCount : v.quantity
              );
            },
          },
          {
            id: 'vatFree',
            name: '과세여부',
            value: ({ items }) => {
              return items.map((v) => (v.vatFree ? '비과세' : '과세'));
            },
          },
          {
            id: 'price',
            name: (
              <>
                금액
                <br />
                (VAT제외)
              </>
            ),
            value: ({ items }) => {
              return items.map((v) => (
                <>
                  {(v.price ?? 0).toLocaleString()}
                  <br />({(v.vatExclusivePrice ?? 0).toLocaleString()})
                </>
              ));
            },
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'discountAmount',
            name: '할인',
            value: ({ items }) => {
              return items.map((v) => (v.discountAmount ?? 0).toLocaleString());
            },
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'requestAmount',
            name: '청구액',
            value: (item) => (item.requestAmount ?? 0).toLocaleString(),
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'paidAmount',
            name: <PaidAmount>매출액</PaidAmount>,
            value: (item) => (item.paidAmount ?? 0).toLocaleString(),
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'payoutAmount',
            name: '수납액',
            value: (item) => (item.payoutAmount ?? 0).toLocaleString(),
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'refundAmount',
            name: '환불액',
            value: (item) => (item.refundAmount ?? 0).toLocaleString(),
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'unpaidAmount',
            name: '미수액',
            value: (item) => (item.unpaidAmount ?? 0).toLocaleString(),
            style: {
              textAlign: 'left',
            },
          },
          {
            id: 'memo',
            name: '메모',
            component: (attr) => {
              const { item } = attr;
              return <QuillText value={item.memo} />;
            },
            grow: true,
            style: {
              wordBreak: 'keep-all',
              textAlign: 'left',
            },
          },
          {
            id: 'consult',
            name: '상담사',
            value: (item) => item.counselor?.name ?? '',
          },
          {
            id: 'manager',
            name: '담당자',
            value: (item) => item.manager?.name ?? '',
          },
        ],
      ],
      collapseColumns: [
        {
          colSpan: 4,
          value: () => '',
        },
        {
          colSpan: '100%',
          component: (attr) => {
            const { item } = attr;
            return <InnerTable item={item} />;
          },
        },
      ],
    }),
    [innerSchema]
  );

  const HoverButton = (attr) => {
    const { item, show } = attr;
    return <PaymentHoverButton show={show} item={item} />;
  };

  return (
    <DataTable
      styleType="chart"
      colorTheme="clear"
      loading={loading}
      data={data}
      schema={schema}
      HoverButton={HoverButton}
      sorts={sorts}
      onChangeSorts={onChangeSorts}
      checked={checked}
      onChangeChecked={onChangeChecked}
      checkedAll={checkedAll}
      collapsed={collapsed}
      onChangeCollapsed={onChangeCollapsed}
      onDoubleClickItem={onDoubleClickItem}
    />
  );
}

PaymentTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  sorts: PropTypes.array,
  checked: PropTypes.array,
  checkedAll: PropTypes.bool,
  onChangeChecked: PropTypes.func,
  onChangeSorts: PropTypes.func,
  onDoubleClickItem: PropTypes.func,
  onChangeSms: PropTypes.func,
  collapsed: PropTypes.array,
  setCollapsed: PropTypes.func,
  updatePaymnetTableFold: PropTypes.func,
};
