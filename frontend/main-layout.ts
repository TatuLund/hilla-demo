import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Layout } from './views/view';
import '@vaadin/app-layout';
import '@vaadin/app-layout/vaadin-drawer-toggle';
import { uiStore } from './stores/app-store';
import '@vaadin/icon'
import '@vaadin/icons'
import '@vaadin/select'
import { ViewRoute, views } from './routes';
import { lang, Language } from './stores/localization';
import { ComboBoxChangeEvent } from '@vaadin/combo-box';

@customElement('main-layout')
export class MainLayout extends Layout {
 connectedCallback() {
   super.connectedCallback();
   this.classList.add('flex', 'h-full', 'w-full');
 }

 @state()
 private languages: Language[] = [];

 async firstUpdated() {
   this.languages = lang.getLanguages();
 } 

 // Generate menu in drawer from the routes
 render() {
    return html`
      <vaadin-app-layout class="h-full w-full">
        <header slot="navbar" class="border-b border-contrast-30 w-full flex items-center px-m">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1 class="text-l m-m">${lang.getText(uiStore.lang, "main-title")}</h1>
          ${this.indicatorIcon()}
          <a href="/logout" class="ms-auto px-m" ?hidden=${uiStore.offline}>
            <vaadin-icon class="m-s" icon="vaadin:key"></vaadin-icon>
            ${lang.getText(uiStore.lang, "main-logout")}
          </a>
        </header>
    
        <div class="h-full" slot="drawer">
          <div class="flex flex-col h-full m-l spacing-b-s ">
            ${views.map(
              (view) => this.createMenuItem(view)
            )}
            <vaadin-combo-box
              class="mt-auto"
              @change=${this.languageChange}
              .items=${this.languages}
              item-label-path="name"
              placeholder=${lang.getText(uiStore.lang, "main-language")}
            ></vaadin-combo-box>
          </div>
        </div>
        <div class="h-full">
          <slot><!-- The router puts views here --></slot>
        </div>
      </vaadin-app-layout>
    `;
   }
 
  languageChange(e : ComboBoxChangeEvent<Language>) {
    const language = e.target.selectedItem;
    if (language) {
      uiStore.lang=language.key;
    }
  }

  createMenuItem(view: ViewRoute) : HTMLTemplateResult {
    if (view.skipMenu) {
      return html`${nothing}`;
    } else {
      const index = view.path.indexOf(":");
      var path : string;
      // Strip possible route paramters
      if (index > 0) {
         path = view.path.substring(0,view.path.indexOf(":"));
      } else {
        path = view.path;
      }
      return html` <a href=${path}><vaadin-icon class="m-s" icon="${view.icon}"></vaadin-icon> ${lang.getText(uiStore.lang, view.title)} </a> `;
    }
  }

  indicatorIcon() : HTMLTemplateResult {
    if (uiStore.offline) {
      return html`<vaadin-icon title=${lang.getText(uiStore.lang, "offline")} icon="vaadin:connect-o"></vaadin-icon>`;
    } else {
      return html`<vaadin-icon title=${lang.getText(uiStore.lang, "online")} icon="vaadin:connect"></vaadin-icon>`;
    }
  }
}
