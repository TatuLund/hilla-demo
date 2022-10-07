
import { makeAutoObservable, observable, runInAction } from 'mobx';

import Company from 'Frontend/generated/com/example/application/data/entity/Company';
import Contact from 'Frontend/generated/com/example/application/data/entity/Contact';
import Status from 'Frontend/generated/com/example/application/data/entity/Status';
import CrmDataModel from 'Frontend/generated/com/example/application/data/endpoint/CrmEndpoint/CrmDataModel';
import * as endpoint from 'Frontend/generated/CrmEndpoint';

import { uiStore } from "./app-store";
import { cacheable } from './cacheable';
import ContactStatsModel from 'Frontend/generated/com/example/application/data/endpoint/CrmEndpoint/ContactStatsModel';

export class CrmStore {

    companies: Company[] = [];
    statuses: Status[] = [];
    companyCounts: Record<string, number> = {};
    statusCounts: Record<string, number> = {};
    count = 0;

    constructor() {
        makeAutoObservable(
            this,
            {
                initFromServer: false,
                companies: observable.shallow,
                statuses: observable.shallow,
                companyCounts: observable.shallow,
                statusCounts: observable.shallow,
                count: observable,
            },
            { autoBind: true }
        );
        this.initFromServer();
    }

    async initFromServer() {
        this.initCompanies();
        this.initCount();
        this.initStatistics();
    }

    async initCompanies() {
        const data = await cacheable(
            endpoint.getCrmData,
            "crm",
            CrmDataModel.createEmptyValue()
          );         

        runInAction(() => {
            this.companies = data.companies;
            this.statuses = data.statuses;
        });
    }

    async initStatistics() {
        const statistics = await cacheable(
            endpoint.getContactStats,
            "statistics",
            ContactStatsModel.createEmptyValue()
          );

          runInAction(() => {
            this.companyCounts = statistics.companyCounts;
            this.statusCounts = statistics.statusCounts;
        });
    }

    async initCount() {
        const count = await cacheable(
            endpoint.getCount,
            "count",
            0
        );
        runInAction(() => {
            this.count = count;
        });
    }

    async fetchPage(page : number, pageSize : number, filter : string) {
        return await endpoint.getPage(page, pageSize, filter);
    }

    async fetchPageByCompanyAndStatus(page : number, pageSize : number, company : string, status : string) {
        return await endpoint.getPageByCompanyAndStatus(page, pageSize, company, status);
    }

    async fetchPageByCompany(page : number, pageSize : number, company : string) {
        return await endpoint.getPageByCompany(page, pageSize, company);
    }

    async fetchPageByStatus(page : number, pageSize : number, status : string) {
        return await endpoint.getPageByStatus(page, pageSize, status);
    }

    async saveContact(contact: Contact, newContact: boolean) {
        try {
            var add=0;
            if (newContact) {
                add++;
            }
            this.updateStats(await endpoint.saveContact(contact), add);
            uiStore.showSuccess("Contact saved.");
        } catch (e) {
            console.log(e);
            uiStore.showError("Contact save failed.");
        }
    }

    async deleteContact(contact: Contact) {
        if (!contact.id) return;

        try {
            await endpoint.deleteContact(contact.id);
            uiStore.showSuccess("Contact deleted.");
            this.count--;
            this.updateStats(await endpoint.saveContact(contact),-1);
        } catch (e) {
            console.log(e);
            uiStore.showError("Failed to delete contact.");
        }
    }

    private updateStats(saved: Contact, addSubtract: number) {
        this.companyCounts[saved.company.name]+=addSubtract;
        this.statusCounts[saved.status.name]+=addSubtract;
    }

}
