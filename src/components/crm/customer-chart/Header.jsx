import PropTypes from 'prop-types';
import styled from 'styled-components';
import TodayConnectSelect from './TodayConnectSelect';

const Wrapper = styled.header`
  position: sticky;
  min-height: 60px;
  top: 0;
  background: #fff;
  z-index: 2;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #333333;
  border-bottom: 1px solid #dee2ec;
  gap: 20px;
`;

const Title = styled.p`
  flex: 0 0 auto;
`;

const Header = ({ title, connect = true }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {connect && <TodayConnectSelect />}
    </Wrapper>
  );
};

Header.propTypes = {
  title: PropTypes.string,
  connect: PropTypes.bool,
};

export default Header;
