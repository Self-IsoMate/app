<template>
    <Page class="page">

        <ActionBar title="HHHH" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="competitionTap()">
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

            <StackLayout ~mainContent>

                <DockLayout>
                    <!--HEY OVER HERE!! -->
                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <!--So bold isnt't working, and my WiFi crashes too much to test this new solution-->
                        <Label text="DESCRIPTION" fontWeight="bold"/> <!-- if fontWeight doesn't work try style="font-weight: bold" -->
                        <Label :text="$props.challenge.description"/>
                        <Label text="DEADLINE" fontWeight="bold"/>
                        <Label :text="$props.challenge.deadline"/>
                        <!--The commented out code below should replace the line above-->
                        <!--The reason it is commented out is because it renders the challenges unclickable-->
                        <!-- Needs to be debugged -->
                       <!-- <Label :text="moment(String($props.challenge.deadline)).format('DD/MM/YYYY')"/> -->
                    </StackLayout>

                    <StackLayout dock="bottom" height="10%" style="border-color:#E4E4E4;border-width:1;background:#fff;">
                        <StackLayout orientation="horizontal">
                            <StackLayout class="navItem" @tap="homeTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="competitionTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text=" " :color="mainColor"
                                    android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="communityTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text=""
                                    android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                            <StackLayout class="navItem" @tap="chatTap()">
                                <Label text="" android:class="notificationAndroid"
                                    ios:class="notification" opacity="0" />
                                <Label text="" android:style="font-size:25;margin-top:-15"
                                    ios:style="font-size:30;margin-top:-15"
                                    class="font-awesome" />
                            </StackLayout>
                        </StackLayout>
                    </StackLayout>

                </DockLayout>

            </StackLayout>

    </page>
</template>
<script>
    import Home from "./Home"
    import Community from "./Community";
    import Chat from "./Chat";
    import Profile from "./Profile";
    import Notifications from "./Notifications";
    import Settings from "./Settings";
    import Help from "./Help";
    import LoginScreen from "./LoginMain";
    import BackendService from "../services/BackendService";
    import { backgroundInternalProperty } from 'tns-core-modules/ui/page/page';
    import Competitions from "./Competitions";
    import moment from "moment";

    export default {
        props: ['challenge'],
        created() {
            var backend = new BackendService();
            backend.getChallenges()
                .then((res) => {
                    if (res) {
                        this.allChallenges = res.challenges;
                        this.challenges = Array.from(this.allChallenges);
                    }
                })
                .catch((err) => {
                    if (err) console.log(err);
                })
            
            backend.getAllCommunities()
                .then((res) => {
                    if (res) {
                        this.communities = res.communities;
                    }
                })
                .catch((err) => {
                    if (err) console.log(err);
                })
        },
        data() {
            return {
                back:"",
                drawerToggle: false,
                drawer1: "",
                drawer2: "",
                mainColor: "#00ff92",
                challenges: [],
                allChallenges: [],
                communities: [],
                searchValue: ""
            };
        },
        methods: {
            filter(){
                var filteredCommunities = this.communities.filter((community) => {
                    return community.name.toUpperCase().startsWith(this.searchValue.toUpperCase());
                });

                this.challenges = Array.from(this.allChallenges).filter((challenge) => {
                    return challenge.communities.some((c) => filteredCommunities.some((c1) => c1._id == c))
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
            homeTap() {
                this.$navigateTo(Home, {
                    animated: false,
                    clearHistory: true
                });
            },
            communityTap() {
                this.$navigateTo(Community, {
                    animated: false,
                    clearHistory: true
                });
            },
            chatTap() {
                this.$navigateTo(Chat, {
                    animated: false,
                    clearHistory: true
                });
            },
            competitionTap() {
                this.$navigateTo(Competitions, {
                    animated: false,
                    clearHistory: true
                });
            },
            profileTap() {
                this.$navigateTo(Profile, {
                    animated: false,
                    clearHistory: true
                });
            },
            notificationTap() {
                this.$navigateTo(Notifications, {
                    animated: false,
                    clearHistory: true
                });
            },
            settingsTap() {
                this.$navigateTo(Settings, {
                    animated: false,
                    clearHistory: true
                });
            },
            helpTap(){
                this.$navigateTo(Help, {
                    animated: false,
                    clearHistory: true
                });
            },
            logOut(){
                this.$navigateTo(LoginScreen, {
                    animated: false,
                    clearHistory: true
                });
            }, //put in here navigate to log-in screen
            showDetails() {}
        }
    };
</script>

<style scoped>

.postContainer{
	margin-top: 10;
	background: #fff;
}

</style>