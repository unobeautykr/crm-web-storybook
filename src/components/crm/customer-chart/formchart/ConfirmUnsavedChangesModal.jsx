import styled from 'styled-components';
import { ConfirmModal } from '~/components/modals/ConfirmModal';

const ModalTitle = styled.h1`
  font-size: 14px;
  line-height: 20px;
`;

const ModalDesc = styled.p`
  font-size: 12px;
  line-height: 17px;
  margin-top: 5px;
`;

const ConfirmUnsavedChangesModal = (props) => {
  return (
    <ConfirmModal variant="warning" {...props}>
      <ModalTitle>작성중인 내용이 있습니다. 그래도 닫으시겠습니까?</ModalTitle>
      <ModalDesc>
        완료하지 않고 페이지를 벗어날 경우 지금까지 작성한 내용은 사라집니다.
      </ModalDesc>
    </ConfirmModal>
  );
};
export default ConfirmUnsavedChangesModal;
