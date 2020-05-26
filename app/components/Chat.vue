<template>
    <Page class="page">
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
                        color="#fff" />
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
                                            <Image :src="item.chatroomPicture"
                                                stretch="aspectFill" class="conImg" />
                                        </StackLayout>
                                        <StackLayout marginLeft="10" paddingTop="3"
                                            width="50%">
                                            <Label  textWrap="true" :text="item.chatroomName"
                                                class="chatroomNameTitle" />
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
     service.getChatroomIds(this.$store.state.user._id).then(res=>{
                if (res) {
                            var chatsinlist  = res.chatrooms.filter( e=> {
                                var matchingChats =  this.chatRoomsList.every(chat => {
                                    
                                    return chat._id != e;
                                });
                                return matchingChats;
                            });
                        } else {
                                console.log("Error on gettin chat rooms objects from id");

                            };
                    
                            if(chatsinlist.length>0){

                                    chatsinlist.forEach(val => {
                                    service.getChatroomObj(val).then(response=>{
                                    this.chatRoomsList = this.chatRoomsList.concat(response.chatroom);    
                            }).catch((err) => {
                            if (err) console.log("err: " + err);
                        });
                            });
                                } else {
                                    console.log("no new chats, check every 10 seconds");
                                }
                            })
                        .catch((err) => {
                            if (err) console.log("err: " + err);
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