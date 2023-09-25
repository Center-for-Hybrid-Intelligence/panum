<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="flex flex-col gap-2 items-center">

      <h2 class="k1:text-5xl text-4xl k1:mt-0 mt-6 font-bold">Current Level: {{ level }}</h2>

      <div class="w-36 flex justify-center items-center ">
        <p class="transition-transform duration-200 transform font-bold text-2xl"
            :class="{ '-translate-y-0' : totalRounds }">
          Round: {{currentRoundNumber}} / {{ totalRounds}}
        </p>
      </div>
      <div class="flex gap-2 items-center py-4 ">
        <h2>Current colors:</h2>
        <div v-for="(color, index) in colors" :key="index" class="w-8 h-8 rounded-md"
             :class="`bg-${color}-500`"></div>
      </div>
      <div class="flex flex-col k1:flex-row gap-4 h-full relative">
        <div class="w-40 flex flex-col justify-center items-center ">
          <div class="flex justify-between text-md font-bold w-40">
          <p class="transition-transform duration-200 transform font-bold text-2xl"
              > Score:
          </p>
          <p class="transition-transform duration-200 transform font-bold text-2xl"
              :class="{ '-translate-y-2': scoreChanged }"> {{ score }} / {{ totalRounds }}
          </p>

          </div>
          <div class="flex justify-between text-md font-bold w-40">

          <h2 class="">Total Score : </h2>
            <h2>
              {{ scoreTotal}} / 12
            </h2>
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
        <div class="flex flex-col w-full  k1:w-40 justify-center gap-8">
          <div class="flex flex-col items-center gap-1">

            <button v-if="level < 5 && showLevelUp" :class="level === 6 ? ' text-gray-200' : 'text-gray-800' " @click=" levelUp"
                    class="flex-col k1:static absolute right-0 top-0 flex items-center ">
              <svg class="w-12 h-12 self-center dark:text-white border-2 p-2 rounded-lg "
                   :class="level === 6 ? 'border-gray-200' : 'border-gray-800'"
                   aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 10 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5 5 1 1 5m8 6L5 7l-4 4"/>
              </svg>
              Lv Up {{level + 1}}
            </button>

            <!--            <button :class="level === 6 ? 'disabledSecondaryButton' : 'buttonSecondary'" @click=" levelUp
                    ">Level Up
                        </button>-->
          </div>
          <!--          <button class="h-full self-end"
                            :class="{ 'disabledSecondaryButton': level === 2, 'buttonSecondary': level !== 2 }"
                            @click="levelDown">Level Down
                    </button>-->
<!--          <div class="flex flex-col items-center gap-1">
            <button class="flex-col flex items-center"
                    :class="{ 'text-gray-200': level === 1, 'text-gray-800': level !== 1 }">
              <svg class="w-12 h-12 dark:text-white border-2 p-2 rounded-lg"
                   :class="level === 1 ? 'border-gray-200' : 'border-gray-800'"
                   @click="levelDown"
                   aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 7 4 4 4-4M1 1l4 4 4-4"/>
              </svg>
              Lv Down
            </button>

          </div>-->

          <!--        :disabled=" gamesBeforeLevel3> 4"-->
        </div>

      </div>
      <div class="flex w-full k1:h-16 h-10 justify-center align-middle ">
        <div v-if="chooseColor && !showTryAgain" class="flex items-center gap-4">
          <div class="">Where did you last see this color?<!--:
            {{ Object.keys(lastColorIndex)[currentColorGuess] }}--> </div>
          <div class="w-12 h-12 rounded-xl"
               :class="['bg-' + Object.keys(lastColorIndex)[currentColorGuess] + '-500']"></div>
        </div>
        <div class="flex items-center gap-4" v-if="showTryAgain">
          <h1 class="text-lg text-red-500">Oh no, that’s not right! Try again next round.</h1>
        </div>
      </div>

      <div class="flex gap-8">
<!--        <button class=" mb-4"
                :class="{ 'disabledSecondaryButton' : !gameIsInProgress,  'buttonSecondary': gameIsInProgress }"
                :disabled='!gameIsInProgress' @click="gameIsInProgress = false">Cancel
        </button>-->
        <button class=" mb-4" :class="{ 'disabledButton' : gameIsInProgress || showLevelUp ,  'button': !gameIsInProgress }"
                :disabled='gameIsInProgress' @click="onStart">Start round {{currentRoundNumber}}
        </button>
      </div>


    </div>
  </div>


</template>

<script>
import {ref, computed, watch} from 'vue';
import Square from '@/components/MemoryGameSquare.vue';

