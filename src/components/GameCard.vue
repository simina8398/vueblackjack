<script>
import verifyPropValue from "@/utils/verifyPropValue";

export default {
	props: {
		rank: {
			type: String,
			required: true,
			validator: rank => verifyPropValue(rank, ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"])
		},
		suite: {
			type: String,
			required: true,
			validator: suite => verifyPropValue(suite, ["Clubs", "Diamonds", "Hearts", "Spades"])
		}
	},
	computed: {
		colorClass() {
			if (this.suite === "Hearts" || this.suite === "Diamonds")
				return "red";
			return "black";
		}
	}
}
</script>

<template>
	<div class="game-card" :class="colorClass">
		<span class="card-suite top">
			{{ suite }}
		</span>
		<span class="card-rank">
			{{ rank }}
		</span>
		<span class="card-suite bottom">
			{{ suite }}
		</span>
	</div>
</template>

<style scoped>
.game-card {
	width: 100px;
	height: 200px;
	background-color: #ffffff;
	border-radius: 5px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.red {
	color: #ff0000;
}
.black {
	color: #000000;
}
.card-suite {
	font-size: 15px;
}
.bottom {
	align-self: flex-end;
}
.card-rank {
	font-size: 100px;
	align-self: center;
}
</style>
