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

export default {
    name: "Forgot",
    data: () => {
        return {
            email: ""
        };
    },
    methods: {
        handleSendRecovery (event) {
            console.log("recovery email");
        },
        onBack (event) {
            this.$navigateTo(LoginMain);
        }
    }
}
</script>


<style scoped>
</style>