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

                            <Label text="Edit your profile" class="setting-text emphasis" @tap="navigateEditProfile" />

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

                            <StackLayout class="hr m-10 divider"/>

                            <!-- Notification Settings -->
                            <Label text="Notifications" class="setting-header" />
                            <GridLayout columns="*, auto" rows="auto">

                                <Label col="0" text="Toggle all Notifications" class="setting-text" />
                                <check-box col="1" />

                            </GridLayout>

                                <StackLayout class="hr m-10 divider"/>

                            <GridLayout columns="*, auto" rows="auto">

                                <Label col="0" text="Toggle comments" class="setting-text" />
                                <check-box col="1" />

                            </GridLayout>

                                <StackLayout class="hr m-10 divider"/>

                            <GridLayout columns="*, auto" rows="auto">

                                <Label col="0" text="Toggle new posts" class="setting-text" />
                                <check-box col="1"/>

                            </GridLayout>

                                <StackLayout class="hr m-10 divider"/>

                            <GridLayout columns="*, auto" rows="auto">

                                <Label col="0" text="Toggle new challenges" class="setting-text" />
                                <check-box col="1" />

                            </GridLayout>

                            <StackLayout class="hr m-10 divider"/>

                            <!-- Display Settings -->
                            <Label text="Display" class="setting-header" />

                            <Label text="Font Size" class="setting-text"/>
                            <Label text="Dark Mode" class="setting-text"/>
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
                    confirmNewEmail: ''
                },
                service: new BackendService()
            }
        },
        methods: {
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
                this.service.deleteAccount((this.$store.state.user._id))
                    .then((res) => {
                        if (res) {
                            if (res.success) {
                                alert({ title: "Deleted", message: "Your account has been successfully deleted" })
                                    .then((res) => {
                                        this.$navigateTo(LoginMain, {
                                            clearHistory: true, 
                                            animated: false
                                        });
                                    });
                            }

                            if (!res.success) {
                                alert({ title: "Unsuccessful", message: "Unfortunately, there was an error deleting your account. Please contact us at <our email>" });
                            }
                        }
                    })
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