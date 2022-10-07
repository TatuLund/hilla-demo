import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
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
import { DatePicker, DatePickerDate } from '@vaadin/date-picker';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { stringifyKey } from 'mobx/dist/internal';

@customElement('contact-form')
export class ContactForm extends View {

  // binder is public as we need to access it from ListView
  binder = new Binder(this, ContactModel);

  @query("#datepicker")
  private datePicker! : DatePicker;

  firstUpdated() {
    const formatDateIso8601 = (dateParts: DatePickerDate): string => {
      const { year, month, day } = dateParts;
      const date = new Date(year, month, day);

      return dateFnsFormat(date, 'yyyy-MM-dd');
    };

    // Allow the user to input the date using both the two digit
    // and four digit year format.
    const parseDateIso8601 = (inputValue: string): DatePickerDate => {
      var date : Date;
      if (inputValue.length > 8) {
        date = dateFnsParse(inputValue, 'yyyy-MM-dd', new Date());
      } else {
        date = dateFnsParse(inputValue, 'yy-MM-dd', new Date());
      }

      return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
    };

    this.datePicker.i18n = {
      ...this.datePicker.i18n,
      formatDate: formatDateIso8601,
      parseDate: parseDateIso8601,
    };
  }

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
    this.binder.for(model.date).addValidator({
      message: "Date needs to be today or past",
      validate: (date: string) => {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const now = Date.parse(today.toDateString());
        const other = Date.parse(date);
        return other <= now;
      },
    });
    return html`
      <vaadin-text-field
        label="First name"
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        theme="label-left"
        ${field(model.firstName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label="Last name"
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        theme="label-left"
        ${field(model.lastName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label="Email"
        ?readonly=${!uiStore.isAdmin()}
        ?disabled=${uiStore.offline}
        theme="label-left"
        style="width: 100%"
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
        id="datepicker"
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
