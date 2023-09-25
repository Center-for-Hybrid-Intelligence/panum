<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="flex flex-col gap-2 items-center">
      <h2 class="k1:text-5xl text-4xl k1:mt-0 mt-6 font-bold">Practice Round</h2>

      <div class="w-36 flex justify-center items-center ">
        <p class="transition-transform duration-200 transform font-bold text-2xl"
        >
          Round: 1 / 1
        </p>
      </div>
        <div class="bg-red-500"></div>
        <div class="bg-blue-500"></div>
        <div class="bg-green-500"></div>
        <div class="bg-yellow-500"></div>
        <div class="bg-purple-500"></div>
      <div class="flex gap-2 items-center py-4 ">
        <h2>Current colors:</h2>
        <div  v-for="(color, index) in colors" :key="index" class="w-8 h-8 rounded-md  "
             :class="{[`bg-${color}-500`] : true}">
        </div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <Square
            v-for="(tileColor, index) in squares"
            :key="index"
            :color="tileColor"
            :index="index"
            @choice="onChoice(index)"
            :disabled="squaresDisabled"
            :isCorrect="isCorrect"
            :isFalse="isFalse"
            :chosenIndex="chosenIndex"
        />
      </div>
      <div class="flex w-full h-16 justify-center align-middle py-4">
        <div v-if="chooseColor && !showTryAgain" class="flex items-center gap-4">
          <div class="">Where did you last see this color?</div>
          <div class="w-12 h-12 rounded-xl"
               :class="['bg-' + Object.keys(lastColorIndex)[currentColorGuess] + '-500']"></div>
        </div>
        <div class="flex items-center gap-4" v-if="showTryAgain">
          <h1 class="text-lg text-red-500">Oh no, that’s not right! Try again.</h1>
        </div>
      </div>

      <button class=" mb-4" :class="{ 'disabledButton' : gameIsInProgress,  'button': !gameIsInProgress }"
              :disabled='gameIsInProgress' @click="onStart" v-if="showTryAgain">
        Try Again
      </button>
      <button v-if="!showTryAgain" class=" mb-4"
              :class="{ 'disabledButton' : gameIsInProgress ,  'button': !gameIsInProgress }"
              :disabled='gameIsInProgress' @click="onStart">
        Start level
      </button>
    </div>
  </div>
</template>

<script>
import Square from '@/components/MemoryGameSquare.vue';
import {ref, watch} from "vue";


export default {
  name: "TutorialGame",
  components: {
    Square
  },
  setup(_, {emit}) {
    const squares = ref(Array(9).fill(''));
    const gameIsInProgress = ref(false);
    const isCorrect = ref(false)
    const isFalse = ref(false)
    const squaresDisabled = ref(true)
    const timeOut = ref(2000);
    const chosenIndex = ref(-1)
    const colors = ['red', 'blue'];
    const chooseColor = ref(null);
    const currentColorGuess = ref(0);
    const lastColorIndex = ref({});
    const showTryAgain = ref(false);

    const onChoice = (index) => {
      chosenIndex.value = index;
      let currentColorIndex = Object.values(lastColorIndex.value)[currentColorGuess.value]
      



      if (currentColorIndex === index) {
        //Correct answer
        isCorrect.value = true
      } else {
        //Wrong answer
        isFalse.value = true;
        showTryAgain.value = true;
        chooseColor.value = false;
        gameIsInProgress.value = false
        squaresDisabled.value = true
        return
      }
      squares.value[index] = '';
      if (currentColorGuess.value < 1) {
        //Next move
        currentColorGuess.value++;
      } else {
        if (showTryAgain.value === false) {
          emit("tutorialEnd")
        }
        currentColorGuess.value = 0;
        chooseColor.value = false;
        squaresDisabled.value = true
      }
    }

    watch(isCorrect, (newValue) => {
      if (newValue !== null) {
        setTimeout(() => {
          isCorrect.value = false;
        }, 1000); // Change the time delay as needed (in milliseconds)
      }
    });
    watch(isFalse, (newValue) => {
      if (newValue !== null) {
        setTimeout(() => {
          isFalse.value = false;
        }, 1000); // Change the time delay as needed (in milliseconds)
      }
    });

    function shuffle(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    function onStart() {
      currentColorGuess.value = 0
      gameIsInProgress.value = true;
      showTryAgain.value = false
      // Initialize an array to hold timeout IDs for each square
      const timeouts = Array(squares.value.length).fill(null);
      // Initialize an object to count how many times each color has been used
      let colorCounts = colors.reduce((counts, color) => ({...counts, [color]: 0}), {});
      // Initialize an object to track the last grid index where each color was used
      lastColorIndex.value = colors.reduce((indices, color) => ({...indices, [color]: null}), {});
      // Create an array of all the colors that will be used
      let allColors = [];
      colors.forEach((color) => {
        for (let i = 0; i < 2; i++) {
          allColors.push(color);
        }
      });
      // Shuffle the array of colors
      let shuffledColors = shuffle(allColors);

      async function updateSquaresWithTimeouts() {
        let isFirstCall = true; // Flag to track the first call
        // Loop over the shuffled colors
        for (let i = 0; i < shuffledColors.length; i++) {
          const delay = isFirstCall ? 0 : timeOut.value + 500; // Adjust the delay
          isFirstCall = false;
          if (gameIsInProgress.value) {
            await new Promise(resolve => {
              setTimeout(() => {
                const randomColor = shuffledColors[i];
                let randomIndex;
                // Keep picking a random square until we find one that's not already displaying the current color
                do {
                  randomIndex = Math.floor(Math.random() * squares.value.length);
                } while (squares.value[randomIndex] === randomColor);
                // Clear existing timeout for this square
                if (timeouts[randomIndex]) {
                  clearTimeout(timeouts[randomIndex]);
                }
                // Change the color of the square, increment the color count, and update the last index for the color
                squares.value[randomIndex] = randomColor;
                colorCounts[randomColor]++;
                lastColorIndex.value[randomColor] = randomIndex;
                // Set a new timeout to revert the color back to gray after x amount of milliseconds
                timeouts[randomIndex] = setTimeout(() => {
                  colorCounts[squares.value[randomIndex]]--; // Decrement the count for the current color
                  squares.value[randomIndex] = '';
                }, timeOut.value);
                resolve();
              }, delay); // Delay each color change by 500 milliseconds
            });
          }
        }
        setTimeout(() => {
          chooseColor.value = true
          squaresDisabled.value = false
        }, timeOut.value)
      }

      updateSquaresWithTimeouts();
    }

    return {
      squares,
      onStart,
      colors,
      lastColorIndex,
      onChoice,
      chooseColor,
      currentColorGuess,
      timeOut,
      isCorrect,
      isFalse,
      squaresDisabled,
      gameIsInProgress,
      chosenIndex,
      showTryAgain
    }
  }


}
</script>

<style scoped>

</style>