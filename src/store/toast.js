import { makeAutoObservable } from 'mobx';

class Toast {
  message = null;
  type = null;
  show = false;

  constructor() {
    makeAutoObservable(this);
  }

  reset = () => {
    this.message = null;
    this.type = null;
    this.show = false;
  };
  set = (payload) => {
    if (!payload) {
      this.reset();
      return;
    }

    ['type', 'message', 'duration'].forEach(
      (key) => payload[key] && (this[key] = payload[key])
    );
    this.show = typeof payload.show === 'boolean' ? payload.show : true;
  };
  success = (message, duration) =>
    this.set({ message, type: 'success', duration });
  warning = (message, duration) =>
    this.set({ message, type: 'warning', duration });
  error = (message, duration) => this.set({ message, type: 'error', duration });
}

export default new Toast();
