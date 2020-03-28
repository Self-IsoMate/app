<template>
    <Page backgroundColor="black">
        <ActionBar title="Home" />
        <ScrollView>
            <StackLayout class="home-panel">
                <Image
                    src="https://play.nativescript.org/dist/assets/img/NativeScript_logo.png" />
                <Label text="SELF-ISOMATE" class="label-class" />
                <TextField v-model="email" hint="EMAIL" class="my-class" />
                <Button text="SEND RECOVERY EMAIL" @tap="handleLogin($event)"
                    class="button-class" />
                <Button text="<- BACK" @tap="onButtonTap" fontStyle="Aharoni"
                    backgroundColor="black" color="#00ff92" fontSize="25"
                    marginRight="150" marginBottom="15" marginTop="50" />
            </StackLayout>
        </ScrollView>
    </Page>

</template>

<script>
    import LoginMain from "./LoginMain.vue";

    export default {
        name: "Forgot",
        data: () => {
            return {
                email: ""
            };
        },
        methods: {
            handleLogin(event) {
                this.$navigateTo(LoginMain);
            }
        }
    };
</script>


<style scoped>
    .home-panel {
        font-family: Aharoni;
        width: 80%;
    }

    .label-class {
        color: #00ff92;
        font-size: 28;
        text-align: center;
        vertical-align: middle;
        margin-top: 10;
    }

    .my-class {
        background-color: pink;
        color: #00ff92;
        font-size: 20;
        border-color: #00ff92;
        border-width: 4;
        margin-top: 40;
    }

    .button-class {
        background-color: #00ff92;
        color: black;
        font-size: 22;
        margin-bottom: 15;
    }
</style>