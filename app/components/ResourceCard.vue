<template>
	<CardView class="card" elevation="10" radius="10" ios:shadowRadius="3">
		<StackLayout margin="10">
			<GridLayout columns="*" rows="auto">
				<Image v-show="containsImage" :src="resource.image" col="0" row="0" tintColor="rgba(0,0,0,0.5)"
					stretch="aspectFill" height="150" />
				<Label :class="{ 'image-title' : containsImage, 'normal-title': !containsImage }"
					:text="resource.title" col="0" row="0" />
			</GridLayout>
			<Label :text="resource.body" textWrap="true" class="body-text" />
			<StackLayout>
				<Label v-for="(link, index) in resource.links" :key="index" :text="link" @tap="openLink(link)"
					class="hyperlink" textWrap="true" />
			</StackLayout>
		</StackLayout>
	</CardView>
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
	font-size: 18;
	font-weight: bold;
}

.card {
    background-color: #fff;
	color: #4d4d4d;
	margin: 10;
}

.body-text {
	margin: 10 0;
	font-size: 16;
}

.hyperlink {
	text-decoration: underline;
	margin: 2 0;
}

</style>