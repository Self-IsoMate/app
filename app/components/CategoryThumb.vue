<template>
	<StackLayout padding="5" backgroundColor="#E8E8E8" height="500">
		<StackLayout class="postContainer">
			<Image :src="category.image" marginTop="10" />
			<Label :text="category.name" />
		</StackLayout>
	</StackLayout>
</template>
<script>
export default {
	props: {
		category: {}
	}
}
</script>
<style scoped>

</style>