import { useMemo } from 'react';
import { styled, css } from '@mui/material/styles';
import PropTypes from 'prop-types';
import moment from 'moment';

import { hexToRgbaString } from '~/utils/colorUtil';
import { smsStatus } from '~/utils/smsStatusUtil';
import { SmsTitleContent } from '~/components/SmsTitleContent';
import { CollapseButton } from '~/components/DataTable/CollapseButton';
import { DataTable } from '~/components/DataTable/DataTable';
import { Tooltip } from '~/components/Tooltip';
import { ScheduledSmsStatus } from './ScheduledSmsStatus';

const CreateInfoWrapper = styled('div')`
  display: flex;
  width: 145px;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
`;

const CreatorName = styled('div')`
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AppointmentInfo = styled('div')(
  ({ expanded }) => `
  display: flex;
  ${
    expanded
      ? `
      font-weight: bold;
    `
      : ''
  }

  span:first-child {
    &::after {
      font-size: 10px;
      margin: 0 5px;
      content: '|';
    }
  }
`
);

const DepartmentName = styled('div')`
  max-width: 105px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const GroupRow = styled('div')`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 2px;
`;

const SendOption = ({ item, data, groupKey }) => {
  const { ruleHistory } = item;
  const { smsScheduleType, daysOffset, scheduleTime } = ruleHistory;
  let text = '';
  if (smsScheduleType === 'scheduled') {
    if (daysOffset === 0) {
      text = `예약일 ${scheduleTime}`;
    } else {
      text = `예약 ${Math.abs(daysOffset)}일 ${
        daysOffset > 0 ? '후' : '전'
      } ${scheduleTime}`;
    }
  } else {
    text = '즉시전송';
  }

  const appointment = data.find((f) => f.id === item[groupKey]);

  const tooltipText =
    ruleHistory.smsScheduleType === 'scheduled' &&
    appointment &&
    moment(new Date(appointment.startAt))
      .subtract((ruleHistory.daysOffset ?? 0) * -1, 'days')
      .format(`yyyy-MM-dd ${ruleHistory.scheduleTime}`);

  return tooltipText ? (
    <Tooltip title={tooltipText}>
      <span>{text}</span>
    </Tooltip>
  ) : (
    <span>{text}</span>
  );
};

SendOption.propTypes = {
  item: PropTypes.object,
  data: PropTypes.array,
  groupKey: PropTypes.string,
};

export const ScheduledSmsTable = ({
  groupData,
  sessionId,
  loading,
  load,
  data,
  expanded,
  onChangeExpanded,
}) => {
  const getAppointment = (id) => {
    return groupData.find((f) => f.id === id);
  };

  const schema = useMemo(
    () => ({
      rows: {
        style: (item) => {
          if (expanded.includes(item.id)) {
            return css`
              background: ${hexToRgbaString('#EDEFF1', 0.4)};

              td {
                border-top: solid 1px
                  ${({ theme }) => theme && theme.color.grey[500]};
              }
            `;
          }

          const children = data.filter((f) =>
            expanded.includes(f.sessionHistoryId)
          );

          if (children.find((f) => f.id === item.id)) {
            return css`
              background: ${hexToRgbaString('#EDEFF1', 0.4)};

              ${item.id === children[children.length - 1]?.id &&
              item?.sessionHistoryId ===
                children[children.length - 1]?.sessionHistoryId &&
              css`
                td {
                  border-bottom: solid 1px
                    ${({ theme }) => theme && theme.color.grey[500]};
                }
              `}
            `;
          }
        },
      },
      rowGroup: {
        groupId: 'id',
        groupKey: (attr) => attr.sessionHistoryId,
        groupData: (key) => getAppointment(key),
        component: (attr) => {
          const { item } = attr;
          const startAt = item.startAt
            ? moment(new Date(item.startAt)).format('yyyy-MM-dd HH:mm')
            : '';
          return (
            <GroupRow
              onClick={() => {
                if (expanded.includes(item.id)) {
                  onChangeExpanded(expanded.filter((f) => f !== item.id));
                } else {
                  onChangeExpanded(expanded.concat(item.id));
                }
              }}
            >
              <AppointmentInfo expanded={expanded.includes(item.id)}>
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
              <div>
                <CollapseButton
                  collapsed={expanded.find((f) => f === item.id)}
                />
              </div>
            </GroupRow>
          );
        },
      },
      columns: [
        {
          id: 'scheuledAt',
          name: '등록일시/등록자',
          component: (attr) => {
            const { item } = attr;
            const createdAt = item.createdAt
              ? moment(new Date(item.createdAt)).format('yyyy-MM-dd HH:mm')
              : '';
            return (
              <CreateInfoWrapper>
                <div>{createdAt}</div>
                <CreatorName>{item?.creator?.name ?? ''}</CreatorName>
              </CreateInfoWrapper>
            );
          },
          headerStyle: {
            '> span': { width: '150px' },
          },
        },
        {
          id: 'option',
          name: '전송옵션',
          component: (attr) => {
            const { item } = attr;
            return (
              <SendOption
                item={item}
                data={groupData}
                groupKey="sessionHistoryId"
              />
            );
          },
          headerStyle: {
            '> span': { width: '95px' },
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
          style: {
            height: '72px',
            padding: '8px',
          },
        },
        {
          id: 'scheduledAt',
          name: '전송시간',
          component: (attr) => {
            const { item } = attr;
            const status = item.status.toUpperCase();
            if (
              status === smsStatus.on_progress ||
              status === smsStatus.success ||
              status === smsStatus.failure
            ) {
              return item?.scheduledAt
                ? moment(new Date(item.scheduledAt)).format(
                    'yyyy-MM-dd HH:mm:ss'
                  )
                : '';
            }
            return '';
          },
          headerStyle: {
            '> span': { width: '120px' },
          },
        },
        {
          id: 'status',
          name: '전송상태',
          component: (attr) => {
            const { item } = attr;
            return (
              item.status && (
                <ScheduledSmsStatus
                  sessionId={sessionId}
                  item={item}
                  data={groupData}
                  load={load}
                />
              )
            );
          },
          headerStyle: {
            '> span': { width: '70px' },
          },
        },
      ],
    }),
    [expanded, groupData, data]
  );

  return (
    <DataTable
      styleType={'chart'}
      data={data ?? []}
      loading={loading}
      schema={schema}
      expanded={expanded}
    />
  );
};

ScheduledSmsTable.propTypes = {
  groupData: PropTypes.array,
  sessionId: PropTypes.number,
  loading: PropTypes.bool,
  load: PropTypes.func,
  data: PropTypes.array,
  expanded: PropTypes.array,
  onChangeExpanded: PropTypes.func,
};
