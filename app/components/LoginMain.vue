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
									//console.log("Resending");
									service.ResendVerification(response.user.email)
										.then((res) => {
											if (res && res.success) {
												//alert({ title: 'Success', message: 'Successfully resent verification' })
													feedback.show({
													title: "Success",
													message: "Successfully resent verification",
													type:
													FeedbackType.Success
												});	
											}

											if (res && !res.success) {
												//alert({ title: 'Error', message: 'Unsuccessful'})
												console.log(res);
												console.log(res.message);
													feedback.show({
													title: "Login Unsuccessful, please try again in few minutes",
													message: "An error might have occurred. \nservers are busy, please try again in few minutes",
													type:
													FeedbackType.Error
												});	
											}
										})
										.catch((err) => {
											if (err) {
												console.log(err);
												//alert({ title: 'Error', message: 'Unsuccessful' })
												feedback.show({
													title: "Login Unsuccessful, please try again in few minutes",
													message: "An error might have occurred. \nservers are busy, please try again in few minutes",
													type:
													FeedbackType.Error
												});	
											}
										})
							} else {
								//console.log("cancelled");
									this.message = "Login cancelled";
									feedback.show({
										title: "Please  try again:",
										message: "An error might have occurred. \nPlease check Username and Password!",
										type:
										//FeedbackType.Custom
										//FeedbackType.Success
										FeedbackType.Warning
										//FeedbackType.Error
										//FeedbackType.Info
									});
							}
						})
							
					}

				} else {
					this.message = "Login failed";
					 feedback.show({
                        title: "Please  try again:",
                        message: "An error might have occurred. \nPlease check Username and Password!",
                        type:
                        //FeedbackType.Custom
                        //FeedbackType.Success
                        FeedbackType.Warning
                        //FeedbackType.Error
                        //FeedbackType.Info
                    });
				}
			});
		},
		handleGuest(event) {
		//alert({ title: "GUEST OPTION NOT AVAILABLE", message: "GUEST OPTION NOT AVAILABLE", okButtonText: "OK"  });
		    feedback.show({
                                title: "We are still working on this. \n Wait for V.02",
                                message: "Guest options not yet available",
                                type:
                                FeedbackType.Info
                            })
			//this.$store.commit("setUser", { user: null }); it creashes better use the clearUser 
            /*this.$store.commit("clearUser");    
			this.$navigateTo(Home,
			{
				animated: false,
				clearHistory: true
			});*/
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
