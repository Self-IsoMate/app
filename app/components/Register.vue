<template>
    <Page >
        <ActionBar title="Self-IsoMate" />
        <ScrollView>
            <StackLayout margin="50 50 50 50">
				<Label text="Register" class="" fontSize="20"/>
                <TextField v-model="username" hint="Username" />
                <TextField v-model="password" hint="Password"  />
                <TextField v-model="confirmpassword" hint="Confirm password" />
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
            email: ""
        };
    },
    methods: {
        navigateQuestions (event) {
            this.$navigateTo(LoginQuestionsMentor);
        }
    }
}
</script>


<style scoped>
    
</style>