<template>
    <Page class="page">
        <ActionBar title="HHHH" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="chatTap()">
                    <Label :text="back" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label class = "action-bar-title" :text="chatRoom.chatroomName" paddingTop = "7.5%" color="white" id="searchField"></Label>
                </StackLayout>
                <StackLayout class="HRight">

                </StackLayout>
            </StackLayout>
        </ActionBar>

            <StackLayout ~mainContent>

                <DockLayout>
                    <StackLayout dock="top" height="80%" width="100%" style="">
                        <RadListView ref="listView" for="item in conversations" 
                            height="100%" separatorColor="transparent" id="listView">
                            <v-template>

                                <StackLayout orientation="horizontal" style="border-bottom-width:1;border-bottom-color:#E4E4E4;"
                                    padding="10">
                                    <StackLayout width="20%">
                                       <Image :src="item.profilePicture"
                                            stretch="aspectFill" class="conImg" />
                                    </StackLayout>
                                    <StackLayout marginLeft="10" paddingTop="3"
                                        width="50%">
                                            <Label :text="item.username" />
                                        <Label :text="item.message" textWrap="true" />
                                    </StackLayout>
                                    <StackLayout marginLeft="10" paddingTop="3"
                                        width="60%">
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                        </RadListView>

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
                    <StackLayout dock="bottom" height="200px" style="border-color:#E4E4E4;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="textItem">
                            <TextView v-model="message" placeholderColor="black" 
                                editable="true" hint="    Say Something" returnKeyType="send"
                                ios:height="30" ios:marginTop="3" 
                                android:paddingBottom="5" class="searchField font-awesome" textWrap="true"
                                color="#000000" :text="message" />
                            </StackLayout>
                            <StackLayout class="send" @tap="sendTap()">
                                <Label text="0" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:23;margin-top:-15"
                                    ios:style="font-size:29;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>


                </DockLayout>

            </StackLayout>

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
    import Chat from "./Chat";
    import moment from "moment";
    import BackendService from "../services/BackendService";

    export default {
        props: ['chatRoom'],
        created() {

            var service = new BackendService();

            var getUserFromMessage = async (message) => {
                return service.getUserfromId(message.userID)
                    .then((res) => {
                        return { ...message, username: res.user.username, profilePicture: res.user.profilePicture };
                    });
            }

            var mutateMessages = async (messages) => {
                return Promise.all(messages.map((message) => getUserFromMessage(message)));
            }

            service.getMessagesfromID(this.$props.chatRoom._id)
                .then((res) => {
                    if (res) {
                        var messages = res.messages;
                        console.log(messages);
                        mutateMessages(messages)
                            .then((result) => {
                                console.log(result);
                                this.conversations = result;
                            })
                    }
                })
        },
        data() {
            return {
                back:"",
                mainColor: "#00ff92",
                conversations: [],
                message: ""
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
            communityTap() {
                this.$navigateTo(Community, {
                    animated: false,
                    clearHistory: true
                });
            },
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
            }, 
            showDetails() {},
            sendTap(events){
                var service = new BackendService();
                service.saveMessage(this.$store.state.user._id,this.$props.chatRoom._id,this.message )
                    .then((response) => {

                        if (response) {
                            console.log(response);
                            this.message = "";
                            this.conversations=[]; //empty where you write
                            //               this.creatingMessages();     
                            //refresh the chat ↑

                        }else{
                            console.log("Error: No Response")
                        }
                    });
                    //better implementation so all messages send from bottom and push up
            }
        }
    };
</script>
<style scoped>
</style>