import Vue from 'nativescript-vue'
import Home from './components/Home'

Vue.config.silent = true

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

import routes from "./routes/routes";

import BackendService from "./services/BackendService";

Vue.config.silent = false;


Vue.registerElement(
  'CheckBox',
  () => require('@nstudio/nativescript-checkbox').CheckBox,
  {
    model: {
      prop: 'checked',
      event: 'checkedChange'
    }
  }
);

new Vue({
    render: h => h("frame", [h(routes.loginMain)])
  }).$start();
  
