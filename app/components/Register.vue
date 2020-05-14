<template>
    <Page >
        <ActionBar title="Self-IsoMate" class="action-bar header" />
        <ScrollView>
            <StackLayout margin="50 50 50 50">
				<Label text="Register" class="" fontSize="20"/>
                <TextField v-model="username" hint="Username" autocapitalizationType="none" autocorrect="false" />
                <TextField secure="true" v-model="password" hint="Password"  />
                <TextField secure="true" v-model="confirmpassword" hint="Confirm password" />
                <Label v-if="invalidPasswords" text="Passwords need to match" class="error" />
                <TextField v-model="email" hint="Email" autocapitalizationType="none" autocorrect="false" keyboardType="email" />
                <Button text="Register" @tap="navigateQuestions" />
            </StackLayout>
        </ScrollView>
    </Page>

</template>

<script>
import Home from "./Home";
import LoginQuestionsMentor from "./LoginQuestionsMentor";
import BackendService from "../services/BackendService";

export default {
    name: "Register",
    data: () => {
        return {
            message: "",
            username: "",
            password: "",
            confirmpassword: "",
            email: "",
            invalidPasswords: false
        };
    },
    methods: {
        navigateQuestions (event) {
            if (!this.isInvalid()) {
                var newUser = {
                    username: this.username,
                    password: this.password,
                    email: this.email
                }

                var backend = new BackendService();

				backend.register(newUser)
					.then((response) => {
						if (response && response.success) {
                            this.$store.commit("setUser", { user: response.user });
                            alert({
                                title: 'Registered',
                                message: 'Successfully registered. We\'ve sent you a confirmation email, so please verify your email so that you can participate in chats and post in communities.'
                            })
							this.$navigateTo(Home,  {
								animated: false,
								clearHistory: true
							});
                        }

                        if (response && !response.success) {
                            alert({ title: "Error", message: response.message });
                        }
                        
                    })
                    .catch((err) => {
                        if (err) {
                            alert({ title: "Error", message: err });
                        }
                    });
            } else {
                this.invalidPasswords = true;
                setTimeout(() => { this.invalidPasswords = false }, 3000);
            }
        },

        isInvalid() {
            // add any extra cases where passwords could be invalid

            if (this.password != this.confirmpassword)
                return true;

            return false;
        }
    }
}
</script>


<style scoped>

.error {
    color: red;
    font-style: italic;
    font-size: 8px;
}
    
</style>