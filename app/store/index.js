import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import RadListView from 'nativescript-ui-listview/vue';
Vue.use(RadListView);
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
		user: {}
    },
    mutations: {
		setUser(state, data) {
			this.state.user = data.user;
		}
    }
});