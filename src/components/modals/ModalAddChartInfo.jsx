import { useState } from 'react';
import { observer } from 'mobx-react';
import CustomerAddChartInfo from '~/components/crm/customer-chart/customer-info/CustomerAddChartInfo';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { OverlayWrapper } from './common/Overlay';
import { ModalHeader } from './common/ModalHeader';

const ModalWrapper = styled.div`
  width: 790px;
  max-height: calc(100vh - 40px);
  overflow: hidden;
`;

const ModalBody = styled.div`
  padding: 0 30px;
`;

const modalType = {
  create: '고객등록',
  edit: '고객수정',
  view: '고객정보 상세보기',
};

const ModalAddChartInfo = ({ options, openWorkIn, onClose }) => {
  const [type, setType] = useState(options.editInfo);
  return (
    <OverlayWrapper onClose={onClose}>
      <ModalWrapper>
        <ModalHeader title={modalType[type]} onClose={onClose} />
        <ModalBody>
          <CustomerAddChartInfo
            customer={options.customer}
            type={type}
            setType={setType}
            snackbar={options.snackbar}
            formData={options.formData}
            openWorkIn={openWorkIn}
            onClose={onClose}
            origin={options?.origin}
            params={options?.params}
          />
        </ModalBody>
      </ModalWrapper>
    </OverlayWrapper>
  );
};

ModalAddChartInfo.propTypes = {
  options: PropTypes.object,
  openWorkIn: PropTypes.func,
  onClose: PropTypes.func,
};

export default observer(ModalAddChartInfo);