export default {
  name: 'MemoryGameGrid',
 emits: ['end'],
  components: {
    Square
  },
  setup(_, {emit}) {
    const squares = ref(Array(9).fill('')); // Initialize with empty strings
    const level = ref(1);
    const gameIsInProgress = ref(false);
    const isCorrect = ref(false)
    const isFalse = ref(false)
    const squaresDisabled = ref(true)
    const currentRoundNumber = ref(1)
    const score = ref(0)
    const scoreTotal = ref(0)
    const showLevelUp = ref(false)
    const totalRounds = 3
    const totalLevel = 3
    const timeOut = ref(2000);
    const chosenIndex = ref(-1)
    const allColors = ['red', 'blue', 'green', 'yellow', 'purple']; // All possible colors
    const chooseColor = ref(null);
    const currentColorGuess = ref(0);
    const colors = computed(() => {
      return allColors.slice(0, level.value + 1); // Return the first 'level' colors
    });
    const showTryAgain = ref(false);

    const lastColorIndex = ref(null);
    const scoreChanged = ref(false);

    watch(score, () => {
      scoreChanged.value = true;
      setTimeout(() => {
        scoreChanged.value = false;
      }, 200); // Adjust the time delay to match the CSS transition duration
    });

    // Every color has to show up the same as the level
    function updateTimeOut() {
      if (level.value >= 1 && level.value <= totalLevel) {
        timeOut.value = Math.min((level.value) * 400 + 1600, 2800);
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


    function levelUp() {
      if (level.value < totalLevel) {
        level.value++;
        score.value = 0
        currentRoundNumber.value = 1
        showLevelUp.value = false;
        updateTimeOut();
      }
    }

    function levelDown() {
      if (level.value > 1) {
        level.value--;
        updateTimeOut();
      }
    }
    watch(showTryAgain, (newValue) => {
      if (newValue !== null) {
        setTimeout(() => {
          showTryAgain.value = false;
        }, 2000); // Change the time delay as needed (in milliseconds)
      }
    });
    const onChoice = (index) => {
      chosenIndex.value = index;
      let currentColorIndex = Object.values(lastColorIndex.value)[currentColorGuess.value]

      function checkForLastRound() {
        if (level.value === totalLevel  && currentRoundNumber.value ===  totalRounds) {
          emit('end', scoreTotal.value)
        }
      }

      if (currentColorIndex === index) {
        //Correct answer
        isCorrect.value = true
      } else {
        //Wrong answer
        isFalse.value = true;
        showTryAgain.value = true;
        checkForLastRound();
        resetValues()
        return
      }
      squares.value[index] = '';
      if (currentColorGuess.value < level.value) {
        //Next move
        //this should only happen when it's not a wrong answer
        currentColorGuess.value++;
      } else {
        //Game done
        score.value++
        scoreTotal.value++
        checkForLastRound()
        resetValues()
      }
    }
    const resetValues = () => {
      chooseColor.value = false;
      gameIsInProgress.value = false
      squaresDisabled.value = true
      currentColorGuess.value = 0;
      if (currentRoundNumber.value <= 2){
        currentRoundNumber.value ++
      }else {
        showLevelUp.value = true
      }
    }
    function shuffle(array) {
      let currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    function onStart() {
      gameIsInProgress.value = true;
      showTryAgain.value = false;
      // Initialize an array to hold timeout IDs for each square
      const timeouts = Array(squares.value.length).fill(null);

      // Initialize an object to count how many times each color has been used
      let colorCounts = colors.value.reduce((counts, color) => ({...counts, [color]: 0}), {});

      // Initialize an object to track the last grid index where each color was used
      lastColorIndex.value = colors.value.reduce((indices, color) => ({...indices, [color]: null}), {});


      const getRandomNumber = () => {
        const min = 1;
        const max = level.value + 2;
        return Math.floor(Math.random() * (max - min) + min);
      };
      // Create an array of all the colors that will be used
      let allColors = [];
      colors.value.forEach((color) => {
        const randomCount = getRandomNumber();
        for (let i = 0; i < randomCount; i++) {
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


                // Set a new timeout to revert the color back to gray after 1000 milliseconds
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
          chooseColor.value = true;
          squaresDisabled.value = false;
        }, timeOut.value)
      }

      updateSquaresWithTimeouts();
    }


    return {
      squares,
      onStart,
      levelUp,
      levelDown,
      level,
      allColors,
      colors,
      lastColorIndex,
      onChoice,
      chooseColor,
      currentColorGuess,
      timeOut,
      currentRoundNumber,
      isCorrect,
      isFalse,
      squaresDisabled,
      gameIsInProgress,
      score,
      totalRounds,
      scoreChanged,
      chosenIndex,
      showLevelUp,
      scoreTotal,
      showTryAgain
    };
  },
};
</script>