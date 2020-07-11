<template>
    <Page @navigatedFrom="stopTimer">
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="chatTap">
                    <Label :text="back" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <TextField placeholderColor="white" id="searchField"
                        editable="true" hint="      Search for a Chatroom" v-model="searchPhrase" 
                        @textChange="filter()" 
                        returnKeyType="search"
                        ios:height="30" ios:marginTop="3"
                        android:paddingBottom="5" class="searchField font-awesome"
                        color="#fff" :isEnabled="arrayEnable" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            
            <SideBar ~drawerContent />
            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in dock top) -->

					<StackLayout dock="top" height="90%" margin="0 10" >

						<StackLayout dock="top" width="100%" style="">
                        <Button text="REQUEST A NEW CHATROOM" @tap="onButtonTap()"/>
                        <ListView for="chatroom in chatrooms"
                            separatorColor="transparent" id="listView">
                            <v-template>

                            <ChatroomItem :chatroom="chatroom" :user="currentUser"/>

                            </v-template>
                        </ListView>
                    </StackLayout>

					</StackLayout>

                    <NavBar dock="bottom" height="10%" selectedtab="chat" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>
	</Page>
</template>

<script>
    import Chat from "./Chat";
    import ChatroomItem from "./ChatroomItem";
    import BackendService from "../services/BackendService";
    import { timer } from 'vue-timers';
    var FeedbackPlugin = require("nativescript-feedback");
    var FeedbackType = require ("nativescript-feedback").FeedbackType;
    var feedback = new FeedbackPlugin.Feedback();


     export default {
         timers: {
            log: { time: 15000, autostart: true, repeat: true }
        },
        created() {
            var backend = new BackendService();
            backend.getAllChatrooms()
                .then((res) => {
                    if (res){
                        this.allChatrooms = res.chatrooms;
                        this.chatrooms = Array.from(this.allChatrooms);

                    } 
                })
                .catch((err) => {
                    if (err) console.log(err);
                }) 
            this.chatrooms = Array.from(this.allChatrooms);
                        this.$timer.start('log')

this.arrayEnable = (this.chatrooms.length>0||this.allChatrooms.length>0)&&(!this.chatrooms.includes(undefined)||!this.allChatrooms.includes(undefined));
        if(this.arrayEnable==false){
                    feedback.show({
						title: "Error: There was a problem retrieving data from the server",
						message: "We are sorry! Something went wrong, please try again in few minutes",
						type: FeedbackType.Warning
					});
        }

        },
        beforeDestroy () {
            this.timers.log.isSwitchTab=true;
            this.$timer.stop('log');
            //console.log(this.timers.log.isRunning);
        }, 
        components: {
            ChatroomItem
        },
        data() {
            return {
                back:"",
                drawerToggle: false,
                drawer1: "",
                drawer2: "",
                mainColor: "#00ff92",
                allChatrooms: [],
                chatrooms: []
            };
        },
         methods: {
            stopTimer() {
                this.timers.log.isSwitchTab=true;
                this.$timer.stop('log');
                //console.log(this.timers.log.isRunning);

            },
             log () {

                 var backend = new BackendService();
            backend.getAllChatrooms()
                .then((res) => {
                    if (res){
                        this.allChatrooms = res.chatrooms;
                        var chatroomsList = Array.from(this.allChatrooms);

                      var chatsinlist  = chatroomsList.filter( e=> {
                                var matchingChats =  this.chatrooms.every(chat => {
                                    return chat._id != e._id;
                                });
                                return matchingChats;
                            });
                        } else {
                                console.log("Error on gettin chat rooms");

                            };
                if(chatsinlist.length>0){
                    this.chatrooms = this.chatrooms.concat(chatsinlist);
                }

                })
                .catch((err) => {
                    if (err) console.log(err);
                }) ;
           // this.chatrooms = Array.from(this.allChatrooms);

             },
            filter() {
                this.chatrooms = this.allChatrooms.filter((c)=>{
                   return c.chatroomName.toUpperCase().startsWith(this.searchPhrase.toUpperCase());
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
            onButtonTap(){
                prompt({
                    title: "Request New Chatroom",
                    message: "Your application will be reviewed by our team. We will let you know if you have been successful with your request",
                    okButtonText: "Send request",
                    cancelButtonText: "Cancel request",
                    }).then(result => {
                    if (result.result){ 
                        var chatroomRequest = {
                            chatroomName: result.text,
                            user_id: this.$store.state.user._id
                        }
                        if (result.text.length > 25) {
                            alert({ title: 'Error', message: 'Max Character Limit Reached' })
                        } else {
                              var backend = new BackendService();
                        backend.requestNewChatroom(chatroomRequest)
                            .then((res) => {
                                if (res && res.success) {
                                    alert({ title: 'Request sent', message: 'Thank you for your submission' })
                                }

                                if (res && !res.success) {
                                    alert({ title: 'Error', message: 'Error processing your request. Please try again later.'})
                                    console.log(res.message);
                                                }
                            })
                            .catch((err) => {
                                if (err) {
                                    console.log(err);
                                    alert({ title: 'Error', message: 'Unsuccessful' })
                                }
                            })
                        }
                    }
                });

            },
            chatTap() {
                this.$navigateTo(Chat, {
                    animated: false,
                    //clearHistory: true
                });
            }
        },
        computed: {
            currentUser: function () {
                return this.$store.state.user;
            }
        }
    };
</script>
<style scoped>
</style>