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
                            <TextField v-model="settingsValues.newPassword" secure="true" hint="Enter new password" @tap="clickPass"/>
                            <TextField v-model="settingsValues.confirmNewPassword" secure="true" hint="Confirm new password" />

                            <Label text="Change email" class="setting-text" />

                            <TextField v-model="settingsValues.newEmail" hint="Enter new email" keyboardType="email" />
                            <TextField v-model="settingsValues.confirmNewEmail" hint="Confirm new email" keyboardType="email" />

                            <GridLayout columns="*, *" rows="auto">

                                <Button text="Confirm changes" col="0" row="0" @tap="changeDetails" :isEnabled="hasEdits"/>
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
    import { Feedback, FeedbackType } from "nativescript-feedback";

    export default { 
        mounted() {
            SelectedPageService.getInstance().updateSelectedPage("Notifications");
        },
        computed: {
            message() {
                return "No Settings";
            },
            hasEdits: function () {
            return this.settingsValues.newPassword!=''||this.settingsValues.newEmail!='';
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
                service: new BackendService(),
                feedback: new Feedback()
            }
        },
        methods: {
            clickPass (){
                    this.feedback.show({
                        title: "For a strong password, please use:",
                        message: "A mixture of both uppercase and lowercase letters and numbers (least 8 characters)",
                        type:
                        FeedbackType.Custom
                        //FeedbackType.Success
                        //FeedbackType.Warning
                        //FeedbackType.Error
                        //FeedbackType.Info
                    });
        },
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


                if (this.settingsValues.newPassword && this.settingsValues.newPassword != this.settingsValues.confirmNewPassword) {
                    this.feedback.show({
                        title: "Passwords do not match:",
                        message: "Please check both password values! They must be the same",
                        type:
                        FeedbackType.Error
                   });
                    return;
                }

                if (this.settingsValues.newEmail && this.settingsValues.newEmail != this.settingsValues.confirmNewEmail) {
                    this.feedback.show({
                        title: "Email addresses do not match",
                        message: "Please check both email address values! They must be the same",
                        type:
                        FeedbackType.Error
                    });
                    return;
                }

                if (this.settingsValues.newPassword) {
                    var countPassword = this.settingsValues.newPassword;
                    if(countPassword.replace(/ /g,'').length < 5 || this.settingsValues.newPassword <8){
                        this.feedback.show({
                            title: "Password must be longer",
                            message: "Please insert at leat 8 characters (spaces excluded)",
                            type:
                            FeedbackType.Error
                        });
                }else{                   
             this.service.updateUser(this.$store.state.user._id, { password: this.settingsValues.newPassword })
                        .then((res) => {
                            if (res) {
                    this.feedback.show({
                        title: "Password Successfully changed!",
                        message: "You have successfully changed your password!",
                        type:
                        FeedbackType.Success
                    })
                        .then((res) => {
                            this.clearDetails();
                                    });
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                console.log(err);
                        this.feedback.show({
                                title: "There has been an error!:",
                                message: "We are sorry! Something went wrong, please try again in few minutes",
                                type:
                                FeedbackType.Error
                            });
                            }
                        })
                }
                }

                if (this.settingsValues.newEmail) {
                    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
                    if(String(this.settingsValues.newEmail).search (filter)==-1){
                        this.feedback.show({
                        title: "Insert a valid email address",
                        message: "Please insert a valid email address (youremail@address.ext)",
                        type:
                        FeedbackType.Error
                    });
                        return;
                    }else{
                    this.service.updateUser(this.$store.state.user._id, { email: this.settingsValues.newEmail })
                        .then((res) => {
                            if (res) {
                    this.feedback.show({
                        title: "Email address Successfully changed!",
                        message: "Your email address has been successfully updated!",
                        type:
                        FeedbackType.Success
                    })
                        .then((res) => {
                                      this.clearDetails();
                                    })
                            }
                        })
                        .catch((err) => {
                            if (err) {
                                console.log(err);
                        this.feedback.show({
                                title: "There has been an error!:",
                                message: "We are sorry! Something went wrong, please try again in few minutes",
                                type:
                                FeedbackType.Error
                            });
                            }
                        })
                }
                }

            if(!this.settingsValues.newEmail && !this.settingsValues.newPassword){
                        this.feedback.show({
                                title: "To update your email or password please fill the form:",
                                message: "You can update your email address and password here! \nYou can also edit or delete your profile",
                                type:
                                FeedbackType.Warning
                            });
            }

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
                                                            //console.log(postBucketName+"  "+postFilename);
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
                                                                                        this.feedback.show({
                                                                                            title: "POSTS REMOVED SUCCESSFULLY!:",
                                                                                            message: "POSTS DELETED",
                                                                                            type:
                                                                                            FeedbackType.Success
                                                                                        });
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
                                                                this.feedback.show({
                                                                    title: "CHAT MESSAGES REMOVED SUCCESSFULLY!:",
                                                                    message: "MESSAGES DELETED",
                                                                    type:
                                                                    FeedbackType.Success
                                                                });
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
                                                        this.feedback.show({
                                                            title: "PROFILE REMOVED SUCCESSFULLY",
                                                            message: "ACCOUNT DELETED",
                                                            type:
                                                            FeedbackType.Success
                                                        });
                                                      			//this.$store.commit("setUser", { user: null }); it creashes better use the clearUser 
                                                                this.$store.commit("clearUser");    
                                                                this.$navigateTo(LoginMain, {
                                                                    //clearHistory: true, 
                                                                    animated: false
                                                                });
                                                    }
                                                    if (!res.success) {
                                                        this.feedback.show({
                                                            title: "Unsuccessful: There has been an error!",
                                                            message: "We are sorry! Something went wrong, please try again in few minutes \nUnfortunately, there was an error deleting your account. Please contact us at <our email>",
                                                            type:
                                                            FeedbackType.Error
                                                        });
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