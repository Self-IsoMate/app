<template>
    <Page >
        <ActionBar title="Self-IsoMate" class="action-bar header" />
        <ScrollView>
            <StackLayout margin="50 50 50 50">
				<Label text="Register" class="" fontSize="20"/>
                <TextField v-model="username" hint="Username" />
                <TextField secure="true" v-model="password" hint="Password"  />
                <TextField secure="true" v-model="confirmpassword" hint="Confirm password" />
                <Label v-if="invalidPasswords" text="Passwords need to match" class="error" />
                <TextField v-model="email" hint="Email" />
                <Button text="CONTINUE" @tap="navigateQuestions" />
            </StackLayout>
        </ScrollView>
    </Page>

</template>

<script>

import LoginQuestionsMentor from "./LoginQuestionsMentor";

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
                this.$navigateTo(LoginQuestionsMentor, {
                    props: {
                        newUser: {
                            username: this.username,
                            password: this.password,
                            email: this.email
                        }
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