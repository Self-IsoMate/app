export default class BackendService {
    isLoggedIn() {
        return false;
    }

    login(user) {
        this.loggedIn = true;
    }

    logout() {
        this.loggedIn = false;
    }
}