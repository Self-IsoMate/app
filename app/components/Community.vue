<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header">
            <GridLayout columns="auto, *, auto" height="38" 
                class="actionBarContainer">
                <StackLayout col="0" @tap="toggleDrawer" style="vertical-alignment:center;" >
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        verticalAlignment="center" class="font-awesome" />
                </StackLayout>
                <StackLayout col="1" orientation="horizontal" alignItems="center">
                    <Label text="Your Feed" class="title"
                        verticalAlignment="center" />
                </StackLayout>
                <StackLayout col="2" orientation="horizontal" alignItems="right" marginRight="10">
                    <Label text="" style="font-size:30;color:#fff;margin:5 15;"
                        class="font-awesome" verticalAlignment="center" @tap="showFilterModal" />
                    <Label text="" style="font-size:30;color:#fff;margin:5;"
                        class="font-awesome" verticalAlignment="center" @tap="createNewPost" />
                </StackLayout>
            </GridLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()" @drawerClosed="onDrawerClosed()">
            
            <SideBar ~drawerContent />

            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in dock top) -->

                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <ListView for="item in posts" height="100%"
                            backgroundColor="#E8E8E8" separatorColor="transparent"
                            id="listView">
                            <v-template>

                                <StackLayout paddingTop="5" backgroundColor="#E8E8E8">
                                    <StackLayout class="post-container">
                                        <StackLayout orientation="horizontal"
                                            padding="10">
                                            <Image :src="item.profilePicture"
                                                stretch="aspectFill" class="postImageSmall" />
                                            <StackLayout>
                                                <Label :text="item.username"
                                                    class="postAuthorName" />
                                                <Label :text="item.dataFormat"
                                                    class="postDateSmall" />
                                            </StackLayout>
                                        </StackLayout>
                                        <Label marginLeft="10" marginRight="10"
                                            class="postTitle" :text="item.title" />
                                            <Label :text="item.body"
                                                    class="postBody" textWrap="true" />
                                        <Image :src="item.media" marginTop="10" />
                                        <VideoPlayer :src="item.media" v-if="item.media.slice(-3)=='mp4'" ref="player"
									controls="true" loop="true" autoplay="true" height="200"
									marginTop="10" />
                                        <WrapLayout orientation="horizontal">
                                            <CommunityPill v-for="(c, index) in item.communities" :key="index" :communityId="c" />
                                        </WrapLayout>
                                        <StackLayout v-if="item.userId == $store.state.user._id">
                                <StackLayout v-if='item.media!==""'>
                                    <GridLayout  rows="auto" columns="*, *">
                                        <Button col="1" text="Remove Media" backgroundColor="red" color="white" @tap="removeMedia(item)" />
                                        <Button row="0" text="Remove Post" backgroundColor="red" color="white" @tap="deletePostinoMedia(item)" />
								    </GridLayout>
                                </StackLayout> 
                                  <StackLayout v-else>
                                   <GridLayout  rows="auto" columns="*">
                                        <Button row="0" text="Remove Post" backgroundColor="red" color="white" @tap="deletePostino(item)" />
								</GridLayout>
                                </StackLayout>
                                </StackLayout>                                   
                            </StackLayout>
                                </StackLayout>

                            </v-template>
                        </ListView>

                    </StackLayout>

                    <NavBar dock="bottom" height="10%" selectedtab="community" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>

    </Page>
</template>

<script>
import BackendService from "../services/BackendService";
import { timer } from 'vue-timers'
import moment from "moment";
import NewPost from "./NewPost";
import CommunityPill from "./CommunityPill";
import CommunityFilter from "./CommunityFilter";
import  Video  from 'nativescript-videoplayer';


