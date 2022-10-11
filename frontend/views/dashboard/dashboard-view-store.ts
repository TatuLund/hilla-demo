import { crmStore, uiStore } from 'Frontend/stores/app-store';
import { makeAutoObservable } from 'mobx';
import type { PointOptionsObject } from 'highcharts';
import { lang } from 'Frontend/util/localization';

class DashboardViewStore {
    constructor() {
        makeAutoObservable(this);
    }

    get contactCount() {
        return crmStore.count;
    }

    get companyStats() {
        const stats :  PointOptionsObject[] = [];
        for (const company in crmStore.companyCounts) {
            stats.push({name : company, y : crmStore.companyCounts[company]})
        }
        return stats;
    }

    get statusStats() {
        const stats :  PointOptionsObject[] = [];
        for (const status in crmStore.statusCounts) {
            stats.push({name : lang.getText(uiStore.lang, status), y : crmStore.statusCounts[status]})
        }
        return stats;
    }
}

export const dashboardViewStore = new DashboardViewStore();
