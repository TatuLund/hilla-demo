import { uiStore } from 'Frontend/stores/app-store';
import { html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { nothing } from 'lit-html';
import '@vaadin/login/vaadin-login-form';
import { View } from '../view';
import { Router } from '@vaadin/router';
import { lang } from 'Frontend/util/localization';
import { LoginForm } from '@vaadin/login/vaadin-login-form';
import 'Frontend/components/language-switch';

@customElement('login-view')
export class LoginView extends View {
    @state()
    private error = false;
    @query("#login")
    private loginForm! : LoginForm;

    onBeforeEnter() {
        if (uiStore.loggedIn) {
            Router.go(sessionStorage.getItem("login-redirect-path") || "/");
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.classList.add('flex', 'flex-col', 'items-center', 'justify-center');
    }

    updated() {
        lang.updateLoginFormI18n(this.loginForm, uiStore.lang);
    }

    render() {
        return html`
            <h1>${lang.getText(uiStore.lang, "main-title")}</h1>
            <vaadin-login-form
                id="login"
                class="m-m p-s shadow-m"
                no-forgot-password
                @login=${this.login}
                .error=${this.error}
                ?disabled=${uiStore.offline}
            >
            </vaadin-login-form>
            ${uiStore.offline ? html` <b>${lang.getText(uiStore.lang, "login-offline")}</b> ` : nothing}
            <language-switch></language-switch>
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

