<template>
    <Page class="page">


        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer()">
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
                <StackLayout class="HRight" @tap="addTap()">
                    <Label text="+" style="font-size:40;color:#fff;" paddingLeft="15%"
                        class="font-awesome" />
                </StackLayout>
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


                        <ListView for="item in chatRoomsList"
                            height="100%" separatorColor="transparent" id="listView">
                            <v-template>

                                <StackLayout orientation="horizontal" style="border-bottom-width:1;border-bottom-color:#E4E4E4;"

                                    padding="10" @tap="chatroomTap">

                                    <StackLayout width="20%">
                                        <Image :src="item.chatroomPicture"
                                            stretch="aspectFill" class="conImg" />
                                    </StackLayout>
                                    <StackLayout marginLeft="10" paddingTop="3"
                                        width="50%">
                                        <Label :text="item.chatroomName"
                                            class="chatroomNameTitle" />
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                        </ListView>

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
                                <Label text="" :color="mainColor"
                                    android:style="font-size:25;margin-top:-15"
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
    import Community from "./Community";
    import Competitions from "./Competitions"
    import Profile from "./Profile";
    import Notifications from "./Notifications";
    import Settings from "./Settings";
    import Help from "./Help";
    import LoginScreen from "./LoginMain";
    import Chatroom from "./Chatroom";
    import ChatroomAdd from "./ChatroomAdd";

    import BackendService from "../services/BackendService";
    var service = new BackendService();
    import { timer } from 'vue-timers'

    
    export default {
        timers: {
            log: { time: 10000, autostart: true, repeat: true }
        },
        mounted() {
            var service = new BackendService();

            service.getChatroomIds(this.$store.state.user._id).then(res=>{
                if (res) {
                    res.chatrooms.forEach(val => {
                        service.getChatroomObj(val).then(response=>{
                            if (response) {
                                //console.log(response.chatroom);
                                this.chatRoomsList.push(response.chatroom);    
                            } else {
                                console.log("error on getting chatrooms objects");
                            }
                        });
                    });
                } else {
                    console.log("error on getting Chatroom Ids");
                }
            });
            
            this.$timer.start('log')

        },
        beforeDestroy () {
            clearInterval(this.$options.interval)
        },
        data() {
            return {
                drawerToggle: false,
                drawer1: "",
                drawer2: "",
                mainColor: "#00ff92",
                chatRoomsList: [
                ]
            };
        },
        methods: {
            log () {
                this.chatRoomsList=[];
                             service.getChatroomIds(this.$store.state.user._id).then(res=>{
                if (res) {
                    res.chatrooms.forEach(val => {
                        service.getChatroomObj(val).then(response=>{
                            if (response) {
                                //console.log(response.chatroom);
                                this.chatRoomsList.push(response.chatroom);    
                            } else {
                                console.log("error on getting chatrooms objects");
                            }
                        });
                    });
                } else {
                    console.log("error on getting Chatroom Ids");
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
            homeTap() {
                 this.$navigateTo(Home, {
                    animated: false,
                    clearHistory: true
                });
            },
            communityTap() {
                this.$navigateTo(Community, {
                    animated: false,
                    clearHistory: true
                });
            },
            chatTap(){},
            competitionTap() {
                this.$navigateTo(Competitions, {
                    animated: false,
                    clearHistory: true
                });
            },
            profileTap() {
                this.$navigateTo(Profile, {
                    animated: false,
                    clearHistory: true
                });
            },
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
            }, //put in here navigate to log-in screen
            showDetails() {},
            chatroomTap(item){    	
                this.$navigateTo(Chatroom, {
                    props: {chatRoom: item},
                    animated: false,
                    clearHistory: true
                }); 
            },
            addTap(){
                 this.$navigateTo(ChatroomAdd); 
            }
        }
    };
</script>
<style scoped>
</style>