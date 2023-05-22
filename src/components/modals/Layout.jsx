import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { withStyles } from 'tss-react/mui';
import { Button } from '@mui/material';
import { CloseIcon } from '~/icons/Close';
import { HideScrollStyle } from '~/utils/cssUtil';

const Wrapper = styled('div')(
  ({ width }) => `
  width: ${width ? `${width}px` : 'auto'};
  height: ${height ? `${height}px` : 'auto'};
  padding: 0 !important;
  overflow: auto !important;
`
);

const Head = styled('div')`
  position: sticky;
  display: flex;
  align-items: center;
  height: 62px;
  padding: 16px;
  border-bottom: 1px solid #dee2ec;
  top: 0;
  left: 0;
  z-index: 2;
  background: #fff;
  h4 {
    line-height: 16px;
  }
`;

const CloseButton = withStyles(Button, (theme, props) => ({
  root: {
    padding: 0,
    minWidth: '24px',
    width: '24px',
    height: '24px',
    background: '#fff',
    marginLeft: 'auto',
    color: '#202020',
  },
  label: {
    width: '10px',
    height: '10px',
  },
}));

export const Body = styled('div')`
  padding: 16px;
  overflow: scroll;
  ${HideScrollStyle}
`;

export const FooterButton = styled('div')`
  display: flex;
  justify-content: flex-end;
  column-gap: 8px;
  padding: 0 16px 16px 16px;
`;

export const FooterPagination = styled('div')`
  position: sticky;
  bottom: 0;
  display: grid;
  padding: 12px;
  border-top: 1px solid #dee2ec;
  background: #fff;
  z-index: 1;
  > * {
    grid-column-start: 1;
    grid-row-start: 1;
    justify-self: center;
  }
`;
const Layout = ({ title, close, width, height, children }) => {
  return (
    <Wrapper width={width} height={height}>
      <Head>
        <h4 role="heading">{title}</h4>
        <CloseButton onClick={() => close()}>
          <CloseIcon />
        </CloseButton>
      </Head>
      {children}
    </Wrapper>
  );
};

Layout.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  close: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  children: PropTypes.node,
};

export default Layout;
