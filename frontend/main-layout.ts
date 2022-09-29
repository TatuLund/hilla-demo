import { html, HTMLTemplateResult, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Layout } from './views/view';
import '@vaadin/app-layout';
import '@vaadin/app-layout/vaadin-drawer-toggle';
import { uiStore } from './stores/app-store';
import '@vaadin/icon'
import '@vaadin/icons'
import { ViewRoute, views } from './routes';
 
@customElement('main-layout')
export class MainLayout extends Layout {
 connectedCallback() {
   super.connectedCallback();
   this.classList.add('flex', 'h-full', 'w-full');
 }

 // Generate menu in drawer from the routes
 render() {
    return html`
      <vaadin-app-layout class="h-full w-full">
        <header slot="navbar" class="border-b border-contrast-30 w-full flex items-center px-m">
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1 class="text-l m-m">Vaadin CRM</h1>
          ${this.indicatorIcon()}
          <a href="/logout" class="ms-auto px-m" ?hidden=${uiStore.offline}><vaadin-icon class="m-s" icon="vaadin:key"></vaadin-icon>Log out</a>
        </header>
    
        <div slot="drawer">
          <div class="flex flex-col h-full m-l spacing-b-s ">
            ${views.map(
              (view) => this.createMenuItem(view)
            )}
          </div>
        </div>
        <div class="h-full">
          <slot><!-- The router puts views here --></slot>
        </div>
      </vaadin-app-layout>
    `;
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
      return html` <a href=${path}><vaadin-icon class="m-s" icon="${view.icon}"></vaadin-icon> ${view.title} </a> `;
    }
  }

  indicatorIcon() : HTMLTemplateResult {
    if (uiStore.offline) {
      return html`<vaadin-icon title="Offline" icon="vaadin:connect-o"></vaadin-icon>`;
    } else {
      return html`<vaadin-icon title="Online" icon="vaadin:connect"></vaadin-icon>`;
    }
  }
}
