import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { phoneNumberFormatHyphen } from '~/utils/filters';
import { DataTable } from '~/components/DataTable/DataTable';
import { CustomerChartLink } from '~/components/DataTable/CustomerChartLink';
import QuillText from '~/components/quill/QuillText';
import { TabType } from '~/core/TabUtil';
import { SmsButton } from './SmsButton';
import moment from 'moment';
import { AppointmentStatus } from '~/core/appointmentStatus';
import { AppointmentType } from '~/core/appointmentType';
import SmsSentSettingButton from './SmsSentSettingButton';

export const AppointmentTable = ({
  data,
  checked,
  setChecked,
  checkedAll,
  orderBy,
  onChangeOrderBy,
}) => {
  const schema = useMemo(
    () => ({
      columns: [
        {
          id: 'startAt',
          name: '예약일시',
          sortable: true,
          value: (item) =>
            `${moment(new Date(item.date)).format('yyyy-MM-dd')} ${
              item.startHour
            } - ${item.endHour}`,
        },
        {
          id: 'Customer.createdAt',
          name: '고객등록일',
          sortable: true,
          value: (item) =>
            moment(new Date(item.customer.createdAt)).format('yyyy-MM-dd'),
        },
        {
          id: 'visitType',
          name: '신/구환',
          value: (item) => (item.visitType === 'NEW' ? '신환' : '구환'),
        },
        {
          id: 'Customer.name',
          name: '고객명',
          sortable: true,
          component: (attr) => {
            const { item } = attr;
            return (
              <CustomerChartLink
                customer={item.customer}
                tab={TabType.appointment}
              />
            );
          },
        },
        {
          id: 'Customer.chartNo',
          name: '차트번호',
          sortable: true,
          value: (item) => item.customer.chartNo,
        },
        {
          id: 'phoneNumber',
          name: '전화번호',
          value: (item) => (
            <>
              {phoneNumberFormatHyphen(item.customer.phoneNumber)}
              {item.customer.phoneNumber && (
                <SmsButton target={item.customer} />
              )}
            </>
          ),
        },
        {
          id: 'status',
          name: '예약상태',
          value: (item) =>
            item.status === AppointmentStatus.registered
              ? '내원'
              : AppointmentStatus.getName(item.status),
        },
        {
          id: 'category',
          name: '예약종류',
          value: (item) => AppointmentType.getName(item.category),
        },
        {
          id: 'departmentCategory',
          name: '부서',
          value: (item) => item.department.category.name,
        },
        {
          id: 'department',
          name: '세부부서',
          value: (item) => item.department.name,
        },
        {
          id: 'acquisitionChannel',
          name: '내원경로',
          value: (item) => item.acquisitionChannel?.name,
        },
        {
          id: 'doctor',
          name: '의사',
          value: (item) => item.doctor?.name,
        },
        {
          id: 'counselor',
          name: '상담사',
          value: (item) => item.counselor?.name,
        },
        {
          id: 'assist',
          name: '어시스트',
          value: (item) => item.assist?.name,
        },
        {
          id: 'categoryName',
          name: '카테고리',
          value: ({ treatmentItems }) => {
            return treatmentItems.map((v) => v.category?.name);
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
          value: ({ treatmentItems }) => {
            return treatmentItems.map((v) => v.name);
          },
          style: {
            textAlign: 'left',
            minWidth: '200px',
            whiteSpace: 'initial',
          },
        },
        {
          id: 'memo',
          name: '예약메모',
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
          id: 'smsSent',
          name: '예약문자',
          component: (attr) => {
            const { item } = attr;
            return <SmsSentSettingButton appointment={item} />;
          },
        },
        {
          id: 'creator',
          name: '작성자',
          value: (item) => item.creator?.name,
        },
        {
          id: 'createdAt',
          name: '작성일',
          value: (item) =>
            moment(new Date(item.createdAt)).format('yyyy-MM-dd HH:mm'),
        },
      ],
    }),
    []
  );

  return (
    <DataTable
      resizable
      data={data}
      schema={schema}
      checked={checked}
      onChangeChecked={setChecked}
      checkedAll={checkedAll}
      sorts={[orderBy]}
      onChangeSorts={(id, value) => onChangeOrderBy({ id, value })}
    />
  );
};

AppointmentTable.propTypes = {
  data: PropTypes.array,
  checked: PropTypes.array,
  setChecked: PropTypes.func,
  checkedAll: PropTypes.bool,
  orderBy: PropTypes.any,
  onChangeOrderBy: PropTypes.func,
};
