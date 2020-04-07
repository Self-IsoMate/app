<template>
	<StackLayout>
		<GridLayout columns="*" rows="150">
			<Image v-show="containsImage" :src="resource.image" col="0" row="0" tintColor="rgba(0,0,0,0.5)"
				stretch="aspectFill" />
			<Label :class="{ 'image-title' : containsImage, 'normal-title': !containsImage }"
				:text="resource.title" col="0" row="0" />
		</GridLayout>
		<Label :text="resource.body" textWrap="true" />
		<StackLayout>
			<Label v-for="(link, index) in resource.links" :key="index" :text="link" @tap="openLink(link)" />
		</StackLayout>
	</StackLayout>
</template>
<script>
export default {
	name: "ResourceCard",
	props: [ 'resource' ],
	computed: {
		containsImage: function () {
			return this.$props.resource.image ? true : false;
		}
	},
	methods: {
		openLink(link) {
			const utilsModule = require("tns-core-modules/utils/utils");
			utilsModule.openUrl(link);
		}
	}
}
</script>
<style scoped>

.image-title {
	color: white;
	vertical-align: bottom;
	font-size: 20;
	margin: 10;
}

.normal-title {
	color: black;
}

</style>