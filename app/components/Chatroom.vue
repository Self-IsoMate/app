<template>
    <Page class="page">
        <ActionBar title="HHHH" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="$navigateBack">
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
                    <StackLayout dock="top" height="90%" width="100%" >
                        <ListView  ref="listView" for="item in conversations" 
                            separatorColor="transparent" id="listView">
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
                                        <Label :text="item.dataFormat"  class="convDateOut" />
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                        </ListView>

                    </StackLayout>
                    <StackLayout dock="bottom" height="10%" style="border-color:#E4E4E4;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="textItem">
                            <TextView v-model="message" placeholderColor="black" 
                                editable="true" hint="Say Something" returnKeyType="send"
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
    import Chat from "./Chat";
    import moment from "moment";
    import BackendService from "../services/BackendService";
    import { timer } from 'vue-timers'
    import { RadListView, ListViewItemSnapMode } from "nativescript-ui-listview";


    export default {
        props: ['chatRoom'],
        timers: {
              log: { time: 4000, autostart: true, repeat: true }
        },
      created() {

            var service = new BackendService();

            var getUserFromMessage = async (message) => {
                return service.getUserfromId(message.userID)
                    .then((res) => {
                                var newFormat = moment(String(message.dateSent)).format('HH:mm');
                        console.log(newFormat);
                        return { ...message, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat };
                    }).catch((err) => {
                                if (err) console.log("err: "+err);
                                         });
            }

            var mutateMessages = async (messages) => {
                return Promise.all(messages.map((message) => getUserFromMessage(message)));//error
            }

                     
            service.getMessagesfromID(this.$props.chatRoom._id)
                .then((res) => {
                    if (res) {
                        var messages = res.messages;
                        mutateMessages(messages)
                            .then((result) => {//it does not run mutate Messages
                                this.conversations = result;
                            }).catch((err) => {
                                if (err) console.log("err: "+err);
                            }) 
                        this.$refs.listView.nativeView.scrollToIndex(0);
                    }
                });
                    this.$timer.start('log')

               
        },
          beforeDestroy () {
    clearInterval(this.$options.interval)
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
                log () {

            var service = new BackendService();

            var getUserFromMessage = async (message) => {
                return service.getUserfromId(message.userID)
                    .then((res) => {

         var newFormat = moment(String(message.dateSent)).format('HH:mm');
                        console.log(newFormat);
                        return { ...message, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat };                    }).catch((err) => {
                                if (err) console.log("err: "+err);
                                         });
            }

            var mutateMessages = async (messages) => {
                return Promise.all(messages.map((message) => getUserFromMessage(message)));//error
            }

                     
            service.getMessagesfromID(this.$props.chatRoom._id)
                .then((res) => {
                    if (res) {
                        var messages = res.messages.filter( e=> {
                        
                             
                            var matchingConvs =  this.conversations.every(
                                conv => {
                                    
                                    return (conv._id != e._id);
                                    } 
                                );
                            return  matchingConvs;

                        });
                        console.log("messages");
                        console.log(messages);
                        // check if id is not already in the list
                        // if not mutate message
                        //this.conversation. push (result)
                        if(messages.length>0){
                        mutateMessages(messages)
                            .then((result) => {//it does not run mutate Messages
                                if(result) {
                                    console.log("result");
                                    console.log(result);
                                    this.conversations = this.conversations.concat(result);
                                    var lastEl = (this.conversations.length-2);
                                    this.$refs.listView.scrollToIndex(lastEl/2);

                                }
                            }).catch((err) => {
                                if (err) console.log("err: "+err);
                                         })
                        } 
                    }
                 }).catch((err) => {
                                if (err) console.log("err: "+err);
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
            sendTap(events){
                var service = new BackendService();
                service.saveMessage(this.$store.state.user._id,this.$props.chatRoom._id,this.message )
                    .then((response) => {

                        if (response) {
                            this.message = "";
                            //empty where you write
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