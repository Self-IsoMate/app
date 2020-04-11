<template>
	<Page>
		<ActionBar title="" class="action-bar header">
            <StackLayout orientation="horizontal" height="38" alignItems="left"
                class="actionBarContainer">
                <StackLayout class="HLeft" style="vertical-align:center;" @tap="$navigateBack">
                    <Label text="<" style="font-size:27;color:#fff;"/>
                </StackLayout>
                <StackLayout class="HMid" alignItems="left">
                    <Label text="New Post" class="header-text" />
                </StackLayout>
                <StackLayout class="HRight">
                </StackLayout>
            </StackLayout>
        </ActionBar>

        <StackLayout ~mainContent>
                <!-- Actual page content goes here (in dock top) -->
			<StackLayout width="100%">

			    <StackLayout margin="15">

					<TextField v-model="post.title" hint="Title..." class="text-field" />

					<TextView v-model="post.body" hint="Your post..." height="100" class="outline-field text-field" />

					<StackLayout>
						<TextView v-model="searchCommunity" hint="Search communities..." @textChange="filterCommunities" />
						<ListView for="commie in availableCommunities" @itemTap="toggleCommunity" height="300" >
							<v-template>
								<CommunityItemPost :community="commie" />
							</v-template>
						</ListView>
						<WrapLayout orientation="horizontal">
							<Label v-for="item in post.communities" :key="item._id" :text="item.name" />
						</WrapLayout>
					</StackLayout>

					<GridLayout rows="auto" columns="*, *">
						<Button col="1" text="Add Post" @tap="addPost" />
						<Button col="0" text="Discard" backgroundColor="red" color="white" @tap="$navigateBack"/>
					</GridLayout>
					
			    </StackLayout>

			</StackLayout>
		</StackLayout>
	</Page>
</template>

<script>
import BackendService from '../services/BackendService';
import CommunityItemPost from "./CommunityItemPost";

export default {
	components: {
		CommunityItemPost
	},
	data() {
		return {
			post: {
				title: '',
				body: '',
				media: '',
				userId: '',
				communities: []
			},
			availableCommunities: [],
			allAvailableCommunities: [],
			service: new BackendService(),
			searchCommunity: ''
		}
	},
	created() {
		if (this.currentUser) {
			this.service.getCommunities(this.currentUser.communities)
				.then((res) => {
					if (res && res.success) {
						this.allAvailableCommunities = res.communities;
						this.availableCommunities = Array.from(this.allAvailableCommunities);
					}

					if (res && !res.success) {
						alert({ title: "Error", message: "There was a problem retrieving your communities", okButtonText: "OK"  })
							.then((res) => {
								this.$navigateBack();
							});
					}
				})
				.catch((err) => {
					if (err) {
						alert({ title: "Error", message: "There was a problem retrieving your communities", okButtonText: "OK"  })
							.then((res) => {
								this.$navigateBack();
							});
					}
				});
		} else {
			alert({ title: "Error", message: "It looks like you're not signed in... Please try again later", okButtonText: "OK"  })
				.then((res) => {
					this.$navigateBack();
				})
		}
	},
	methods: {
		addPost (event) {
			console.log("HHAHAHAHHAHAHA");
			this.post.userId = this.currentUser._id;
			console.log(this.post);
		},
		toggleCommunity (event) {
			var commie = event.item;
			console.log("you may proceed.... but be warned......");
			if (this.isSelected(commie)) {
				console.log("i must retreat!");
				this.post.communities = this.post.communities.filter((c) => c._id != commie._id );
			} else {
				console.log("finally! i have been chosen.")
				this.post.communities.push(commie);
			}

			console.log(this.post.communities);
		},
		filterCommunities (event) {
			this.availableCommunities = this.allAvailableCommunities.filter((commie) => {
				return commie.name.toUpperCase().startsWith(this.searchCommunity.toUpperCase());
			});
		},
		isSelected (community) {
			console.log("we're here");
			console.log(this.post.communities.find((c) => c._id == community._id) != null);
			return this.post.communities.find((c) => c._id == community._id) != null;
		}
	},
	computed: {
		currentUser () {
			return this.$store.state.user;
		}
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

.outline-field {
	border-color: #dedede;
	border-width: 1;
}

.text-field {
	margin: 10;
}

.selected {
	background-color: green;
}
</style>