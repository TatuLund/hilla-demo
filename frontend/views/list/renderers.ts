import { GridColumnBodyLitRenderer } from "@vaadin/grid/lit.js"
import "@vaadin/vertical-layout"
import Contact from "Frontend/generated/com/example/application/data/entity/Contact";
import { crmStore, uiStore } from "Frontend/stores/app-store";
import { lang } from "Frontend/util/localization";
import { html } from "lit";
import "@vaadin/list-box";
import "@vaadin/item";

export const statusRenderer: GridColumnBodyLitRenderer<Contact> = (contact) => {
  return html`<span theme="badge" class="ml-auto text-s">
      ${lang.getText(uiStore.lang,contact.status.name)}
    </span>`;
}

export const contactRenderer: GridColumnBodyLitRenderer<Contact> = (contact) => {
    return html`
      <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
        <span class="w-full flex text-primary">
          ${contact.firstName} ${contact.lastName}
          <span theme="badge" class="ml-auto text-s">
            ${lang.getText(uiStore.lang,contact.status.name)}
          </span>
        </span>
        <span
          class="text-s text-secondary"
        >
          ${contact.email}
        </span>
        <span
          class="text-s"
        >
          ${contact.company.name}
        </span>
      </vaadin-vertical-layout>
    `;
  };

  export const statusSelectRenderer = () => html`
    <vaadin-list-box>
      ${crmStore.statuses.map((status) => html`
        <vaadin-item value="${status.id}">
          <span theme="badge" class="ml-auto text-s">
            ${lang.getText(uiStore.lang, status.name)}
          </span>
        </vaadin-item>
      `
      )}
    </vaadin-list-box>`;