import styled from 'styled-components';
import PropTypes from 'prop-types';
import { withStyles } from 'tss-react/mui';
import { Dialog } from '@mui/material';
import { ModalWrapper } from './common/ModalWrapper';
import { ModalHeader } from './common/ModalHeader';
import { ModalBody } from './common/ModalBody';
import { ImmediateSmsPreviewTable } from './ImmediateSmsPreviewTable';
import { TableContent } from '~/components/crm/customer-chart/TableContent';

const TableWrapper = styled(TableContent)`
  height: 400px;
`;

const StyledDialog = withStyles(Dialog, (theme, props) => ({
  root: {
    '& .MuiBackdrop-root': {
      background: 'rgba(0, 0, 0, 0.2) !important',
    },
  },
  paper: {
    boxShadow: 'none',
    maxWidth: '1300px',
  },
}));

export const ImmediateSmsPreviewModal = ({
  appointment,
  smsRules,
  onClose,
}) => {
  return (
    <StyledDialog open={true} onClose={onClose}>
      <ModalWrapper>
        <ModalHeader
          title="즉시 전송 예약문자 미리보기"
          onClose={() => onClose()}
        />
        <ModalBody>
          <TableWrapper>
            <ImmediateSmsPreviewTable
              appointment={appointment}
              smsRules={smsRules}
            />
          </TableWrapper>
        </ModalBody>
      </ModalWrapper>
    </StyledDialog>
  );
};

ImmediateSmsPreviewModal.propTypes = {
  appointment: PropTypes.any,
  smsRules: PropTypes.array,
  onClose: PropTypes.func,
};
