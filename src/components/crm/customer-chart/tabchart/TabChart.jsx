import { useState, createContext, useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { UpperTablePanel } from './UpperTablePanel';
import { LowerTablePanel } from './LowerTablePanel';
import { CustomerChartContext } from '~/components/providers/DataTableProvider';
import { FormList } from '../formchart/FormChart';
import TabCategory from '~/components/crm/customer-chart/tabchart/TabCategory';
import { Box } from '@mui/material';

export const TabContext = createContext();

const TabChart = () => {
  const { openForm, checkRemoveForm, selectedTab, setSelectedTab, formData } =
    useContext(CustomerChartContext);
  const [layoutRow, setLayoutRow] = useState('single'); // single OR dual
  const [lowerTab, setLowerTab] = useState('');

  // 탭 변경시 해당 탭의 폼이 열리게
  useEffect(() => {
    if (
      selectedTab &&
      formData?.type !== selectedTab &&
      FormList[selectedTab]
    ) {
      if (formData) {
        openForm({
          type: selectedTab,
          isOpenForm: formData.isOpenForm || Boolean(formData.id),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab]);

  // 차트 첫 진입시 해당 탭의 폼이 열리게
  useEffect(() => {
    if (FormList[selectedTab] && formData?.type) {
      openForm({ ...formData, type: formData?.type ?? selectedTab });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeTab = (tab) => {
    FormList[tab] && formData?.type && formData?.type !== tab
      ? checkRemoveForm(() => setSelectedTab(tab), formData?.type)
      : setSelectedTab(tab);
  };

  return (
    <TabContext.Provider
      value={{
        layoutRow,
        setLayoutRow,
        selectedTab,
        setSelectedTab: (tab) => onChangeTab(tab),
        lowerTab,
        setLowerTab,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden',
          gap: 1,
        }}
      >
        <TabCategory />
        <Box
          sx={{
            display: 'grid',
            flexGrow: 1,
            overflow: 'hidden',
            gridAutoFlow: 'row',
            gridAutoRows: '1fr',
            gap: 1,
          }}
        >
          <UpperTablePanel />
          {layoutRow === 'dual' && <LowerTablePanel />}
        </Box>
      </Box>
    </TabContext.Provider>
  );
};

export default observer(TabChart);
