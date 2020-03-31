import Vue from 'nativescript-vue';
import Vuex from 'vuex';
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