<template lang="html">
    <Page>
		<ActionBar title="Home"/>
		<ScrollView>
			<StackLayout margin="50 50 50 50">
				<Label text="Login" class="" fontSize="20"/>
				<TextField v-model="username" hint="Username"/>
				<TextField v-model="password" hint="Password" secure="true"/>
				<Button text="LOGIN" @tap="handleLogin($event)"></Button>
				<GridLayout columns="*, *" rows="*, *">
					<Button col="0" row="0" text="REGISTER" @tap="handleLogin($event)"></Button>
					<Button col="1" row="0" text="GUEST" @tap="handleLogin($event)"></Button>
					<Label row="1" colSpan="2" text="Forgot password?" @tap="handleLogin($event)" class="forgot-pass"></Label>
				</GridLayout>
			</StackLayout>
		</ScrollView>
    </Page>
</template>

<script>
import Browse from './Browse.vue';

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
		handleLogin(event) {
			this.$navigateTo(Browse);
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