<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <TextField placeholderColor="white" id="searchField"
                        editable="true" hint="      Search" returnKeyType="search"
                        ios:height="30" ios:marginTop="3"
                        android:paddingBottom="5" class="searchField font-awesome"
                        color="#fff" />
                </StackLayout>
                <StackLayout class="HRight">
                    <Label text="+" style="font-size:40;color:#fff;" paddingLeft="15%"
                        class="font-awesome" @tap="createNewPost" />
                </StackLayout>
            </StackLayout>
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
                                        <VideoPlayer src='https://file-examples.com/wp-content/uploads/2017/04/file_example_MP4_480_1_5MG.mp4' ref="player"
									controls="true" loop="true" autoplay="true" height="200"
									marginTop="10" />
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
import  Video  from 'nativescript-videoplayer';


export default {
    name: "Community",
    timers: {
        log: { time: 4000, autostart: true, repeat: true }
    },
    created() {
        var service = new BackendService();

        var getUserFromPosts = async (post) => {
            return service.getUserfromId(post.userId)
                .then((res) => {
                                        console.log("res1");
                                        console.log(res);

                    var newFormat = moment(String(post.datePosted)).format('DD/MM/YYYY HH:mm');
                        if (res && !res.user){
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


        service.getAllPosts()
            .then((res) => {
                var posts = res.posts;
                mutatePosts(posts)
                    .then((result) => {
                        //console.log("result");
                        //console.log(result);
                        this.posts = result;
                    })
                    .catch((err) => {
                        if (err) console.log("err: "+err);
                    });     

            });
            this.$timer.start('log');
    },
    beforeDestroy () {
        clearInterval(this.$options.interval)
    },
    data() {
        return {
            drawerToggle: false,
            drawer1: "",
            drawer2: "",
            posts: []
        };
    },
    methods: {
        log() {
            var service = new BackendService();

            var getUserFromPosts = async (post) => {
                return service.getUserfromId(post.userId)
                   .then((res) => {
                    var newFormat = moment(String(post.datePosted)).format('DD/MM/YYYY HH:mm');
                    console.log("res2");
                    console.log(res);
                        if (res && !res.user){
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

            service.getAllPosts()
            .then((res) => {
                if (res) {
                    var posts = res.posts.filter((e)=> {
                        var matchingPosts =  this.posts.every( post => {
                            return (post._id != e._id);
                        });
                        return matchingPosts;
                    });

                    if(posts.length>0) {
                        mutatePosts(posts)
                        .then((result) => {
                            if (result) {
                                this.posts = this.posts.concat(result);
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
            this.$navigateTo(NewPost);
        }
    }
}
</script>
<style scoped>

.post-container {
    background-color: white;
}

</style>