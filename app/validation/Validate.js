export default class Validate {

     filterEmail() {
        var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return filter;
    };

    validateUsername(usernameString){
        var countUsername = usernameString;
        return countUsername.replace(/ /g,'').length < 5;
    };

    validatePassword(passwordString){
        var countPassword = passwordString;
        return countPassword.replace(/ /g,'').length < 5 || passwordString.length <8;
    };
}