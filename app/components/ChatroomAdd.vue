<template>
    <Page>
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
                        color="#fff" />
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
                        <Button text="MAKE A NEW CHATROOM" @tap="onButtonTap()"/>
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

     export default {
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