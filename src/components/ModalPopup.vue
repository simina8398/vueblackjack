<script>
export default {
	props: {
		isOpen: {
			type: Boolean,
			default: false
		},
		cancelCallback: {
			type: Function,
			default: null
		},
		okCallback: {
			type: Function,
			default: null
		}
	}
}
</script>

<template>
	<div v-if="isOpen" class="modal-wrapper">
		<div class="modal-body">
			<div class="modal-container">
				<div class="modal-slot">
					<slot />
				</div>
				<div v-if="cancelCallback || okCallback">
					<button v-if="cancelCallback" class="modal-button cancel" @click="cancelCallback()">Cancel</button>
					<button v-if="okCallback" class="modal-button ok" @click="okCallback()">Ok</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.modal-wrapper {
	position: fixed;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
}
.modal-body {
	position: absolute;
	width: 250px;
	height: 150px;
	top: calc(50% - 95px);
	left: calc(50% - 145px);
	background-color: #ffffff;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	border-radius: 2px;
	padding: 20px;
}
.modal-container {
	height: 100%;
	display: flex;
	flex-direction: column;
}
.modal-slot {
	flex-grow: 1;
	max-height: calc(100% - 22px);
}
.modal-button {
	cursor: pointer;
	height: 22px;
	width: 30%;
}
.modal-button.ok {
	float: right;
}
.modal-button.cancel {
	float: left;
}
</style>