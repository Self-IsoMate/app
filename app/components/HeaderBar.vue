<template>
	<ActionBar title="" class="action-bar header">
		<StackLayout orientation="horizontal" height="38" alignItems="left"
			class="actionBarContainer">
			<StackLayout class="HLeft" style="margin-top:10;" @tap="emitToggleDrawer">
				<Label :text="drawerToggle ? drawer2: drawer1" style="font-size:27;color:#fff;"
					class="font-awesome" />
			</StackLayout>
			<StackLayout class="HMid" alignItems="left">
				<TextField placeholderColor="white" id="searchField"
					editable="true" hint="      Search" returnKeyType="search"
					ios:height="30" ios:marginTop="3"
					android:paddingBottom="5" class="searchField font-awesome"
					color="#fff" />
			</StackLayout>
			<StackLayout class="HRight">

			</StackLayout>
		</StackLayout>
	</ActionBar>
</template>

<script>
export default {
	props: [ "title", "drawerToggle" ],
	methods: {
		emitToggleDrawer(event) {
			this.$emit("toggleDrawer", event);
		}
	},
	data () {
		return {
			drawer1: "",
			drawer2: ""
		}
	}
}
</script>

<style scoped>

</style>