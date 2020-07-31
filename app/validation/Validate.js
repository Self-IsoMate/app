const usernameLength = 5;
const passwordNOSPACELength = 5;
const passwordLength = 8;
const filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;

const FeedbackPlugin = require("nativescript-feedback");
const FeedbackType = require ("nativescript-feedback").FeedbackType;
const feedback = new FeedbackPlugin.Feedback();

export default class Validate {

    validateUsernameLength(usernameString){
        var countUsername = usernameString;
        if (countUsername.replace(/ /g,'').length < usernameLength){
            alert({ title: "Username must be longer", message: "Please insert at leat 5 characters (spaces excluded)" });
            /*feedback.show({
                title: "Username must be longer",
                message: "Please insert at leat 5 characters (spaces excluded)",
                type:
                FeedbackType.Warning
            });*/
            return false
        }
        else return true;
    };


    validatePasswordLength(passwordString){
        var countPassword = passwordString;
        if(countPassword.replace(/ /g,'').length < passwordNOSPACELength || passwordString.length <passwordLength){
            alert({ title: "Password must be longer", message: "Please insert at leat 8 characters (spaces excluded)" });
            /*feedback.show({
                title: "Password must be longer",
                message: "Please insert at leat 8 characters (spaces excluded)",
                type:
                FeedbackType.Error
            });*/
            return false;
        }
    else return true;
    };

    validatePasswordAgainstUsername(password, username){
        if(password == username){
            alert({ title: "Password must be different from username", message: "Please insert a more safe password (different from username)" });
            /*feedback.show({
                title: "Password must be different from username",
                message: "Please insert a more safe password (different from username)",
                type:
                FeedbackType.Error
            });*/
            return false;
    }
    else return true;
    };
    
    validateEmail(emailAddress){
        if( String(emailAddress).search(filter)==-1 ) {
            alert({ title: "Insert a valid email address", message: "Please insert a valid email address (youremail@address.ext)" });
            /*feedback.show({
                title: "Insert a valid email address",
                message: "Please insert a valid email address (youremail@address.ext)",
                type:
                FeedbackType.Error
            });*/
            return false;
    }
    else return true;
    };

    validateConfirmPassword(password, confirmpassword ){
        if( password != confirmpassword) {
            alert({ title: "Passwords need to match", message: "Please confirm your password correctly!" });
              /*feedback.show({
                    title: "Passwords need to match",
                    message: "Please confirm your password correctly!",
                    type:FeedbackType.Error
                });*/
            return false;
    }
    else return true;
    };

    selectPassword(){
        alert({ title: "For a strong password, please use:", message: "A mixture of both uppercase and lowercase letters and numbers (least 8 characters)" });
        /*feedback.show({
            title: "For a strong password, please use:",
            message: "A mixture of both uppercase and lowercase letters and numbers (least 8 characters)",
            type: FeedbackType.Custom
        });*/
    };
}