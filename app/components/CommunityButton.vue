<template>
	<StackLayout>
		<Button :text="community.name" 
			:class="{ following : isFollowing, 'not-following' : !isFollowing, 'pill-button': true }"
			@tap="handleClick" />
	</StackLayout>
</template>
<script>
import BackendService from "../services/BackendService";

export default {
	name: "CommunityButton",
	created () {
		// check if user subscribed to community
		// check if user.communities contains this community's id
		if (this.$props.user.communities.includes(this.$props.community._id)) {
			this.isFollowing = true;
		} else {
			this.isFollowing = false;
		}
	},
	methods: {
		handleClick(event) {
			if (this.isFollowing) {
				this.isFollowing = false;
			} else {
				this.service.subscribeUserToCommunity(this.$props.user, this.$props.community._id)
					.then((res) => {
						if (res && res.success) {
							this.isFollowing = true;
							console.log(res);
						}
					});
			}
		}
	},
	props: {
		user: Object,
		community: Object
	},
	data () {
		return {
			isFollowing: false,
			service: new BackendService()
		};
	}
}
</script>
<style scoped>

.following {
	background-color: #1aa3ff;
	color: white;
}

.not-following {
	background-color: rgb(219, 207, 207);
	color: rgb(54, 54, 54);
}

.pill-button {
	height: 30;
	padding-top: 2;
	padding-bottom: 2;
	width: auto;
	font-size: 10;
	font-weight: bold;
	border-radius: 25;
}

</style>