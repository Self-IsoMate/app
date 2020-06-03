<template>
	<Button :text="community.name" :class="{ 'selected': isToggled, 'button': true}" @tap="emitTap" />
</template>
<script>
export default {
	props: {
		community: Object
	},
	methods: {
		toggleSelected () {
			if (this.isToggled) {
				this.isToggled = false;
			} else {
				this.isToggled = true;
			}
		},
		emitTap (event) {
			console.log(this.$props.community);
			this.$emit('tap', { item: this.$props.community });
			this.toggleSelected();
		}
	},
	data() {
		return {
			isToggled: false
		}
	}
}
</script>
<style scoped>
.selected {
	background-color: #1aa3ff;
	color: white;
}

.button {
	font-size: 12;
	padding: 5 10;
	height: 40;
}
</style>