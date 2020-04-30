<template>
	<Label class="pill" :text="name" />
</template>
<script>
import BackendService from "../services/BackendService";

export default {
	props: [ "communityId" ],
	data () {
		return {
			name: ''
		}
	},
	created () {
		var service = new BackendService();

		if (this.$props.communityId) {

			service.getCommunity(this.$props.communityId)
				.then((res) => {
					if (res && res.success) {
						this.name = res.community.name;
					} else {
						this.name = "Error";
					}
				})

		} else {
			this.name = "Error";
		}
	}
}
</script>
<style scoped>

</style>