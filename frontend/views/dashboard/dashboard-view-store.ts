import { crmStore } from 'Frontend/stores/app-store';
import { CrmStore } from 'Frontend/stores/crm-store';
import { makeAutoObservable } from 'mobx';

class DashboardViewStore {
    constructor() {
        makeAutoObservable(this);
    }

    get contactCount() {
        return crmStore.count;
    }

    get companyStats() {
        const stats : any[] = [];
        for (const company in crmStore.companyCounts) {
            stats.push({name : company, y : crmStore.companyCounts[company]})
        }
        return stats;
    }

    get statusStats() {
        const stats : any[] = [];
        for (const status in crmStore.statusCounts) {
            stats.push({name : status, y : crmStore.statusCounts[status]})
        }
        return stats;
    }
}

export const dashboardViewStore = new DashboardViewStore();
