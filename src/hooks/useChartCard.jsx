import { ReactComponent as Consulting } from '@ic/common/ic-consulting.svg';
import { ReactComponent as Treatment } from '@ic/common/ic-treatment.svg';
import { ReactComponent as Operation } from '@ic/common/ic-surgery.svg';
import { ReactComponent as SkinCare } from '@ic/common/ic-skincare.svg';
import { ReactComponent as Payment } from '@ic/common/ic-payment.svg';
import { ReactComponent as Appointment } from '@ic/common/ic-appointment.svg';

import { TabType } from '~/core/TabUtil';

export const useChartCard = () => {
  const getCardValue = (item) => {
    const {
      consultings,
      treatments,
      surgeries,
      nurseCares,
      nurseOperations,
      skincares,
      payments,
      appointment,
    } = item;

    if (consultings?.length > 0) {
      return consultings;
    }
    if (treatments?.length > 0) {
      return treatments;
    }
    if (surgeries?.length > 0) {
      return surgeries;
    }
    if (nurseCares?.length > 0) {
      return nurseCares;
    }
    if (nurseOperations?.length > 0) {
      return nurseOperations;
    }
    if (skincares?.length > 0) {
      return skincares;
    }
    if (payments?.length > 0) {
      return payments;
    }
    if (appointment?.length > 0) {
      return appointment;
    }
  };

  const getCardType = (item) => {
    const {
      consultings,
      treatments,
      surgeries,
      nurseCares,
      nurseOperations,
      skincares,
      payments,
      appointment,
    } = item;

    if (consultings?.length > 0) {
      return 'CONSULTING';
    }
    if (treatments?.length > 0) {
      return 'TREATMENT';
    }
    if (surgeries?.length > 0) {
      return 'SURGERY';
    }
    if (nurseCares?.length > 0) {
      return 'NURSE_CARE';
    }
    if (nurseOperations?.length > 0) {
      return 'NURSE_OPERATION';
    }
    if (skincares?.length > 0) {
      return 'SKINCARE';
    }
    if (payments?.length > 0) {
      return 'PAYMENT';
    }
    if (appointment?.length > 0) {
      return 'APPOINTMENT';
    }
  };

  const getIconByType = (item) => {
    const cardType = getCardType(item);
    let iconSelector;

    if (cardType === TabType.consulting) {
      iconSelector = <Consulting />;
    }
    if (cardType === TabType.treatment) {
      iconSelector = <Treatment />;
    }
    if (cardType === TabType.surgery) {
      iconSelector = <Operation />;
    }
    if (cardType === TabType.nurseCare) {
      iconSelector = <Operation />;
    }
    if (cardType === TabType.nurseOperation) {
      iconSelector = <Operation />;
    }
    if (cardType === TabType.skinCare) {
      iconSelector = <SkinCare />;
    }
    if (cardType === TabType.payment) {
      iconSelector = <Payment />;
    }
    if (cardType === TabType.appointment) {
      iconSelector = <Appointment />;
    }

    return { icon: iconSelector, type: cardType };
  };

  const getValue = (cardType) => {
    let value = '';

    if (cardType === TabType.consulting) {
      value = 'consultings';
    }
    if (cardType === TabType.treatment) {
      value = 'treatments';
    }
    if (cardType === TabType.surgery) {
      value = 'surgeries';
    }
    if (cardType === TabType.nurseCare) {
      value = 'nurseCares';
    }
    if (cardType === TabType.nurseOperation) {
      value = 'nurseOperations';
    }
    if (cardType === TabType.skinCare) {
      value = 'skincares';
    }
    if (cardType === TabType.payment) {
      value = 'payments';
    }
    if (cardType === TabType.appointment) {
      value = 'appointment';
    }

    return value;
  };

  return { getCardValue, getCardType, getIconByType, getValue };
};
