import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '~/components/Button';
import { ReactComponent as FileIcon } from '@ic/ic-file.svg';

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const PenchartAddFileButton = ({ onClick }) => {
  return (
    <Button
      styled="outline"
      color="mix"
      size="s"
      style={{ fontWeight: 'bold', height: '30px' }}
      onClick={onClick}
    >
      <ButtonWrapper>
        <FileIcon />
        <span>파일 추가</span>
      </ButtonWrapper>
    </Button>
  );
};

PenchartAddFileButton.propTypes = {
  onClick: PropTypes.func,
};
