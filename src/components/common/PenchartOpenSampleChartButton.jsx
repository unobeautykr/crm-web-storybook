import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Button } from '~/components/Button';
import { ReactComponent as PenchartSampleIcon } from '@ic/ic-penchartsample.svg';

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

export const PenchartOpenSampleChartButton = ({ onClick }) => {
  return (
    <Button
      styled="outline"
      color="mix"
      size="s"
      style={{ fontWeight: 'bold', height: '30px' }}
      onClick={onClick}
    >
      <ButtonWrapper>
        <PenchartSampleIcon />
        <span>펜차트 샘플함</span>
      </ButtonWrapper>
    </Button>
  );
};

PenchartOpenSampleChartButton.propTypes = {
  onClick: PropTypes.func,
};
