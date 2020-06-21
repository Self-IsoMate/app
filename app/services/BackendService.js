import axios from "axios";
const API = "https://self-isomate-api.appspot.com/api/";
const BUCKET_NAME = "self-isomate-images";
const BUCKET_NAME_VIDEOS = "self-isomate-videos";
const BUCKET_PROFILE_PICTURES = "https://storage.googleapis.com/self-isomate-images/profile-pictures/";
const BUCKET_POST_IMAGES = "https://storage.googleapis.com/self-isomate-images/post-images/";
const BUCKET_POST_VIDEOS = "https://storage.googleapis.com/self-isomate-videos/post-videos/";
var bghttp = require("nativescript-background-http");


export default class BackendService {

    isLoggedIn() {
        return this.loggedIn;
    }

    login(username, password) {

        return axios.post(API+"login", { username: username, password: password })
            .then((res) => {

                if (res) {
                    if (res.data.success) {
                        this.loggedIn = true;
                        return { success : true, user: res.data.user };
                    } 
                    else 
                    {
                        return { success : false };
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message };
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
                    return { success: false, message: err.message } 
                }
            });
    }

    async changeProfilePicture (user) {
        // checking if image uses android or apple file system uri
        var imageUri = null;

        imageUri = user.profilePicture._android ?? user.profilePicture._ios;

        if (!imageUri) {
            return { success: false, message: 'Image not found' } 
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

        return { task: session.uploadFile(imageUri, request), data: { link: link, user: user } };
    }

    async updateUserProfilePicture (user, imageLink) {
        //console.log("updateUserProfilePicture");
        user.profilePicture = imageLink;

        return await axios.put(API+`users/${user._id}`, user)
            .then((res) => {
                if (res.data.success) {
                    return { success: true, newLocation: user.profilePicture };
                }
            })
            .catch((err) => {
                if (err)
                    return { success: false, message: err.message } 
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
                if (err) {
                    return { success: false, message: err.message } 
                }
            })
    }

    async getProfilePosts(user) {
        return axios.get(API+`posts?user.username=${user.username}`)
            .then((res) => {
                return { posts: res.data };
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message } 
                }
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
                    return { success: false, message: err.message }
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
                    return { success: false, message: err.message }
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
                    return { success : false, message: err.message }
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
                    return { success: false, message: err.message };
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
                    return { success: false, message: err.message }
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
                    return { success: false, message: res.data.message };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message }
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
                    return { success: false, message: err.message };
                }
            })
    }

    async getMessagesfromID(chatroomId) {
      
        return axios.get(API+`messages?chatroomID=`+chatroomId)
        .then((res) => {
            return { messages: res.data };
        })
        .catch((err) => {
            if (err) {
                return { success: false, message: err.message } 
            }
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
                if (err) {
                    return { success: false, message: err.message } 
                }
            })
    }

    async getChatroomObj(chatroomId) {
      
        return axios.get(API+`chatrooms/`+chatroomId)
        .then((res) => {
            return { chatroom: res.data };
        })
        .catch((err) => {
            if (err) {
                return { success: false, message: err.message } 
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
            if (err) {
                return { success: false, message: err.message } 
            }
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
            if (err) {
                return { success: false, message: err.message } 
            }
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
            if (err) {
                return { success: false, message: err.message } 
            }
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
            if (err) {
                return { success: false, message: err.message } 
            }
        }) 
    }

    async getUserfromId(userID) {
      
        return axios.get(API+`users?_id=`+userID)
        .then((res) => {
            return { user: res.data.users[0] };
        })
        .catch((err) => {
            if (err) {
                return { success: false, message: err.message } 
            }
        })
    }

    async getChatroomIds(userId) {
      
        return axios.get(`${API}users/${userId}/chatrooms`)
        .then((res) => {
            return { chatrooms: res.data.chatrooms }; // return { chatroom: res.data };

        })
        .catch((err) => {
            if (err) {
                return { success: false, message: err.message } 
            }
        })
    }
	
	async getProfilePosts(user) {
        return axios.get(API+`posts?user.username=${user.username}`)
            .then((res) => {
                return { posts: res.data };
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message } 
                }
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
            if (err) {
                return { success: false, message: err.message } 
            }
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
            if (err) {
                return { success: false, message: err.message } 
            }
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
                    return { success: false, message: err.message };
                }
            })
    }

    async removeMediaFromCloud( postBucketName, postFilename ) {
        return axios.post(`${API}/gcloud/posts`, { bucketName : postBucketName, filename : postFilename })
            .then((res) => {
                if (res) {
                    return { success: true, message: res.data };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message };
                }
            })
    }


    async removeMediaFromPost(postId) {

        return await axios.put(API+`posts/${postId}`, {'media':''})
            .then((res) => {
                if (res) {
                    return { success: res.data.success };
                } else {
                    return { success: false, message: res.data.message }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message } 
                }
            })
    }


    async deletePost(postId) { 
        return axios.delete(API + `posts/${postId}`)
            .then((res) => {
                if (res) {
                    return { success: res.data.success };
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message };
                }
            })
    }

    uploadPostImage (image) {
        // checking if image uses android or apple file system uri
        var imageUri = null;

        console.log ("image");
        console.log (image);


        imageUri = image._android ?? image._ios;

        if (!imageUri) {
            console.log("No image found");
            return;
        }

        console.log ("imageUri");
        console.log (imageUri);

        var imgArr = imageUri.split('/');

        console.log ("imgArr");
        console.log (imgArr);

        var name = imgArr.pop();

        console.log ("name");
        console.log (name);

        var link = BUCKET_POST_IMAGES + name;

        console.log ("link");
        console.log (link);

        var type = name.split('.').pop();

        console.log ("type");
        console.log (type);
        
        var session = bghttp.session("image-upload");

        console.log ("session");
        console.log (session);

        var request = {
            url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME}/o?uploadType=media&name=post-images/${name}`,
            method: "POST",
            headers: {
                "Content-Type": `image/${type}`
            }
        };

        console.log ("request");
        console.log (request);

        return { task: session.uploadFile(imageUri, request), link: link };
    }

    uploadPostVideo (video) { //TODO
        console.log ("video");
        console.log (video);

        var videoArr = video.split('/');

        console.log ("videoArr");
        console.log (videoArr);

        var name = videoArr.pop();

        console.log ("name");
        console.log (name);

        var link = BUCKET_POST_VIDEOS + name;

        console.log ("link");
        console.log (link);

        var type = name.split('.').pop();

        console.log ("type");
        console.log (type);

        var session = bghttp.session("video-upload");

        console.log ("session");
        console.log (session);

        var request = {
            url: `https://storage.googleapis.com/upload/storage/v1/b/${BUCKET_NAME_VIDEOS}/o?uploadType=media&name=post-videos/${name}`,
            method: "POST",
            headers: {
                "Content-Type": `video/${type}`
            }
        };

        console.log ("request");
        console.log (request);

        return { task: session.uploadFile(video, request), link: link };
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
                    return { success: false, message: err.message };
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
                    return { success: false, message: err.message };
                }
            })
    }

    async ResendVerification(email) {
        return axios.post(`${API}/verify`, { email: email })
            .then((res) => {
                if (res) {
                    if (res.data.success) {
                        return { success: true }
                    } else {
                        return { success: false, message: res.data.message }
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message };
                }
            })
    }

    async RefreshUser(userId) {
        return axios.get(`${API}/users?_id=${userId}`)
            .then((res) => {
                if (res) {
                    if (res.data.success) {
                        return { success: true, user: res.data.users[0] }
                    } else {
                        return { success: false, message: res.data.message }
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message };
                }
            })
    }

    async requestNewChatroom(chatroomRequest) {
        return axios.post(`${API}/chatrooms/request`, chatroomRequest)
            .then((res) => {
                if (res) {
                    if (res.data.success) {
                        return { success: true }
                    } else {
                        return { success: false, message: res.data.message }
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    return { success: false, message: err.message };
                }
            })
    }

    async getFAQs() {
        return axios.get(`${API}faq`)
        .then((res) => {
            return { faqs: res.data.questions }; // return { chatroom: res.data };

        })
        .catch((err) => {
            if (err) {
                return { success: false, message: err.message };
            }
        })
    }

}