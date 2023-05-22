import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: calc(100% - 62px);
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px 16px;
  padding-bottom: 0;
  row-gap: 14px;
  height: 100%;
  > form {
    display: flex;
    flex-direction: column;
    row-gap: 14px;
    height: 100%;
  }
`;

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <FormWrapper>{children}</FormWrapper>
    </Wrapper>
  );
};

Layout.propTypes = {
  children: PropTypes.node,
};

export default Layout;
