<template>
    <Page>
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="toggleDrawer">
                    <Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
                        class="font-awesome" />
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                <AutoFocusView></AutoFocusView>
                    <SearchBar hint="Search" v-model="searchValue" @loaded="onSearchBarLoaded($event)" @textChange="filter" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <RadSideDrawer ref="drawer" @drawerOpened="onDrawerOpened" @drawerClosed="onDrawerClosed">
            
            <SideBar ~drawerContent />
            <StackLayout ~mainContent>
                <DockLayout>
                    <!-- Actual page content goes here (in dock top) -->

					<StackLayout dock="top" height="90%" width="100%" style="">
                        <ListView for="item in challenges" key="index" height="100%"
                            backgroundColor="#E8E8E8" separatorColor="transparent"
                            id="listView">
                            <StackLayout>
                            <v-template>

                                <StackLayout paddingTop="5" backgroundColor="#E8E8E8">
                                    <StackLayout class="item"  @tap="showDetails(item)">
                                        <Image :src="item.image" marginTop="10" />
                                    </StackLayout>
                                </StackLayout>

                            </v-template>
                            </StackLayout>
                        </ListView>
                    </StackLayout>

                    <NavBar dock="bottom" height="10%" selectedtab="competition" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>
	</Page>
</template>
<script>
    import BackendService from "../services/BackendService";
    import { backgroundInternalProperty } from 'tns-core-modules/ui/page/page';
    import CompetitionInfo from "./CompetitionInfo";
    import moment from "moment";

    export default {
        created() {
            var backend = new BackendService();
            backend.getChallenges()
                .then((res) => {
                    if (res) {
                        this.allChallenges = res.challenges;
                        this.challenges = Array.from(this.allChallenges);
                        console.log(this.challenges);

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
                 onSearchBarLoaded: function(event) {
                if (event.object.android) {
                    setTimeout(() => {
                        event.object.dismissSoftInput();
                        event.object.android.clearFocus();
                    }, 0);
                }
            },
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
            showDetails(challengeVariable){
                this.$navigateTo(CompetitionInfo, {
                    props: {challenge: challengeVariable, formattedTime: moment(String(challengeVariable.deadline)).format('DD/MM/YYYY')},
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