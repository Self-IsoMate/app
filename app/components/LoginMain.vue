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
import {Feedback, FeedbackType} from "nativescript-feedback";

export default {
	name: 'LoginMain',
    data: () => {
        return {
			message: "",
			username: "",
			password: "",
			feedback: new Feedback()
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
								this.feedback.show({
									title: 'Log In',
									message: res.message,
									type: FeedbackType.Warning
								});
							}
						}
					})
					.catch((err) => {
						if (err) {
							this.feedback.show({
								title: 'Error',
								message: err.message,
								type: FeedbackType.Error
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
				if (response) {
					if (response.success) {
						this.$navigateTo(Home,{
								animated: false,
								clearHistory: true
							});

						this.$store.commit("setUser", { user: response.user });

						if (!response.user.isVerified) {
							confirm({  title: 'Please verify your email', message: 'Make sure you check your spam folder.', cancelButtonText: 'Cancel', kButtonText: 'Resend Verification' })
								.then((result) => {
									if (result) {
										service.ResendVerification(response.user.email)
											.then((res) => {
												if (res && res.success) {
													this.feedback.show({
														title: 'Sent',
														message: 'New verification email sent',
														type: FeedbackType.Success
													});	
												}

												if (res && !res.success) {
													this.feedback.show({
														title: 'Login Unsuccessful',
														message: res.message,
														type: FeedbackType.Error
													});	
												}
											})
											.catch((err) => {
												if (err) {
													this.feedback.show({
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
						this.feedback.show({
							title: 'Login Unsuccessful',
							message: response.message,
							type: FeedbackType.Error
						});	
					}
				}
			})
			.catch((err) => {
				if (err) {
					this.feedback.show({
						title: 'Login Unsuccessful',
						message: response.message,
						type: FeedbackType.Error
					});	
				}
			});
		},
		handleGuest(event) {
		    this.feedback.show({
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
