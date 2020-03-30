import Vue from 'nativescript-vue';
import Vuex from 'vuex';
import * as ApplicationSettings from "application-settings";

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
		userId: "",
		isLoggedIn: false
    },
    mutations: {
        load(state) {
            if(ApplicationSettings.getString("store")) {
                this.replaceState(
                    Object.assign(state, JSON.parse(ApplicationSettings.getString("store")))
                );
            }
        },
        save(state, data) {
            state.firstname = data.firstname;
            state.lastname = data.lastname;
		},
		saveUser(state, data) {
			state.userId = data.userId
		}
    }
});

Vue.prototype.$store = store;

module.exports = store;