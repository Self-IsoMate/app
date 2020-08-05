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
            alert({ title: "Passwords need to match", message: "Please check both password values! They must be the same!" });
              /*feedback.show({
                    title: "Passwords need to match",
                    message: "Please check both password values! They must be the same!",
                    type:FeedbackType.Error
                });*/
            return false;
    }
    else return true;
    };

    validateConfirmEmail(email, confirmEmail ){
        if( email != confirmEmail) {
            alert({ title: "Email addresses do not match", message: "Please check both email address values! They must be the same!" });
              /*feedback.show({
                        title: "Email addresses do not match",
                        message: "Please check both email address values! They must be the same!",
                        type:
                        FeedbackType.Error
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

    emptySettingChanges(emailAddress, newPassword){
        if(!emailAddress && !newPassword){
            alert({ title: "To update your email or password please fill the form:", message: "You can update your email address and password here! \nYou can also edit or delete your profile" });
            /*feedback.show({
                    title: "To update your email or password please fill the form:",
                    message: "You can update your email address and password here! \nYou can also edit or delete your profile",
                    type:
                    FeedbackType.Warning
                });*/
                return false;
            }
            else return true;
            };

    validateEmptyPost(body){
        if(body == "") {
            alert({ title: "Body Required", message: "Cannot send an empty post" });
            /*feedback.show({
                title: 'Body Required',
                message: 'Cannot send an empty post',
                type: FeedbackType.Warning
            });*/
                return false;
            }
            else return true;
            };

    validateTitlePost(title){
        if(title == "") {
            alert({ title: "Title Required", message: "Your post must have a title!" });
            /*feedback.show({
				title: 'Title required',
				message: "Your post must have a title!",
				type: FeedbackType.Custom
			});*/

                return false;
            }
            else return true;
            };
 
    spamDetection(lastPosted){
        var today = new Date();
		if(lastPosted!=null) {
            console.log(lastPosted);
			var diffMs = (today - lastPosted); 
			var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
			if (diffMins < 4) {
                alert({ title: "Spam detected", message: "Please wait before adding another post" });
				/*feedback.show({
                    title: "Spam detected",
                    message: "Please wait before adding another post",
                    type: FeedbackType.Warning
                    });*/
        return false
                }
        else return true;
			}else return true;
            };            

    validateCommunities(communities){
		if (communities.length < 1) {
            alert({ title: "Community Required", message: "Select at least a community to post to" });
			/*feedback.show({
				title: "Community Required:",
				message: "Select a community to post to",
				type: FeedbackType.Warning
                });*/
        return false;
            }
        else return true;
    };

        }