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
                <Button text="Register" @tap="navigateQuestions" />
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

export default {
    name: "Register",
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
            this.feedback.show({
                title: "For a strong password, please use:",
                message: "A mixture of both uppercase and lowercase letters and numbers (least 8 characters)",
                type: FeedbackType.Custom
            });
        },
        navigateQuestions (event) {
            var validation = new Validate();
            if (validation.validateUsername(this.username)){
                    this.feedback.show({
                        title: "Username must be longer",
                        message: "Please insert at leat 5 characters (spaces excluded)",
                        type:
                        FeedbackType.Warning
                    });
            }else if(validation.validatePassword(this.password)){
                    this.feedback.show({
                        title: "Password must be longer",
                        message: "Please insert at leat 8 characters (spaces excluded)",
                        type:
                        FeedbackType.Error
                    });
            }else if(this.password == this.username){
                    this.feedback.show({
                        title: "Password must be different from username",
                        message: "Please insert a more safe password (different from username)",
                        type:
                        FeedbackType.Error
                    });
            }else if( String(this.email).search(validation.filterEmail())==-1 ) {
                    this.feedback.show({
                        title: "Insert a valid email address",
                        message: "Please insert a valid email address (youremail@address.ext)",
                        type:
                        FeedbackType.Error
                    });
            }else{
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
                                this.feedback.show({
                                    title: 'Registered',
                                    message: "We\'ve sent you a confirmation email, so please verify your email so that you can participate in chats and post in communities.",
                                    type: FeedbackType.Success
                                });
                                this.$navigateTo(Home,  {
                                    animated: false,
                                    clearHistory: true
                                });
                        }

                        if (response && !response.success) {
                            this.feedback.show({
                                title: "Error",
                                message: response.message,
                                type: FeedbackType.Error
                            })
                        }
                    })
                    .catch((err) => {
                        if (err) {
                            this.feedback.show({
                                title: "Error",
                                message: err.message,
                                type: FeedbackType.Error
                            })
                        }
                    });
            } else {
                this.feedback.show({
                    title: "Passwords need to match",
                    message: "Please confirm your password correctly!",
                    type:FeedbackType.Error
                });
                this.invalidPasswords = true;
                setTimeout(() => { this.invalidPasswords = false }, 3000);
            }
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