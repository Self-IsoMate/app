<template lang="html">
    <Page>
		<ActionBar title="Home"/>
		<GridLayout rows="*, auto">
			<ScrollView row="0">
				<StackLayout margin="50 50 50 50">
					<Button v-for="a in allActivities" :key="a.name" :text="a.name" @tap="toggleSelect(a)"
						:class="{ selected : isSelected(a) }"/>
				</StackLayout>
			</ScrollView>
			<Button row="1" text="Finish" @tap="confirm" />
		</GridLayout>
    </Page>
</template>

<script>

import _ from "underscore";
import Home from "./Home";

export default {
    data: () => {
        return {
			selectedActivities: [],
			allActivities: [
				{ name: "DIY" },
				{ name: "Sport" },
				{ name: "Sewing" },
				{ name: "Knitting" },
				{ name: "Cooking" },
				{ name: "Baking" },
				{ name: "Hydroponics" },
				{ name: "Films" },
				{ name: "Painting" },
				{ name: "Pottery" },
				{ name: "Gardening" },
				{ name: "Poetry" },
				{ name: "Creative Writing" },
				{ name: "History" },
				{ name: "Reptiles" },
				{ name: "Dogs" },
				{ name: "Cats" },
				{ name: "Horse Riding" },
				{ name: "Guitar" },
				{ name: "Violin" }
			]
        };
	},
	methods: {
		toggleSelect(event) {
			if (this.selectedActivities != null && this.isSelected(event)) {
				var selected = this.selectedActivities.find((k) => k.name == event.name);

				if (selected != null)
					this.deselectActivity(selected);
			}
			else {
				var selected = this.allActivities.find((k) => k.name == event.name);


				if (selected != null)
					this.selectActivity(selected);
				
				console.log(this.isSelected(event));
			}
		},
		selectActivity(param) {
			this.selectedActivities.push(param);
		},
		deselectActivity(param) {
			this.selectedActivities = this.selectedActivities.filter((act) => act.name != param.name);
		},
		isSelected(param) {
			return this.selectedActivities.find((a) => _.isEqual(a.name, param.name)) != null;
		},
		confirm(event) {
			this.$navigateTo(Home);
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