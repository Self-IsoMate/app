<template>
    <Page >
        <ActionBar title="Self-IsoMate" class="action-bar header" />
        <ScrollView>
            <StackLayout margin="50 50 50 50">
				<Label text="Register" class="" fontSize="20"/>
                <TextField v-model="username" hint="Username" autocapitalizationType="none" autocorrect="false" />
                <TextField secure="true" v-model="password" hint="Password" @tap="clickPass"  />
                <TextField secure="true" v-model="confirmpassword" hint="Confirm password" />
                <Label v-if="invalidPasswords" text="Passwords need to match" class="error" />
                <TextField v-model="email" hint="Email" autocapitalizationType="none" autocorrect="false" keyboardType="email" />
                <Button text="Register" @tap="navigateQuestions" :isEnabled="hasEdits"/>
            </StackLayout>
        </ScrollView>
    </Page>

</template>

<script>
import Home from "./Home";
import LoginQuestionsMentor from "./LoginQuestionsMentor";
import BackendService from "../services/BackendService";
import Validate from "../validation/Validate";
import {Feedback, FeedbackType} from "nativescript-feedback";
var validation = new Validate();

export default {
    name: "Register",
    computed: {
            hasEdits: function () {
            return this.username!=''&& this.password!=''&& this.email!='';
        }
        },
    data: () => {
        return {
            message: "",
            username: "",
            password: "",
            confirmpassword: "",
            email: "",
            invalidPasswords: false,
            feedback: new Feedback()
        };
    },
    methods: {
        clickPass () {
   validation.selectPassword();
        },
        navigateQuestions (event) {
           
            if (this.isValid()) {
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
                                alert({ title: "Registered", message: "We\'ve sent you a confirmation email, so please verify your email so that you can participate in chats and post in communities." });
                                /*this.feedback.show({
                                    title: 'Registered',
                                    message: "We\'ve sent you a confirmation email, so please verify your email so that you can participate in chats and post in communities.",
                                    type: FeedbackType.Success
                                });*/
                                this.$navigateTo(Home,  {
                                    animated: false,
                                    clearHistory: true
                                });
                        }

                        if (response && !response.success) {
                            alert({ title: "Error:", message: response.message });
                            /*this.feedback.show({
                                title: "Error",
                                message: response.message,
                                type: FeedbackType.Error
                            })*/
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            alert({ title: "Error:", message: err.message });
                            /*this.feedback.show({
                                title: "Error",
                                message: err.message,
                                type: FeedbackType.Error
                            })*/
                        }
                    });
            } else {
                this.invalidPasswords = true;
                setTimeout(() => { this.invalidPasswords = false }, 3000);
            }
        
        },

        isValid() {
            return (validation.validateUsernameLength(this.username) && validation.validatePasswordLength(this.password) && validation.validatePasswordAgainstUsername(this.password, this.username) && validation.validateEmail(this.email) && validation.validateConfirmPassword(this.password, this.confirmpassword));
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