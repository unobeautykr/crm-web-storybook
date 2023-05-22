import { useState } from 'react';
import styled from 'styled-components';
import { Popover } from '@mui/material';
import Button from '~/components/Button2';
import { LowerTableContextMenu } from './LowerTableContextMenu';

const ViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  row-gap: 16px;
`;

export const LowerPanelView = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ViewWrapper>
      <p>보고싶은 메뉴를 선택하면 해당메뉴의 화면이 추가됩니다.</p>
      <Button styled="outline" type="primary" onClick={handleClick}>
        + 메뉴 추가하기
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <LowerTableContextMenu />
      </Popover>
    </ViewWrapper>
  );
};
