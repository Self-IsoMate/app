import Vue from "nativescript-vue";

import App from "./components/App";

import routes from "./routes/routes";

import BackendService from "./services/BackendService";

new Vue({
    render: h => h("frame", [h(routes.forgot)])
  }).$start();
  