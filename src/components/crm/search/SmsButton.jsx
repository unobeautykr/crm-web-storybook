import PropTypes from 'prop-types';
import { convertManualNumbers } from '~/utils/messageFilters';
import { useModal } from '~/hooks/useModal';
import { Button } from '~/components/Button';
import { Tooltip } from '~/components/Tooltip';
// import SendSMSModal from '~/modals/sms/SendSMSModal';
import { ReactComponent as MsgIcon } from '@ic/ic-msg.svg';

export const SmsButton = ({ target, onClose, children }) => {
  const modal = useModal();

  const getTooltipText = (target) => {
    if (!target.smsEnabled) return '문자수신거부';
    else if (convertManualNumbers(target.phoneNumber).total.error)
      return '유효하지 않은 전화번호';
    return '';
  };

  const onClickSms = () => {
    onClose && onClose();
    modal.custom({
      component: <div>hello</div>,
      options: {
        target: [target],
        smsSituation: 'customer',
      },
    });
  };

  return (
    <>
      <Tooltip title={getTooltipText(target)}>
        <span>
          <Button
            styled="outline"
            color="mix"
            size="xs"
            onClick={onClickSms}
            disabled={Boolean(getTooltipText(target))}
            icon={<MsgIcon width="12" />}
            style={{ marginLeft: 4 }}
          >
            {children}
          </Button>
        </span>
      </Tooltip>
    </>
  );
};

SmsButton.propTypes = {
  target: PropTypes.object,
  onClose: PropTypes.func,
  children: PropTypes.node,
};
