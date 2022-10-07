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
import { pastOrPresentValidator } from 'Frontend/util/validators';
import { lang } from 'Frontend/stores/localization';

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

  updated() {
    this.datePicker.i18n.monthNames = lang.getMonths(uiStore.lang);
    this.datePicker.i18n.weekdays = lang.getWeekdays(uiStore.lang, false);
    this.datePicker.i18n.weekdaysShort = lang.getWeekdays(uiStore.lang, true);
    this.datePicker.i18n.calendar = lang.getText(uiStore.lang, "dp-calendar");
    this.datePicker.i18n.today = lang.getText(uiStore.lang, "dp-today");
    this.datePicker.i18n.cancel = lang.getText(uiStore.lang, "dp-cancel");
    this.datePicker.i18n.clear = lang.getText(uiStore.lang, "dp-clear");
    this.datePicker.i18n.clear = lang.getText(uiStore.lang, "dp-week");
    if (uiStore.lang === "fi") {
      this.datePicker.i18n.firstDayOfWeek=1;
    } else {
      this.datePicker.i18n.firstDayOfWeek=0;
    }
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
    this.binder.for(model.date).addValidator(pastOrPresentValidator);
    return html`
      <vaadin-text-field
        label=${lang.getText(uiStore.lang,"first-name")}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.firstName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label=${lang.getText(uiStore.lang,"last-name")}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.lastName)}
      ></vaadin-text-field>
      <vaadin-text-field
        label=${lang.getText(uiStore.lang,"email")}
        ?readonly=${!uiStore.isAdmin()}
        ?disabled=${uiStore.offline}
        ${field(model.email)}
      ></vaadin-text-field>
      <vaadin-combo-box
        label=${lang.getText(uiStore.lang,"company")}
        .items=${crmStore.companies}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        item-label-path="name"
        ${field(model.company)}
      >
      </vaadin-combo-box>
      <vaadin-combo-box
        label=${lang.getText(uiStore.lang,"status")}
        .items=${crmStore.statuses}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        item-label-path="name"
        ${field(model.status)}
      ></vaadin-combo-box>
      <vaadin-date-picker
        id="datepicker"
        label=${lang.getText(uiStore.lang,"date")}
        auto-open-disabled
        clear-button-visible
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
          ${this.binder.value.id ? lang.getText(uiStore.lang,"button-save") : lang.getText(uiStore.lang,"button-create")}
        </vaadin-button>
        <vaadin-button
          theme="error"
          @click=${this.delete}
          ?disabled=${!this.binder.value.id || uiStore.offline || this.loading || !uiStore.isAdmin() }
        >
          <vaadin-icon icon="vaadin:trash"></vaadin-icon>
          ${lang.getText(uiStore.lang,"button-delete")}
        </vaadin-button>
        <vaadin-button theme="tertiary" @click=${listViewStore.cancelEdit}>
        ${lang.getText(uiStore.lang,"button-cancel")}
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
