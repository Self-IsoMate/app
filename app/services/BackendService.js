import axios from "axios";
const API = "https://self-isomate-api.appspot.com/api/";
const BUCKET_NAME = "self-isomate-images";
const BUCKET_PROFILE_PICTURES = "https://storage.googleapis.com/self-isomate-images/profile-pictures/";
const BUCKET_POST_IMAGES = "https://storage.googleapis.com/self-isomate-images/post-images/";
var bghttp = require("nativescript-background-http");
import store from "../store/index";
/**
 * TO DO: 
 * something to show that a user is uploading something (will use the store for this);
 */


export default class BackendService {

    isLoggedIn() {
        return this.loggedIn;
    }

    login(username, password) {

        console.log(`username: ${username} password: ${password}`);

        return axios.post(API+"login", { username: username, password: password })
            .then((res) => {

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
                if (err) {
                    console.log(err);
                    return { success: false, message: err };
                }
            });

    }

    logout() {
        this.loggedIn = false;
    }

    register (user) {
        return axios.post(API+"users", user)
            .then((res) => {
                if (res && res.data.success) {
                    return { success: true, user: res.data.user }
                }
                if (res && !res.data.success) {
                    return { success: false, message: res.data.message }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err } 
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

        task.on("error", (err) => {
            if (err) {
                console.log(err);
            }
        });

        task.on("complete", (e) => {
            if (e) {
                this.updateUserProfilePicture(user, link)
                    .then((res) => {
                        if (res) {
                            console.log("inner return");
                            console.log(res);
                            return { newLocation: res.newLocation };
                        }
                    });
                }
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

    async updateUser (userId, newUser) {
        return await axios.put(API+`users/${userId}`, newUser)
            .then((res) => {
                if (res) {
                    return { user: res.data.update };
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
            return axios.get( API + `communities?_id=${id}` )
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

    async deleteAccount(userId) {
        return axios.delete(API + `users/${userId}`)
            .then((res) => {
                if (res) {
                    return { success: res.data.success };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err };
                }
            })
    }

    async getMessagesfromID(chatroomId) {
      
        return axios.get(API+`messages?chatroomID=`+chatroomId)
        .then((res) => {
            return { messages: res.data };
        })
        .catch((err) => {
            if (err) console.log(err);
        })
    }
	
	async saveMessage(userID,chatroomID,message) {
      
        return axios.post(API+"messages", {
                userID: userID,
				chatroomID: chatroomID,
                message: message
        })
        .then((res, err) => {

     
                return {success : true, message: res};  
        
            }).catch((err) => {
                if (err) console.log(err);
            })
    }

    async getChatroomObj(chatroomId) {
      
        return axios.get(API+`chatrooms/`+chatroomId)
        .then((res) => {
            return { chatroom: res.data };
        })
        .catch((err) => {
            if (err) console.log(err);
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
	
	async addChatroom(userID, chatroomID){
        return axios.post(API + 'users/' + userID + "/chatrooms", {"chatroomId": [chatroomID]})
        .then((res) => {
            if (res){
                return {user: res.data.user};
            } 
        })
        .catch((err) => {
            if (err) console.log(err);
        }) 
    }

    async removeChatroom(userID, chatroomID){
        return axios.delete(`${API}users/${userID}/chatrooms/${chatroomID}`)
        .then((res) => {
            if (res){
                return {user: res.data.user};
            } 
        })
        .catch((err) => {
            if (err) console.log(err);
        }) 
    }

    async getUserfromId(userID) {
      
        return axios.get(API+`users?_id=`+userID)
        .then((res) => {
            //console.log("userfromBackend");
            //console.log(res.data.users[0]);
            return { user: res.data.users[0] };
        })
        .catch((err) => {
            if (err) console.log(err);
        })
    }

    async getChatroomIds(userId) {
      
        return axios.get(`${API}users/${userId}/chatrooms`)
        .then((res) => {
            return { chatrooms: res.data.chatrooms }; // return { chatroom: res.data };

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

    async getAllChatrooms(){
        return axios.get(API + 'chatrooms')
        .then((res) => {
            if (res){
                return {chatrooms: res.data};
            } 
        })
        .catch((err) => {
            if (err) console.log(err);
        }) 
    }

    async getAllPosts(){
        return axios.get(API + 'posts')
        .then((res) => {
            if (res){
                return {posts: res.data};
            } 
        })
        .catch((err) => {
            if (err) console.log(err);
        }) 
    }

    async addPost(post) {
        return axios.post(`${API}posts`, post)
            .then((res) => {
                if (res) {
                    if (res.data.success) {
                        console.log("successfully posted");
                        return { success: true, post: res.data.post };
                    }

                    if (!res.data.success) {
                        return { success: false, message: res.data.message };
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err };
                }
            })
    }

    uploadPostImage (image) {
        // checking if image uses android or apple file system uri
        var imageUri = null;

        imageUri = image._android ?? image._ios;

        if (!imageUri) {
            console.log("No image found");
            return;
        }

        var imgArr = imageUri.split('/');

        var name = imgArr.pop();

        var link = BUCKET_POST_IMAGES + name;

        var type = name.split('.').pop();

        var session = bghttp.session("image-upload");

        var request = {
            url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o?uploadType=media&name=post-images/${name}`,
            method: "POST",
            headers: {
                "Content-Type": `image/${type}`
            }
        };

        return { task: session.uploadFile(imageUri, request), link: link };
    }

    async giveImageLink(e, image) {
        console.log("returning image?")
        return { success: true, image: image }
    }

    async getFeed(userId) {
        return axios.get(`${API}/feed/${userId}`)
            .then((res) => {
                if (res && res.data.success) {
                    return { success: true, posts: res.data.feed };
                }

                if (res && !res.data.success) {
                    console.log(res);
                    return { success: false, message: res.data.message }
                }
            })
            .catch((err) => {
                if (err) {
                    console.log(err);
                    return { success: false, message: err };
                }
            })
    }

    async getCommunity(communityId) {
        return axios.get(`${API}/communities/${communityId}`)
            .then((res) => {
                if (res) {
                    if (res.data.success) {
                        return { success: true, community: res.data.community };
                    } else {
                        return { success: false, message: res.data.message };
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.toString() };
                }
            })
    }

}