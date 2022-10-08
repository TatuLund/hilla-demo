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
        document.title = lang.getText(uiStore.lang, "menu-title");
    }
   });
   