import { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Popover } from '@mui/material';
import { TabType } from '~/core/TabUtil';
import { LowerTableContextMenu } from './LowerTableContextMenu';
import { ReactComponent as ChevronUp } from '~/assets/images/icon/chevron_up.svg';
import { ReactComponent as ChevronDown } from '~/assets/images/icon/chevron_down.svg';
import Button from '~/components/Button2';
import { observer } from 'mobx-react';
import { useCustomerChart } from '~/hooks/useCustomerChart';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  border: solid 1px #dee2ec;
  border-radius: 4px;
  padding: 5px;
  font-weight: bold;
  font-size: 14px;
  line-height: 20px;
  color: #2d2d2d;

  span {
    margin-right: 5px;
  }
`;

export const LowerTabHeader = observer(({ tab, showForm }) => {
  const chartStore = useCustomerChart();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Header>
      <Name onClick={handleClick}>
        <span>
          {TabType.getTabHeaderTitleName(tab)}{' '}
          {chartStore.countList[TabType.getCountTabName(tab)] != undefined
            ? `(${chartStore.countList[TabType.getCountTabName(tab)]})`
            : ''}
        </span>
        {anchorEl ? <ChevronDown /> : <ChevronUp />}
      </Name>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
      >
        <LowerTableContextMenu onClose={handleClose} />
      </Popover>
      {tab !== TabType.penchart &&
        tab !== TabType.sms &&
        tab !== TabType.callHistory && (
          <Button highlight onClick={showForm}>
            + {TabType.getName(tab)}등록
          </Button>
        )}
    </Header>
  );
});

LowerTabHeader.propTypes = {
  tab: PropTypes.string,
  showForm: PropTypes.func,
};
