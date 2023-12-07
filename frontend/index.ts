import { Binder } from '@hilla/form';
import { Router } from '@vaadin/router';
import { routes, ViewRoute } from "./routes";
import { uiStore } from './stores/app-store';
import { lang } from './util/localization';

export const router = new Router(document.querySelector('#outlet'));
router.setRoutes(routes);

window.addEventListener("vaadin-router-location-changed", (e) => {
    const activeRoute = router.location.route as ViewRoute;
    if (activeRoute.title) {
        document.title = lang.getText(uiStore.lang, activeRoute.title);

    } else {
        document.title = lang.getText(uiStore.lang, "main-title");
    }
});

Binder.interpolateMessageCallback = (message, validator, binderNode) => {
    // Try to find a translation for the specific type of validator
    console.log(validator.message);
    let key = `validationError.${validator.message}`;
  
    // Special case for DecimalMin and DecimalMax validators to use different message based on "inclusive" property
    if (['validationError.DecimalMin', 'validationError.DecimalMax'].includes(key)) {
      key += (validator as any).inclusive ? '.inclusive' : '.exclusive';
    }
  
    return lang.getText(uiStore.lang, key);
};