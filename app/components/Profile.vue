<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header" backgroundColor="#079ef5">
            <StackLayout orientation="horizontal" height="38" class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer()" alignItems="left">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="center">
                     <Label class = "action-bar-title" text= "Profile" paddingTop = "7.5%" color="white" id="searchField"></Label>
                </StackLayout>
                <StackLayout class="HRight"></StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()"
            @drawerClosed="onDrawerClosed()">
            <StackLayout ~drawerContent backgroundColor="#eee">
                <StackLayout height="2%"></StackLayout>
                <StackLayout class="">
                    <StackLayout class = "prof" @tap="profileTap()">
                    <Label text="  Profile" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "notif" @tap="notificationTap()">
                    <Label text="  Notifications" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "settings" @tap="settingsTap()">
                    <Label text="  Settings" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "help" @tap="helpTap()">
                    <Label text="  Help" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "logout" @tap="logOut()">
                    <Label text="  Log out" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                </StackLayout>
            </StackLayout>

            <StackLayout ~mainContent>

                <DockLayout>
                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <ScrollView>

                            <StackLayout style="font-size:18;">
                                <StackLayout alignItems="center" margin="0 30px">
                                    <Image :src="currentUser.profilePicture"
                                        stretch="aspectFill" class="profilePic"
                                        @tap="pickProfile">
                                    </Image>
                                    <Label :text="currentUser.username" color="#000"
                                        fontSize="19" fontWeight="bold"
                                        textAlignment="center" />
                                    <Label :text="currentUser.bio" class="bio" />
                                    <WrapLayout orientation="horizontal">
                                        <Label v-for="commie in currentUser.communities" :key="commie._id" :text="commie.name" class="pill" />
                                    </WrapLayout>
                                </StackLayout>

                                <StackLayout  alignItems="left" backgroundColor="#eeeeee"
                                    margin="10" padding="10" v-show="posts">
                                    <Label padding="10" text="Posts" fontSize="20px" textAlign="center" />
                                    <PostThumb v-for="post in posts" :key="post._id" :post="post" />
                                </StackLayout>

                            </StackLayout>


                        </ScrollView>
                    </StackLayout>


                    <StackLayout dock="bottom" height="10%" style="border-color:#E4E4E4;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="navItem" @tap="homeTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="competitionTap()">
                                <Label text="0" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text=" " android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="communityTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="chatTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>


                </DockLayout>

            </StackLayout>
        </RadSideDrawer>

    </Page>
</template>

<script>
    import Home from "./Home";
    import Chat from "./Chat";
    import Competitions from "./Competitions"
    import Notifications from "./Notifications";
    import Settings from "./Settings";
    import Help from "./Help";
    import LoginScreen from "./LoginMain";
    import Vuex from "vuex";
    import * as imagepicker from "nativescript-imagepicker";
    import { ItemEventData } from "tns-core-modules/ui/list-view";
    import { Observable } from "tns-core-modules/data/observable";
    import BackendService from "../services/BackendService";
    import PostThumb from "./PostThumb";

    export default {
        created() {
            var service = new BackendService();

            if (this.$store.state.user) {
                service.getProfilePosts(this.$store.state.user)
                    .then((res) => {
                        if (res.posts.length > 0)
                            this.posts = res.posts;
                        else
                            this.posts = null;
                        console.log(res);
                    });
            }

        },
        data() {
            return {
                drawerToggle: false,
                drawer1: "", //the three dots vertically
                drawer2: "", //the three dots horizontally
                mainColor: "#00ff92",
                posts: []
            };
        },
        methods: {
            onDrawerClosed() {
                this.drawerToggle = false;
            },
            onDrawerOpened() {
                this.drawerToggle = true;
            },
            toggleDrawer() {
                this.$refs.drawer.nativeView.toggleDrawerState();
            },
            homeTap() {
                this.$navigateTo(Home, {
                    animated: false,
                    //clearHistory: true
                });
            },
            communityTap() {},
            chatTap() {
                this.$navigateTo(Chat, {
                    animated: false,
                    //clearHistory: true
                });
            },
            competitionTap() {
                this.$navigateTo(Competitions, {
                    animated: false,
                    //clearHistory: true
                });
            },
            profileTap() {},
            notificationTap() {
                this.$navigateTo(Notifications, {
                    animated: false,
                    //clearHistory: true
                });
            },
            settingsTap() {
                this.$navigateTo(Settings, {
                    animated: false,
                    //clearHistory: true
                });
            },
            helpTap(){
                this.$navigateTo(Help, {
                    animated: false,
                    //clearHistory: true
                });
            },
            logOut(){
                this.$navigateTo(LoginScreen, {
                    animated: false,
                    //clearHistory: true
                });
            },
            showDetails() {},

            pickProfile () {
                let context = imagepicker.create({ mode: "single", mediaType: 1 });

                context
                    .authorize()
                    .then(() => {
                        return context.present()
                    })
                    .then((selection) => {
                        if (selection) {
                            let image = selection[0];
                            image.options.width = 300;
                            image.options.height = 300;
                            this.currentUser.profilePicture = image;
                            this.uploadImage()
                                .then((res) => {
                                    if (res) {
                                        console.log("got response");
                                        this.currentUser.profilePicture = res;
                                    }
                                });
                        } else {
                            console.log("no image selected");
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })

            },
            
            async uploadImage () {
                let backendService = new BackendService();
                console.log("uploading image");
                return await backendService.changeProfilePicture(this.currentUser).newLocation;
            }
        },
        computed: {
            currentUser: function () { 
                return this.$store.state.user
            }
        },
        components: {
            PostThumb
        }
    };
</script>
<style scoped>

.pill {
    background-color: rgb(209, 224, 215);
    padding: 25px;
    margin: 10px;
    border-radius: 10%;
    font-size: 12px;
}

.bio {
    text-align: center;
    font-size: 14px;
}

</style>