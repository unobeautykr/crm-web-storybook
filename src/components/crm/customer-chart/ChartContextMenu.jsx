import styled from 'styled-components';
import PropTypes from 'prop-types';
import { ContextMenu } from '~/components/contextmenu/ContextMenu';
import { ContextMenuItemSmall } from '~/components/contextmenu/ContextMenuItem';
import { StatusColor } from '~/core/statusColor';
import { AppointmentStatus } from '~/core/appointmentStatus';
import { useStatusColorSettings } from '~/components/providers/StatusColorSettingsProvider';

const ListItemWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColorDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin: 2px;
`;

const StatusText = styled.span`
  margin-left: 8px;
`;

const StatusInfo = styled.div`
  display: flex;
  align-items: center;
`;

const cancelStatuses = [StatusColor.scheduled, StatusColor.no_show];
const noShowStatuses = [StatusColor.scheduled];
const statuses = [
  StatusColor.scheduled,
  StatusColor.no_show,
  StatusColor.consulting_waiting,
  StatusColor.consulting_during,
  StatusColor.treatment_waiting,
  StatusColor.treatment_during,
  StatusColor.surgery_waiting,
  StatusColor.surgery_during,
  StatusColor.payment_waiting,
  StatusColor.complete,
  StatusColor.leave,
];

const StatusItem = ({ status }) => {
  const statusColorSettings = useStatusColorSettings();
  const config = statusColorSettings.getStatusSettings(status);

  return (
    <ListItemWrapper>
      <StatusInfo>
        <ColorDot color={config.backgroundColor} />
        <StatusText>{StatusColor.getName(config.id)}</StatusText>
      </StatusInfo>
    </ListItemWrapper>
  );
};

StatusItem.propTypes = {
  status: PropTypes.string,
};

const ChartContextMenu = ({
  anchorEl,
  openStatusMenu,
  appointment,
  onClickStatus,
}) => {
  return (
    <ContextMenu
      style={{ pointerEvents: 'none' }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        horizontal: 'left',
        vertical: 'top',
      }}
      getContentAnchorEl={null}
      autoFocus={false}
      disableAutoFocus
      disableEnforceFocus
      open={openStatusMenu}
    >
      <div style={{ pointerEvents: 'auto', width: '106px' }}>
        {(appointment.status === AppointmentStatus.canceled
          ? cancelStatuses
          : appointment.status === AppointmentStatus.noShow
          ? noShowStatuses
          : statuses
        )
          .filter(
            (v) =>
              ![
                appointment.status.includes('DONE')
                  ? StatusColor.complete
                  : appointment.status,
                ...(appointment.type === 'APPOINTMENT'
                  ? [StatusColor.complete, StatusColor.leave]
                  : [StatusColor.scheduled, StatusColor.no_show]),
              ].includes(v)
            // 현재 상태 && 예약일경우 완료,퇴원 / 접수일경우 예약, 미방문 제외하고 보여야함
          )
          .map((s) => (
            <ContextMenuItemSmall
              key={s}
              onClick={() => {
                onClickStatus({
                  data: appointment,
                  status: s,
                });
              }}
            >
              <StatusItem status={s} style={{ padding: '8px' }} />
            </ContextMenuItemSmall>
          ))}
      </div>
    </ContextMenu>
  );
};
ChartContextMenu.propTypes = {
  anchorEl: PropTypes.object,
  openStatusMenu: PropTypes.bool,
  appointment: PropTypes.object,
  onClickStatus: PropTypes.func,
  statusColor: PropTypes.array,
};

export default ChartContextMenu;
