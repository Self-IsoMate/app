<template lang="html">
    <Page>
		<ActionBar title="Self-IsoMate" class="action-bar header" />
		<ScrollView>
			<StackLayout margin="50 50 50 50">
				<Label text="Some Questions..." class="main-text" fontSize="20"/>
				<Label text="Would you be open to becoming a mentor?" class="main-text"/>

				<StackLayout margin="15 0 0 0">
					<FlexboxLayout alignItems="stretch" justifyContent="space-between">
						<Button :class="{ selected : checkYes }" text="YES" @tap="selectYes" width="50%" />
						<Button :class="{ selected : !checkYes }" text="NO" @tap="selectNo" width="50%" />
					</FlexboxLayout>

					<Button text="Next" @tap="navigateNext" />
					<Button text="Skip" @tap="navigateNext" />
				</StackLayout>
			</StackLayout>

		</ScrollView>
    </Page>
</template>

<script>

import BackendService from "../services/BackendService";
import LoginQuestionsActivities from "./LoginQuestionsActivities";
import Home from "./Home";
import * as ApplicationSettings from "application-settings"

export default {
	props: {
		newUser: Object
	},
    data: () => {
        return {
			checkYes: null
        };
	},
	methods: {
		selectYes () {
			this.checkYes = true;
		},
		selectNo () {
			this.checkYes = false;
		},
		navigateNext () {
			if (this.checkYes) {
				// go to choosing which ones you're good at
				this.$navigateTo(LoginQuestionsActivities, {
					props: {
						newUser: {
							username: this.$props.newUser.username,
							password: this.$props.newUser.password,
							email: this.$props.newUser.email,
							isMentor: this.checkYes
						}
					}
				});
			} else {
				// register

				var backend = new BackendService();

				backend.register(this.newUser)
					.then((response) => {
						if (response.success) {
							this.$store.commit("saveUser", response.user._id);
							console.log(this.$store.state.userId);
							this.$navigateTo(Home);
						} else {
							console.log("you failed, you loser");
						}
					});
			}
		}
	}
}
</script>

<style lang="scss" scoped>
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles

.selected {
	background-color: $complementary;
	color: $complementary-color;
}

.main-text {
	text-align: center;
}

</style>