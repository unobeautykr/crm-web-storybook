import { useMemo } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import moment from 'moment';
import { DataTable } from '~/components/DataTable/DataTable';
import { translate } from '~/utils/filters';
import { SmsTitleContent } from '~/components/SmsTitleContent';
import { hexToRgbaString } from '~/utils/colorUtil';

const AppointmentInfo = styled.div`
  display: flex;
  font-weight: bold;

  span:first-child {
    &::after {
      font-size: 10px;
      margin: 0 5px;
      content: '|';
    }
  }
`;

const DepartmentName = styled.div`
  max-width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ImmediateSmsPreviewTable = ({ appointment, smsRules }) => {
  const groupId = 'group';
  const translateScheduledAt = (item) => {
    if (item.smsScheduleType === 'immediate') {
      return translate('SMS_SCHEDULE_TYPE_IMMEDIATE');
    }
    if (item.smsScheduleType === 'scheduled') {
      const days = Math.abs(item.daysOffset) === 1 ? 'ONE_DAY' : 'N_DAYS';
      const direction = item.daysOffset < 0 ? 'AGO' : 'LATER';
      const date = translate(`${days}_${direction}`).replace(
        /%s/,
        Math.abs(item.daysOffset)
      );
      const time = item.scheduleTime;
      if (item.daysOffset === 0) return `예약 0일 ${time}`;
      return `예약 ${date} ${time}`;
    }
  };

  const schema = useMemo(
    () => ({
      rows: {
        style: (item) => {
          return css`
            background: ${hexToRgbaString('#EDEFF1', 0.4)};
          `;
        },
      },
      rowGroup: {
        groupId: groupId,
        groupKey: () => groupId,
        groupData: () => Object.assign(appointment, { group: groupId }),
        component: (attr) => {
          const { item } = attr;
          const startAt = item.startAt
            ? moment(new Date(item.startAt)).format('yyyy-MM-dd HH:mm')
            : '';
          return (
            <div>
              <AppointmentInfo>
                <span>예약정보</span>
                <span>{startAt} </span>
                <div style={{ display: 'flex' }}>
                  <DepartmentName>
                    {item.department?.category?.name}
                  </DepartmentName>
                  <span>-</span>
                  <DepartmentName>{item.department?.name}</DepartmentName>
                </div>
              </AppointmentInfo>
            </div>
          );
        },
      },
      columns: [
        {
          id: 'sendOption',
          name: '전송옵션',
          value: (item) => translateScheduledAt(item),
          style: {
            minWidth: '100px',
          },
        },
        {
          id: 'title',
          name: '제목/내용',
          component: (attr) => {
            const { item } = attr;
            return <SmsTitleContent item={item} />;
          },
          grow: true,
        },
      ],
    }),
    []
  );

  return (
    <DataTable
      styleType={'chart'}
      data={smsRules.map((v) => ({ ...v })) ?? []}
      schema={schema}
      expanded={[groupId]}
    />
  );
};

ImmediateSmsPreviewTable.propTypes = {
  appointment: PropTypes.any,
  smsRules: PropTypes.array,
  data: PropTypes.array,
  loading: PropTypes.bool,
};
