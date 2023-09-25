<template>
  <IntroductionModal :show="!tutorialStarted && !gameStarted" @start="startTutorial"/>
  <div class="" v-if="!gameStarted" :class="{ 'blur-xl': !tutorialStarted }">
    <TutorialGame @tutorialEnd="showGameModal"/>
  </div>
  <GameModal :show="isShowGameModal" @start="startGame" />
  <div v-if="gameStarted" :class="{ 'blur-xl': isShowGameModal || isEndGame  }">
    <MemoryGameGrid @end="endGame"   />
  </div>
  <DoneGameModal :totalPoints="totalScoreFromChild" :show="isEndGame"/>
</template>

<script>

import MemoryGameGrid from "@/components/MemoryGameGrid.vue";
import IntroductionModal from "@/components/IntroductionModal.vue";
import {ref} from "vue";
import TutorialGame from "@/components/Tutorial.vue";
import GameModal from "@/components/GameModal.vue";
import DoneGameModal from "@/components/DoneGameModal.vue";

export default {
  name: 'HomeView',
  components: {
    DoneGameModal,
    GameModal,
    TutorialGame,
    IntroductionModal,
    MemoryGameGrid
  },
  setup() {
    const gameStarted = ref(false);
    const tutorialStarted = ref(false);
    const isShowGameModal = ref(false);
    const isEndGame = ref(false);
    const totalScoreFromChild = ref(0)
    const startTutorial = () => {
      tutorialStarted.value = true;
    }
    const endGame = (totalscore) => {
      totalScoreFromChild.value = totalscore
      setTimeout(() => {
      isEndGame.value = true;
      }, 500);
    }
    const startGame = () => {
      isShowGameModal.value = false;
    }
    const showGameModal = () => {
      setTimeout(() => {
        tutorialStarted.value = false;
        gameStarted.value = true;
        isShowGameModal.value = true;
      }, 500);
    }
    return {
      startTutorial, totalScoreFromChild, tutorialStarted, startGame, gameStarted, showGameModal, isShowGameModal, isEndGame, endGame,
    }
  }
}
</script>
