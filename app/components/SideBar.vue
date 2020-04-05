<template>
	<StackLayout backgroundColor="#eee">
		<StackLayout height="2%"></StackLayout>
		<StackLayout>
			<StackLayout class = "prof" @tap="profileTap()">
			<Label text="  Profile" paddingLeft="15%" color="black"
				class="drawerItemText font-awesome" margin="15" />
			</StackLayout>
			<StackLayout class = "notif" @tap="notificationTap()">
			<Label text="  Notifications" paddingLeft="15%" color="black"
				class="drawerItemText font-awesome" margin="15" />
			</StackLayout>
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
import Profile from "./Profile";
import Notifications from "./Notifications";
import Settings from "./Settings";
import Help from "./Help";
import LoginScreen from "./LoginMain";

export default {
	name: "SideBar",
	components: {
	},
	methods: {
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
            }
	}
}
</script>

<style scoped>

</style>