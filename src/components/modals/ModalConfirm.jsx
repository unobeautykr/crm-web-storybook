import { useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';

const ModalConfirm = ({ options, close }) => {
  /*
  options : { type, msg }
  type : SUCCESS / ERROR
  msg : 노출될 메시지 
  */
  useEffect(() => {
    setTimeout(function () {
      //팝업 로딩 후 0.5초 뒤에 팝업 종료
      close();
    }, 500);
  });

  return (
    <div className="modal-confirm">
      <div className={`icon ${options.type.toLowerCase()}`}>
        {options.type === 'SUCCESS' && (
          <i className="zmdi zmdi-check-circle"></i>
        )}
        {options.type === 'ERROR' && <i className="zmdi zmdi-close-circle"></i>}
      </div>
      <p>{options.msg}</p>
    </div>
  );
};

ModalConfirm.propTypes = {
  options: PropTypes.object,
  close: PropTypes.func,
};

export default observer(ModalConfirm);
