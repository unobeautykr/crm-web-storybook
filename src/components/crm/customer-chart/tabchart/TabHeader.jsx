import { useContext, useEffect, useCallback, useState } from 'react';
import styled from 'styled-components';
import Button from '~/components/Button2';
import PropTypes from 'prop-types';
import { TabType } from '~/core/TabUtil';
import { observer } from 'mobx-react';
import { CustomerChartContext } from '../CustomerChart';
import { useCustomerChart } from '~/hooks/useCustomerChart';
import { useDataEvent } from '~/hooks/useDataEvent';
import { EventType } from '~/store/dataEvent';
import * as $http from 'axios';
import { buildUrl } from '~/utils/url';
import { Box } from '@mui/material';
import { Tooltip } from '~/components/Tooltip';
import { QuestionMark } from '~/components/QuestionMark';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.p`
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #2d2d2d;
`;

const TooltipText = {
  appointment: (
    <>
      <p>
        내원 전 고객의 예약 등록 및 변경, 취소, 예약 문자 관리를 할 수 있습니다.
      </p>
      <p>
        예약상태(예약, 미방문, 예약취소)에서는 예약캘린더 & 현황판 티켓이
        예약정보로 확인되며
      </p>
      <p>예약 건이 접수된 후(내원)에는 접수차트에서 관리할 수 있습니다.</p>
    </>
  ),
  registration: (
    <>
      <p>내원 후 고객의 접수 등록 및 변경, 취소를 할 수 있습니다.</p>
      <p>접수(내원) 건은 예약캘린더 & 현황판 티켓이 접수정보로 확인되며</p>
      <p>
        상담, 수납 등의 차트 등록 시 접수정보를 연동하여 관리할 수 있습니다.
        (파란색 원표기)
      </p>
    </>
  ),
  payment: (
    <>
      <p>고객의 수납코드 등록 및 환불, 취소, 미수 입금을 처리할 수 있습니다.</p>
      <p>상담, 진료 차트의 [수납생성]에서도 수납등록이 가능합니다.</p>
      <p>
        청구일 3일 이내 수납정보 수정 시 자동 수납취소 후 재수납처리 됩니다.
      </p>
      <p>
        • 수납대기 : 고객에게 청구할 시수술/제품 정보 등록 후 [수납대기로 저장]
        한 상태
      </p>
      <p>• 수납취소 : 환불액 없이 전체 수납(미수)내역 취소 (기본 3일이내)</p>
    </>
  ),
};

const TooltipComponent = ({ tab }) => {
  return (
    <Tooltip title={TooltipText[tab.toLowerCase()]}>
      <Box sx={{ marginLeft: '5px' }}>
        <QuestionMark size="medium" />
      </Box>
    </Tooltip>
  );
};

TooltipComponent.propTypes = {
  tab: PropTypes.string,
};

const Information = ({ tab }) => {
  switch (tab) {
    case TabType.appointment:
    case TabType.registration:
    case TabType.payment:
      return <TooltipComponent tab={tab} />;
    default:
      return null;
  }
};

Information.propTypes = {
  tab: PropTypes.string,
};

export const TabHeader = observer(({ tab, showForm }) => {
  const chartStore = useCustomerChart();
  const dataEvent = useDataEvent();
  const [remainingCount, setRemainingCount] = useState(0);
  const { customer, customerId } = useContext(CustomerChartContext);

  const onReloadPrescription = () => {
    chartStore.loadTabCount(customerId);
    chartStore.setReloadTableName(TabType.prescriptions);
  };

  const countCallApi = useCallback(async () => {
    const resp = await $http.get(
      buildUrl('/tickets', {
        customerId,
        remainingCountMin: 1,
        limit: 100,
      })
    );
    if (!resp) return;
    setRemainingCount(resp.data.length);
  }, [customerId]);

  useEffect(() => {
    const dispose = dataEvent.on(EventType.COUNT_CALL_API, countCallApi);
    countCallApi();

    return dispose;
  }, [countCallApi, dataEvent]);

  const onClickOpenPrescriptions = () => {
    var win = window.open(`/prescriptions`);
    win.customer = customer;
    win.onSaveCallback = onReloadPrescription;
  };

  return (
    <Header>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Name>
          {TabType.getTabHeaderTitleName(tab)}{' '}
          {chartStore.countList[TabType.getCountTabName(tab)] != undefined &&
          tab !== TabType.sms &&
          tab !== TabType.prescriptions
            ? `(${chartStore.countList[TabType.getCountTabName(tab)]})`
            : ''}
        </Name>
        <Information tab={tab} />
      </Box>
      {tab === TabType.prescriptions ? (
        <Button highlight onClick={onClickOpenPrescriptions}>
          처방전 작성
        </Button>
      ) : (
        tab !== TabType.penchart &&
        tab !== TabType.sms &&
        tab !== TabType.callHistory && (
          <Button
            highlight
            onClick={showForm}
            disabled={
              (tab === TabType.surgery || tab === TabType.skinCare) &&
              !remainingCount
            }
          >
            + {TabType.getName(tab)}
            {tab === TabType.surgery || tab === TabType.skinCare
              ? ' 진행'
              : '등록'}
          </Button>
        )
      )}
    </Header>
  );
});

TabHeader.propTypes = {
  tab: PropTypes.string,
  showForm: PropTypes.func,
};
