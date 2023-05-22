import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import hooks from '~/hooks';
import moment from 'moment';
import { useFetch } from 'use-http';
import { AppointmentStatus } from '~/core/appointmentStatus';
import { useChart } from '~/hooks/useChart';
import { useCustomerChart } from '~/hooks/useCustomerChart';
import { useDataEvent } from '~/hooks/useDataEvent';
import { EventType } from '~/store/dataEvent';
import { buildUrl } from '~/utils/url';
import { withStyles } from 'tss-react/mui';
import { Button as ButtonUI } from '@mui/material';
import { CollapseIcon } from '~/icons/Collapse';
import { CloseIcon } from '~/icons/Close';
import { CustomerChartContext } from './CustomerChart';
import AppointmentStatusBox from './AppointmentStatusBox';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 60px auto 60px;
  align-items: center;
  grid-gap: 10px;
  width: 100%;
  height: 60px;
  flex: 0 0 auto;
  border-bottom: 1px solid #dee2ec;
`;

const Head = styled.span`
  font-weight: 700;
  font-size: 14px;
`;

const Tail = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: inherit;
`;

const Button = withStyles(ButtonUI, (theme, props) => ({
  root: {
    padding: 0,
    minWidth: '24px',
    width: '24px',
    height: '24px',
    background: '#fff',
    boxShadow: '0px 1px 2px #dee2ec',
    borderRadius: '3px',
    color: '#293142',
  },
  label: {
    width: '14px',
    height: '14px',
  },
}));

const HeaderBar = () => {
  const chart = useChart();
  const chartStore = useCustomerChart();
  const dataEvent = useDataEvent();
  const { customer } = useContext(CustomerChartContext);

  const { data: sessions = [], get: getSessions } = useFetch(
    buildUrl('/sessions', {
      limit: 100,
      orderBy: 'startAt asc',
      customerId: customer.id,
      dateStart: moment().format('YYYY-MM-DD'),
      dateEnd: moment().format('YYYY-MM-DD'),
    }),
    {
      onNewData: (old, updates) => {
        return updates?.data.filter(
          (v) => ![AppointmentStatus.registered, 'NONE'].includes(v.status)
        );
      },
    },
    []
  );

  useEffect(() => {
    const dispose = dataEvent.on(EventType.DAILY_APPOINTMENT_API, () => {
      getSessions();
    });
    return dispose;
  }, [dataEvent, getSessions]);

  const onReload = () => {
    getSessions();
    chartStore.loadTabCount(customer.id);
  };

  const onHidden = () => chart.hidden(customer.id);
  const onClose = () => hooks.closeCustomerChartNew(customer.id);

  return (
    <Wrapper>
      <Head>통합차트</Head>
      <AppointmentStatusBox appointments={sessions} onReload={onReload} />
      <Tail>
        <Button onClick={onHidden}>
          <CollapseIcon />
        </Button>
        <Button onClick={onClose}>
          <CloseIcon />
        </Button>
      </Tail>
    </Wrapper>
  );
};

export default HeaderBar;
