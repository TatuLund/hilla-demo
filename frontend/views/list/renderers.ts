import { GridColumnBodyLitRenderer } from "@vaadin/grid/lit.js"
import "@vaadin/vertical-layout"
import Contact from "Frontend/generated/com/example/application/data/entity/Contact";
import { html } from "lit";

export const contactRenderer: GridColumnBodyLitRenderer<Contact> = (contact) => {
    return html`
      <vaadin-vertical-layout style="line-height: var(--lumo-line-height-m);">
        <span class="w-full flex text-primary">
          ${contact.firstName} ${contact.lastName}
          <span theme="badge" class="ml-auto text-s">
            ${contact.status.name}
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
