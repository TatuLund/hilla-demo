import { TextField, TextFieldChangeEvent } from "@vaadin/text-field";
import { css, html, LitElement } from "lit";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { customElement, property, query } from "lit/decorators.js";
import Cleave from "cleave.js";
import { CleaveOptions } from "cleave.js/options";
import { TooltipController } from "@vaadin/component-base/src/tooltip-controller";

@customElement("live-currency-field")
export class LiveCurrencyField extends LitElement {
  private cleave: Cleave | undefined = undefined;

  @query("#textfield")
  private textField!: TextField;

  @property({ type: Number })
  value: number | null = null;
  @property()
  errorMessage: string | null | undefined = null;
  @property()
  helperText: string | null | undefined = null;
  @property()
  label: string | undefined = undefined;
  @property({ reflect: true })
  theme: string | undefined = undefined;
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;
  @property({ type: Boolean, reflect: true })
  readonly: boolean = false;
  @property({ type: Boolean, reflect: true })
  invalid: boolean = false;
  @property({ type: Boolean, reflect: true })
  required: boolean = false;

  @property({ type: Object })
  config: CleaveOptions = {
    numeral: true,
    prefix: " €",
    tailPrefix: true,
  };

  _tooltipController: TooltipController | undefined;

  static get styles() {
    return css`
      :host {
        --lumo-text-field-size: var(--lumo-size-m);
      }

      vaadin-text-field {
        min-width: 100%;
      }
    `;
  }

  focus() {
    this.textField.focus();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.cleave) {
      this.cleave.destroy();
      this.cleave = undefined;
    }
  }

  firstUpdated(): void {
    this._tooltipController = new TooltipController(this, "tooltip");
    this.addController(this._tooltipController);
    this.cleave = new Cleave(this.textField.inputElement, this.config);
  }

  updated() {
    if (this.value) {
      this.cleave?.setRawValue("" + this.value);
    } else {
      this.textField.value = "";
    }
  }

  private handleChange(e: TextFieldChangeEvent) {
    const raw = this.cleave?.getRawValue();
    if (raw) {
      this.value = parseFloat(raw);
    }
    const event = new CustomEvent("change", {
      detail: this.value,
      composed: true,
      cancelable: true,
      bubbles: true,
    });
    this.dispatchEvent(event);
  }

  render() {
    return html` <vaadin-text-field
        id="textfield"
        theme=${ifDefined(this.theme)}
        @change=${this.handleChange}
        .label=${this.label}
        .helperText=${this.helperText}
        ?disabled=${this.disabled}
        ?invalid=${this.invalid}
        .errorMessage=${this.errorMessage}
        ?readonly=${this.readonly}
        ?required=${this.required}
        @change=${this.handleChange}
      ></vaadin-text-field>
      <slot name="tooltip"></slot>`;
  }
}
