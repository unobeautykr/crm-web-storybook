import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useModal } from '~/hooks/useModal';
// import PenChartDetailModal from './PenChartDetail';

const Button = styled('button')`
  display: flex;
  margin: auto;
  text-decoration: underline;
  font-size: 12px;
  font-weight: 500;
`;

export function CustomerPenChartLink({ directory, fileCount = 0 }) {
  const modal = useModal();

  const openPenChartDetail = () => {
    modal.custom({
      component: <div>hello</div>,
      options: {
        directory,
        fileCount,
      },
    });
  };

  return (
    <Button onClick={openPenChartDetail}>
      {fileCount >= 100 ? '99+' : fileCount}건
    </Button>
  );
}

CustomerPenChartLink.propTypes = {
  directory: PropTypes.object,
  fileCount: PropTypes.number,
};
