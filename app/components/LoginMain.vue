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
var FeedbackPlugin = require("nativescript-feedback");
var FeedbackType = require ("nativescript-feedback").FeedbackType;
var feedback = new FeedbackPlugin.Feedback();

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
			if (this.$store.state.user && this.$store.state.user._id) {
				var service = new BackendService();
				service.RefreshUser(this.$store.state.user._id)
					.then((res) => {
						if (res) {
							if (res.success && res.user) {
								this.$navigateTo(Home,{
									animated: false,
									clearHistory: true
								});
							} else {
								//alert({ title: 'Please log in', message: 'You\'ve been signed out, please re-enter your details.' })
								feedback.show({
									title: "Please log in:",
									message: "You\'ve been signed out, please re-enter your details.",
									type:
									FeedbackType.Warning
								});
							}
						}
					})
					.catch((err) => {
						if (err) {
							//alert({ title: 'Error', message: 'Problem logging in, please enter your details.' })
							feedback.show({
									title: "Error:",
									message: "An error might have occurred. \nPlease check Username and Password!",
									type:
									FeedbackType.Error
								});
						}
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
				if (response) {
					if (response.success) {
						this.$navigateTo(Home,{
								animated: false,
								clearHistory: true
							});

						this.$store.commit("setUser", { user: response.user });

						if (!response.user.isVerified) {
							confirm({ 
									title: 'Please verify your email',
									message: 'Make sure you check your spam folder.',
									cancelButtonText: 'Cancel',
									okButtonText: 'Resend Verification'
								})
								.then((result) => {
									if (result) {
										service.ResendVerification(response.user.email)
											.then((res) => {
												if (res && res.success) {
													alert({ title: 'Success', message: 'Verification email resent' })
												}

												if (res && !res.success) {
													feedback.show({
														title: 'Login Unsuccessful',
														message: res.message,
														type: FeedbackType.Error
													});	
												}
											})
											.catch((err) => {
												if (err) {
													feedback.show({
														title: 'Login Unsuccessful',
														message: err.message,
														type: FeedbackType.Error
													});	
												}
											})
									}
								})
								
						}

					} else {
						feedback.show({
							title: 'Login Unsuccessful',
							message: response.message,
							type: FeedbackType.Error
						});	
					}
				}
			})
			.catch((err) => {
				if (err) {
					feedback.show({
							title: 'Login Unsuccessful',
							message: response.message,
							type: FeedbackType.Error
						});	
				}
			});
		},
		handleGuest(event) {
		    feedback.show({
				title: "We are still working on this. \n Wait for V.02",
				message: "Guest options not yet available",
				type: FeedbackType.Info
			})
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
