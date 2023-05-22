import { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import moment from 'moment';
import { smsInvalidReason, smsFailReason } from '~/utils/smsReasonUtil';
import { smsStatus } from '~/utils/smsStatusUtil';
import { Tooltip } from '~/components/Tooltip';
import { Button } from '~/components/Button';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { ReactComponent as Spinner } from '@ic/ic-spinner.svg';
import { ReactComponent as NotiIcon } from '@ic/common/ic-noti-blue-16.svg';

import { useApi } from '~/components/providers/ApiProvider';

const StatusWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MarkWrapper = styled('div')(
  ({ theme }) => `
  display: flex;
  justify-content: center;
  svg {
    path {
      fill: ${theme.color.common.red};
    }
  }
`
);

const smsScheduleType = {
  immediate: 'immediate',
};

const sendType = {
  resend: 'resend',
  send: 'send',
};

export const ScheduledSmsStatus = ({ sessionId, item, data, load }) => {
  const [disabled, setDisabled] = useState(false);
  const status = item.status.toUpperCase();

  const { sessionSmsApi, smsSendTaskApi } = useApi();
  const snackbar = useSnackbarContext();

  const onClickSendTask = async (ruleId, type) => {
    let msg = '전송예약 되었습니다.';
    if (
      type === sendType.resend ||
      item.ruleHistory.smsScheduleType === smsScheduleType.immediate
    ) {
      msg = '재전송 되었습니다.';
    }
    setDisabled(true);

    try {
      await sessionSmsApi.createSessionSms({
        sessionId: sessionId,
        ruleId: ruleId,
      });
      snackbar.success(msg);
    } catch (e) {
      snackbar.alert('이미 전송되었거나 전송 가능한 시간이 지났습니다.');
    } finally {
      load();
    }
  };

  const onClickTaskCancel = async (taskId) => {
    setDisabled(true);
    try {
      await smsSendTaskApi.createSmsSendTaskCancel({
        taskId: taskId,
      });
      snackbar.success('전송취소 되었습니다.');
    } catch (e) {
      snackbar.alert('전송취소를 실패했습니다.');
      throw e;
    } finally {
      load();
    }
  };

  const getCanceledTooltipText = () => {
    const canceledAt = item?.canceledAt
      ? moment(new Date(item?.canceledAt)).format('yyyy-MM-dd HH:mm:ss')
      : '';
    const tooltipText = (
      <>
        <div>취소일시 : {canceledAt}</div>
        <div>취소자 : {item?.canceler ?? ''}</div>
      </>
    );
    return tooltipText;
  };

  const validateToShowButton = () => {
    const appointment = data.find((f) => f.id === item['sessionHistoryId']);
    const { ruleHistory } = item;
    const date = moment(new Date(appointment.startAt))
      .subtract((ruleHistory.daysOffset ?? 0) * -1, 'days')
      .format(`yyyy-MM-dd ${ruleHistory.scheduleTime ?? 'HH:mm'}`);
    return new Date() < new Date(date);
  };

  const ProgressSpinner = () => {
    return (
      <StatusWrapper>
        <div>
          <Spinner />
        </div>
        <span>전송중</span>
      </StatusWrapper>
    );
  };

  switch (status) {
    case smsStatus.success:
      return (
        <div>
          <span>전송성공</span>
        </div>
      );
    case smsStatus.canceled: {
      return (
        <StatusWrapper>
          <Tooltip title={getCanceledTooltipText()}>
            <MarkWrapper>
              <NotiIcon />
            </MarkWrapper>
          </Tooltip>
          <span>전송취소</span>
          {item.resendAvailable && (
            <Button
              size="xs"
              styled="outline"
              color="green"
              disabled={disabled}
              onClick={() => onClickSendTask(item.ruleId, sendType.send)}
            >
              전송예약
            </Button>
          )}
        </StatusWrapper>
      );
    }
    case smsStatus.pending: {
      if (item.ruleHistory.smsScheduleType === smsScheduleType.immediate) {
        return <ProgressSpinner />;
      }
      return (
        <StatusWrapper>
          <span>전송대기</span>
          {validateToShowButton() && (
            <Button
              size="xs"
              styled="outline"
              color="alert"
              disabled={disabled}
              onClick={() => onClickTaskCancel(item.taskId)}
            >
              전송취소
            </Button>
          )}
        </StatusWrapper>
      );
    }
    case smsStatus.on_progress:
      return <ProgressSpinner />;
    case smsStatus.failure: {
      return (
        <StatusWrapper>
          <Tooltip title={smsFailReason.getFailReason(item.failReason)}>
            <MarkWrapper>
              <NotiIcon />
            </MarkWrapper>
          </Tooltip>
          <span>전송실패</span>
          {item.ruleHistory.smsScheduleType === smsScheduleType.immediate &&
            validateToShowButton() && (
              <Button
                size="xs"
                styled="outline"
                color="green"
                disabled={disabled}
                onClick={() => onClickSendTask(item.ruleId, sendType.resend)}
              >
                재전송
              </Button>
            )}
        </StatusWrapper>
      );
    }
    case smsStatus.invalid: {
      return (
        <StatusWrapper>
          <Tooltip
            title={smsInvalidReason.getInvalidReason(item.invalidReason)}
          >
            <MarkWrapper>
              <NotiIcon />
            </MarkWrapper>
          </Tooltip>
          <span>전송불가</span>
        </StatusWrapper>
      );
    }
  }
};

ScheduledSmsStatus.propTypes = {
  sessionId: PropTypes.number,
  item: PropTypes.object,
  data: PropTypes.array,
  load: PropTypes.func,
};
