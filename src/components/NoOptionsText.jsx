import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

const Wrapper = styled('div')(
  ({ theme }) => `
  font-size: 12px;
  color: ${theme.palette.bluegrey[600]};
`
);

export const NoOptionsText = ({ value }) => {
  return <Wrapper>{value ?? '검색결과가 없습니다.'}</Wrapper>;
};

NoOptionsText.propTypes = {
  value: PropTypes.string,
};
