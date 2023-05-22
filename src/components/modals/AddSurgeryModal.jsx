import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

import { NormalModal } from './common/NormalModal';
import { AddSurgeryModalContent } from './AddSurgeryModalContent';

const AddSurgeryModal = ({ options, open, onClose }) => {
  return (
    <NormalModal title="시/수술코드 생성" open={open} onClose={onClose}>
      <AddSurgeryModalContent options={options} onClose={onClose} />
    </NormalModal>
  );
};

AddSurgeryModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  options: PropTypes.object,
};

export default observer(AddSurgeryModal);
