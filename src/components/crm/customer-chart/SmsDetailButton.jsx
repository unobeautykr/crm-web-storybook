import PropTypes from 'prop-types';
import { Button } from '~/components/Button';
import { ReactComponent as SmsIcon } from '@ic/ico-sms.svg';
import { color as colorTheme } from '~/themes/styles';

const SmsDetailButton = ({ smsSent, onClick }) => {
  return (
    <Button
      size="s"
      styled="outline"
      color="secondary"
      onClick={onClick}
      style={{ gap: 10 }}
    >
      설정
      <SmsIcon
        style={{
          color: smsSent ? colorTheme.primary.deepblue : colorTheme.grey[500],
        }}
      />
    </Button>
  );
};

SmsDetailButton.propTypes = {
  smsSent: PropTypes.bool,
  onClick: PropTypes.func,
};

export default SmsDetailButton;
