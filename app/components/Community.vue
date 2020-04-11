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
                        class="font-awesome" />
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
                                                    class="postAuthotName" />
                                                <Label :text="item.datePosted"
                                                    class="postDateSmall" />
                                            </StackLayout>
                                        </StackLayout>
                                        <Label marginLeft="10" marginRight="10"
                                            class="postTitle" :text="item.title" />
                                            <Label :text="item.body"
                                                    class="postBody" textWrap="true" />
                                        <Image :src="item.media" marginTop="10" />
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

export default {
    name: "Community",
       timers: {
              log: { time: 4000, autostart: true, repeat: true }
        },
    created() {

        var getUserFromPosts = async (post) => {
                        return service.getUserfromId(post.userId)
                            .then((res) => {

                                return { ...post, username: res.user.username, profilePicture: res.user.profilePicture };
                            }).catch((err) => {
                                        if (err) console.log("err: "+err);
                                                });
                    }
        
        var mutatePosts = async (posts) => {
                return Promise.all(posts.map((post) => getUserFromPosts(post)));//error
            }


        var service = new BackendService();
        service.getAllPosts()
                .then((res) => {
                        var posts = res.posts;
                mutatePosts(posts)
                            .then((result) => {
                                //console.log("result");
                                //console.log(result);
                                this.posts = result;
                            }).catch((err) => {
                                if (err) console.log("err: "+err);
                                         })    ;     

                });
                   // this.$timer.start('log');
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
                        log () {

            var service = new BackendService();
      
      var getUserFromPosts = async (post) => {
                        return service.getUserfromId(post.userId)
                            .then((res) => {

                                return { ...post, username: res.user.username, profilePicture: res.user.profilePicture };
                            }).catch((err) => {
                                        if (err) console.log("err: "+err);
                                                });
                    }

            var getUserFromMessage = async (message) => {
                return service.getUserfromId(message.userID)
                    .then((res) => {

                        return { ...message, username: res.user.username, profilePicture: res.user.profilePicture };
                    }).catch((err) => {
                                if (err) console.log("err: "+err);
                                         });
            }

            var mutateMessages = async (messages) => {
                return Promise.all(messages.map((message) => getUserFromMessage(message)));//error
            }

                     
            service.getMessagesfromID(this.$props.chatRoom._id)
                .then((res) => {
                    if (res) {
                        var messages = res.messages.filter( e=> {
                        
                             
                            var matchingConvs =  this.conversations.every(
                                conv => {
                                    
                                    return (conv._id != e._id);
                                    } 
                                );
                            return  matchingConvs;

                        });
                        console.log("messages");
                        console.log(messages);
                        // check if id is not already in the list
                        // if not mutate message
                        //this.conversation. push (result)
                        if(messages.length>0){
                        mutateMessages(messages)
                            .then((result) => {//it does not run mutate Messages
                                if(result) {
                                    console.log("result");
                                    console.log(result);
                                    this.conversations = this.conversations.concat(result);
                                    var lastEl = (this.conversations.length-2);
                                    this.$refs.listView.scrollToIndex(lastEl/2);

                                }
                            }).catch((err) => {
                                if (err) console.log("err: "+err);
                                         })
                        } 
                    }
                 }).catch((err) => {
                                if (err) console.log("err: "+err);
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
        }
    }
}
</script>
<style scoped>

.post-container {
    background-color: white;
}

</style>