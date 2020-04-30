import Vue from 'nativescript-vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
		user: {},
		spamFilterCount: 0,
		datePosted:null
    },
    mutations: {
		setUser(state, data) {
			this.state.user = data.user;
		},
		setUserProfilePicture(state, data) {
			console.log("we're setting it up!!!");
			this.state.user.profilePicture = data.profilePicture;
		}
    }
});