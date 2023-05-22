import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { hexToRgbaString } from '~/utils/colorUtil';
import { StatusConfig } from '~/core/chartCard';
import { AppointmentStatus } from '~/core/appointmentStatus';

const ChartType = styled('div')(
  ({ type }) => `
    padding: 0 4px;
    border-radius: 2px;
    font-size: 11px;
    background-color: ${hexToRgbaString(StatusConfig[type].color, 0.4)};
`
);

export const ChartTypeBadge = ({ item }) => {
  if (item.status === 'NONE') return null;

  let type = '';
  if (item.type === 'APPOINTMENT') {
    if (item.status === AppointmentStatus.canceled) {
      type = item.status;
    } else if (item.status === AppointmentStatus.noShow) {
      type = item.status;
    } else {
      type = item.type;
    }
  } else {
    if (item.type === 'REGISTRATION') {
      type = item.type;
    }
  }

  return <ChartType type={type}>{StatusConfig[type].label}</ChartType>;
};

ChartTypeBadge.propTypes = {
  item: PropTypes.object,
};
