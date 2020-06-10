<template>
    <Page class= "page">
        <ActionBar title="" class="action-bar header" backgroundColor="#079ef5">
            <StackLayout orientation="horizontal" height="38" class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer()" alignItems="left">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="center">
                     <Label class = "action-bar-title" text= "Notifications" paddingTop = "7.5%" color="white" id="searchField"></Label>
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
                    <ListView for="item in items" @itemTap="onItemTap">
                    <v-template>
                        <StackLayout orientation="horizontal">
                        <Label :text="item.description" textWrap="false" paddingLeft = "5%" paddingTop = "25%" paddingBottom = "15%"
                        android:style="font-size:18;margin-top:-15" ios:style="font-size:18;margin-top:-15"></Label>
                        </StackLayout>
                    </v-template>
                    </ListView>
                    </StackLayout>

                    <StackLayout dock="bottom" height="10%" style="border-color:#E8E8E8;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="navItem" @tap="homeTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" :color="mainColor"
                                    android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="competitionTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text=" " android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="communityTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" :color="profileColor"
                                    android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
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
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import Community from "./Community";
    import Chat from "./Chat";
    import Competitions from "./Competitions"
    import Profile from "./EditProfile";
    import Home from "./Home";
    import Settings from "./Settings";
    import Help from "./Help";
    import LoginScreen from "./LoginMain";

    export default {
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Notifications");
        },
        computed: {
            message() {
                return "No Notifications";
            }
        },
        data: () => {
        return {
            items: [
                {
                    name: "Music",
                    description: "Welcome to Self-Isomate. There's a lot to do but you should first..."
                },
                {
                    name: "DIY",
                    description: "Day 3 in Isolation, why not try something new? We have a range of..."
                },
                {
                    name: "Cooking",
                    description: "Hey Helen, you got 3rd prize in this week's cooking competition... "
                }
            ],
            drawerToggle: false,
            drawer1: "", //the three dots vertically
            drawer2: "", //the three dots horizontally
            mainColor: "#00ff92",
            }
        }, methods: {
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
            communityTap() {
                this.$navigateTo(Community, {
                    animated: false,
                    //clearHistory: true
                });
            },
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
            profileTap() {
                this.$navigateTo(Profile, {
                    animated: false,
                    //clearHistory: true
                });
            },
            notificationTap() {},
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
                this.$store.commit("clearUser");
                this.$navigateTo(LoginScreen, {
                    animated: false,
                    //clearHistory: true
                });
            }, //put in here navigate to log-in screen
            showDetails() {}
        }
    };
</script>

<style scoped>

</style>