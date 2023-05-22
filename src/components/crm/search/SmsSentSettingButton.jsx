import { useState } from 'react';
import PropTypes from 'prop-types';
import { ScheduledSmsSettingModal } from '~/components/modals/ScheduledSmsSettingModal';
import SmsDetailButton from './SmsDetailButton';

const SmsSentSettingButton = ({ appointment }) => {
  const [showSmsSettingModal, setShowSmsSettingModal] = useState(false);

  const openSmsDetail = async () => {
    setShowSmsSettingModal(true);
  };

  return (
    <>
      <SmsDetailButton
        smsSent={appointment.smsSent}
        onClick={() => openSmsDetail()}
      />
      {showSmsSettingModal && (
        <ScheduledSmsSettingModal
          appointment={appointment}
          onClose={() => setShowSmsSettingModal(false)}
        />
      )}
    </>
  );
};

SmsSentSettingButton.propTypes = {
  appointment: PropTypes.object,
};

export default SmsSentSettingButton;
