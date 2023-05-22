import { useState, useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ChartContextMenu from './ChartContextMenu';
import { hexToRgb } from '~/utils/colorUtil';
import { ReactComponent as ChevronRight } from '@ic/chevron_right.svg';
import { useUpdateStatus } from '~/hooks/useUpdateStatus';
import { Tooltip } from '~/components/Tooltip';
import { StatusColor } from '~/core/statusColor';
import { AppointmentStatus } from '~/core/appointmentStatus';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { ScheduledSmsSettingModal } from '~/components/modals/ScheduledSmsSettingModal';
import { useDialog } from '~/hooks/useDialog';
import { UnderlineButton } from '~/components/UnderlineButton';
import { useStatusColorSettings } from '~/components/providers/StatusColorSettingsProvider';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  gap: 4px;
`;

const Status = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
  padding: 2px 6px;
  border-radius: 3px;
  background: ${({ color }) => {
    const rgb = hexToRgb(color);
    return `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 0.6)`;
  }};
  border: 1px solid
    ${({ color }) => {
      const rgb = hexToRgb(color);
      return `rgba(${rgb?.r}, ${rgb?.g}, ${rgb?.b}, 1)`;
    }};
  color: ${({ textColor }) => textColor};
  cursor: pointer;
`;

const AppointmentStatusBox = ({ appointments, onReload }) => {
  const ref = useRef([]);
  const snackbar = useSnackbarContext();
  const modal = useDialog();
  const [openStatusMenu, setOpenStatusMenu] = useState([
    ...appointments.map(() => false),
  ]);
  const {
    copyRegistration,
    updateRegistrationStatus,
    updateAppointmentStatus,
    updateRegistrationLeaveStatus,
  } = useUpdateStatus();

  const statusColorSettings = useStatusColorSettings();

  const onClickStatus = async ({ data, status }) => {
    if (
      data.type === 'APPOINTMENT' &&
      (status === StatusColor.scheduled ||
        status === StatusColor.no_show ||
        status === StatusColor.canceled)
    ) {
      if (status === StatusColor.scheduled) {
        const reResp = await updateAppointmentStatus(
          data,
          AppointmentStatus.scheduled
        );
        if (reResp.ok) {
          snackbar.open('unoblue', reResp.msg, {
            actionItems: (
              <UnderlineButton
                size="s"
                onClick={() => modal.open({ appointment: reResp.data.data })}
              >
                문자설정
              </UnderlineButton>
            ),
          });
        }
      } else {
        await updateAppointmentStatus(data, status);
      }
    } else {
      if (data.type === 'REGISTRATION') {
        if (status === AppointmentStatus.leave) {
          await updateRegistrationLeaveStatus(data);
        } else {
          await updateRegistrationStatus(
            data.id,
            status === StatusColor.complete ? `${data.category}_DONE` : status
          );
        }
      } else {
        await copyRegistration(
          data.id,
          status === StatusColor.complete ? `${data.category}_DONE` : status
        );
      }
    }

    onReload();
  };

  return (
    <>
      {modal.opened && (
        <ScheduledSmsSettingModal
          appointment={modal.data.appointment}
          onClose={modal.close}
        />
      )}
      <Wrapper>
        {appointments.map((v, i) => (
          <Tooltip
            key={i}
            title={`${v.date} ${v.startHour}  |  ${v.department.category.name} - ${v.department.name}`}
            placement="top-start"
            role="stautsTooltip"
            arrow
          >
            <Status
              key={i}
              ref={(el) => (ref.current[i] = el)}
              onClick={() => {
                openStatusMenu[i] = !openStatusMenu[i];
                setOpenStatusMenu([...openStatusMenu]);
              }}
              onMouseLeave={() => {
                if (openStatusMenu[i]) {
                  openStatusMenu[i] = false;
                  setOpenStatusMenu([...openStatusMenu]);
                }
              }}
              color={
                statusColorSettings.getStatusSettings(
                  StatusColor.fromStatus(v.status)
                ).backgroundColor
              }
            >
              {StatusColor.getName(StatusColor.fromStatus(v.status))}
              <ChevronRight height="10" />
              <ChartContextMenu
                anchorEl={ref.current[i]}
                openStatusMenu={openStatusMenu[i]}
                appointment={v}
                onClickStatus={onClickStatus}
              />
            </Status>
          </Tooltip>
        ))}
      </Wrapper>
    </>
  );
};
AppointmentStatusBox.propTypes = {
  appointments: PropTypes.array,
  onReload: PropTypes.func,
};

export default AppointmentStatusBox;
