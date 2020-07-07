<template>
    <Page>
        <ActionBar title="Self-IsoMate" class="action-bar header"/>
        <ScrollView>
            <StackLayout margin="50">
                <TextField v-model="email" hint="Email" />
                <Button text="RECOVER PASSWORD" @tap="handleSendRecovery"/>
                <Button text="CANCEL" @tap="onBack"/>
            </StackLayout>
        </ScrollView>
    </Page>

</template>

<script>
import LoginMain from "./LoginMain";
var FeedbackPlugin = require("nativescript-feedback");
var FeedbackType = require ("nativescript-feedback").FeedbackType;
var feedback = new FeedbackPlugin.Feedback();
export default {
    name: "Forgot",
    data: () => {
        return {
            email: ""
        };
    },
    methods: {
        handleSendRecovery (event) {
            feedback.show({
                    title: "We are still working on this. \n Wait for V.02",
                    message: "Recovery email options not yet available",
                     type:FeedbackType.Info
                            })        },
        onBack (event) {
            this.$navigateTo(LoginMain);
        }
    }
}
</script>


<style scoped>
</style>