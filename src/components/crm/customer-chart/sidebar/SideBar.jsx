import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';

import { CustomerIdCard } from './CustomerIdCard';
import { CustomerChartHistory } from './CustomerChartHistory';
import { CollapsedSideBar } from './CollapsedSideBar';
import FastForward from '@mui/icons-material/FastForward';
import FastRewind from '@mui/icons-material/FastRewind';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  background: #fff;
  overflow: hidden;

  ${({ collapsed }) => css`
    ${collapsed ? 'width: 48px;' : 'width: 306px'}
  `}
`;

const SideBarHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: ${(props) => (props.$collapsed ? '5px 0' : '5px 10px')};
`;

const SideBarBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;

const ExpandedSideBar = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
  height: calc(100% - 28px);
`;

const ButtonWrapper = styled.div`
  display: flex;
  color: #9cb2cd;
  font-size: 12px;
  cursor: pointer;
`;

const FastRewindIcon = styled(FastRewind)`
  color: #9cb2cd;
  width: 18px;
  height: 18px;
  margin: 0 2px;
`;

const FastForwardIcon = styled(FastForward)`
  color: #9cb2cd;
  width: 18px;
  height: 18px;
  margin: 0 2px;
`;

const Collapsed = () => {
  return (
    <ButtonWrapper>
      접기
      <FastRewindIcon />
    </ButtonWrapper>
  );
};

const Expanded = () => {
  return (
    <ButtonWrapper>
      펼침
      <FastForwardIcon />
    </ButtonWrapper>
  );
};

export const SideBar = () => {
  const { collapseSideBar, toggleCollapseSideBar } =
    useContext(CustomerChartContext);

  return (
    <Wrapper collapsed={collapseSideBar}>
      <SideBarHeader
        onClick={toggleCollapseSideBar}
        $collapsed={collapseSideBar}
      >
        {collapseSideBar ? <Expanded /> : <Collapsed />}
      </SideBarHeader>
      <SideBarBody>
        {collapseSideBar ? (
          <CollapsedSideBar />
        ) : (
          <ExpandedSideBar>
            <CustomerIdCard />
            <CustomerChartHistory />
          </ExpandedSideBar>
        )}
      </SideBarBody>
    </Wrapper>
  );
};
