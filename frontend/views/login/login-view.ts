
import { uiStore } from 'Frontend/stores/app-store';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { nothing } from 'lit-html';
import '@vaadin/login/vaadin-login-form';
import { View } from '../view';

@customElement('login-view')
export class LoginView extends View {
    @state()
    private error = false;

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
    }

    render() {
        return html`
            <h1>Vaadin CRM</h1>
            <vaadin-login-form
                class="m-m p-s shadow-m"
                no-forgot-password
                @login=${this.login}
                .error=${this.error}
                ?disabled=${uiStore.offline}
            >
            </vaadin-login-form>
            ${uiStore.offline ? html` <b>You are offline. Login is only available while online.</b> ` : nothing}
        `;
    }

    async login(e: CustomEvent) {
        try {
            await uiStore.login(e.detail.username, e.detail.password);
        } catch (err) {
            this.error = true;
        }
    }
}

