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
                    <Label text="Edit communities" class="field-header" />

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
                            console.log(this.editedUser.profilePicture);
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
                let backendService = new BackendService();
                console.log("uploading image");
                this.currentUser.profilePicture = this.editedUser.profilePicture;
                return backendService.changeProfilePicture(this.currentUser).newLocation;
            },
            
            confirmChanges () {
                console.log(this.editedUser.profilePicture);
                this.editedUser.username = "I will actually ";
                console.log(this.hasEdits);
            },

            resetProfile() {
                this.editedUser.username = this.currentUser.username;
                this.editedUser.profilePicture = this.currentUser.profilePicture;
                this.editedUser.communities = Array.from(this.currentUser.communities);
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
            }
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