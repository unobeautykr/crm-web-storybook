import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { TabContext } from '../tabchart/TabChart';
import { useModal } from '~/hooks/useModal';

import { ReactComponent as SettingIcon } from '@ic/ic-set-fill-gray.svg';
import { ReactComponent as SingleIcon } from '@ic/ic-table-single-on.svg';
import { ReactComponent as DualIcon } from '@ic/ic-table-dual-on.svg';
import TabSettingModal from '~/components/modals/TabSettingModal';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 4px;
`;

const TableLayoutIcons = styled.div`
  display: flex;
  background-color: #e6eef8;
  border-radius: 4px;
  width: 43px;
  height: 24px;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
`;

const IconWrapper = styled.div`
  width: 18px;
  height: 18px;
  background-color: white;
  text-align: center;
  margin-right: 1px;
  cursor: pointer;
`;

const SettingIconWrapper = styled.div`
  width: 18px;
  height: 18px;
  text-align: center;
  cursor: pointer;
`;

const SingleIconWrapper = styled(IconWrapper)`
  svg {
    ${({ layout }) =>
      layout === 'single'
        ? css`
            fill: #2c62f6;
          `
        : css`
            fill: #a1b1ca;
          `}
  }
`;
const DualIconWrapper = styled(IconWrapper)`
  svg {
    ${({ layout }) =>
      layout === 'dual'
        ? css`
            fill: #2c62f6;
          `
        : css`
            fill: #a1b1ca;
          `}
  }
`;

export const TableLayoutSetting = () => {
  const modal = useModal();
  const { layoutRow, setLayoutRow, setLowerTab } = useContext(TabContext);

  const onClickSettingPopup = () => {
    modal.custom({
      component: TabSettingModal,
      options: {},
    });
  };

  return (
    <Wrapper>
      <TableLayoutIcons>
        <SingleIconWrapper
          layout={layoutRow}
          onClick={() => setLayoutRow('single')}
        >
          <SingleIcon />
        </SingleIconWrapper>
        <DualIconWrapper
          layout={layoutRow}
          onClick={() => {
            setLayoutRow('dual');
            setLowerTab('');
          }}
        >
          <DualIcon />
        </DualIconWrapper>
      </TableLayoutIcons>
      <SettingIconWrapper>
        <SettingIcon onClick={onClickSettingPopup} />
      </SettingIconWrapper>
    </Wrapper>
  );
};
