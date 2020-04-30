<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header">
            <GridLayout columns="*, auto" height="38" 
                class="actionBarContainer">
                <StackLayout col="0" @tap="toggleDrawer" style="vertical-alignment:center;" >
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        verticalAlignment="center" class="font-awesome" />
                </StackLayout>
                <StackLayout col="1" orientation="horizontal" alignItems="right" marginRight="10">
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
                                        <WrapLayout orientation="horizontal">
                                            <CommunityPill v-for="(c, index) in item.communities" :key="index" :communityId="c" />
                                        </WrapLayout>
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

        var getUserFromPosts = async (post) => {
            return service.getUserfromId(post.userId)
                .then((res) => {
                    if (res) {
                        var newFormat = moment(String(post.datePosted)).format('DD/MM/YYYY HH:mm');
                        return { ...post, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat};
                    }
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
                    var posts = res.posts;
                    mutatePosts(posts)
                        .then((result) => {
                            //console.log("result");
                            //console.log(result);
                            if (!this.$props.communities) {
                                this.posts = result;
                            } else {
                                // filter posts by communities
                                console.log(this.$props.communities);
                                this.posts = result.filter(post => post.communities.some(c => this.$props.communities.some(pc => pc._id == c)));
                            }
                        })
                        .catch((err) => {
                            if (err) console.log("err: "+err);
                        });
                }
                this.$timer.start('log');
            });

        service.getCommunities(this.$store.state.user.communities)
            .then((res) => {
                if (res) {
                    console.log(res);
                    this.allCommunities = [... res.communities];
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
        log() {
            var service = new BackendService();

            var getUserFromPosts = async (post) => {
                return service.getUserfromId(post.userId)
                    .then((res) => {
                        console.log(post.datePosted);
                        var newFormat = moment(String(post.datePosted)).format('DD/MM/YYYY HH:mm');
                        return { ...post, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat};
                    })
                    .catch((err) => {
                        if (err) console.log("err: "+err);
                    });
            }

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

                        if(posts.length>0) {
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
            this.$navigateTo(NewPost);
        },
        showFilterModal() {
            if (this.$props.communities && this.$props.communities.length > 0) {
                this.$navigateTo(CommunityFilter, { props: { allCommunities: this.allCommunities, preSelectedCommunities: this.$props.communities} });
            } else {
                this.$navigateTo(CommunityFilter, { props: { allCommunities: this.allCommunities } });
            }
        }
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

</style>