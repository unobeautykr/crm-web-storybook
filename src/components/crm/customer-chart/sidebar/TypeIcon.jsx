import PropTypes from 'prop-types';
import { useChartCard } from '~/hooks/useChartCard';

import { ReactComponent as Appointment } from '@ic/common/ic-appointment.svg';
import { ReactComponent as Registration } from '@ic/common/ic-registration.svg';
import { ReactComponent as ArrowRightFill } from '@ic/arrow-right-fill.svg';

import { TabType } from '~/core/TabUtil';
import { TypeWrapper } from './TypeWrapper';
import { IconWrapper } from './IconWrapper';
import { Type } from './Type';

export const TypeIcon = ({ item, openEditForm }) => {
  const { getCardValue, getIconByType } = useChartCard();

  let registrationFormType;
  let iconSelector;

  if (item.progress === 'OPEN') {
    if (item.type === TabType.registration) {
      iconSelector = <Registration />;
      registrationFormType = TabType.registration;
    } else if (item.type === TabType.appointment) {
      iconSelector = <Appointment />;
      registrationFormType = TabType.appointment;
    }
  } else {
    const { icon, type } = getIconByType(item);
    iconSelector = icon;
    registrationFormType = type;
  }

  const cardValue = getCardValue(item);
  const id = item.category !== 'NONE' ? item.id : cardValue && cardValue[0]?.id;

  return (
    <TypeWrapper onClick={() => openEditForm(registrationFormType, id)}>
      <IconWrapper>{iconSelector}</IconWrapper>
      <Type>{TabType.getName(registrationFormType)}</Type>
      <IconWrapper>
        <ArrowRightFill />
      </IconWrapper>
    </TypeWrapper>
  );
};

TypeIcon.propTypes = {
  item: PropTypes.object,
  openEditForm: PropTypes.func,
};
