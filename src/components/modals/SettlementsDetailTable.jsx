import { useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { currency } from '~/utils/filters';
import { DataTable } from '~/components/DataTable/DataTable';
import hooks from '~/hooks';

const CustomerNameText = styled.span`
  text-overflow: ellipsis;
  white-space: break-spaces;
`;

export const SettlementsDetailTable = ({ loading, data }) => {
  const schema = useMemo(
    () => ({
      headers: [
        {
          id: 'paidAmount',
          name: '수납액',
        },
        {
          id: 'refundAmount',
          name: '환불액',
        },
      ],
      columns: [
        {
          id: 'date',
          name: '일자',
          value: (item) => moment(item.paidAt).format('YYYY.MM.DD'),
        },
        {
          id: 'name',
          name: '고객명',
          component: (attr) => {
            const { item } = attr;
            return (
              <CustomerNameText
                onClick={() => {
                  hooks.openCustomerChartNew({
                    customerId: item.customerId,
                    tab: 'PAYMENT',
                    form: { tab: 'PAYMENT' },
                  });
                }}
              >
                {item.name}
              </CustomerNameText>
            );
          },
          style: {
            textDecoration: 'underline',
            color: '#2C62F6',
            cursor: 'pointer',
          },
        },
        {
          id: 'actualAmount',
          name: '매출액',
          value: (item) => currency(item.actualAmount),
        },
        {
          id: 'paidAmount',
          name: '총 수납액',
          parentHeader: 'paidAmount',
          value: (item) => currency(item.paidAmount),
        },
        {
          id: 'creditCardAmount',
          name: '카드',
          parentHeader: 'paidAmount',
          value: (item) => currency(item.creditCardAmount),
        },
        {
          id: 'bankTransferAmount',
          name: '계좌이체',
          parentHeader: 'paidAmount',
          value: (item) => currency(item.bankTransferAmount),
        },
        {
          id: 'cashAmount',
          name: '현금',
          parentHeader: 'paidAmount',
          value: (item) => currency(item.cashAmount),
        },
        {
          id: 'refundAmount',
          name: '총 환불액',
          parentHeader: 'refundAmount',
          value: (item) => currency(item.refundAmount),
        },
        {
          id: 'refundCreditCardAmount',
          name: '카드',
          parentHeader: 'refundAmount',
          value: (item) => currency(item.refundCreditCardAmount),
        },
        {
          id: 'refundBankTransferAmount',
          name: '계좌이체',
          parentHeader: 'refundAmount',
          value: (item) => currency(item.refundBankTransferAmount),
        },
        {
          id: 'refundCashAmount',
          name: '현금',
          parentHeader: 'refundAmount',
          value: (item) => currency(item.refundCashAmount),
        },
        {
          id: 'cashReceiptAmount',
          name: '현금영수증',
          value: (item) => currency(item.cashReceiptAmount),
        },
      ],
    }),
    []
  );

  return (
    <DataTable
      placeholder="조회 내역이 없습니다."
      loading={loading}
      data={data ?? []}
      schema={schema}
    />
  );
};

SettlementsDetailTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
};
