import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Dialog, CircularProgress } from '@mui/material';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 20px;
  position: relative;
  min-width: 400px;
  padding: 20px 30px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  color: #2d2d2d;
`;

export const LoadingModal = ({ show, msg }) => {
  if (!show) return null;
  return (
    <Dialog open={show}>
      <Wrapper>
        <CircularProgress />
        {msg || '로딩중입니다.'}
      </Wrapper>
    </Dialog>
  );
};

LoadingModal.propTypes = {
  show: PropTypes.bool,
  msg: PropTypes.string,
};
