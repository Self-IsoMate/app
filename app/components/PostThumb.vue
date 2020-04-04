<template>
	<StackLayout class="main" backgroundColor="white">
		<Image v-show="post.media" :src="post.media" />
		<StackLayout class="content">
			<GridLayout columns="*, auto">
				<Label :text="post.title" class="title" col="0" />
				<Label :text="datePosted" class="body-text" col="1" textAlign="right" />
			</GridLayout>
			<Label :text="post.body" class="body-text" textWrap="true" />
		</StackLayout>
	</StackLayout>
</template>
<script>
import moment from "moment";
export default {

	props: {
		post: {}
	},
	computed: {
		datePosted: function () {
			var m = moment(new Date(this.post.datePosted), "YYYY-MM-DDTHH:MM:SS:SSSZ").format("D MMM");
			return m;
		}
	}
}
</script>
<style scoped>

.main {
	margin: 10px 20px;
	padding: 0;
}

.title {
	font-size: 16px;
	font-weight: bold;
}

.body-text {
	font-size: 12px;
}

.content {
	padding: 50px;
	opacity: 1;
}

</style>