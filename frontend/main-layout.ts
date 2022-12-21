import { html, HTMLTemplateResult, nothing, PropertyValueMap } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Layout } from "./views/view";
import "@vaadin/app-layout";
import "@vaadin/app-layout/vaadin-drawer-toggle";
import { uiStore } from "./stores/app-store";
import "@vaadin/icon";
import "@vaadin/icons";
import "@vaadin/select";
import "@vaadin/tooltip";
import { ViewRoute, views } from "./routes";
import { lang } from "./util/localization";
import "Frontend/components/language-switch";
import { router } from ".";
import { ifDefined } from "lit-html/directives/if-defined.js";

@customElement("main-layout")
export class MainLayout extends Layout {
  @state()
  dense = false;

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("flex", "h-full", "w-full");
  }

  firstUpdated() {
    window.addEventListener("vaadin-router-location-changed", (e) =>
      this.refresh()
    );
  }

  // Generate menu in drawer from the routes
  render() {
    return html`
      <vaadin-app-layout class="h-full w-full">
        <header
          slot="navbar"
          class="border-b border-contrast-30 w-full flex items-center px-m"
        >
          <vaadin-drawer-toggle></vaadin-drawer-toggle>
          <h1 class="text-l m-m">
            ${lang.getText(uiStore.lang, "main-title")}
          </h1>
          ${this.indicatorIcon()}
          <a href="/logout" class="ms-auto px-m" ?hidden=${uiStore.offline}>
            <vaadin-icon class="m-s" icon="vaadin:key"></vaadin-icon>
            ${lang.getText(uiStore.lang, "main-logout")}
          </a>

          <vaadin-icon
            @click=${this.switchZoom}
            icon=${this.dense
              ? "vaadin:expand-square"
              : "vaadin:compress-square"}
            ><vaadin-tooltip
              slot="tooltip"
              text=${lang.getText(uiStore.lang, "main-zoom-toggle")}
            ></vaadin-tooltip
          ></vaadin-icon>
        </header>

        <div class="h-full" slot="drawer">
          <div class="flex flex-col h-full m-l spacing-b-s ">
            ${views.map((view) => this.createMenuItem(view))}
            <language-switch class="mt-auto"></language-switch>
          </div>
        </div>
        <div class="h-full">
          <slot><!-- The router puts views here --></slot>
        </div>
      </vaadin-app-layout>
    `;
  }

  private createMenuItem(view: ViewRoute): HTMLTemplateResult {
    if (view.skipMenu) {
      return html`${nothing}`;
    } else {
      const index = view.path.indexOf(":");
      var path: string;
      // Strip possible route paramters
      if (index > 0) {
        path = view.path.substring(0, view.path.indexOf(":"));
      } else {
        path = view.path;
      }
      return html`<a
        class=${router.location.route?.path.includes(path)
          ? "rounded-s shadow-xs"
          : ""}
        href=${path}
        ><vaadin-icon class="m-s" icon="${ifDefined(view.icon)}"></vaadin-icon>
        ${lang.getText(uiStore.lang, view.title)}
      </a> `;
    }
  }

  private switchZoom(): void {
    this.dense = !this.dense;
    if (this.dense) {
      document.documentElement.setAttribute("theme", "dense");
    } else {
      document.documentElement.removeAttribute("theme");
    }
  }

  private refresh() {
    this.requestUpdate();
  }

  private indicatorIcon(): HTMLTemplateResult {
    if (uiStore.offline) {
      return html`<vaadin-icon icon="vaadin:connect-o"
        ><vaadin-tooltip
          slot="tooltip"
          text=${lang.getText(uiStore.lang, "offline")}
        ></vaadin-tooltip
      ></vaadin-icon>`;
    } else {
      return html`<vaadin-icon icon="vaadin:connect"
        ><vaadin-tooltip
          slot="tooltip"
          text=${lang.getText(uiStore.lang, "online")}
        ></vaadin-tooltip
      ></vaadin-icon>`;
    }
  }
}
