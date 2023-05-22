import { makeAutoObservable } from 'mobx';
import ModalBasic from '~/components/modals/ModalBasic';
import ModalImages from '~/components/modals/ModalImages';
import ModalInput from '~/components/modals/ModalInput';
import ModalSlot from '~/components/modals/ModalSlot';
import ModalLoading from '~/components/modals/ModalLoading';
import ModalConfirm from '~/components/modals/ModalConfirm';

class Modal {
  list = [];

  constructor() {
    makeAutoObservable(this);
  }

  add = (component, options, resolve) => {
    this.list.push({ component, options, resolve });
  };
  pop = () => {
    this.list.pop();
  };
  closeAll = () => (this.list = []);
  close = ({ type }) =>
    (this.list = this.list.filter((v) => v.options.type !== type));
  closeModalByComponent = (component) => {
    this.list = this.list.filter(
      (v) => v.component.displayName !== component.displayName
    );
  };

  // create
  basic = (options) =>
    new Promise((resolve) => this.add(ModalBasic, options, resolve));
  images = (options) =>
    new Promise((resolve) => this.add(ModalImages, options, resolve));
  custom = ({ component, options }) =>
    new Promise((resolve) => this.add(component, options, resolve));
  input = (options) =>
    new Promise((resolve) => this.add(ModalInput, options, resolve));
  slot = (options) =>
    new Promise((resolve) => this.add(ModalSlot, options, resolve));
  loading = (customOptions) => {
    const options = Object.assign(
      {
        canClose: false,
      },
      customOptions
    );
    return new Promise((resolve) => this.add(ModalLoading, options, resolve));
  };
  confirm = (options) =>
    new Promise((resolve) => this.add(ModalConfirm, options, resolve));
}

export default new Modal();
