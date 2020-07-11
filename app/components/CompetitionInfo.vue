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
                    <Label class = "challengeTitle" :text="$props.challenge.title" paddingTop = "7.5%" color="white" id="searchField"></Label>
                </StackLayout>
                <StackLayout class="HRight">

                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            <SideBar ~drawerContent />
            <StackLayout ~mainContent>
                <DockLayout>
                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <Label text="Description" style="font-weight: bold"/>
                        <Label :text="$props.challenge.description" textWrap="true"/>
                        <Label class="newParagraph"/>
                        <Label text="Deadline" style="font-weight: bold"/>
                        <Label :text="$props.formattedTime" textWrap="true"/>
                    </StackLayout>
                    <NavBar dock="bottom" height="10%" selectedtab="competition" />
                </DockLayout>
            </StackLayout>
        </RadSideDrawer>

    </page>
</template>
<script>
    import Home from "./Home"
    import Community from "./Community";
    import Chat from "./Chat";
    import Profile from "./EditProfile";
    import Notifications from "./Notifications";
    import Settings from "./Settings";
    import Help from "./Help";
    import LoginScreen from "./LoginMain";
    import Competitions from "./Competitions";

    export default {
        props: ['challenge','formattedTime'],
        data() {
            return {
                back:"",
                drawerToggle: false,
                mainColor: "#00ff92"
            };
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
            }
        }
    };
</script>

<style scoped>

.postContainer{
	margin-top: 10;
	background: #fff;
}

</style>