<template>
    <Page class="page">

        <ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="margin-top:10;" @tap="toggleDrawer()">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <SearchBar hint="Search hint" v-model="searchValue" @textChange="filter" />
                </StackLayout>
                <StackLayout class="HRight">

                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened()"
            @drawerClosed="onDrawerClosed()">
            <StackLayout ~drawerContent backgroundColor="#eee">
                <StackLayout height="2%"></StackLayout>
                <StackLayout class="">
                    <StackLayout class = "prof" @tap="profileTap()">
                    <Label text="  Profile" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "notif" @tap="notificationTap()">
                    <Label text="  Notifications" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "settings" @tap="settingsTap()">
                    <Label text="  Settings" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "help" @tap="helpTap()">
                    <Label text="  Help" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                    <StackLayout class = "logout" @tap="logOut()">
                    <Label text="  Log out" paddingLeft="15%" color="black"
                        class="drawerItemText font-awesome" margin="15" />
                    </StackLayout>
                </StackLayout>
            </StackLayout>

            <StackLayout ~mainContent>

                <DockLayout>

                    <StackLayout dock="top" height="90%" width="100%" style="">
                        <ListView for="challenge in challenges" key="index" height="100%"
                            backgroundColor="#E8E8E8" separatorColor="transparent"
                            id="listView">
                            <StackLayout @tap="showDetails(challenge.title)">
                            <v-template>

                                <StackLayout paddingTop="5" backgroundColor="#E8E8E8">
                                    <StackLayout class="postContainer">
                                        <Image :src="challenge.image" marginTop="10" />
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                            </StackLayout>
                        </ListView>
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
        </RadSideDrawer>

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
    import CompetitionInfo from "./CompetitionInfo";

    export default {
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
            competitionTap() {},
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
            showDetails(name){
                this.$navigateTo(CompetitionInfo, {
                    props: {title: name},
                    animated: false,
                    clearHistory: true
                });
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