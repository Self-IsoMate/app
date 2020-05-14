fcommit<template lang="html">
    <Page @loaded="checkToken()">
		<ActionBar title="Self-IsoMate" class="action-bar header"/>
		<ScrollView>
			<StackLayout margin="50 50 50 50">
				<TextField v-model="username" hint="Username" autocapitalizationType="none" autocorrect="false"/>
				<TextField v-model="password" hint="Password" secure="true"/>
				<Button text="LOGIN" @tap="handleLogin($event)" ></Button>
				<GridLayout columns="*, *" rows="*, *">
					<Button col="0" row="0" text="REGISTER" @tap="navigateRegister"></Button>
					<Button col="1" row="0" text="GUEST" @tap="handleGuest"></Button>
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
		checkToken() {
			this.$store.commit("loadFromStorage");
			if (this.$store.state.user && this.$store.state.user.username) {
				this.$navigateTo(Home, {
								animated: false,
								clearHistory: true
							});
			}
		},
		navigateRegister(event) {
			this.$navigateTo(Register);
		},
		navigateForgot(event) {
			this.$navigateTo(Forgot);
		},
		handleLogin(event) {
			var service = new BackendService();
			service.login(this.username, this.password).then((response) => {
				//console.log(response);
				if (response && response.success) {
					this.$navigateTo(Home,{
							animated: false,
							clearHistory: true
						});

					/*console.log("response.user to store");
					console.log(response.user);*/

					this.$store.commit("setUser", { user: response.user });

					if (!response.user.isVerified) {
						confirm({ 
								title: 'Please verify your email',
								message: 'Make sure you check your spam folder.',
								cancelButtonText: 'Cancel',
								okButtonText: 'Resend Verification'
							}).then((result) => {
								if (result) {
									console.log("Resending");
									service.ResendVerification(response.user.email)
										.then((res) => {
											if (res && res.success) {
												alert({ title: 'Success', message: 'Successfully resent verification' })
											}

											if (res && !res.success) {
												alert({ title: 'Error', message: 'Unsuccessful'})
												console.log(res.message);
											}
										})
										.catch((err) => {
											if (err) {
												console.log(err);
												alert({ title: 'Error', message: 'Unsuccessful' })
											}
										})
							} else {
								console.log("cancelled");
							}
						})
							
					}

				} else {
					this.message = "Login failed";
				}
			});
		},
		handleGuest(event) {
			this.$store.commit("setUser", { user: null });
			this.$navigateTo(Home,
			{
				animated: false,
				clearHistory: true
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
