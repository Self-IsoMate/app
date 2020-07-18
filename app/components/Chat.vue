<template>
    <Page @navigatedFrom="stopTimer" class="page">
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="toggleDrawer">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <TextField placeholderColor="white" id="searchField"
                        editable="true" hint="      Search" returnKeyType="search"
                        ios:height="30" ios:marginTop="3"
                        android:paddingBottom="5" class="searchField font-awesome"
                        color="#fff" :isEnabled="arrayEnable" />
                </StackLayout>
                <StackLayout class="HRight" @tap="addTap">
                    <Label text="+" style="font-size:40;color:#fff;" paddingLeft="15%"
                        class="font-awesome" />
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            
            <SideBar ~drawerContent />
            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in dock top) -->

					<StackLayout dock="top" height="90%" margin="0 10" >
						<StackLayout dock="top" height="90%" width="100%" style="">
                            
                            <ListView for="item in chatRoomsList"
                                height="100%" separatorColor="transparent" id="listView">
                                <v-template>

                                    <StackLayout orientation="horizontal" style="border-bottom-width:1;border-bottom-color:#E4E4E4;"
                                        padding="10" @tap="chatroomTap(item)">
                                        <StackLayout width="20%">
                                            <Image :src="item.chatroomPicture" stretch="aspectFill" class="conImg" />
                                        </StackLayout>
                                        <StackLayout marginLeft="10" paddingTop="3" width="50%">
                                            <Label  textWrap="true" :text="item.chatroomName" class="chatroomNameTitle" />
                                        </StackLayout>
                                    </StackLayout>

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
    import Chatroom from "./Chatroom";
    import ChatroomAdd from "./ChatroomAdd";

    import BackendService from "../services/BackendService";
    var service = new BackendService();
    import { timer } from 'vue-timers';
    import { Feedback, FeedbackType } from "nativescript-feedback";

    
    export default {
        timers: {
            log: { time: 10000, autostart: true, repeat: true }
        },
        mounted() {
            var service = new BackendService();

            service.getChatroomIds(this.$store.state.user._id).then(res=>{
                if (res) {
                    if (res.success) {
                        res.chatrooms.forEach(val => {
                            service.getChatroomObj(val)
                                .then( response => {
                                    if (response) {
                                        if (response.success) {
                                            this.chatRoomsList.push(response.chatroom);
                                        } else {
                                            alert({ title: 'Error', message: response.message })
                                        }
                                    }
                                })
                                .catch((err) => {
                                    if (err) {
                                        alert({ title: 'Error', message: err.message })
                                    }
                                })
                        });
                    } else {
                        alert({ title: 'Error', message: res.message })
                    }
                }
            });
            
            this.$timer.start('log')
            this.arrayEnable = (this.chatRoomsList.length>0)&&(!this.chatRoomsList.includes(undefined));
            if(this.arrayEnable==false){
                        this.feedback.show({
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
        data() {
            return {
                drawerToggle: false,
                drawer1: "",
                drawer2: "",
                mainColor: "#00ff92",
                chatRoomsList: [],
                arrayEnable: true,
                feedback: new Feedback()
            };
        },
        methods: {
            stopTimer() {
                this.timers.log.isSwitchTab=true;
                this.$timer.stop('log');
                //console.log(this.timers.log.isRunning);
            },
            log () {
                service.getChatroomIds(this.$store.state.user._id)
                    .then( res => {
                        if (res) {
                            if (res.success) {
                                var chatsInList  = res.chatrooms.filter((chatroom) => this.chatRoomsList.every(chat => chat._id != chatroom ));
                                var chatroomPromises = chatsInList.map((chatroomId) => service.getChatroomObj(chatroomId));

                                Promise.all(chatroomPromises)
                                    .then((responses) => {
                                        if (responses.every(response => response.success)) {
                                            var chatrooms = responses.map((response) => response.chatroom);
                                            if (this.chatroomsList) {
                                                this.chatroomsList.concat(chatrooms);
                                            } else {
                                                this.chatroomsList = chatrooms;
                                            }
                                        } else {
                                            alert({ title: 'Error', message: 'Could not retrieve chatrooms' })
                                        }
                                    })
                                    .catch((err) => {
                                        if (err) {
                                            alert({ title: 'Error', message: err.message })
                                        }
                                    })
                            }
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            alert({ title: 'Error', message: err.message })
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
            chatroomTap(item){    	
                this.$navigateTo(Chatroom, {
                    props: {chatRoom: item}
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