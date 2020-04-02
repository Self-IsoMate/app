import axios from "axios";
const API = "https://self-isomate-api.appspot.com/api/";
const BUCKET_NAME = "self-isomate-images";
const BUCKET_PROFILE_PICTURES = "https://storage.googleapis.com/self-isomate-images/profile-pictures/";
var bghttp = require("nativescript-background-http");


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

    async changeProfilePicture (user) {
        // checking if image uses android or apple file system uri
        var imageUri = null;

        imageUri = user.profilePicture._android ?? user.profilePicture._ios;

        if (!imageUri) {
            console.log("No image found");
            return;
        }

        var imgArr = imageUri.split('/');

        var name = user.username + imgArr.pop();

        var link = BUCKET_PROFILE_PICTURES + name;

        var type = name.split('.').pop();

        var session = bghttp.session("image-upload");

        var request = {
            url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o?uploadType=media&name=profile-pictures/${name}`,
            method: "POST",
            headers: {
                "Content-Type": `image/${type}`
            }
        };

        var task = session.uploadFile(imageUri, request);

        task.on("error", (err) => console.log(err));
        task.on("complete", (e) => {
            this.updateUserProfilePicture(user, link);
        });

    }

    async updateUserProfilePicture (user, imageLink) {
        console.log("updateUserProfilePicture");
        user.profilePicture = imageLink;

        return await axios.put(API+`users/${user._id}`, user)
            .then((res) => {
                if (res) {
                    return { newLocation: imageLink };
                }
            })
            .catch((err) => {
                if (err) console.log(err);
            })
    }
}