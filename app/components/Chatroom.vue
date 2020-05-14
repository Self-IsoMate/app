gi<template>
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
                                :editable="isUserVerified" @tap="alertMessage" hint="Say Something" returnKeyType="send"
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
              log: { time: 4000, autostart: true, repeat: true },
              spamFilterTimer: { time: 10000, autostart: true, repeat: true }

        },
        created() {
            var service = new BackendService();

            this.refreshUser();

            // Refreshing user account for email verification
            if (this.$store.state.user) {
                service.RefreshUser(this.$store.state.user._id)
                    .then((res) => {
                        if (res && res.success) {
                            this.$store.commit("setUser", { user: res.user });
                        }

                        if (res && !res.success) {
                            console.log("couldn't refresh user");
                            console.log(res.message);
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            console.log(err);
                        }
                    })
            }

            var getUserFromMessage = async (message) => {
                return service.getUserfromId(message.userID)
                    .then((res) => {
                        var newFormat = moment(String(message.dateSent)).format('HH:mm');
                        if (res && !res.user){
                            return { ...message, username: "🚫deleted account", profilePicture: "https://storage.googleapis.com/self-isomate-images/profile-pictures/default/deleted-account.png", dataFormat: newFormat };
                        }
                        return { ...message, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat };
                    })
                    .catch((err) => {
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
                    }
                });

            this.$timer.start('log');
            this.$timer.start('spamFilterTimer');       
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
            spamFilterTimer(){
                this.$store.state.spamFilterCount=0;
            },
            refreshUser () {
                var service = new BackendService();
                if (this.$store.state.user) {
                    service.RefreshUser(this.$store.state.user._id)
                        .then((res) => {
                            if (res && res.success) {
                                this.$store.commit("setUser", { user: res.user });
                            }

                            if (res && !res.success) {
                                console.log("couldn't refresh user");
                                console.log(res.message);
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                }
            },
            log () {
                var service = new BackendService();

                // Refreshing user account for email verification
                this.refreshUser();

                var getUserFromMessage = async (message) => {
                    return service.getUserfromId(message.userID)
                        .then((res) => {
                            var newFormat = moment(String(message.dateSent)).format('HH:mm');
                            if (res && !res.user){
                                return { ...message, username: "deleted account", profilePicture: "https://storage.googleapis.com/self-isomate-images/profile-pictures/default/deleted-account.png", dataFormat: newFormat };
                            }
                            return { ...message, username: res.user.username, profilePicture: res.user.profilePicture, dataFormat: newFormat };
                        })
                        .catch((err) => {
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
                                var matchingConvs =  this.conversations.every(conv => {
                                    return conv._id != e._id;
                                });
                                return matchingConvs;
                            });
                            console.log("messages");
                            console.log(messages);
                            // check if id is not already in the list
                            // if not mutate message
                            //this.conversation. push (result)
                            if(messages.length > 0){
                            mutateMessages(messages)
                                .then((result) => {//it does not run mutate Messages
                                    if(result) {
                                        console.log("result");
                                        console.log(result);
                                        this.conversations = this.conversations.concat(result);
                                    }
                                })
                                .catch((err) => {
                                    if (err) console.log("err: " + err);
                                })
                            } 
                        }
                    })
                    .catch((err) => {
                        if (err) console.log("err: " + err);
                    });
                this.scrollDown();
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
                if (this.isUserVerified) {
                    if(this.$store.state.spamFilterCount<4) {
                        if (this.message.trim().length >= 1) {
                            var service = new BackendService();
                            service.saveMessage(this.$store.state.user._id,this.$props.chatRoom._id,this.message)
                                .then((response) => {
                                    if (response) {
                                        this.$store.state.spamFilterCount += 1;
                                        this.message = "";
                                    }
                                });
                            this.scrollDown(); 
                        }
                    } else {
                        this.confirmDialog();
                    }
                } else {
                    this.confirmDialog();
                }
            },
            scrollDown(){
                this.$refs.listView.nativeView.scrollToIndex(this.conversations.length);
            },
            alertMessage () {
                // If user isn't verified and tries to click on the messagebox, then display a message
                if (!this.isUserVerified) {
                    alert({ title: 'Please verify your email', message: 'Ewwww did you just try to chat without first verifying your email??? 🤮' })
                }
            },
            confirmDialog () {
                confirm({ 
							title: 'Please verify your email',
							message: 'Make sure you check your spam folder.',
							cancelButtonText: 'Cancel',
							okButtonText: 'Resend Verification'
                        })
                        .then((result) => {
							if (result) {
								console.log("Resending");
								service.ResendVerification(response.user.email)
									.then((res) => {
										if (res && res.success) {
											alert({ title: 'Success', message: 'Successfully resent verification' })
										}

										if (res && !res.success) {
											alert({ title: 'Error', message: 'Unsuccessful'})
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
                        })
            }
        },
        computed: {
            isUserVerified: function () {
                return this.$store.state.user.isVerified;
            }
        }
    };
</script>
<style scoped>
</style>