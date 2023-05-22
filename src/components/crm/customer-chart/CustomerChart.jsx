import { createContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getLocalStorage, setLocalStorage } from '~/utils/localStorage';
import { useFetch } from 'use-http';
import { Grow } from '@mui/material';

import HeaderBar from './HeaderBar';
import TabChart from './tabchart/TabChart';
import ConfirmUnsavedChangesModal from './formchart/ConfirmUnsavedChangesModal';
import { SideBar } from './sidebar/SideBar';
import { useChart } from '~/hooks/useChart';
import { useDataEvent } from '~/hooks/useDataEvent';
import { useCustomerChart } from '~/hooks/useCustomerChart';
import { useSnackbarContext } from '~/components/providers/SnackbarProvider';
import { useFormChange } from '~/hooks/useFormChange';
import { EventType } from '~/store/dataEvent';
import { ScheduledSmsSettingModal } from '~/components/modals/ScheduledSmsSettingModal';
import { FormPanel } from './FormPanel';
import { useImperativeModal } from '~/components/providers/ImperativeModalProvider';
import { useApi } from '~/components/providers/ApiProvider';
import { DefaultTabSetting } from '~/core/TabUtil';

const Wrapper = styled.div`
  display: ${({ show }) => (show ? 'flex' : 'none')};
  width: 1877px;
  height: 984px;
  max-width: calc(100vw - 44px);
  max-height: calc(100vh - 96px) !important;
  overflow: auto;
  background: #f9fbff !important;
  padding: 0 !important;
  border-radius: 4px;
`;

const MainContents = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  row-gap: 10px;
  margin-bottom: 20px;
  > * {
    padding: 0 20px;
  }
