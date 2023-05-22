import { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import SMSPreviewButton from '~/components/crm/customer-chart/formchart/SMSPreviewButton';
import { ImmediateSmsPreviewModal } from './ImmediateSmsPreviewModal';

const Wrapper = styled.div`
  font-size: 13px;
`;

const Span = styled.span`
  color: #2c62f6;
`;

export const ImmediateSmsConfirmPopup = ({ appointment, smsRules }) => {
  const [showScheduledSmsModal, setShowScheduledSmsModal] = useState(false);

  return (
    <Wrapper>
      <div>
        <Span>[즉시 전송 예약문자]</Span>가 있습니다.전송하시겠습니까?
      </div>
      <div>다른 예약문자 취소는 [문자설정]에서 가능합니다.</div>
      <div style={{ marginTop: '8px' }}>
        <SMSPreviewButton onClick={() => setShowScheduledSmsModal(true)} />
        {showScheduledSmsModal && (
          <ImmediateSmsPreviewModal
            appointment={appointment}
            smsRules={smsRules}
            onClose={() => setShowScheduledSmsModal(false)}
          />
        )}
      </div>
    </Wrapper>
  );
};

ImmediateSmsConfirmPopup.propTypes = {
  appointment: PropTypes.any,
  smsRules: PropTypes.array,
};
