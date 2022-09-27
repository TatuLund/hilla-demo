import { makeAutoObservable } from 'mobx';
import { CrmStore } from "./crm-store";
import { UiStore } from './ui-store';

export class AppStore {
  constructor() {
    makeAutoObservable(this);
  }
  crmStore = new CrmStore();
  uiStore = new UiStore();
}
export const appStore = new AppStore();
export const crmStore = appStore.crmStore;
export const uiStore = appStore.uiStore;

