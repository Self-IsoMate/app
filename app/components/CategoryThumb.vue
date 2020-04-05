<template>
	<GridLayout columns="*" rows="*" class="thumb" @tap="tapHandler">
		<Image col="0" row="0" :src="category.image" width="100%" stretch="aspectFill" class="rounded" />
		<Label padding="10" col="0" row="0" :text="category.name" class="name" />
	</GridLayout>
</template>
<script>
export default {
	props: {
		category: {}
	},
	methods: {
		tapHandler() {
			this.$emit('tap', { category: this.$props.category});
		}
	}
}
</script>
<style scoped>
.name {
	font-weight: bold;
	color: white;
	vertical-align: bottom;
	background-color: #1aa3ff;
}

.thumb {
	margin: 0;
	padding: 10;
	height: 500px;
	width: 50%;
}

.rounded {
	border-radius: 10%;
}
</style>