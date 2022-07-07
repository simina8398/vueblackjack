<script>
import GameCard from "./GameCard.vue";

export default {
	components: {
		GameCard
	},
	props: {
		cards: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		stringifiedCards() {
			return this.cards.map(card => {
				return {
					rank: card.rank.toString(),
					suite: card.suite
				}
			});
		}
	}
}
</script>

<template>
	<div class="user-cards">
		<game-card v-for="(card, index) in stringifiedCards" :key="index" :rank="card.rank" :suite="card.suite"/>
	</div>
</template>

<style scoped>
.user-cards {
	height: fit-content;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 12px;
}
</style>
