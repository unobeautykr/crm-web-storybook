import { TablePanel } from './TablePanel';
import { useContext } from 'react';

import { CustomerChartContext } from '../CustomerChart';
import { TabContext } from './TabChart';
import { SelectedComponent } from './SelectedComponent';
import { LowerTabHeader } from './LowerTabHeader';
import { LowerPanelView } from './LowerPanelView';

export const LowerTablePanel = () => {
  const { lowerTab } = useContext(TabContext);
  const { openForm } = useContext(CustomerChartContext);
  const showForm = () => openForm({ type: lowerTab, isOpenForm: true });

  return (
    <TablePanel>
      {lowerTab === '' ? (
        <LowerPanelView />
      ) : (
        <>
          <LowerTabHeader tab={lowerTab} showForm={showForm} />
          <SelectedComponent tab={lowerTab} />
        </>
      )}
    </TablePanel>
  );
};
