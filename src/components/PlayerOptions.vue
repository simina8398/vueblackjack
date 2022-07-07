<script>
import axios from "axios";

import ActionButton from "./ActionButton.vue";
import ModalPopup from "./ModalPopup.vue";

export default {
	components: {
		ActionButton,
		ModalPopup
	},
	data() {
		return {
			balance: null,
			showBalanceInput: false,
			showChooseBetting: false,
			showTurnResult: false,
			showFinalResult: false,
			input: null,
			availableBetOptions: [],
			sessionId: null,
			roundEnded: false,
			dealerCards: [],
			playerCards: [],
			winAmount: 0,
			resultText: "",
			gamesPlayedText: "",
			gamePhase: 0
		}
	},
	computed: {
		isSitButtonDisabled() {
			return this.gamePhase !== 0;
		},
		isDealButtonDisabled() {
			return (this.gamePhase !== 1 && this.gamePhase !== 3) || !this.balance;
		},
		isTurnButtonDisabled() {
			return this.gamePhase !== 2 || !(this.balance || this.roundEnded);
		},
		isStandButtonDisabled() {
			return this.gamePhase !== 3;
		}
	},
	watch: {
		roundEnded(value) {
			if (value) {
				setTimeout(() => this.showTurnResult = true, 1000); 
				this.getResultText();
			}
		},
		balance(value) {
			this.availableBetOptions = this.getAvailableBetOptions(this.availableBetOptions, value);
		}
	},
	methods: {
		sitAction() {
			this.showBalanceInput = true;
		},
		closeBalanceModal() {
			this.showBalanceInput = false;
			this.input = null;
		},
		async okBalanceModal() {
			if (this.input < 10)
				this.balance = 10;
			else if (this.input > 1000)
				this.balance = 1000; 
			else this.balance = this.input;

			try {
				let response = await axios.post("/post/sit", { balance : this.balance });
				this.availableBetOptions = this.getAvailableBetOptions(response.data.availableBetOptions, this.balance);
				this.sessionId = response.data.sessionId;
			} catch (e) {
				Promise.reject(e);
			}

			this.closeBalanceModal();
			
			this.gamePhase = 1;
		},
		getAvailableBetOptions(bets, balance) {
			return bets.filter(bet => bet <= balance);
		},
		dealAction() {
			this.showChooseBetting = true;
		},
		closeTurnResultModal() {
			this.showTurnResult = false;
			this.$emit("dealerCards", []);
			this.$emit("playerCards", []);

			this.gamePhase = 3;
		},
		async placeBet(bet) {
			this.showChooseBetting = false;

			try {
				let response = await axios.post("/post/deal", { bet : bet, sessionId: this.sessionId });
				this.dealerCards = response.data.dealerCards;
				this.playerCards = response.data.playerCards;
				this.$emit("dealerCards", this.dealerCards);
				this.$emit("playerCards", this.playerCards);

				this.setTurnData(response.data);
				
				this.gamePhase = 2;
			} catch (e) {
				Promise.reject(e);
			}
		},
		async turnAction(type) {
			if (!this.roundEnded) {
				try {
					let response = await axios.post("/post/turn", { action : type, sessionId: this.sessionId });
					if (response.data.playerCard) {
						this.playerCards.push(response.data.playerCard);
						this.$emit("playerCards", this.playerCards);
					}

					this.dealerCards = response.data.dealerCards;
					this.$emit("dealerCards", this.dealerCards);

					this.setTurnData(response.data);
				} catch (e) {
					Promise.reject(e);
				}
			}
		},
		setTurnData(data) {
			this.balance = data.currentBalance;
			this.roundEnded = data.roundEnded;
			this.winAmount = data.winAmount;
		},
		async standAction() {
			try {
				let response = await axios.post("/post/stand", { sessionId: this.sessionId });
				this.showFinalResult = true;
				this.winAmount = response.data.winAmount;

				this.gamesPlayedText = `You played ${response.data.roundsPlayed} round(s)`;
				this.getResultText();
			} catch (e) {
				Promise.reject(e);
			}
		},
		getResultText() {
			this.resultText = "";

			if (this.winAmount < 0)
				this.resultText += `You lost ${Math.abs(this.winAmount)} $`;
			else if (this.winAmount > 0)
				this.resultText += `You won ${this.winAmount} $`;
			else this.resultText += "You didn't lose or win any money";
		},
		closeFinalResultModal() {
			this.showFinalResult = false;
			this.balance = null;
			
			this.gamePhase = 0;
		}
	}
}
</script>

<template>
	<div class="actions-wrapper">
		<span class="balance" v-if="balance !== null"> {{ balance }} $</span>
		<action-button text="Sit" :disabled="isSitButtonDisabled" @click="sitAction()" />
		<action-button text="Deal" :disabled="isDealButtonDisabled" @click="dealAction()"/>
		<action-button text="Hit" :disabled="isTurnButtonDisabled" @click="turnAction('hit')"/>
		<action-button text="Stay" :disabled="isTurnButtonDisabled" @click="turnAction('stay')"/>
		<action-button text="Stand" :disabled="isStandButtonDisabled" @click="standAction()"/>
		
		<modal-popup :is-open="showBalanceInput" :cancelCallback="closeBalanceModal" :okCallback="okBalanceModal">
			Insert balance between 10 and 1000
			<input v-model="input" class="balance-input" type="number" min="10" max="1000" step="1" placeholder="Enter balance(USD)">
		</modal-popup>

		<modal-popup :is-open="showChooseBetting">
			Choose betting
			<div class="betting-buttons">
				<button v-for="(bet, index) in availableBetOptions" :key="index" class="betting-button" @click="placeBet(bet)">{{ bet }}</button>
			</div>
		</modal-popup>

		<modal-popup :is-open="showTurnResult" :okCallback="closeTurnResultModal">
			<span class="turn-result-text"> {{ resultText }} </span>
		</modal-popup>

		<modal-popup :is-open="showFinalResult" :okCallback="closeFinalResultModal">
			<span class="final-result-text"> {{ gamesPlayedText }} </span>
			<br>
			<span class="final-result-text"> {{ resultText }} </span>
		</modal-popup>
	</div>
</template>

<style scoped>
.actions-wrapper {
	text-align: center;
	width: 60%;
	height: fit-content;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
}
.balance {
	color: #ffffff;
	font-weight: 700;
	font-size: 20px;
}
.balance-input {
	width: 95%;
	height: 25px;
}
.betting-buttons {
	margin-top: 15px;
	display: flex;
	justify-content: space-evenly;
}
.betting-button {
	width: 45px;
	height: 40px;
}
.turn-result-text {
	line-height: 125px;
	font-size: 25px;
}
.final-result-text {
	line-height: 64px;
	font-size: 25px;
}
</style>
