<!-- eslint-disable vue/multi-word-component-names -->
<script>
import PlayerOptions from './PlayerOptions.vue';
import UserCards from "./UserCards.vue";

export default {
	components: {
		PlayerOptions,
		UserCards,
	},
	data() {
		return {
			dealerCards: [],
			playerCards: []
		};
	},
	methods: {
		dealer(data) {
			this.dealerCards = data;
		},
		player(data) {
			this.playerCards = data;
		}
	}
}
</script>

<template>
	<div class="blackjack">
		<section class="cards">
			<user-cards :cards="dealerCards" />
			<user-cards :cards="playerCards" />
		</section>
		<section class="options">
			<player-options @dealerCards="dealer" @playerCards="player"/>
		</section>
	</div>
</template>

<style scoped>
.blackjack {
	padding: 10px;
	height: 100%;
	box-sizing: border-box;
} 
.blackjack .cards {
	height: calc(100% - 125px);
	display: flex;
	flex-direction: column;
	justify-content: space-around;
}
.blackjack .options {
	position: fixed;
	left: 0px;
	bottom: 10px;
	width: 100%;
	height: 95px;
	display: flex;
	justify-content: center;
}
</style>