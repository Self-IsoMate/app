import Vue from "nativescript-vue";

import App from "./components/App";

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
  