import { html, HTMLTemplateResult } from "lit";
import { customElement, query }  from "lit/decorators.js"
import { View } from "../view";
import "@vaadin/charts";
import "@vaadin/notification";
import "@vaadin/charts/src/vaadin-chart-series";
import { dashboardViewStore } from "./dashboard-view-store";
import { uiStore } from "Frontend/stores/app-store";
import type { Options } from 'highcharts';
import { Router } from "@vaadin/router";
import { lang } from "Frontend/util/localization";
import "@vaadin/progress-bar"
import { listViewStore } from "../list/list-view-store";

@customElement("dashboard-view")
export class DashboardView extends View {

  connectedCallback() {
    super.connectedCallback();
    this.classList.add("flex", "flex-col", "items-center", "pt-xl");
  }

  // Options can be used for many kinds of advanced configuration settings
  // for vaadin-chart. The vaadin-chart has some attributes and 
  // properties for quick configuration.
  private getChartOptions() : Options {
    const options : Options = {
      tooltip: {
        formatter: function() {
          return this.point.name +": <b>" + this.point.y + "</b>";
        }
      },
      yAxis: {
        title: {
          text: lang.getText(uiStore.lang, "dashboard-yaxis")
        }
      }
    }
    return options;
  }

  private getLoadingIndicator() : HTMLTemplateResult {
    return html`
    <div class="chart-wrapper flex flex-col items-center justify-center">
      <vaadin-progress-bar
        style="width: 50%"
        indeterminate
      ></vaadin-progress-bar>
    </div>`;
  }

  private getCompanyStats() : HTMLTemplateResult {
    if (dashboardViewStore.contactCount === 0) {
      return this.getLoadingIndicator();
    } else {
      return html`
      <div class="chart-wrapper">
        <vaadin-chart
          @point-click=${this.companyClicked} 
          tooltip
          .additionalOptions=${this.getChartOptions()}
          type="column" 
          title=${lang.getText(uiStore.lang, "company")}>
          <vaadin-chart-series
            .values=${dashboardViewStore.companyStats}
            title=${lang.getText(uiStore.lang, "dashboard-contacts-company")}
          ></vaadin-chart-series>
        </vaadin-chart>
      </div>
    `;
    }
  }

  private getStatusStats() : HTMLTemplateResult {
    if (dashboardViewStore.contactCount === 0) {
      return this.getLoadingIndicator();
    } else {
      return html`
      <div class="chart-wrapper" >
        <vaadin-chart 
          @point-click=${this.statusClicked} 
          tooltip
          .additionalOptions=${this.getChartOptions()}
          type="pie"
          title=${lang.getText(uiStore.lang, "status")}>
          <vaadin-chart-series          
            .values=${dashboardViewStore.statusStats}
          ></vaadin-chart-series>
        </vaadin-chart>
      </div>
    `;
    }
  }

  // Navigate to ListView using company as url parameter
  private companyClicked(e : CustomEvent) {
    if (uiStore.offline) {
      uiStore.showError(lang.getText(uiStore.lang, "error-offline"));
      return;
    }
    Router.go(e.detail.point.point.name);
  }

  private statusClicked(e : CustomEvent) {
    if (uiStore.offline) {
      uiStore.showError(lang.getText(uiStore.lang, "error-offline"));
      return;
    }
    if (e.detail.point) {
      let company = "none"
      if (listViewStore.company) {
        company=listViewStore.company;
      }
      Router.go(company+"/"+e.detail.point.point.className);
    }
  }

  // vaadin-notification open state is bound to uiStore.message.open
  // The rest of the logic is in ui-store.ts
  render() {
    return html`
    <div class="m-m p-s border rounded-m text-primary text-xl font-bold">
      ${dashboardViewStore.contactCount} ${lang.getText(uiStore.lang, "dashboard-contacts")}
    </div>
    <div class="dashboard-wrapper m-m p-s shadow-m flex flex-row flex-wrap">
    ${this.getCompanyStats()}
    ${this.getStatusStats()}
    </div>
    <vaadin-notification
        theme=${uiStore.message.error ? "error" : "contrast"}
        position="middle"
        .opened=${uiStore.message.open}
        .renderer=${(root: HTMLElement) =>
        (root.textContent = uiStore.message.text)}
      ></vaadin-notification>
  `;
  }
}

