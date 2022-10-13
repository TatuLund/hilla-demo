import PageResponse from 'Frontend/generated/com/example/application/data/endpoint/CrmEndpoint/PageResponse';
import PageResponseModel from 'Frontend/generated/com/example/application/data/endpoint/CrmEndpoint/PageResponseModel';
import Contact from 'Frontend/generated/com/example/application/data/entity/Contact';
import ContactModel from 'Frontend/generated/com/example/application/data/entity/ContactModel';
import { crmStore, uiStore } from 'Frontend/stores/app-store';
import { makeAutoObservable, observable } from 'mobx';

class ListViewStore {
    filterText = '';
    company : string | null = null;
    status : string | null = null;
    selectedContact: Contact | null = null;
    contacts : Contact[] = [];

    constructor() {
        makeAutoObservable(
            this,
            { selectedContact: observable.ref },
            { autoBind: true }
        );
    }

    updateFilter(filterText: string) {
        this.filterText = filterText;
    }

    setSelectedContact(contact: Contact) {
        this.selectedContact = contact;
    }

    editNew() {
        this.selectedContact = ContactModel.createEmptyValue();
    }

    cancelEdit() {
        this.selectedContact = null;
    }

    async save(contact: Contact) {
        console.log("Saving contact: "+contact.id);
        await crmStore.saveContact(contact, !this.contacts.includes(contact));
        this.cancelEdit();
    }

    async delete() {
        if (this.selectedContact) {
            console.log("Deleting contact: "+this.selectedContact.id);
            await crmStore.deleteContact(this.selectedContact);
            this.cancelEdit();
        }
    }

    // This function delegates data fetching to different functions in 
    // CrmStore based on what kind of filtering is used
    async fetchPage(page : number, pageSize : number) {
        var dataPage : PageResponse;
        if (uiStore.offline) {
            dataPage = PageResponseModel.createEmptyValue();
            dataPage.size = this.contacts.length;
            dataPage.content = this.contacts;
            return dataPage;
        }
        if (this.company && !(this.company === "none")) {
            if (this.status) {
                dataPage = await crmStore.fetchPageByCompanyAndStatus(page, pageSize, this.company, this.status);
            } else {
                dataPage = await crmStore.fetchPageByCompany(page, pageSize, this.company);
            }
        } else if (this.status) {
            dataPage = await crmStore.fetchPageByStatus(page, pageSize, this.status);
        } else {
            dataPage = await crmStore.fetchPage(page, pageSize, this.filterText);
        }
        this.contacts = dataPage.content;
        return dataPage;
    }

}

export const listViewStore = new ListViewStore();
