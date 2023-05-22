import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

const ModalLoading = ({ options }) => {
  return (
    <div className="modal-loading">
      <div className="loading-icon" />
      <pre>{options.msg || '로딩중입니다.'}</pre>
    </div>
  );
};

ModalLoading.propTypes = {
  options: PropTypes.object,
};

export default observer(ModalLoading);
