import styled from 'styled-components';
import PropTypes from 'prop-types';

import { TabType } from '~/core/TabUtil';
import { RegistrationConnectChart } from './RegistrationConnectChart';
import { useChartCard } from '~/hooks/useChartCard';

const RegistrationWrapper = styled.div`
  hr {
    margin: 10px 0;
  }
`;

export const ConnectRegistrationItems = ({ item }) => {
  const {
    consultings,
    treatments,
    surgeries,
    nurseCares,
    nurseOperations,
    skincares,
    payments,
  } = item;
  const { getCardType } = useChartCard();

  const regstrationConnectCharts = [
    { key: TabType.consulting, value: consultings },
    { key: TabType.treatment, value: treatments },
    { key: TabType.surgery, value: surgeries },
    { key: TabType.nurseCare, value: nurseCares },
    { key: TabType.nurseOperation, value: nurseOperations },
    { key: TabType.skinCare, value: skincares },
    { key: TabType.payment, value: payments },
  ];

  return (
    item.type === 'REGISTRATION' &&
    item.progress === 'OPEN' && (
      <RegistrationWrapper>
        {getCardType(item) && <hr />}
        {regstrationConnectCharts.map((v) => (
          <RegistrationConnectChart key={v.key} chart={v} />
        ))}
      </RegistrationWrapper>
    )
  );
};

ConnectRegistrationItems.propTypes = {
  item: PropTypes.object,
};
