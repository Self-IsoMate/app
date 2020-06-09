import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as ApplicationSettings from "application-settings";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
		user: {},
		spamFilterCount: 0,
		lastPosted: null // last time this device created a post
    },
    mutations: {
		setUser(state, data) {
			this.state.user = data.user;
			ApplicationSettings.setString("user", JSON.stringify(data.user));
		},
		setUserProfilePicture(state, data) {
			this.state.user.profilePicture = data.profilePicture;
		},
		clearUser(state) {
			this.state.user = false;
			ApplicationSettings.remove("user");
		},
		loadFromStorage(state) {
			const storedState = ApplicationSettings.getString("user");
			if(storedState) {
				const user = JSON.parse(storedState);
				this.state.user = user;
			}
		},
	}
});
