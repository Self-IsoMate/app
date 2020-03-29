import Vue from 'nativescript-vue'
import Home from './components/Home'

Vue.config.silent = true

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

import routes from "./routes/routes";

import BackendService from "./services/BackendService";

Vue.config.silent = false;

new Vue({
    render: h => h("frame", [h(routes.loginMain)])
  }).$start();
  
