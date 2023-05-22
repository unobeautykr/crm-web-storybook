import PropTypes from 'prop-types';
import { ConsultingTab } from '../consulting/ConsultingTab';
import { TreatmentTab } from '../treatment/TreatmentTab';
import { CustomerOperationNurse } from './CustomerOperationNurse';
import { CustomerNurse } from './CustomerNurse';
import { CustomerSkinCare } from './CustomerSkinCare';
import { CustomerSmsList } from './CustomerSmsList';
import { CustomerSurgeries } from './CustomerSurgeries';
import { CustomerCallHistory } from './CustomerCallHistory';
import { PaymentTab } from '../payment/PaymentTab';
import { CustomerPrescriptions } from './CustomerPrescriptions';
import { CustomerPenCharts } from './CustomerPenchart/CustomerPenChart';
import { AppointmentTab } from '../appointment/AppointmentTab';
import { RegistrationTab } from '../registration/RegistrationTab';
import { TabType } from '../../../../core/TabUtil';

export const SelectedComponent = ({ tab }) => {
  switch (tab) {
    case TabType.appointment:
      return <AppointmentTab />;
    case TabType.registration:
      return <RegistrationTab />;
    case TabType.consulting:
      return <ConsultingTab />;
    case TabType.treatment:
      return <TreatmentTab />;
    case TabType.payment:
      return <PaymentTab />;
    case TabType.nurseOperation:
      return <CustomerOperationNurse />;
    case TabType.nurseCare:
      return <CustomerNurse />;
    case TabType.skinCare:
      return <CustomerSkinCare />;
    case TabType.sms:
      return <CustomerSmsList />;
    case TabType.surgery:
      return <CustomerSurgeries />;
    case TabType.callHistory:
      return <CustomerCallHistory />;
    case TabType.prescriptions:
      return <CustomerPrescriptions />;
    case TabType.penchart:
      return <CustomerPenCharts />;
    default:
      return null;
  }
};

SelectedComponent.propTypes = {
  tab: PropTypes.string,
};
