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
        })
        .catch((err) => {
            if (err) console.log(err);
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

    async getProfilePosts(user) {
        return axios.get(API+`posts?user.username=${user.username}`)
            .then((res) => {
                return { posts: res.data };
            })
            .catch((err) => {
                if (err) console.log(err);
            })
    }


    async getChallenges() {
        return axios.get(API + 'challenges')
        .then((res) => {
            if (res) {
                return {challenges: res.data};
            }
        })
        .catch((err) => {
            if (err) console.log(err);
        })
    }

    async getCategories() {
        return axios.get(API+'categories?isChild=false')
            .then((res) => {
                if (res) {
                    return { categories: res.data }
                }
            })
            .catch((err) => {
                if (err)
                    return { success: false, message: err }
            })
    }

    async getSubcategories(parent) {
        return axios.get( API + `categories?parentId=${parent._id}` )
            .then((res) => {
                if (res) {
                    return { subcategories: res.data }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err }
                }
            })
    }

    async getCommunities(communityIds) {
        var promises = communityIds.map((id) => {
            return axios.get( `API + communities?_id=${id}` )
        });

        return Promise.all(promises)
            .then((res) => {
                if (res) {
                    var commies = res.map((r) => r.data[0]);
                    return { success: true, communities: commies }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success : false, message: err }
                }
            })
    }
    async getAllCommunities() {
        return axios.get(API + 'communities')
        .then((res) => {
            if (res) {
                return {communities: res.data};
            }
        })
        .catch((err) => {
            if (err) console.log(err);
        })
    }
      
    async getResources(categoryId) {
        return axios.get( API + `resources?categoryId=${categoryId}` )
            .then((res) => {
                if (res && res.data.success) {
                    return { success: res.data.success, resources: res.data.resources };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err };
                }
            })
    }

    async subscribeUserToCommunity(user, communityId) {
        return axios.post( API + `users/${user._id}/communities`, { communityId: communityId })
            .then((res) => {
                if (res && res.data.success) {
                    return { success: true, user: res.data.user };
                }

                if (res && !res.data.success) {
                    return { success: false, message: res.data.message };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err }
                }
            })
    }

    async unSubscribeUserFromCommunity(user, communityId) {
        return axios.delete( API + `users/${user._id}/communities/${communityId}`)
            .then((res) => {
                if (res && res.data.success) {
                    return { success: true, user: res.data.user };
                }

                if (res && !res.data.success) {
                    console.log(res);
                    return { success: false, message: res.data.message };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err }
                }
            })
    }

}