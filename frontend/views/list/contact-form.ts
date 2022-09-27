import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../view';
import '@vaadin/date-picker';
import '@vaadin/text-field';
import '@vaadin/combo-box';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/icons';
import { Binder, field } from '@hilla/form';
import ContactModel from 'Frontend/generated/com/example/application/data/entity/ContactModel';
import { crmStore, uiStore } from 'Frontend/stores/app-store';
import { listViewStore } from './list-view-store';

@customElement('contact-form')
export class ContactForm extends View {

  // binder is public as we need to access it from ListView
  binder = new Binder(this, ContactModel);

  @state()
  private loading = false;

  constructor() {
    super();
    this.autorun(() =>
      this.binder.read(
        listViewStore.selectedContact || ContactModel.createEmptyValue()
      )
    );
  }

  // Form has various modes of operation
  // - When offline we show fields and buttons disabled
  // - We allow editing only for ADMIN role
  // - Note, elso update and delete end points are protected
  render() {
    const { model } = this.binder;
    return html`
      <vaadin-text-field
        label="First name"
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.firstName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label="Last name"
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.lastName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label="Email"
        ?readonly=${!uiStore.isAdmin()}
        ?disabled=${uiStore.offline}
        ${field(model.email)}
      ></vaadin-text-field>
      <vaadin-combo-box
        label="Company"
        .items=${crmStore.companies}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        item-label-path="name"
        ${field(model.company)}
      >
      </vaadin-combo-box>
      <vaadin-combo-box
        label="Status"
        .items=${crmStore.statuses}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        item-label-path="name"
        ${field(model.status)}
      ></vaadin-combo-box>
      <vaadin-date-picker
        label="Date"
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.date)}
      >
      </vaadin-date-picker>
      <div class="buttons border-contrast-30 border-t mt-auto flex justify-between">
        <vaadin-button
          theme="primary"
          @click=${this.save}
          ?disabled=${!this.binder.dirty || this.binder.invalid || uiStore.offline || this.loading || !uiStore.isAdmin()}
        >
        <vaadin-icon icon="vaadin:disc"></vaadin-icon>
          ${this.binder.value.id ? "Save" : "Create"}
        </vaadin-button>
        <vaadin-button
          theme="error"
          @click=${this.delete}
          ?disabled=${!this.binder.value.id || uiStore.offline || this.loading || !uiStore.isAdmin() }
        >
          <vaadin-icon icon="vaadin:trash"></vaadin-icon>
          Delete
        </vaadin-button>
        <vaadin-button theme="tertiary" @click=${listViewStore.cancelEdit}>
          Cancel
        </vaadin-button>
      </div>
    `;
  }

  async delete() {
    await listViewStore.delete();
    this.submitDataChange();
  }

  async save() {
    this.loading = true;
    await this.binder.submitTo(listViewStore.save);
    this.binder.clear();
    this.loading = false;
    this.submitDataChange();
  }

  // We dispatch a custom event so that ListView can observe changes
  private submitDataChange() {
    const event = new CustomEvent("data-change");
    this.dispatchEvent(event);
  }
}
