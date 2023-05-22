import { useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';

import Header from '../Header';
import Layout from '../Layout';
// import AppointmentForm from './AppointmentForm';
// import RegistrationForm from './RegistrationForm';
import ConsultingForm from './ConsultingForm';
// import SkinCareForm from './SkinCareForm';
// import SurgeryForm from './SurgeryForm';
// import TreatmentForm from './TreatmentForm';
// import OperationNurseFormPage from './OperationNurseFormPage';
// import NurseFormPage from './NurseFormPage';
// import PaymentForm from './PaymentForm';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-left: 10px solid #d9e3f0;
  box-sizing: content-box;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const FormType = {
  appointment: 'appointment',
  consulting: 'consulting',
  treatment: 'treatment',
  surgery: 'surgery',
  nurse_operation: 'nurse_operation',
  nurse_care: 'nurse_care',
  skin_care: 'skin_care',
  payment: 'payment',

  getChartType: (type) => {
    switch (type) {
      case FormType['appointment']:
        return 'APPOINTMENT';
      case FormType['consulting']:
        return 'CONSULTING';
      case FormType['treatment']:
        return 'TREATMENT';
      case FormType['surgery']:
        return 'SURGERY';
      case FormType['nurse_operation']:
        return 'NURSE_OPERATION';
      case FormType['nurse_care']:
        return 'NURSE_CARE';
      case FormType['skin_care']:
        return 'SKINCARE';
      case FormType['payment']:
        return 'PAYMENT';
    }
  },
};

export const FormList = {
  // APPOINTMENT: {
  //   title: '예약 등록',
  //   content: <AppointmentForm />,
  //   connect: false,
  // },
  // REGISTRATION: {
  //   title: '접수 등록',
  //   content: <RegistrationForm />,
  //   connect: false,
  // },
  CONSULTING: {
    title: '상담 등록',
    content: <ConsultingForm />,
    connect: true,
  },
  // SKINCARE: {
  //   title: '피부관리 진행',
  //   content: <SkinCareForm />,
  //   connect: true,
  // },
  // SURGERY: {
  //   title: '시/수술 진행',
  //   content: <SurgeryForm />,
  //   connect: true,
  // },
  // TREATMENT: {
  //   title: '진료 등록',
  //   content: <TreatmentForm />,
  //   connect: true,
  // },
  // NURSE_OPERATION: {
  //   title: '수술간호 등록',
  //   content: <OperationNurseFormPage />,
  //   connect: true,
  // },
  // NURSE_CARE: {
  //   title: '간호 등록',
  //   content: <NurseFormPage />,
  //   connect: true,
  // },
  // PAYMENT: {
  //   title: '수납 등록',
  //   content: <PaymentForm />,
  //   connect: true,
  // },
};

const FormChart = () => {
  const { formData } = useContext(CustomerChartContext);

  return (
    <Wrapper key={formData?.id ?? 'new'}>
      <Header
        title={FormList[formData?.type]?.title}
        connect={FormList[formData?.type]?.connect}
      />
      <Layout>{FormList[formData?.type]?.content}</Layout>
    </Wrapper>
  );
};

FormChart.propTypes = {
  tabName: PropTypes.string,
};

export default FormChart;