export default {
    name: "Community",
    timers: {
        log: { time: 4000, autostart: true, repeat: true }
    },
    props: {
        communities: Array
    },
    components: {
        CommunityPill
    },
    created() {
        var service = new BackendService();

        // Refreshing user account for email verification
        this.refreshUser();

        var getUserFromPosts = async (post) => {
            return service.getUserfromId(post.userId)
                .then((res) => {
                    if (res) {
                        if (res.success) {
                            var newFormat = moment(String(post.datePosted)).format('DD/MM/YYYY HH:mm');
                            if (res && !res.user){
                                return { ...post, username: "deleted account", profilePicture: "https://storage.googleapis.com/self-isomate-images/profile-pictures/default/deleted-account.png", dataFormat: newFormat};
                            }
                            return { ...post, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat};
                        } else {
                            alert({ title: 'Error', message: res.message })
                        }
                    }
                })
                .catch((err) => {
                    if (err) {
                        alert({ title: 'Error', message: err.message })
                    }
                });
        };
        
        var mutatePosts = async (posts) => {
            return Promise.all(posts.map((post) => getUserFromPosts(post)));
        }


        service.getFeed(this.$store.state.user._id)
            .then((res) => {
                if (res) {
                    if (res.success) {
                        var posts = res.posts;
                        mutatePosts(posts)
                            .then((result) => {
                                if (result) {
                                    if (!this.$props.communities) {
                                        this.posts = result;
                                    } else {
                                        this.posts = result.filter(post => post.communities.some(c => this.$props.communities.some(pc => pc._id == c)));
                                    }
                                }
                            })
                            .catch((err) => {
                                if (err) {
                                    alert({ title: 'Error', message: err.message })
                                }
                            });
                    } else {
                        alert({ title: 'Error', message: res.message });
                    }
                }
                this.$timer.start('log');
            });

        service.getCommunities(this.$store.state.user.communities)
            .then((res) => {
                if (res) {
                    if (res.success) {
                        this.allCommunities = [... res.communities];
                        if (this.allCommunities.length == 0){
                            alert({ title: '😢 Nothing to see here', message: "Subscribe to communities to fill up that feed" })
                        }
                    } else {
                        alert({ title: 'Error', message: res.message })
                    }
                }
            })
            .catch((err) => {
                this.$alert({ message: "Error retrieving communities - filtering may not work as expected." })
            })
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    },
    data() {
        return {
            drawerToggle: false,
            drawer1: "",
            drawer2: "",
            posts: [],
            communityFilter: CommunityFilter,
            communityFilters: [],
            allCommunities: []
        };
    },
    methods: {
        deletePostinoMedia (post) {
            confirm({ title: 'Are you sure?', message: 'Are you sure you want to delete your Post?', okButtonText: "Delete", cancelButtonText: "Go Back" })
                .then((res) => {
                    if (res) {
                        var postBucketName;
                        var postFilename;
                        var mediaData = post.media.split("/");
                        var service = new BackendService();
                        if (mediaData[mediaData.length - 1].slice(-3)=='mp4'){
                            postBucketName  = "self-isomate-videos";
                            postFilename = "post-videos/" + mediaData[mediaData.length - 1];
                        } else {   
                            postBucketName  = "self-isomate-images";
                            postFilename = "post-images/"+mediaData[mediaData.length - 1];
                        }
                        service.removeMediaFromCloud(postBucketName, postFilename )
                            .then((res) => {
                                if (res) {
                                    if (res.success) {
                                        service.removeMediaFromPost(post._id)
                                            .then((res) => {
                                                if (res) {
                                                    if (res.success) {
                                                        service.deletePost(post._id)
                                                            .then((res) => {
                                                                if (res) {
                                                                    if (res.success) {
                                                                        alert({ title: "Success", message: "post successfully deleted", okButtonText: "OK"  });
                                                                        this.posts = [];
                                                                        this.log();
                                                                    } else {
                                                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                                                    }
                                                                }
                                                            })
                                                            .catch((err) => {
                                                                if (err) console.log("err: "+err);
                                                            });
                                                    } else {
                                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                                    }
                                                }
                                            })
                                            .catch((err) => {
                                                if (err) console.log("err: "+err);
                                            });
                                    } else {
                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                    }
                                }
                            })
                            .catch((err) => {
                                if (err) console.log("err: "+err);
                            });
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            alert({ title: 'Error', message: err.message })
                        }
                    });
        },
        removeMedia(post){
            confirm({ title: 'Are you sure?', message: 'Are you sure you want to remove your image/video from your Post?', okButtonText: "Delete", cancelButtonText: "Go Back" })
                .then((res) => {
                    if (res) {
                        var postBucketName;
                        var postFilename;
                        var mediaData = post.media.split("/");
                        var service = new BackendService();
                        if (mediaData[mediaData.length - 1].slice(-3)=='mp4'){
                            postBucketName  = "self-isomate-videos";
                            postFilename = "post-videos/"+mediaData[mediaData.length - 1];
                        } else {   
                            postBucketName  = "self-isomate-images";
                            postFilename = "post-images/"+mediaData[mediaData.length - 1];
                        }
                        service.removeMediaFromCloud(postBucketName, postFilename)
                            .then((res) => {
                                if (res) {
                                    if (res.success){
                                        service.removeMediaFromPost(post._id)
                                            .then((res) => {
                                                if (res) {
                                                    if (res.success) {
                                                        this.posts = [];
                                                        this.log();
                                                    } else {
                                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                                    }
                                                }
                                            })
                                            .catch((err) => {
                                                if (err) console.log("err: "+err);
                                            });

                                    } else {
                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                    }
                                }
                            })
                            .catch((err) => {
                                if (err) console.log("err: "+err);
                            });
                    }
                })
                .catch((err) => {
                    if (err) console.log("err: "+err);
                });
        },
        deletePostino(post){
            confirm({ title: 'Are you sure?', message: 'Are you sure you want to delete your Post?', okButtonText: "Delete", cancelButtonText: "Go Back" })
                .then((res) => {
                    if (res) {
                        var service = new BackendService();
                        service.deletePost(post._id)
                            .then((res) => {
                                if (res) {
                                    if (res.success) {
                                        alert({ title: "Success", message: "post successfully deleted", okButtonText: "OK"  });
                                        this.posts= [];
                                        this.log();
                                    } else {
                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                    }
                                }
                            })
                            .catch((err) => {
                                if (err) console.log("err: "+err);
                            });
                    }
                })
                .catch((err) => {
                    if (err) console.log("err: "+err);
                });
        },
        log () {
            var service = new BackendService();

            // Refreshing user account for email verification
            this.refreshUser();

            var getUserFromPosts = async (post) => {
                return service.getUserfromId(post.userId)
                    .then((res) => {
                        var newFormat = moment(String(post.datePosted)).format('DD/MM/YYYY HH:mm');
                        console.log("res2");
                        console.log(res);
                        if (res && !res.user) {
                            return { ...post, username: "deleted account", profilePicture: "https://storage.googleapis.com/self-isomate-images/profile-pictures/default/deleted-account.png", dataFormat: newFormat};
                        }
                        return { ...post, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat};
                    })
                    .catch((err) => {
                        if (err) console.log("err: "+err);
                    });
            };

            var mutatePosts = async (posts) => {
                return Promise.all(posts.map((post) => getUserFromPosts(post)));//error
            }

            service.getFeed(this.$store.state.user._id)
                .then((res) => {
                    if (res) {
                        var posts = res.posts.filter((e)=> {
                            var matchingPosts =  this.posts.every( post => {
                                return (post._id != e._id);
                            });
                            return matchingPosts;
                        });

                        if (posts.length > 0) {
                            mutatePosts(posts)
                                .then((result) => {
                                    if (result) {
                                        console.log(result);
                                        if (!this.$props.communities) {
                                            this.posts = [ ...result, ... this.posts];
                                        } else {
                                            var r = result.filter(post => post.communities.some(c => this.$props.communities.some(pc => pc._id == c)));
                                            this.posts = [ ...r, ...this.posts];
                                        }
                                    }
                                })
                                .catch((err) => {
                                    if (err) console.log("err: "+err);
                                });
                        } 
                    }
                });

        },
        onDrawerClosed() {
            this.drawerToggle = false;
        },
        onDrawerOpened() {
            this.drawerToggle = true;
        },
        toggleDrawer() {
            this.$refs.drawer.nativeView.toggleDrawerState();
        },
        createNewPost() {
            if (this.$store.state.user.isVerified) {
                this.$navigateTo(NewPost);
            } else {
                confirm({ title: 'Please verify your email', message: 'Make sure you check your spam folder.', cancelButtonText: 'Cancel', okButtonText: 'Resend Verification' })
                    .then((result) => {
                        if (result) {
                            service.ResendVerification(response.user.email)
                                .then((res) => {
                                    if (res && res.success) {
                                        alert({ title: 'Success', message: 'Successfully resent verification' })
                                    }

                                    if (res && !res.success) {
                                        alert({ title: 'Error', message: res.message})
                                    }
                                })
                                .catch((err) => {
                                    if (err) {
                                        alert({ title: 'Error', message: err.message })
                                    }
                                })
                        }
                    })
            }
        },
        showFilterModal() {
            if (this.$props.communities && this.$props.communities.length > 0) {
                this.$navigateTo(CommunityFilter, { props: { allCommunities: this.allCommunities, preSelectedCommunities: this.$props.communities} });
            } else {
                this.$navigateTo(CommunityFilter, { props: { allCommunities: this.allCommunities } });
            }
        },
        refreshUser () {
            var service = new BackendService();
            if (this.$store.state.user) {
                service.RefreshUser(this.$store.state.user._id)
                    .then((res) => {
                        if (res && res.success) {
                            this.$store.commit("setUser", { user: res.user });
                        }

                        if (res && !res.success) {
                            alert({ title: 'Error', message: `Couldn't refresh details: ${res.message}` })
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
            }
        },
    }
}
</script>
<style scoped>

.post-container {
    background-color: white;
    padding: 5; 
}

.pill {
    background-color: black;
    color: white;
    padding: 2 7;
    border-radius: 50%;
    margin: 1;
    font-size: 10;
}

.title {
    color: white;
    font-size: 20;
    font-weight: bold;
    margin: 0 15;
}

</style>