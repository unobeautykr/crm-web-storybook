import { makeAutoObservable } from 'mobx';
import update from 'immutability-helper';

class Chart {
  list = [];
  activeId = null;

  constructor() {
    makeAutoObservable(this);
  }

  open = (id) => {
    this.activeId = id;
  };

  updateCustomerData = (data) => {
    let index = this.list.findIndex((v) => v.options.customerId === data.id);
    const updateList = update(this.list, {
      [index]: { options: { customer: { $set: data } } },
    });
    this.list = updateList;
  };

  push = (options, resolve) => {
    const id = options.customerId;
    if (!this.list.find((v) => v.options.customerId === id)) {
      this.list.push({ options, resolve });
    } else {
      let index = this.list.findIndex((v) => v.options.customerId === id);
      const updateList = update(this.list, {
        [index]: {
          options: { tab: { $set: options.tab } },
        },
      });
      this.list = updateList;
    }
    this.open(id);
  };

  hidden = (id = this.activeId) => {
    // 최근 접힌 카드가 처음으로 오게
    const target = this.list.find((v) => v.options.customerId === id);
    const targetIndex = this.list.findIndex((v) => v.options.customerId === id);
    this.list.splice(targetIndex, 1);
    this.list.unshift(target);
    this.activeId = null;
  };

  reset = () => {
    this.activeId = null;
    this.list = [];
  };

  closeModalByCustomerId = (id) => {
    if (!id) return;
    this.list = this.list.filter((v) => v.options.customerId !== id);
    if (this.activeId === id) this.activeId = null;
  };

  // show
  show = ({ options }) => new Promise((resolve) => this.push(options, resolve));
}

export default new Chart();
