import styled from 'styled-components';
import PropTypes from 'prop-types';
import EmailIcon from '@mui/icons-material/Email';

const Button = styled.button`
  display: flex;
  align-items: center;
  column-gap: 2px;
  font-weight: 500;
  font-size: 11px;
  color: #a1b1ca;
  border: 1px solid #dee2ec;
  border-radius: 2px;
  padding: 0 4px 0 2px;
  svg {
    font-size: 16px;
  }
`;

const SMSPreviewButton = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <EmailIcon />
      미리보기
    </Button>
  );
};

SMSPreviewButton.propTypes = {
  onClick: PropTypes.func,
};

export default SMSPreviewButton;
