import Vue from 'nativescript-vue'
import Home from './components/Home'
import userStore from "./store/index";
import routes from "./routes/routes";
import Vuex from "vuex";
//import Vue from 'vue'
import RadListView from 'nativescript-ui-listview/vue';
import VueTimers from 'vue-timers'
 
Vue.use(VueTimers)
Vue.use(RadListView);
Vue.use(Vuex);


// Vue.config.silent = true;

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);

Vue.config.silent = false;

new Vue({
    render: h => h("frame", [h(routes.loginMain)]),
    store: userStore
  }).$start();
  
