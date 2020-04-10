import Vue from 'nativescript-vue'
import Home from './components/Home'
import userStore from "./store/index";
import routes from "./routes/routes";
import Vuex from "vuex";
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
Vue.use(Vuex);


// Vue.config.silent = true;

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);
Vue.registerElement("CardView", () => require('nativescript-cardview').CardView);
Vue.component('SideBar', SideBar);
Vue.component('NavBar', NavBar);

Vue.config.silent = false;

new Vue({
    render: h => h("frame", [h(routes.loginMain)]),
    store: userStore
  }).$start();
  
