import { useContext, useState, useEffect } from 'react';
import { useFetch } from 'use-http';
import { observer } from 'mobx-react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { ReactComponent as ChevronUp } from '@ic/chevron_up.svg';

import QuillText from '~/components/quill/QuillText';
import { convertFormData } from '~/utils/convertFormData';
import { Collapse, IconButton } from '@mui/material';

import { useChartCard } from '~/hooks/useChartCard';

import { ChartTypeBadge } from './ChartTypeBadge';
import { TypeIcon } from './TypeIcon';
import { SurgeryCategoriesNames } from './SurgeryCategoriesNames';
import { ConnectRegistrationItems } from './ConnectRegistrationItems';
import moment from 'moment';
import { RegistrationConnectChart } from './RegistrationConnectChart';
import { TabType } from '~/core/TabUtil';
import { MemoWrapper } from './MemoWrapper';

export const StatusConfig = {
  APPOINTMENT: { label: '예약', color: '#FF9D5F', apiPath: '/appointments' },
  CANCELED: {
    label: '예약 - 취소',
    color: '#FF3D3D',
    apiPath: '/appointments',
  },
  NO_SHOW: {
    label: '예약 - 미방문',
    color: '#E6E6E6',
    apiPath: '/appointments',
  },
  REGISTRATION: { label: '내원', color: '#2C62F6', apiPath: '/registrations' },
  CONSULTING: { label: '상담', color: '#B7E4B0', apiPath: '/consultings' },
  PAYMENT: { label: '수납', color: '#5080FA', apiPath: '/payments' },
  SURGERY: { label: '시/수술', color: '#FF508C', apiPath: '/surgeries' },
  TREATMENT: { label: '진료', color: '#56B1E4', apiPath: '/treatments' },
  NURSE_CARE: { label: '간호', color: '#D1E20F', apiPath: '/nurse_cares' },
  NURSE_OPERATION: {
    label: '수술간호',
    color: '#6DCDD1',
    apiPath: '/nurse_operations',
  },
  SKINCARE: { label: '피부관리', color: '#A4A4A4', apiPath: '/skincares' },
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 6px 10px;
  overflow: auto;
  border: solid 1px #dee2ec;
  border-radius: 4px;
  &:not(:last-child) {
    margin-bottom: 8px;
  }
`;

const Header = styled.div`
  display: flex;
`;

const LeftSection = styled.div`
  display: flex;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
`;

const BadgeWrapper = styled.div`
  margin: 0 8px;
`;

const Body = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Contents = styled.div`
  width: 100%;
`;

const CollapseButton = styled(IconButton)`
  width: 20px;
  height: 16px;
  padding: 0;

  ${(props) =>
    props.$collapsed &&
    css`
      transform: rotate(180deg);
    `}
`;

export const ManagerNames = ({ item }) => {
  let name = [];
  const { counselor, doctor, facialist, assist, nurse } = item;
  if (doctor) {
    name.push(doctor.name);
  }

  if (counselor) {
    name.push(counselor.name);
  }

  if (facialist) {
    name.push(facialist.name);
  }

  if (assist) {
    name.push(assist.name);
  }

  if (nurse) {
    name.push(nurse.name);
  }

  return name.length > 0 ? <div>{name.join('∙')}</div> : '';
};

ManagerNames.propTypes = {
  item: PropTypes.object,
};

const AcquisitionChannel = ({ acquisitionChannel }) => {
  return acquisitionChannel?.id ? <div>{acquisitionChannel.name}</div> : '';
};

AcquisitionChannel.propTypes = {
  acquisitionChannel: PropTypes.object,
};

export const ChartCard = observer(({ allCollapsed, item }) => {
  const { openForm } = useContext(CustomerChartContext);
  const { get } = useFetch();
  const { getCardValue } = useChartCard();

  const [collapsed, setCollapsed] = useState(allCollapsed ?? false);

  useEffect(() => {
    setCollapsed(allCollapsed);
  }, [allCollapsed]);

  const openEditForm = async (type, id) => {
    if (!type) return;
    const resp = await get(`${StatusConfig[type].apiPath}/${id}`);
    openForm(
      convertFormData({
        ...resp.data,
        type: type,
      }),
      resp.data
    );
  };

  const getMemoText = (item) => {
    const { category, memo } = item;
    let text = memo;
    if (category === 'NONE') {
      const cardValue = getCardValue(item);
      text = cardValue && cardValue[0].memo;
    }

    return text;
  };

  return (
    <Wrapper
      onDoubleClick={() =>
        item.type === TabType.appointment &&
        openEditForm(TabType.appointment, item.id)
      }
    >
      <Header>
        <LeftSection>
          <div>{moment(new Date(item.date)).format('yyyy-MM-dd(E)')}</div>
          <BadgeWrapper>
            <ChartTypeBadge item={item} />
          </BadgeWrapper>
        </LeftSection>
        <RightSection>
          <div>
            <CollapseButton
              $collapsed={collapsed}
              onClick={() => setCollapsed((col) => !col)}
            >
              <ChevronUp />
            </CollapseButton>
          </div>
        </RightSection>
      </Header>
      <Collapse in={!collapsed}>
        <Body style={{ marginTop: '5px' }}>
          <Contents>
            {item.type === TabType.registration &&
              item.appointment !== null && (
                <RegistrationConnectChart
                  chart={{
                    key: 'APPOINTMENT',
                    value: [item.appointment],
                  }}
                />
              )}
            <TypeIcon item={item} openEditForm={openEditForm} />
            {item.category !== 'NONE' && <ManagerNames item={item} />}
            <AcquisitionChannel acquisitionChannel={item.acquisitionChannel} />
            <SurgeryCategoriesNames item={item} />
            {item.memo !== null && item.memo !== '' && (
              <MemoWrapper type={item.type}>
                <QuillText
                  value={getMemoText(item)}
                  maxLine={3}
                  style={{ lineHeight: '1.4', width: 'auto' }}
                />
              </MemoWrapper>
            )}
          </Contents>
        </Body>
        <ConnectRegistrationItems item={item} />
      </Collapse>
    </Wrapper>
  );
});

ChartCard.propTypes = {
  allCollapsed: PropTypes.bool,
  item: PropTypes.object,
};
