<script>
export default {
	props: {
		text: {
			type: String,
			default: ""
		},
		disabled: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		buttonClasses() {
			let classes = ["action-button"];

			if (this.disabled)
				classes.push("disabled");

			return classes;
		}
	},
	methods: {
		clickButton() {
			this.$emit("click");
		},
	}
}
</script>

<template>
	<button :class="buttonClasses" type="button" :disabled="disabled" @click="clickButton"> {{ text }} </button>
</template>

<style scoped>
.action-button {
	height: 75px;
	width: 100px;
	border-radius: 50%;
	margin: 10px;
	background-color: #f3c620;
	color: #477148;
	font-weight: 700;
	font-size: 20px;
	border: none;
}
.action-button:hover {
	cursor: pointer;
}
.disabled.action-button:hover {
	cursor: not-allowed;
}.action-button.disabled {
	opacity: 0.4;
}
</style>
