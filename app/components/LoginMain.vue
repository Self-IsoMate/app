<template lang="html">
    <Page>
		<ActionBar title="Login"/>
		<ScrollView>
			<StackLayout margin="50 50 50 50">
				<Label text="Login" class="" fontSize="20"/>
				<TextField v-model="username" hint="Username"/>
				<TextField v-model="password" hint="Password" secure="true"/>
				<Button text="LOGIN" @tap="handleLogin($event)"></Button>
				<GridLayout columns="*, *" rows="*, *">
					<Button col="0" row="0" text="REGISTER" @tap="navigateRegister"></Button>
					<Button col="1" row="0" text="GUEST" @tap="handleLogin($event)"></Button>
					<Label row="1" colSpan="2" text="Forgot password?" @tap="navigateForgot" class="forgot-pass"></Label>
				</GridLayout>
				<Label :text="message" />
			</StackLayout>
		</ScrollView>
    </Page>
</template>

<script>
import Register from "./Register";
import Forgot from "./Forgot";
import Home from "./Home";
import BackendService from "../services/BackendService";

export default {
	name: 'LoginMain',
    data: () => {
        return {
			message: "",
			username: "",
			password: ""
        };
	},
	methods: {
		navigateRegister(event) {
			this.$navigateTo(Register);
		},
		navigateForgot(event) {
			this.$navigateTo(Forgot);
		},
		handleLogin(event) {
			var service = new BackendService();
			service.login(this.username, this.password).then((response) => {
				console.log(response);
				if (response && response.success) {
					this.$navigateTo(Home);
				} else {
					this.message = "Login failed";
				}
			});
		}
	}
}
</script>

<style lang="scss" scoped>
// Start custom common variables
@import "~@nativescript/theme/scss/variables/blue";
// End custom common variables

// Custom styles

.forgot-pass {
	font-style: italic;
	text-align: center;
}

</style>