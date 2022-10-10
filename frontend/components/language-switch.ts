import { customElement, state } from "lit/decorators.js";
import { html } from "lit";
import { lang, Language } from "Frontend/util/localization";
import { uiStore } from "Frontend/stores/app-store";
import { View } from "Frontend/views/view";
import "@vaadin/list-box";
import "@vaadin/item";
import "@vaadin/select";
import { selectRenderer } from "@vaadin/select/lit.js";
import { SelectChangeEvent } from "@vaadin/select";

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
        <vaadin-list-box>
        ${this.languages.map((language) => html`
            <vaadin-item value="${language.key}">
                <div class="flex gap-s">
                    <img
                        style="width: 30px; height: 20px"
                        src="icons/${language.key}.svg"/>
                    <div>
                        ${language.name}
                    </div>
                </div>
            </vaadin-item>
            `
        )}
    </vaadin-list-box>
  `;
}
