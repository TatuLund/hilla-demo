import { html } from "lit";
import { customElement }  from "lit/decorators.js"
import { View } from "../view";
import "@vaadin/charts";
import "@vaadin/notification";
import "@vaadin/charts/src/vaadin-chart-series";
import { dashboardViewStore } from "./dashboard-view-store";
import { uiStore } from "Frontend/stores/app-store";

@customElement("dashboard-view")
export class DashboardView extends View {
  connectedCallback() {
    super.connectedCallback();
    this.classList.add("flex", "flex-col", "items-center", "pt-xl");
  }

  getCompanyStats() {
    if (dashboardViewStore.companyStats.length === 0) {
      return html`<p>Loading stats...</p>`;
    } else {
      return html`
      <vaadin-chart
        @point-click=${this.companyClicked} 
        tooltip
        style="width: 500px" type="column" title="Company">
        <vaadin-chart-series
          .values=${dashboardViewStore.companyStats}
        ></vaadin-chart-series>
      </vaadin-chart>
    `;
    }
  }

  getStatusStats() {
    if (dashboardViewStore.statusStats.length === 0) {
      return html`<p>Loading stats...</p>`;
    } else {
      return html`
      <vaadin-chart 
        @point-click=${this.statusClicked} 
        tooltip
        style="width: 500px" type="pie" title="Status">
        <vaadin-chart-series          
          .values=${dashboardViewStore.statusStats}
        ></vaadin-chart-series>
      </vaadin-chart>
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

  render() {
    return html`
    <div class="m-m p-s border rounded-m text-primary text-xl font-bold">
      ${dashboardViewStore.contactCount} contacts
    </div>
    <div class="m-m -p-s shadow-m flex flex-row flex-wrap">
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

