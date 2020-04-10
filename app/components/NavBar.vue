<template>
	<StackLayout style="border-color:#E8E8E8;border-width:1;background:#fff;">
		<StackLayout orientation="horizontal">
			<StackLayout class="navItem" @tap="homeTap()">
				<Label text="" android:class="notificationAndroid"
					ios:class="notification" opacity="0" />
				<Label text="" :color="isSelected('home')"
					android:style="font-size:25;margin-top:-15"
					ios:style="font-size:30;margin-top:-15"
					class="font-awesome" />
			</StackLayout>
			<StackLayout class="navItem" @tap="competitionTap()">
				<Label text="" android:class="notificationAndroid"
					ios:class="notification" opacity="0" />
				<Label text=" " :color="isSelected('competition')"
					android:style="font-size:23;margin-top:-15"
					ios:style="font-size:29;margin-top:-15"
					class="font-awesome" />
			</StackLayout>
			<StackLayout class="navItem" @tap="communityTap()">
				<Label text="" android:class="notificationAndroid"
					ios:class="notification" opacity="0" />
				<Label text="" :color="isSelected('community')"
					android:style="font-size:25;margin-top:-15"
					ios:style="font-size:30;margin-top:-15"
					class="font-awesome" />
			</StackLayout>
			<StackLayout class="navItem" @tap="chatTap()">
				<Label text="" android:class="notificationAndroid"
					ios:class="notification" opacity="0" />
				<Label text="" :color="isSelected('chat')"
					android:style="font-size:25;margin-top:-15"
					ios:style="font-size:30;margin-top:-15"
					class="font-awesome" />
			</StackLayout>
		</StackLayout>
	</StackLayout>
</template>
<script>
import Home from "./Home";
import Community from "./Community";
import Chat from "./Chat";
import Competitions from "./Competitions";

export default {
	name: "NavBar",
	methods: {
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
		isSelected(tabName) {
			console.log(this.$props.selectedtab);
			if (this.$props.selectedtab == tabName) return "#00ff92";
			else "";
		}
	},
	props: {
		selectedtab: String
	}
}
</script>
<style scoped>

</style>