`;

export const CustomerChartContext = createContext();

const CustomerChart = ({
  customerId,
  tab,
  form,
  show,
  consultingRequest,
  tabSettings,
}) => {
  const snackbar = useSnackbarContext();
  const imperativeModal = useImperativeModal();
  const chart = useChart();
  const dataEvent = useDataEvent();
  const formPanelRef = useRef();
  const subDialogRef = useRef();
  const chartStore = useCustomerChart();
  const { userApi } = useApi();

  const { checkFormUpdate, resetFormChange, formChange } = useFormChange();
  const [selectedTab, setSelectedTab] = useState(
    tab ??
      Object.keys(tabSettings.tabSetting).find(
        (f) => tabSettings.tabSetting[f].pinned
      ) ??
      'CONSULTING'
  );
  const [connectRegistration, setConnectRegistration] = useState(
    form?.registration ?? null
  );
  const [showSmsSettingModal, setShowSmsSettingModal] = useState(false);
  const [smsSettingModalAppointment, setSmsSettingModalAppointment] = useState(
    {}
  );

  const { get, data: customerData } = useFetch(
    `/customers/${customerId}`,
    {
      onNewData: (old, updates) => {
        if (updates.data) {
          chart.updateCustomerData(updates.data);
        }
        return updates?.data;
      },
    },
    []
  );
  const [collapseSideBar, setCollapseSideBar] = useState(
    getLocalStorage('collapseChartSideBar') ?? false
  );
  const [collapseTopSection, setCollapseTopSection] = useState(
    getLocalStorage('collapseChartTopSection') ?? false
  );
  const [formData, setFormData] = useState(form);
  const [editingForm, setEditingForm] = useState(false);
  const [isOpenForm, setIsOpenForm] = useState(chartStore.openFormSetting);

  const loadTabSetting = async () => {
    const resp = await userApi.getConfig('customerChartTabSetting');
    if (resp.data.value) {
      const tabSettings = JSON.parse(resp.data.value);
      chartStore.setTabSetting(tabSettings.tabSetting ?? DefaultTabSetting);
      chartStore.setOpenFormSetting(tabSettings.openFormSetting);
      setIsOpenForm(tabSettings.openFormSetting);
    }
  };

  const loadApi = () => {
    get();
  };

  useEffect(() => {
    const dispose = dataEvent.on(EventType.CUSTOMER_LOAD_API, loadApi);
    return dispose;
  }, [dataEvent]);

  useEffect(() => {
    chartStore.loadTabCount(customerId);
    chartStore.setTabSetting(tabSettings.tabSetting ?? DefaultTabSetting);
    chartStore.setOpenFormSetting(tabSettings.openFormSetting);
    setIsOpenForm(tabSettings.openFormSetting);
  }, []);

  useEffect(() => {
    const dispose = dataEvent.on(
      EventType.OPEN_FORM_SETTING_API,
      loadTabSetting
    );
    return dispose;
  }, [dataEvent]);

  const checkRemoveForm = async (callback = () => {}, check = true) => {
    const editing = editingForm || formChange;
    if (!editing || !check) {
      callback();
      return;
    }

    const confirmed = await imperativeModal.open((close) => {
      return (
        <ConfirmUnsavedChangesModal
          onConfirm={() => {
            close(true);
          }}
          onCancel={() => {
            close(false);
          }}
        />
      );
    });

    if (confirmed) {
      callback();
    }
  };

  useEffect(() => {
    const activeId = chart.activeId;
    if (!activeId) return;

    const index = chart.list.findIndex(
      (v) => v.options.customerId === activeId
    );
    const openChart = chart.list[index];
    if (!openChart.options.tab) return;
    if (openChart.options.tab !== selectedTab) {
      checkRemoveForm(() => {
        setSelectedTab(openChart.options.tab);
        resetFormChange();
        setFormData(null);
        setEditingForm(false);
      });
    }
  }, [chart.list]);

  const openForm = (formData, originFormData) => {
    setConnectRegistration(null);
    setFormData({ type: selectedTab, ...formData, originFormData });
  };

  const closeForm = (check = true) => {
    checkRemoveForm(() => {
      resetFormChange();
      setFormData(null);
      setEditingForm(false);
    }, check);
  };

  const reloadChart = (name) => {
    chartStore.loadTabCount(customerId);
    chartStore.setReloadTableName(name);
    chartStore.setReloadMemoType(true);
    dataEvent.emit(EventType.DAILY_APPOINTMENT_API);
  };

  const toggleCollapseSideBar = () => {
    setLocalStorage('collapseChartSideBar', !collapseSideBar);
    setCollapseSideBar(!collapseSideBar);
  };

  const toggleCollapseTopSection = () => {
    setLocalStorage('collapseChartTopSection', !collapseTopSection);
    setCollapseTopSection(!collapseTopSection);
  };

  const formOpenValidation = () => {
    if (!isOpenForm) {
      if (formData?.id || formData?.isOpenForm) {
        return true;
      } else {
        if (formData?.type === 'SURGERY' || formData?.type === 'SKINCARE') {
          if (formData?.useCountId) {
            return true;
          }
        }
        return false;
      }
    }

    if (isOpenForm && formData && formData.type) {
      return true;
    }
    return false;
  };

  return (
    <CustomerChartContext.Provider
      value={{
        tab,
        selectedTab,
        setSelectedTab,
        customerId,
        customer: customerData,
        originFormData: formData?.originFormData,
        formData,
        connectRegistration,
        setConnectRegistration,
        setEditingForm,
        setFormData,
        checkRemoveForm,
        openForm,
        closeForm,
        reloadChart,
        collapseSideBar,
        collapseTopSection,
        toggleCollapseSideBar,
        toggleCollapseTopSection,
        setCollapseTopSection,
        formPanelRef,
        subDialogRef,
        checkFormUpdate,
        snackbar,
        setShowSmsSettingModal,
        smsSettingModalAppointment,
        setSmsSettingModalAppointment,
        consultingRequest,
      }}
    >
      {customerData && (
        <>
          <Grow in={show}>
            <Wrapper show={show}>
              <SideBar />
              <MainContents>
                <HeaderBar />
                <TabChart />
              </MainContents>
              {formOpenValidation() && (
                <FormPanel formData={formData} ref={formPanelRef} />
              )}
            </Wrapper>
          </Grow>
          {showSmsSettingModal && (
            <ScheduledSmsSettingModal
              appointment={smsSettingModalAppointment}
              onClose={() => setShowSmsSettingModal(false)}
            />
          )}
        </>
      )}
    </CustomerChartContext.Provider>
  );
};

CustomerChart.propTypes = {
  customerId: PropTypes.number,
  tab: PropTypes.string,
  form: PropTypes.object,
  show: PropTypes.bool,
  // 상담문의 > 응대하기 > 예약등록 callback
  consultingRequest: PropTypes.bool,
  tabSettings: PropTypes.object,
};

export default CustomerChart;
