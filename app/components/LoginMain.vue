<template lang="html">
    <Page>
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
					this.$navigateTo(Home,{
							animated: false,
							//clearHistory: true
						});

					console.log(response);

					this.$store.commit("setUser", { user: response.user });

					if (!response.user.isVerified) {
						alert({ message: 'You have not verified your email 🤢 You won\'t be able to post or chat in the meantime' });
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
				//clearHistory: true
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