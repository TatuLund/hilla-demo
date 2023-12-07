import { html } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { View } from "../view";
import "@vaadin/date-picker";
import "@vaadin/text-field";
import "@vaadin/combo-box";
import "@vaadin/select";
import "@vaadin/button";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/confirm-dialog";
import "@vaadin/tooltip";
import { Binder, field } from "@hilla/form";
import ContactModel from "Frontend/generated/com/example/application/data/entity/ContactModel";
import { crmStore, uiStore } from "Frontend/stores/app-store";
import { listViewStore } from "./list-view-store";
import { DatePicker } from "@vaadin/date-picker";
import { ComboBox } from "@vaadin/combo-box";
import { PastOrPresentWeekdayAndRequired } from "Frontend/util/validators";
import { lang } from "Frontend/util/localization";
import { statusSelectRenderer } from "./renderers";
import { selectRenderer } from "@vaadin/select/lit";
import "Frontend/components/live-currency-field";
import "@vaadin/number-field";
import { checkAllowedFormat } from "Frontend/util/datepicker-util";
import { loadingIndicator } from "Frontend/util/loading-indicator";

@customElement("contact-form")
export class ContactForm extends View {
  // binder is public as we need to access it from ListView
  binder = new Binder<ContactModel>(this, ContactModel);

  @state()
  private confirm = false;

  @query("#datepicker")
  private datePicker!: DatePicker;
  @query("#company")
  private companyBox!: ComboBox;

  firstUpdated() {
    const { model } = this.binder;
    this.binder
      .for(model.date)
      .addValidator(new PastOrPresentWeekdayAndRequired());
    lang.setDatePickerFormatter(this.datePicker);
    this.companyBox.inputElement.addEventListener("keypress", () =>
      this.companyBox.open()
    );
    this.datePicker.inputElement.addEventListener('change', e => {
      const elm = e.target as HTMLInputElement;
      if (!checkAllowedFormat(elm.value)) {
        this.datePicker.helperText = lang.getText(uiStore.lang, "datepicker-format");
      } else {
        this.datePicker.helperText = null;
      }
    })
  }

  updated() {
    lang.updateDatePickerI18n(this.datePicker, uiStore.lang);
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
    return html`
      <vaadin-text-field
        id="firstname"
        label=${lang.getText(uiStore.lang, "first-name")}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.firstName)}
      ></vaadin-text-field>
      <vaadin-text-field
        id="lastname"
        label=${lang.getText(uiStore.lang, "last-name")}
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.lastName)}
      ></vaadin-text-field>
      <vaadin-text-field
        id="emailfield"
        label=${lang.getText(uiStore.lang, "email")}
        ?readonly=${!uiStore.isAdmin()}
        ?disabled=${uiStore.offline}
        ${field(model.email)}
      ></vaadin-text-field>
      <vaadin-combo-box
        id="company"
        label=${lang.getText(uiStore.lang, "company")}
        .items=${crmStore.companies}
        auto-open-disabled
        clear-button-visible
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        item-label-path="name"
        ${field(model.company)}
      >
      </vaadin-combo-box>
      <vaadin-select
        id="status"
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        label=${lang.getText(uiStore.lang, "status")}
        ${selectRenderer(statusSelectRenderer, [
          crmStore.statuses,
          uiStore.lang,
        ])}
        ${field(model.status.id)}
      ></vaadin-select>
      <vaadin-date-picker
        id="datepicker"
        label=${lang.getText(uiStore.lang, "date")}
        theme="weekend"
        auto-open-disabled
        clear-button-visible
        ?disabled=${uiStore.offline}
        ?readonly=${!uiStore.isAdmin()}
        ${field(model.date)}
      >
      </vaadin-date-picker>
      <live-currency-field
        id="prospectvalue"
        label=${lang.getText(uiStore.lang, "prospect-value")}
        ?readonly=${!uiStore.isAdmin()}
        ?disabled=${uiStore.offline}
        ${field(model.prospectValue)}
        ><vaadin-tooltip
          slot="tooltip"
          text=${lang.getText(uiStore.lang, "currency-field-tooltip")}
        ></vaadin-tooltip
      >
    </live-currency-field>
      <div
        class="buttons border-contrast-30 border-t mt-auto flex justify-between"
      >
        <vaadin-button
          id="save"
          theme="primary"
          @click=${this.save}
          ?disabled=${!this.binder.dirty ||
          this.binder.invalid ||
          uiStore.offline ||
          this.loading ||
          !uiStore.isAdmin()}
        >
          <vaadin-icon icon="vaadin:disc"></vaadin-icon>
          ${this.binder.value.id
            ? lang.getText(uiStore.lang, "button-save")
            : lang.getText(uiStore.lang, "button-create")}
        </vaadin-button>
        <vaadin-button
          id="delete"
          theme="error"
          @click=${this.deleteClicked}
          ?disabled=${!this.binder.value.id ||
          uiStore.offline ||
          this.loading ||
          !uiStore.isAdmin()}
        >
          <vaadin-icon icon="vaadin:trash"></vaadin-icon>
          ${lang.getText(uiStore.lang, "button-delete")}
        </vaadin-button>
        <vaadin-button
          id="cancel"
          theme="tertiary"
          @click=${listViewStore.cancelEdit}
        >
          ${lang.getText(uiStore.lang, "button-cancel")}
        </vaadin-button>
      </div>
      <!-- confirm dialog is bound to confirm state variable -->
      <!-- clicking delete will change it to true, which opens the dialog -->
      <vaadin-confirm-dialog
        header=${lang.getText(uiStore.lang, "contact-confirm-delete")}
        cancel
        cancel-text=${lang.getText(uiStore.lang, "button-cancel")}
        confirm-text=${lang.getText(uiStore.lang, "button-confirm")}
        @confirm=${this.delete}
        @cancel=${this.cancelClicked}
        .opened=${this.confirm}
        ><span class="whitespace-pre text-l">
          <span class="text-secondary font-semibold text-s"
            >${lang.getText(uiStore.lang, "contact")}:</span
          >
          ${listViewStore.selectedContact?.firstName}
          ${listViewStore.selectedContact?.lastName}
        </span></vaadin-confirm-dialog
      >
    `;
  }

  // Update the value to false after closing. Otherwise the dialog cannot
  // be re-opened.
  cancelClicked() {
    this.confirm = false;
  }

  // Open the dialog by changing the value bound to opened property
  deleteClicked() {
    this.confirm = true;
  }

  async delete() {
    await listViewStore.delete();
    this.confirm = false;
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
