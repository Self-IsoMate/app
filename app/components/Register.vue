<template>
    <Page backgroundColor="black">
        <ActionBar title="Home2" />
        <ScrollView>
            <StackLayout class="home-panel">
                <Image
                    src="https://play.nativescript.org/dist/assets/img/NativeScript_logo.png" />
                <Label text="REGISTER" class="label-class" />
                <TextField v-model="username" hint="USERNAME" class="my-class" marginTop= "40"/>
                <TextField v-model="password" hint="PASSWORD" class="my-class" />
                <TextField v-model="confirmpassword" hint="CONFIRM PASSWORD" class="my-class" />
                <TextField v-model="email" hint="EMAIL" class="my-class" />
                <Button text="CONTINUE" @tap="onButtonTap" class="button-class" />
            </StackLayout>
        </ScrollView>
    </Page>

</template>

<script>
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
            onButtonTap() {
                console.log("Button was pressed");
            }
        }
    }
</script>


<style scoped>
    .home-panel {
        font-family: aharoni;
        width: 80%;
    }

    .label-class{
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
    }

    .button-class {
        background-color: #00ff92;
        color: black;
        font-size: 22;
        margin-bottom: 15;
        margin-top: 50;
    }

    
</style>