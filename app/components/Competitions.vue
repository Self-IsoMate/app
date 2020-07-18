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
                    <SearchBar hint="Search" v-model="searchValue" @loaded="onSearchBarLoaded($event)" @textChange="filter" :isEnabled="arrayEnable"/>
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
                                        <GridLayout rows="*" backgroundColor="White">
                                           <GridLayout rows="*" columns="*" margin="0">
                                                <Image :src="item.image" stretch="aspectFill" />
                                                <GridLayout verticalAlignment="bottom">
                                                    <StackLayout paddingTop="8" paddingBottom="8" paddingLeft="16" paddingRight="16">
                                                        <Label :text="item.title" style="font-size:24;color:#ffffff;" class="font-awesome"/>
                                                        <Label :text="formatDeadline(item.deadline)" style="font-size:20;color:#ffffff;" class="font-awesome" />
                                                    </StackLayout>
                                                </GridLayout>
                                            </GridLayout>
                                        </GridLayout>
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
import { Feedback, FeedbackType } from "nativescript-feedback";

export default {
    created() {
        var backend = new BackendService();
        backend.getChallenges()
            .then((res) => {
                if (res) {
                    if (res.success) {
                        this.allChallenges = res.challenges;
                        this.challenges = Array.from(this.allChallenges);
                    } else {
                        alert({ title: 'Error', message: res.message })
                    }
                }
            })
            .catch((err) => {
                if (err) {
                    alert({ title: 'Error', message: err.message });
                }
            })
        
        backend.getAllCommunities()
            .then((res) => {
                if (res) {
                    if (res.success) {
                        this.communities = res.communities;
                    } else {
                        this.feedback.show({
                            title: "Error: There was a problem retrieving data from the server",
                            message: "We are sorry! Something went wrong, please try again in few minutes",
                            type: FeedbackType.Warning
                        });
                    }
                }
            })
            .catch((err) => {
                if (err) console.log(err);
            });
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
            searchValue: "",
            feedback: new Feedback()
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
        formatDeadline(deadline){
            var newFormat = moment(String(deadline)).format('MMMM Do YYYY');
            return "Deadline: " + newFormat;
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
        showDetails(challengeVariable){
            this.$navigateTo(CompetitionInfo, {
                props: {challenge: challengeVariable, formattedTime: moment(String(challengeVariable.deadline)).format('DD/MM/YYYY')},
                animated: false
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