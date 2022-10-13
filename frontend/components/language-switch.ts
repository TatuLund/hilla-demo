import { customElement, state } from "lit/decorators.js";
import { html } from "lit";
import { lang, Language } from "Frontend/util/localization";
import { uiStore } from "Frontend/stores/app-store";
import { View } from "Frontend/views/view";
import "@vaadin/select/src/vaadin-select-list-box.js";
import "@vaadin/select/src/vaadin-select-item.js";
import "@vaadin/select";
import { selectRenderer } from "@vaadin/select/lit.js";
import { SelectChangeEvent } from "@vaadin/select";

// This language switch component is used both by login-view
// and main-layout.
@customElement("language-switch")
export class LanguageSwitch extends View {

    @state()
    private languages: Language[] = [];

    firstUpdated() {
        this.languages = lang.getLanguages();
    } 

    render() {
        return html`
            <vaadin-select
                ${selectRenderer(this.renderer, this.languages)}
                @change=${this.languageChange}
                value=${uiStore.lang}
                placeholder=${lang.getText(uiStore.lang, "main-language")}
            ></vaadin-select>
            `;
    }

    languageChange(e : SelectChangeEvent) {
        if (e.target.value) {
          uiStore.lang=e.target.value;
        }
    }

    private renderer = () => html`
        <vaadin-select-list-box>
        ${this.languages.map((language) => html`
            <vaadin-select-item value="${language.key}">
                <div class="flex gap-s">
                    <!-- Flag svg icons are served by the server as static resources -->
                    <img
                        style="width: 30px; height: 20px"
                        src="icons/${language.key}.svg"/>
                    <div>
                        ${language.name}
                    </div>
                </div>
            </vaadin-select-item>
            `
        )}
    </vaadin-select-list-box>
  `;
}
