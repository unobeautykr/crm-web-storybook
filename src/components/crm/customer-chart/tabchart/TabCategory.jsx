import { useContext } from 'react';
import styled, { css } from 'styled-components';
import { observer } from 'mobx-react';
import update from 'immutability-helper';

import { TabContext } from '~/components/crm/customer-chart/tabchart/TabChart';
import { TabType } from '~/core/TabUtil';
import { TableLayoutSetting } from './TableLayoutSetting';
import { useCustomerChart } from '~/hooks/useCustomerChart';
import { useChart } from '~/hooks/useChart';

const Wrapper = styled.div`
  flex: 0 0 auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const TabItems = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  row-gap: 6px;
  column-gap: 30px;
`;

const Item = styled.li`
  padding-bottom: 8px;
  cursor: pointer;
  display: block;
  border-bottom: 2px solid transparent;
  font-size: 13px;
  line-height: 19px;

  ${({ selected }) =>
    selected &&
    css`
      border-bottom: 2px solid #0060ff;
      color: #0060ff;
      font-weight: bold;
    `}
`;

const TabCategory = () => {
  const chartStore = useCustomerChart();
  const chart = useChart();
  const tabContext = useContext(TabContext);

  const onClickTab = (value) => {
    const activeId = chart.activeId;
    const index = chart.list.findIndex(
      (v) => v.options.customerId === activeId
    );
    const updateList = update(chart.list, {
      [index]: { options: { tab: { $set: value } } },
    });
    chart.list = updateList;

    tabContext.setSelectedTab(value);
  };

  return (
    <Wrapper>
      <TabItems>
        {Object.keys(chartStore.tabSetting)
          .filter((f) => chartStore.tabSetting[f].visible)
          .map((v) => (
            <Item
              selected={v === tabContext.selectedTab}
              key={v}
              onClick={() => onClickTab(v)}
            >
              <span>
                {`${TabType.getName(v)} ${
                  chartStore.countList[TabType.getCountTabName(v)] != undefined
                    ? `(${chartStore.countList[TabType.getCountTabName(v)]})`
                    : ''
                }`}
              </span>
            </Item>
          ))}
      </TabItems>
      <TableLayoutSetting />
    </Wrapper>
  );
};

export default observer(TabCategory);
