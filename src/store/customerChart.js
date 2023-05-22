import { makeAutoObservable } from 'mobx';
import * as $http from 'axios';
import { DefaultTabSetting } from '~/core/TabUtil';

class CustomerChart {
  constructor() {
    makeAutoObservable(this);
  }

  reloadTableName = '';
  reloadMemoType = false;
  countList = [];
  tabSetting = DefaultTabSetting;
  openFormSetting = true;

  setTabSetting = (setting) => {
    this.tabSetting = setting;
  };
  setOpenFormSetting = (value) => {
    this.openFormSetting = value;
  };

  loadTabCount = async (customerId) => {
    const res = await $http.get(`/customers/${customerId}/category_count`);
    this.countList = res.data;
  };

  setReloadTableName = (name) => {
    this.reloadTableName = name;
  };

  setReloadMemoType = (reload) => {
    this.reloadMemoType = reload;
  };
}

export default new CustomerChart();
