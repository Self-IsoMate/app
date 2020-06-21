<template>
    <Page class= "page">
        
        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="toggleDrawer">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="Settings" class="header-text" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            
            <SideBar ~drawerContent />

            <StackLayout ~mainContent>
                <!-- Actual page content goes here (in dock top) -->
                <StackLayout dock="top" width="100%" style="">
                    <ScrollView>
                        <StackLayout margin="15">
                            <!-- Profile Settings -->
                            <Label text="Profile" class="setting-header" />

                            <Label text="Click here to edit your profile" class="setting-text emphasis" @tap="navigateEditProfile" />
                            <StackLayout class="hr m-10 divider"/>

                            <!-- Security & Privacy Settings -->
                            <Label text="Security &amp; Privacy" class="setting-header" />

                            <Label text="Change password" class="setting-text" />
                            <TextField v-model="settingsValues.newPassword" secure="true" hint="Enter new password" />
                            <TextField v-model="settingsValues.confirmNewPassword" secure="true" hint="Confirm new password" />

                            <Label text="Change email" class="setting-text" />

                            <TextField v-model="settingsValues.newEmail" hint="Enter new email" keyboardType="email" />
                            <TextField v-model="settingsValues.confirmNewEmail" hint="Confirm new email" keyboardType="email" />

                            <GridLayout columns="*, *" rows="auto">

                                <Button text="Confirm changes" col="0" row="0" @tap="changeDetails"/>
                                <Button text="Delete your account" col="1" backgroundColor="red" @tap="deleteAccount"/>

                            </GridLayout>
                        </StackLayout>
                    </ScrollView>

                </StackLayout>
            </StackLayout>
            
        </RadSideDrawer>
        
    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import EditProfile from "./EditProfile";
    import BackendService from '../services/BackendService';
    import LoginMain from "./LoginMain";
    import { CheckBox } from '@nstudio/nativescript-checkbox';
    import { topmost } from 'tns-core-modules/ui/frame'
    import ModalComponent from "./ModalComponent";


    export default { 
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Notifications");
        },
        computed: {
            message() {
                return "No Settings";
            }
        },
        data: () => {
            return {
                drawerToggle: false,
                drawer1: "", //the three dots vertically
                drawer2: "", //the three dots horizontally
                settingsValues: {
                    newPassword: '',
                    confirmNewPassword: '',
                    newEmail: '',
                    confirmNewEmail: '',
                    deleteprofileResponses:[false,false,false]
                },
                service: new BackendService()
            }
        },
        methods: {
            getCheckProp() {
            const checkBox = topmost().getViewById('yourCheckBoxId');
            console.log('checked prop value = ' + checkBox.checked);
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
            navigateEditProfile(event) {
                this.$navigateTo(EditProfile);
            },
            changeDetails(event) {

                console.log("tapped");

                if (this.settingsValues.newPassword && this.settingsValues.newPassword != this.settingsValues.confirmNewPassword) {
                    // throw error
                    console.log("not matching");
                    return;
                }

                if (this.settingsValues.newEmail && this.settingsValues.newEmail != this.settingsValues.confirmNewEmail) {
                    // throw error
                    console.log("not matching");
                    return;
                }

                if (this.settingsValues.newPassword) {
                    // change password
                    this.service.updateUser(this.$store.state.user._id, { password: this.settingsValues.newPassword })
                        .then((res) => {
                            if (res) {
                                console.log("updated password");
                                alert({ title: "Password", message: "Successfully changed your password" })
                                    .then((res) => {
                                        this.clearDetails();
                                    });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                console.log(err);
                                alert({ title: "Error", message: "There was a problem changing your password" })
                                    .then((res) => {
                                        console.log("acknowledged");
                                    });
                            }
                        })
                }

                if (this.settingsValues.newEmail) {
                    this.service.updateUser(this.$store.state.user._id, { email: this.settingsValues.newEmail })
                        .then((res) => {
                            if (res) {
                                console.log("updated email");
                                alert({ title: "Email", message: "Successfully changed your email" })
                                    .then((res) => {
                                        this.clearDetails();
                                    })
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                }

                // check if email is being updated and then update

            },
            deleteAccount(event) {
                this.$showModal(ModalComponent)
                  .then((modalRes) => {
                           if(modalRes[0]!=false || modalRes[1]!=false || modalRes[2]!=false){
                           this.deleteprofileResponses = modalRes;
                           var deleteMessage="Are you sure you want to delete your data? "+'\n'+'\n';
                           if(this.deleteprofileResponses[0]==true) deleteMessage=deleteMessage.concat("Removing your PROFILE: You will not be able to log in again ",'\n','\n');
                           if(this.deleteprofileResponses[1]==true) deleteMessage=deleteMessage.concat("Removing your POSTS: All your posts will be deleted ",'\n','\n');
                           if(this.deleteprofileResponses[2]==true) deleteMessage=deleteMessage.concat("Removing your MESSAGES: All the chat messages you sent will be deleted ",'\n','\n');
                confirm(
                    {
                        title: 'Are you sure?',
                        message: deleteMessage, // message depending on what inside the array
                        okButtonText: "I am sure, please Delete",
                        cancelButtonText: "No, Go Back"
                    })
                    .then((res) => {
                        if (res) {

                                var service = new BackendService();

                                if(this.deleteprofileResponses[1]==true){
                                        this.service.getProfilePosts((this.$store.state.user._id))
                                            .then((res) => {
                                                if (res) {
                                                    var postsArray = res.posts;

                                                    postsArray.forEach(post => {
                                                        var mediaData = post.media.split("/");
                                                        if(mediaData!=''){
                                                            var postBucketName;
                                                            var postFilename;
                                                            if(mediaData[mediaData.length - 1].slice(-3)=='mp4'){
                                                                        postBucketName  = "self-isomate-videos";
                                                                        postFilename = "post-videos/"+mediaData[mediaData.length - 1];
                                                            }else{   
                                                                        postBucketName  = "self-isomate-images";
                                                                        postFilename = "post-images/"+mediaData[mediaData.length - 1];
                                                            }             
                                                            console.log(postBucketName+"  "+postFilename);
                                                                service.removeMediaFromCloud(postBucketName, postFilename )
                                                                    .then((res) => {
                                                                        if (res) {
                                                                            if(res.success==true){
                                                                                    service.removeMediaFromPost(post._id)
                                                                                    .then((res) => {
                                                                                        if (res) {
                                                                                            if(res.success!=true){
                                                                                        alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                                                                    }
                                                                                }
                                                                            }).catch((err) => {
                                                                                if (err) console.log("err: "+err);
                                                                            });

                                                                            }else{
                                                                                alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });

                                                                            }
                                                                        }
                                                                    }).catch((err) => {
                                                                        if (err) console.log("err: "+err);
                                                                    });
                                                            }
                                                                        service.deletePost(post._id)
                                                                            .then((res) => {
                                                                                if (res) {
                                                                                    if(res.success!=true){
                                                                                    alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });
                                                                                    }else{
                                                                                    alert({ title: "POSTS REMOVED SUCCESSFULLY", message: "POSTS DELETED", okButtonText: "OK"  });
                                                                                    }
                                                                                }
                                                                            }).catch((err) => {
                                                                                if (err) console.log("err: "+err);
                                                                            })
                                                        });                                     
                                                }
                                            })
                                     }      

                                              if(this.deleteprofileResponses[2]==true){
                                                  

                                        this.service.getMessagesfromUser((this.$store.state.user._id))
                                            .then((res) => {
                                                if (res) {
                                                    var chatsArray = res.chatMessages;

                                                    chatsArray.forEach(message => {

                                                        this.service.deleteMessage((message._id))
                                                            .then((res) => {
                                                                alert({ title: "CHAT MESSAGES REMOVED SUCCESSFULLY", message: "MESSAGES DELETED", okButtonText: "OK"  });    
                                                        }
                                                        
                                                        );


                                                    });
                                                }
                                                    
                                                    
                                        });

                                     }  

                                if(this.deleteprofileResponses[0]==true){
//                                                3) Need to delete all user data (emails, tokens?, anything with personal info)
//                                                4) Delete profile pictures from gcloud

                                        this.service.deleteToken((this.$store.state.user.email))    .then((removeRes) => {
                                                })
                                                .catch((err) => {
                                                    if (err) console.log("err: "+err);
                                                });
                                    var propicData = this.$store.state.user.profilePicture.split("/");
                                        if (propicData[5] && propicData[5]!="default") {
                                            var postBucketName  = "self-isomate-images";
                                            var postFilename = "profile-pictures/"+propicData[5];
                                            this.service.removeMediaFromCloud(postBucketName, postFilename )
                                                .then((removeRes) => {
                                                })
                                                .catch((err) => {
                                                    if (err) console.log("err: "+err);
                                                });
                                        }                                   
                                    this.service.deleteAccount((this.$store.state.user._id))
                                            .then((res) => {
                                                if (res) {
                                                    if (res.success) {
                                                        alert({ title: "Deleted", message: "Your account has been successfully deleted" })
                                                            .then((res) => {
                                                          alert({ title: "PROFILE REMOVED SUCCESSFULLY", message: "ACCOUNT DELETED", okButtonText: "OK"  });    
                                                                this.$store.commit("setUser", { user: null });
                                                                this.$navigateTo(LoginMain, {
                                                                    //clearHistory: true, 
                                                                    animated: false
                                                                });
                                                            });
                                                    }
                                                    if (!res.success) {
                                                        alert({ title: "Unsuccessful", message: "Unfortunately, there was an error deleting your account. Please contact us at <our email>" });
                                                    }
                                                }
                                            })
                                }
                        }
                    });
                           }
                     });
                     
            },
            clearDetails () {
                this.settingsValues = {
                    newPassword: '',
                    confirmNewPassword: '',
                    newEmail: '',
                    confirmNewEmail: ''
                }
            }
        }
    };
</script>

<style scoped>

.setting-header {
    font-size: 20;
    font-weight: bold;
    color: #1aa3ff;
    margin: 0 0 5 0;
}

.setting-text {
    font-size: 16;
    vertical-align: center;
}

.header-text {
	font-size: 20;
	vertical-align: center;
	color: white;
	margin: 5 0 0 0
}

</style>