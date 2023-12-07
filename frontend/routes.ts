import { Commands, Context, Route, Router } from '@vaadin/router';
import './views/dashboard/dashboard-view';
import './views/list/list-view';
import "./main-layout";
import "./views/login/login-view";
import { uiStore } from './stores/app-store';
import { autorun } from 'mobx';

// Extend Route with new capabilities like icon
export type ViewRoute = Route & { skipMenu?: boolean; icon?: string; title?: string; children?: ViewRoute[] };

const authGuard = async (context: Context, commands: Commands) => {
  if (location.pathname !== "/login") {
    sessionStorage.setItem("login-redirect-path", context.pathname);
  }
  if (!uiStore.loggedIn) {
    // Save requested path
    return commands.redirect("/login");
  }
  return undefined;
};

export const views: ViewRoute[] = [
  // for client-side, place routes below (more info https://vaadin.com/docs/v19/flow/typescript/creating-routes.html)

  // Note: When using route parameters in the default route, place it last, otherwise "dashboard" will be picked as route parameter
  {
    path: 'dashboard',
    component: 'dashboard-view',
    icon: 'vaadin:chart',
    title: 'menu-dashboard',
  },
  {
    path: '/:company?/:status?',
    component: 'list-view',
    icon: 'vaadin:user',
    title: 'menu-contacts',
  },

];

export const routes: ViewRoute[] = [
  { path: "login", component: "login-view" },
  {
    path: "logout",
    action: (_: Context, commands: Commands) => {
      uiStore.logout();
      return commands.redirect("/login");
    },
  },
  {
    path: '',
    component: 'main-layout',
    children: views,
    action: authGuard,
  },
];

autorun(() => {
  if (uiStore.loggedIn) {
    Router.go(sessionStorage.getItem("login-redirect-path") || "/");
  } else {
    if (location.pathname !== "/login") {
      sessionStorage.setItem("login-redirect-path", location.pathname);
      Router.go("/login");
    }
  }
});


