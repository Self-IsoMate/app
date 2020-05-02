<template>
	<StackLayout backgroundColor="#eee">
		<StackLayout height="2%"></StackLayout>
		<StackLayout>
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
</template>

<script>
import Community from "./Community";
import Chat from "./Chat";
import Competitions from "./Competitions"
import Settings from "./Settings";
import Help from "./Help";
import LoginScreen from "./LoginMain";

export default {
	name: "SideBar",
	components: {
	},
	methods: {
            profileTap() {
                this.$navigateTo(Profile);
            },
            settingsTap() {
                this.$navigateTo(Settings);
            },
            helpTap(){
                this.$navigateTo(Help);
            },
            logOut(){
				this.$store.commit("clearUser");
                this.$navigateTo(LoginScreen);
            }
	}
}
</script>

<style scoped>

</style>