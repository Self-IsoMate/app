<template>
	<Page>
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="$navigateBack">
                    <Label text="<" style="font-size:27;color:#fff;"/>
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="Edit Profile" class="header-text" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <StackLayout ~mainContent>
                <!-- Actual page content goes here (in dock top) -->
			<StackLayout width="100%">

			    <StackLayout margin="15">

                    <!-- Edit username -->
                    <Label text="Edit Username" class="field-header" />
                    <TextView v-model="editedUser.username" :text="editedUser.username" />

                    <!-- Edit profile picture -->
                    <FlexboxLayout width="100%" alignItems="center" justifyContent="center">
                        <AbsoluteLayout>
                            <Label text="" class="font-awesome icon" top="20" left="130"/>
                            <Image :src="editedUser.profilePicture"
                                stretch="aspectFill" class="profilePic"
                                @tap="pickProfile" top="0" right="0">
                            </Image>
                        </AbsoluteLayout>
                    </FlexboxLayout>

                    <!-- Edit communities -->
                    <!--Label text="Edit communities" class="field-header" /-->

                    <WrapLayout>
                        <Label v-for="(com, index) in editedUser.communities" :text="com.name" :key="index" />
                    </WrapLayout>

                    <GridLayout columns="*, *" rows="auto">
                        <Button col="0" text="Confirm Changes" @tap="confirmChanges" :isEnabled="hasEdits" />
                        <Button col="1" text="Revert Changes" @tap="resetProfile" :isEnabled="hasEdits" />
                    </GridLayout>

			    </StackLayout>

			</StackLayout>
		</StackLayout>
	</Page>
</template>
<script>
import BackendService from "../services/BackendService";
import * as imagepicker from "nativescript-imagepicker";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { Observable } from "tns-core-modules/data/observable";
import _ from "underscore";

export default {
	methods: {
		pickProfile () {
            let context = imagepicker.create({ mode: "single", mediaType: 1 });

            context
                .authorize()
                .then(() => {
                    return context.present()
                    this.editedUser.profilePicture = null;
                })
                .then((selection) => {
                    if (selection) {
                        let image = selection[0];
                        image.options.width = 300;
                        image.options.height = 300;
                        this.editedUser.profilePicture = image;
                        //console.log(this.editedUser.profilePicture);
                        return;
                    } else {
                        console.log("no image selected");
                    }
                })
                .catch((err) => {
                    console.log(err);
                })

        },
            
        async uploadImage () {
            // run when you click save
            //console.log("uploading image");
            return this.service.changeProfilePicture(this.editedUser)
                .then((newLocation) => {
                    console.log("IMAGEEEE");
                    console.log(newLocation);
                    if (newLocation) {
                        /*console.log("RESPONSE");
                        console.log(res);*/
                    }
                });
        },
        
        confirmChanges () {
            // 1. update user
            // 2. if there's a profile picture, then do that

            var edit = {};
            Object.assign(edit, this.editedUser);
            // making sure the profile picture isn't updated
            delete edit.profilePicture;
            
            var updateUser = this.service.updateUser(this.currentUser._id, edit)
                .then((res) => {
                    if (res) {
                        this.$store.commit("setUser", {user: res.user});

                        if (this.editedUser.profilePicture != this.currentUser.profilePicture) {
                      
                            var propicData = this.$store.state.user.profilePicture.split("/");
                            //console.log(propicData);
                            if(propicData[5] && propicData[5]!="default"){
                            /*console.log("profilepic old ");
                            console.log(this.$store.state.user.profilePicture);*/
                                var postBucketName  = "self-isomate-images";
                                var postFilename = "profile-pictures/"+propicData[5];
                           this.service.removeMediaFromCloud(postBucketName, postFilename )
                                        .then((res) => {
                                            if (res) {
                                                //console.log(res);
                                                if(res.success==true){
                                                    alert({ title: "Loading your profile pic", message: "Loading please wait", okButtonText: "OK"  });
                                                }else{
                                                    alert({ title: ""+res.success+"", message: ""+res.message+"", okButtonText: "OK"  });

                                                }
                                            }
                                        }).catch((err) => {
                                            if (err) console.log("err: "+err);
                                        });
                            }
                         
                           this.uploadImage()
                                .then((res => {
                                    /*console.log("FRAAAA");
                                    console.log(res);*/
                                    if (res) {
                                        /*console.log("current user before");
                                        console.log(this.currentUser.profilePicture);
                                        console.log("response");
                                        console.log(res);*/
                                        this.$store.commit("setUserProfilePicture", { profilePicture: res });
                                        /*console.log("current user after");
                                        console.log(this.currentUser.profilePicture);*/
                                        	this.$navigateTo(Home,{
                                                animated: false,
                                                clearHistory: true
                                            });
                                    }
                                }))
                                .catch((errr) => {
                                    console.log(errr);
                                });
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                });

        },

        resetProfile() {
            this.editedUser.username = this.currentUser.username;
            this.editedUser.profilePicture = this.currentUser.profilePicture;
            this.editedUser.communities = Array.from(this.currentUser.communities);
            this.editedUser._id = this.currentUser._id;
        }
	},
	data () {
		return {
			drawerToggle: false,
			drawer1: "", //the three dots vertically
            drawer2: "", //the three dots horizontally
            editedUser: {
                username: '',
                profilePicture: '',
                communities: []
            },
            service: new BackendService()
		}
	},
	computed: {
		currentUser: function () { 
			return this.$store.state.user
        },
        hasEdits: function () {
            return this.currentUser.username != this.editedUser.username
                || !_.isEqual(this.currentUser.communities, this.editedUser.communities)
                || this.currentUser.profilePicture != this.editedUser.profilePicture;
        }
    },
    created () {
        this.resetProfile();
        console.log(this.editedUser);
    }
	
}
</script>
<style scoped>
.header-text {
	font-size: 20;
	vertical-align: center;
	color: white;
	margin: 5 0 0 0
}

.profilePic{
	width:150;
	height:150;
	border-radius:100;
	margin:20;
	border-color: #4db8ff;
    border-width: 3;
}

.icon {
    padding: 10;
    border-radius: 50%;
    background: #4db8ff;
    color: white;
    font-size: 20;
    z-index: 1;
}

.field-header {
    font-size: 18;
}
</style>