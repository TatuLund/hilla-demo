import { TextField, TextFieldChangeEvent } from "@vaadin/text-field";
import "@vaadin/text-field";
import { css, html, LitElement } from "lit";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { customElement, property, query } from "lit/decorators.js";
import currencyField from "input-currency-field";

@customElement("currency-field")
export class CurrencyField extends LitElement {

    @query("#textfield")
    private textField! : TextField;

    @property()
    value : number | null = null;
    @property()
    errorMessage : string | null = null;
    @property()
    helperText : string | null = null;
    @property()
    label : string | undefined = undefined;
    @property({reflect: true})
    theme : string | undefined = undefined;
    @property({reflect: true})
    disabled : boolean | undefined = undefined;
    @property({reflect: true})
    readonly : boolean | undefined = undefined;
    @property({reflect: true})
    invalid : boolean | undefined = undefined;

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

    private config = {
        decimalSymbol: ',',
        allowedDecimalSymbols: ',.',
        postfix: ' €',
        thousandsSeparator: '.',
    }

    focus() {
        this.textField.focus();
    }

    updated() {
        if (this.value) {
            const displayValue = currencyField.format(""+this.value, this.config);
            this.textField.value = displayValue;
        } else {
            this.textField.value = "";
        }
    }

    private handleChange(e: TextFieldChangeEvent) {
        this.value = currencyField.parse(e.target.value, this.config);
        const displayValue = currencyField.format(""+this.value, this.config);
        this.textField.value = displayValue;
        const event = new CustomEvent("change", {
            detail: this.value,
            composed: true,
            cancelable: true,
            bubbles: true
        });
        this.dispatchEvent(event);
    }

    render() {
        return html`
            <vaadin-text-field
                id="textfield"
                theme=${ifDefined(this.theme)}
                .label=${this.label}
                .errorMessage=${this.errorMessage}
                .helperText=${this.helperText}
                disabled=${ifDefined(this.disabled)}
                readonly=${ifDefined(this.readonly)}
                invalid=${ifDefined(this.invalid)}
                @change=${this.handleChange}
            ></vaadin-text-field>`;
    }
}

