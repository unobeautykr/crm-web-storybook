import { createContext } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { OverlayWrapper } from './common/Overlay';
import { ModalWrapper } from './common/ModalWrapper';
import { ModalHeader } from './common/ModalHeader';
import { ModalBody } from './common/ModalBody';
import { ScheduledSmsTab } from './ScheduledSmsTab';
import { color as colorTheme } from '~/themes/styles';
import hooks from '~/hooks';
import { Tooltip } from '~/components/Tooltip';
import { ReactComponent as InfoBlueIcon } from '@ic/common/ic-info-blue-16.svg';

const Wrapper = styled(ModalWrapper)`
  width: 900px;
`;

const Description = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 11px;
`;

const BlueText = styled.span`
  text-decoration: underline;
  color: ${colorTheme.primary.unoblue};
  cursor: pointer;
`;

const TableWrapper = styled.div`
  height: 600px;
  overflow: auto;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const ScheduledSmsSettingContext = createContext();

export const ScheduledSmsSettingModal = ({ appointment = {}, onClose }) => {
  const openCustomerChart = () => {
    onClose();
    hooks.openCustomerChartNew({
      customerId: appointment.customer.id,
      tab: 'SMS',
    });
  };

  return (
    <ScheduledSmsSettingContext.Provider value={{ onClose }}>
      <OverlayWrapper onClose={onClose}>
        <Wrapper>
          <ModalHeader
            title="예약 자동문자 설정"
            titleNode={
              <Tooltip
                title={
                  <>
                    <div>
                      문자 관리 - 문자코드 설정에 등록된
                      예약완료/예약취소/미방문 자동 문자를 설정하는 화면입니다.
                    </div>
                    <div>
                      예약 건을 등록하거나 변경, 취소, 복원, 미방문으로 상태
                      변경 시 발송 가능한 예약 자동 문자가 생성됩니다.
                    </div>
                  </>
                }
                placement="bottom-start"
              >
                <IconWrapper>
                  <InfoBlueIcon />
                </IconWrapper>
              </Tooltip>
            }
            onClose={() => onClose()}
          />
          <ModalBody>
            <Description>
              <div>
                V2 업데이트 이전의 예약문자는{' '}
                <BlueText onClick={() => openCustomerChart()}>여기</BlueText>를
                클릭해서 확인하세요.
              </div>
            </Description>
            <TableWrapper>
              <ScheduledSmsTab appointment={appointment} />
            </TableWrapper>
          </ModalBody>
        </Wrapper>
      </OverlayWrapper>
    </ScheduledSmsSettingContext.Provider>
  );
};

ScheduledSmsSettingModal.propTypes = {
  appointment: PropTypes.object,
  onClose: PropTypes.func,
};
