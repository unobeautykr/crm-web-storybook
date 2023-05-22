import { useContext } from 'react';
import PropTypes from 'prop-types';
import { TabContext } from './TabChart';
import { TablePanel } from './TablePanel';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { TabHeader } from './TabHeader';
import { SelectedComponent } from './SelectedComponent';

export const UpperTablePanel = () => {
  const { selectedTab } = useContext(TabContext);
  const tabContext = useContext(TabContext);
  const { openForm } = useContext(CustomerChartContext);
  const showForm = () =>
    openForm({ type: tabContext.selectedTab, isOpenForm: true });

  return (
    <TablePanel>
      {selectedTab === 'PENCHART' && (
        <>
          <SelectedComponent tab={tabContext.selectedTab} />
        </>
      )}
      {selectedTab !== 'PENCHART' && (
        <>
          <TabHeader tab={tabContext.selectedTab} showForm={showForm} />
          <SelectedComponent tab={tabContext.selectedTab} />
        </>
      )}
    </TablePanel>
  );
};

UpperTablePanel.propTypes = {
  row: PropTypes.string,
};
