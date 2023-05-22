import { useMemo } from 'react';
import QuillText from '~/components/quill/QuillText';
import moment from 'moment';
import { DataTable } from '~/components/DataTable/DataTable';
import { EditButton } from '~/components/EditButton';
import { CustomerPenChartLink } from './CustomerPenChartLink';
import PropTypes from 'prop-types';
import { LinkedPaymentButton } from './LinkedPaymentButton';
import { ChartType } from '~/core/chartType';

export function ConsultingTable({
  loading,
  data,
  sorts,
  checked,
  onChangeChecked,
  onChangeSorts,
  onDoubleClickItem,
  onClickEdit,
  customerId,
}) {
  const schema = useMemo(
    () => ({
      columns: [
        {
          id: 'edit',
          component: (attr) => {
            const { item } = attr;
            return <EditButton onClick={() => onClickEdit(item)} />;
          },
        },
        {
          id: 'no',
          name: 'No.',
          value: (item) => item.rowIndex,
        },
        {
          id: 'date',
          name: '일자',
          sortable: true,
          value: (item) => moment(item.registration.date).format('YYYY-MM-DD'),
        },
        {
          id: 'memo',
          name: '상담내용',
          component: (attr) => {
            const { item } = attr;
            return <QuillText value={item.memo} />;
          },
          grow: true,
          style: {
            textAlign: 'left',
          },
        },
        {
          id: 'counselor',
          name: '상담사',
          value: (item) => item.registration.counselor?.name ?? '',
          style: {
            minWidth: '50px',
          },
        },
        {
          id: 'categoryName',
          name: '카테고리',
          value: ({ items }) => {
            return items.map((v) => v.category?.name ?? '');
          },
          style: {
            textAlign: 'left',
            minWidth: '150px',
            whiteSpace: 'initial',
          },
        },
        {
          id: 'itemsName',
          name: '시/수술명',
          value: ({ items }) => {
            return items.map((v) => v.name);
          },
          style: {
            textAlign: 'left',
            minWidth: '200px',
            whiteSpace: 'initial',
          },
        },
        {
          id: 'linkedPayment',
          name: '수납내역',
          component: (attr) => {
            const { item } = attr;
            return (
              <LinkedPaymentButton
                payment={item.registration.payments[0]}
                registration={item.registration}
                chartId={item.id}
                chartType={ChartType.CONSULTING}
              />
            );
          },
        },
        {
          id: 'result',
          name: '상담결과',
          value: (item) => {
            return item.result?.name;
          },
        },
        {
          id: 'penchart',
          name: '펜차트',
          component: (attr) => {
            const { item } = attr;
            return (
              <CustomerPenChartLink
                directory={item.directory}
                fileCount={item.fileCnt}
              />
            );
          },
        },
      ],
    }),
    []
  );

  return (
    <DataTable
      styleType={'chart'}
      loading={loading}
      data={data}
      schema={schema}
      sorts={sorts}
      onChangeSorts={onChangeSorts}
      checked={checked}
      onChangeChecked={onChangeChecked}
      onDoubleClickItem={onDoubleClickItem}
    />
  );
}

ConsultingTable.propTypes = {
  loading: PropTypes.bool,
  data: PropTypes.array,
  sorts: PropTypes.array,
  checked: PropTypes.array,
  onChangeChecked: PropTypes.func,
  onChangeSorts: PropTypes.func,
  onDoubleClickItem: PropTypes.func,
  onClickEdit: PropTypes.func,
  customerId: PropTypes.number,
};
