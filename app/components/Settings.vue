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
                    <StackLayout margin="15">
                        <!-- Profile Settings -->
                        <Label text="Profile" class="setting-header" />

                        <Label text="Edit your profile" class="setting-text emphasis" @tap="navigateEditProfile" />

                        <StackLayout class="hr m-10 divider"/>

                        <!-- Security & Privacy Settings -->
                        <Label text="Security &amp; Privacy" class="setting-header" />

                        <Label text="Change password" class="setting-text" />
                        <Label text="Change email" class="setting-text" />
                        <Button text="Delete your account" backgroundColor="red"/>

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

                </StackLayout>
            </StackLayout>
            
        </RadSideDrawer>
        
    </Page>
</template>

<script>
    import * as utils from "~/shared/utils";
    import SelectedPageService from "../shared/selected-page-service";
    import EditProfile from "./EditProfile";

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