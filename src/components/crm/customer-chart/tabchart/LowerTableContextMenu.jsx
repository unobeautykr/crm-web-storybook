import { useContext } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { TabType } from '~/core/TabUtil';
import { TabContext } from './TabChart';
import { useCustomerChart } from '~/hooks/useCustomerChart';
import { ContextMenuItem } from '~/components/contextmenu/ContextMenuItem';

export const LowerTableContextMenu = observer(({ onClose }) => {
  const chartStore = useCustomerChart();
  const { selectedTab, setLowerTab } = useContext(TabContext);

  return (
    <>
      {Object.keys(chartStore.tabSetting)
        .filter((f) => chartStore.tabSetting[f].visible)
        .map((tab) => (
          <ContextMenuItem
            key={tab}
            disabled={selectedTab === tab}
            onClick={() => {
              setLowerTab(tab);
              onClose && onClose();
            }}
          >
            {TabType.getTabHeaderTitleName(tab)}
          </ContextMenuItem>
        ))}
    </>
  );
});

LowerTableContextMenu.propTypes = {
  onClose: PropTypes.func,
};
