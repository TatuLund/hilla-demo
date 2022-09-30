import { html } from "lit";
import { customElement, query }  from "lit/decorators.js"
import { View } from "../view";
import "@vaadin/charts";
import "@vaadin/notification";
import "@vaadin/charts/src/vaadin-chart-series";
import { dashboardViewStore } from "./dashboard-view-store";
import { uiStore } from "Frontend/stores/app-store";
import type { Options } from 'highcharts';

@customElement("dashboard-view")
export class DashboardView extends View {

  @query("#chart1")
  chart1! : any;
  @query("#chart2")
  chart2! : any;
  
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("flex", "flex-col", "items-center", "pt-xl");
  }

  // Options can be used for many kinds of advanced configuration settings
  // for vaadin-chart. The vaadin-chart has some attributes and 
  // properties for quick configuration.
  tooltipFormatter : Options = {
    tooltip: {
      formatter: function() {
        return this.point.name +": <b>" + this.point.y + "</b>";
      }
    }
  }

  getCompanyStats() {
    if (dashboardViewStore.contactCount === 0) {
      return html`<p>Loading stats...</p>`;
    } else {
      return html`
      <div class="chart-wrapper">
        <vaadin-chart
          @point-click=${this.companyClicked} 
          tooltip
          .additionalOptions=${this.tooltipFormatter}
          type="column" title="Company">
          <vaadin-chart-series
            .values=${dashboardViewStore.companyStats}
          ></vaadin-chart-series>
        </vaadin-chart>
      </div>
    `;
    }
  }

  getStatusStats() {
    if (dashboardViewStore.contactCount === 0) {
      return html`<p>Loading stats...</p>`;
    } else {
      return html`
      <div class="chart-wrapper" >
        <vaadin-chart 
          @point-click=${this.statusClicked} 
          tooltip
          .additionalOptions=${this.tooltipFormatter}
          type="pie" title="Status">
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
      uiStore.showError("Offline: Can't fetch new data.");
      return;
    }
    window.location.assign(e.detail.point.point.name);
  }

  private statusClicked(e : CustomEvent) {
    if (uiStore.offline) {
      uiStore.showError("Offline: Can't fetch new data.");
      return;
    }
    window.location.assign("none/"+e.detail.point.point.name);
  }

  // vaadin-notification open state is bound to uiStore.message.open
  // The rest of the logic is in ui-store.ts
  render() {
    return html`
    <div class="m-m p-s border rounded-m text-primary text-xl font-bold">
      ${dashboardViewStore.contactCount} contacts
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

