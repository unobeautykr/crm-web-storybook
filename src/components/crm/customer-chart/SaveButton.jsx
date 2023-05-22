import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button } from '~/components/Button';

const Wrapper = styled.div`
  position: sticky;
  bottom: 0;
  margin-top: auto;
  padding: 16px 0;
  background: rgb(255, 255, 255);
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  display: flex;
  column-gap: 10px;

  &&& button {
    height: 48px;
    font-weight: bold;
    font-size: 14px;
    border-radius: 4px;
    &:nth-child(1) {
      width: 30%;
      background: #fff !important;
    }
    &:nth-child(2) {
      width: calc(70% - 10px);
    }
  }
`;

const SaveButton = ({ children, disabled, onClick, onClose, style }) => {
  return (
    <Wrapper style={style}>
      <Button type="mix" styled="outline" color="secondary" onClick={onClose}>
        취소
      </Button>
      <Button onClick={onClick} disabled={disabled}>
        {children}
      </Button>
    </Wrapper>
  );
};

SaveButton.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  style: PropTypes.object,
};

export default SaveButton;
