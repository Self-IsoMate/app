<template lang="html">
    <Page>
		<ActionBar title="Home"/>
		<ScrollView>
			<StackLayout margin="50 50 50 50">
				<Label text="Some Questions..." class="" fontSize="20"/>
				<Label text="Would you be open to becoming a mentor?" />

				<StackLayout orientation="horizontal">
					<Button :class="{ selected : checkYes }" text="YES" @tap="selectYes" />
					<Button :class="{ selected : !checkYes }" text="NO" @tap="selectNo" />
				</StackLayout>

				<Button text="Next" @tap="navigateNext" />
			</StackLayout>

		</ScrollView>
    </Page>
</template>

<script>

import Browse from "./Browse";
import LoginQuestionsActivities from "./LoginQuestionsActivities";

export default {
    data: () => {
        return {
			checkYes: false
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
				this.$navigateTo(LoginQuestionsActivities);
			} else {
				// go straight to home
				this.$navigateTo(Browse);
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

</style>