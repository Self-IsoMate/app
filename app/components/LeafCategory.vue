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
                    <Label :text="category.name" class="category-header" />
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

					<!-- Recommended Communities section -->
					<StackLayout dock="top" height="90%" margin="0 10" >

						<Label text="Recommended Communities:" class="sub-header" margin-top="10" />

						<WrapLayout>
							<CommunityButton v-for="commie in communities" :key="commie._id" :community="commie"
							:user="currentUser" margin="2" />
						</WrapLayout>

						<Label text="Resources" class="sub-header" />

						<ScrollView>
							<StackLayout>
								<ResourceCard v-for="resource in resources" :key="resource._id" :resource="resource" />
							</StackLayout>
						</ScrollView>

					</StackLayout>

                    <NavBar dock="bottom" height="10%" selectedtab="home" />

                </DockLayout>
            </StackLayout>
        </RadSideDrawer>
	</Page>
</template>
<script>
import BackendService from "../services/BackendService";
import CommunityButton from "./CommunityButton";
import ResourceCard from "./ResourceCard";

export default {
	props: {
		category: Object
	},
	data () {
		return {
			drawerToggle: false,
            drawer1: "",
            drawer2: "",
			service: new BackendService(),
			communities: [],
			resources: []
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
        }
	},
	components : {
		CommunityButton,
		ResourceCard
	},
	created() {
		if (this.$props.category.communities) {
			this.service.getCommunities(this.category.communities)
				.then((res) => {
					if (res) {
						console.log(res);
						this.communities = res.communities;
					}

					if (!res.success) {
						console.log("failed");
					}
				})
				.catch((err) => {
					if (err) {
						console.log(err);
					}
				});
		}

		this.service.getResources(this.$props.category._id)
			.then((res) => {
				if (res && res.success) {
					console.log(":)");
					this.resources = res.resources;
				}

				if (res && !res.success) {
					console.log(":(");
				}
			})
	},
	computed: {
		currentUser () {
			return this.$store.state.user;
		}
	}
}
</script>
<style scoped>
.category-header {
	font-size: 20;
	vertical-align: center;
	color: white;
	margin: 5 0 0 0
}

.sub-header {
	font-size: 16;
	margin: 5 0;
}
</style>