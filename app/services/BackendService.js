import axios from "axios";
const API = "https://self-isomate-api.appspot.com/api/";

export default class BackendService {

    isLoggedIn() {
        return this.loggedIn;
    }

    login(username, password) {

        console.log(`username: ${username} password: ${password}`);

        return axios.post(API+"login", {
            username: username,
            password: password
        })
        .then((res, err) => {

            if (err) {
                return {success : false, message: err};
            }

            if (res) {

                var loginSuccessful = res.data.loginSuccess;

                if (loginSuccessful) {
                    console.log("login successful");
                    this.loggedIn = true;
                    return { success : true, user: res.data.user };
                } 
                else 
                {
                    console.log("login failed");
                    return { success : false };
                }
            }
        });

    }

    logout() {
        this.loggedIn = false;
    }

    register (user) {
        return axios.post(API+"users", user)
            .then((res) => {
                if (res.data.success) {
                    return { success: true }
                } else {
                    return { success: false }
                }
            });
    }
}