import Vue from 'nativescript-vue'
import Home from './components/Home'
import userStore from "./store/index";
import routes from "./routes/routes";
import Vuex from "vuex";
//import Vue from 'vue'
import RadListView from 'nativescript-ui-listview/vue';
import VueTimers from 'vue-timers';
 
Vue.use(VueTimers)
Vue.use(RadListView);
import SideBar from "./components/SideBar";
import NavBar from "./components/NavBar";
Vue.use(Vuex);

import { Video } from 'nativescript-videoplayer';

// Vue.config.silent = true;
Vue.registerElement('AutoFocusView', () => require('./auto-focus-view').AutoFocusView)
Vue.registerElement("VideoPlayer", () => require('nativescript-videoplayer').Video);
Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer);
Vue.registerElement('RadListView ', () => require('nativescript-ui-listview/vue').RadListView);
Vue.registerElement("CardView", () => require('nativescript-cardview').CardView);
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
Vue.component('SideBar', SideBar);
Vue.component('NavBar', NavBar);

Vue.config.silent = false;

new Vue({
    render: h => h("frame", [h(routes.loginMain)]),
    store: userStore
  }).$start();
  
