<template>
	<GridLayout columns="*" rows="*" class="thumb">
		<Image col="0" row="0" :src="category.image" width="100%" height="500px" />
		<Label padding="10" col="0" row="0" :text="category.name" class="name" stretch="aspectFill" />
	</GridLayout>
</template>
<script>
export default {
	props: {
		category: {}
	}
}
</script>
<style scoped>
.name {
	font-weight: bold;
	color: white;
	vertical-align: bottom;
	background-color: green;
}

.thumb {
	margin: 10px 10px 0 10px;
	padding: 10px;
	border-radius: 50%;
}
</style>