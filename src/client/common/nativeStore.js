import {Native, Platform} from 'fun-plus';

const {Bridge} = Native;

export default class NativeStore {
  static set(name, value) {
    try {
      const param = {
        key: name,
        value: typeof value === 'string' ? value : JSON.stringify(value)
      };
      return Bridge.postMessage('utils/saveLocalData', param);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static get(name) {
    try {
      const param = {
        key: name
      };
      return Bridge.postMessage('utils/getLocalData', param);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  static remove(name) {
    try {
      const param = {
        key: name
      };
      return Bridge.postMessage('utils/deleteLocalData', param);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}