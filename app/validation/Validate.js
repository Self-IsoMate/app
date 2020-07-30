const usernameLength = 5;
const passwordNOSPACELength = 5;
const passwordLength = 8;
export default class Validate {

     filterEmail() {
        var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
        return filter;
    };

    validateUsername(usernameString){
        var countUsername = usernameString;
        if (countUsername.replace(/ /g,'').length < usernameLength){
            this.feedback.show({
                title: "Username must be longer",
                message: "Please insert at leat 5 characters (spaces excluded)",
                type:
                FeedbackType.Warning
            });
            return false
        }
        else return true;
    };


    validatePassword(passwordString){
        var countPassword = passwordString;
        if(countPassword.replace(/ /g,'').length < passwordNOSPACELength || passwordString.length <passwordLength){
            this.feedback.show({
                title: "Password must be longer",
                message: "Please insert at leat 8 characters (spaces excluded)",
                type:
                FeedbackType.Error
            });
            return false;
        }
    else return true;
    };
}