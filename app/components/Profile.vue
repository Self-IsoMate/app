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
                                <StackLayout alignItems="center">
                                    <Image :src="currentUser.profilePicture"
                                        stretch="aspectFill" class="profilePic"
                                        @tap="pickProfile">
                                    </Image>
                                    <Label :text="currentUser.username" color="#000"
                                        fontSize="19" fontWeight="bold"
                                        textAlignment="center" />
                                    <StackLayout class="aboutContainer">
                                        <StackLayout orientation="horizontal">
                                            <Label text="" style="font-size:18;color:#557AAD;"
                                                class="font-awesome" />
                                            <Label text="Sheffield, UK" style="font-size:16;color:#000;margin-left:9;margin-top:1;"
                                                class="font-awesome" />
                                        </StackLayout>
                                        <StackLayout orientation="horizontal"
                                            class="aboutRow">
                                            <Label text="" style="font-size:16;color:#557AAD;"
                                                class="font-awesome" />
                                            <Label text="Website.com" style="font-size:16;color:#000;margin-left:6;"
                                                class="font-awesome" />
                                        </StackLayout>

                                    </StackLayout>
                                    <StackLayout orientation="horizontal"
                                        class="followersContainer">
                                        <StackLayout width="33%">
                                            <Label text="6" class="followersTxtValue" />
                                            <Label text="Posts " class="followersTxt" />
                                        </StackLayout>
                                        <StackLayout width="33%">
                                            <Label text="2300" class="followersTxtValue" />
                                            <Label text="Followers " class="followersTxt" />
                                        </StackLayout>
                                        <StackLayout width="33%">
                                            <Label text="400" class="followersTxtValue" />
                                            <Label text="Following " class="followersTxt" />
                                        </StackLayout>
                                    </StackLayout>
                                </StackLayout>

                                <WrapLayout alignItems="left" backgroundColor="#eeeeee"
                                    marginTop="10">
                                    <Image src="~/assets/images/New-York.jpg"
                                        stretch="aspectFill" class="listImage"
                                        width="50%" height="140" />
                                    <Image src="~/assets/images/ny2.jpg"
                                        stretch="aspectFill" class="listImage"
                                        width="50%" height="140" />
                                    <Image src="~/assets/images/food.jpg"
                                        stretch="aspectFill" class="listImage"
                                        width="50%" height="140" />
                                    <Image src="~/assets/images/wedding.jpg"
                                        stretch="aspectFill" class="listImage"
                                        width="50%" height="140" />
                                </WrapLayout>

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

    export default {
        data() {
            return {
                drawerToggle: false,
                drawer1: "", //the three dots vertically
                drawer2: "", //the three dots horizontally
                mainColor: "#00ff92"
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
                    clearHistory: true
                });
            },
            communityTap() {},
            chatTap() {
                this.$navigateTo(Chat, {
                    animated: false,
                    clearHistory: true
                });
            },
            competitionTap() {
                this.$navigateTo(Competitions, {
                    animated: false,
                    clearHistory: true
                });
            },
            profileTap() {},
            notificationTap() {
                this.$navigateTo(Notifications, {
                    animated: false,
                    clearHistory: true
                });
            },
            settingsTap() {
                this.$navigateTo(Settings, {
                    animated: false,
                    clearHistory: true
                });
            },
            helpTap(){
                this.$navigateTo(Help, {
                    animated: false,
                    clearHistory: true
                });
            },
            logOut(){
                this.$navigateTo(LoginScreen, {
                    animated: false,
                    clearHistory: true
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
                console.log(this);
                return this.$store.state.user
            }
        }
    };
</script>
<style scoped>
</style>