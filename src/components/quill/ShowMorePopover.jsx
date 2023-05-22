import sanitizeHtml from 'sanitize-html';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { Popover } from '@mui/material';
import { CloseIcon } from '~/icons/Close';

const Header = styled('div')(
  ({ theme }) => `
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  margin-bottom: 10px;

  font-weight: bold;
  font-size: 12px;
  color: ${theme.palette.grey[700]};

  button {
    width: 24px;
    height: 24px;
    color: #202020;
    svg {
      width: 10px;
      height: 10px;
    }
  }
`
);

const Body = styled('div')`
  font-size: 12px;
`;

export default function ShowMorePopover({ anchorEl, open, onClose, value }) {
  return (
    <Popover
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      PaperProps={{
        style: {
          minWidth: '150px',
          maxWidth: '300px',
          padding: '8px',
          marginLeft: '10px',
        },
      }}
    >
      <Header>
        [메모]
        <button onClick={onClose}>
          <CloseIcon />
        </button>
      </Header>
      <Body
        dangerouslySetInnerHTML={{
          __html: sanitizeHtml(value, {
            allowedAttributes: false,
          }),
        }}
      />
    </Popover>
  );
}

ShowMorePopover.propTypes = {
  anchorEl: PropTypes.node,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  value: PropTypes.any,
};
