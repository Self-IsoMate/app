import axios from "axios";
const API = "https://self-isomate-api.appspot.com/api/";
const {Storage} =  require("@google-cloud/storage");

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

        return this.uploadImage(imageUri, user)
            .then((response) => {
                if (response) console.log("successfully uploaded image");
            })
            .catch((err) => console.log(err));
    }

    async uploadImage(imageUri, user) {
        const bucketName = "";
        const storage = new Storage({keyFilename: "../../secrets/key.json"});

        return storage.bucket(bucketName).upload(imageUri, {
            gzip: true,
            // destination: user.username + "profilePicture.png",
            metadata: {
              cacheControl: 'no-cache',
            },
          });
    }
}