<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="flex flex-col gap-2 items-center">

      <h2 class="text-5xl font-bold">Current Level: {{ level }}</h2>
      <div class="flex gap-2 items-center p-4">
        <h2>Current colors:</h2>

        <div v-for="(color, index) in colors" :key="index" class="w-8 h-8 rounded-md"
             :class="`bg-${color}-500`"></div>
      </div>
      <!--        <div class="w-8 h-8 rounded-md bg-red-500">
              </div>
              <div class="w-8 h-8 rounded-md bg-blue-500">
              </div>
              <div class="w-8 h-8 rounded-md bg-purple-500">
              </div>
              <div class="w-8 h-8 rounded-md bg-green-500">
              </div>
              <div class="w-8 h-8 rounded-md bg-yellow-500">
              </div>
              <div class="w-8 h-8 rounded-md bg-orange-500">
              </div>-->
      <div class="flex gap-4 relative">
        <div class="grid grid-cols-3 gap-3">
          <Square
              v-for="(tileColor, index) in squares"
              :key="index"
              :color="tileColor"
              :index="index"
              @choice="onChoice(index)"
          />
        </div>
        <div class="flex flex-col absolute -right-36 gap-8  h-full justify-center">
          <div class="flex flex-col items-center gap-1">
            <div class="" v-if="gamesBeforeLevel3">{{ gamesBeforeLevel3 }} Games left</div>
            <button :class="level === 6 ? ' text-gray-200' : 'text-gray-800' " @click=" levelUp" class="flex-col flex items-center ">
              <svg class="w-12 h-12 self-center dark:text-white border-2 p-2 rounded-lg " :class="level === 6 ? 'border-gray-200' : 'border-gray-800'"
                   aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 10 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5 5 1 1 5m8 6L5 7l-4 4"/>
              </svg>
            <p>Lv Up</p>
            </button>

            <!--            <button :class="level === 6 ? 'disabledSecondaryButton' : 'buttonSecondary'" @click=" levelUp
                    ">Level Up
                        </button>-->
          </div>
          <!--          <button class="h-full self-end"
                            :class="{ 'disabledSecondaryButton': level === 2, 'buttonSecondary': level !== 2 }"
                            @click="levelDown">Level Down
                    </button>-->
          <div class="flex flex-col items-center gap-1">
            <button class="flex-col flex items-center" :class="{ 'text-gray-200': level === 2, 'text-gray-800': level !== 2 }">
              <svg class="w-12 h-12 dark:text-white border-2 p-2 rounded-lg" :class="level === 2 ? 'border-gray-200' : 'border-gray-800'"
                    @click="levelDown"
                   aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="m1 7 4 4 4-4M1 1l4 4 4-4"/>
              </svg>
            <p>Lv Down</p>
            </button>

          </div>

          <!--        :disabled=" gamesBeforeLevel3> 4"-->
        </div>

      </div>
      <div class="flex w-full h-18 justify-center align-middle">
        <div v-if="chooseColor" class="flex items-center gap-4 py-4">
          <div class="">Choose the latest {{ Object.keys(lastColorIndex)[currentColorGuess] }} square</div>
          <div class="w-12 h-12 rounded-xl"
               :class="['bg-' + Object.keys(lastColorIndex)[currentColorGuess] + '-500']"></div>
        </div>
      </div>
      <div class="" v-if="feedbackString"> {{ feedbackString }}</div>
      <div class="flex gap-8">
        <button class="buttonSecondary mt-8 mb-4" @click="gameIsInProgress = false">Cancle</button>
        <button class="mt-8 mb-4" :class="{ 'disabledButton' : gameIsInProgress,  'button': !gameIsInProgress }"
                :disabled='gameIsInProgress' @click="onStart">Start level
        </button>
      </div>


    </div>
  </div>


</template>

<script>
import {ref, computed} from 'vue';
import Square from '@/components/MemoryGameSquare.vue';

export default {
  name: 'MemoryGameGrid',
  components: {
    Square
  },
  setup() {
    const squares = ref(Array(9).fill('')); // Initialize with empty strings
    const level = ref(2);
    const gameIsInProgress = ref(false);
    const feedbackString = ref("")
    const gamesBeforeLevel3 = ref(3)
    const timeOut = ref(2000);
    const allColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // All possible colors
    const chooseColor = ref(null);
    const currentColorGuess = ref(0);
    const colors = computed(() => {
      return allColors.slice(0, level.value); // Return the first 'level' colors
    });
    const lastColorIndex = ref(null);

    // Every color has to show up the same as the level
    function updateTimeOut() {
      if (level.value >= 2 && level.value <= 5) {
        timeOut.value = Math.min(level.value * 400 + 1200, 2800);
      }
    }

    function levelUp() {
      if (level.value < 6) {
        level.value++;
        updateTimeOut();
      }
    }

    function levelDown() {
      if (level.value > 2) {
        level.value--;
        updateTimeOut();
      }
    }

    const onChoice = (index) => {
      console.log(Object.values(lastColorIndex.value)[currentColorGuess.value])
      let currentColorIndex = Object.values(lastColorIndex.value)[currentColorGuess.value]
      console.log(currentColorIndex, index)
      if (currentColorIndex === index) {
        feedbackString.value = "That's correct, Well Done"
        console.log('correct')
      } else {
        feedbackString.value = "That's wrong"
        console.log('wrong')
      }
      squares.value[index] = '';
      if (currentColorGuess.value < level.value - 1) {
        currentColorGuess.value++;
        console.log('next')
      } else {
        currentColorGuess.value = 0;
        chooseColor.value = false;
        gamesBeforeLevel3.value--
        gameIsInProgress.value = false
        /*
                feedbackString.value = "You are done"
        */
        console.log('done')
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
      // Initialize an array to hold timeout IDs for each square
      const timeouts = Array(squares.value.length).fill(null);

      // Initialize an object to count how many times each color has been used
      let colorCounts = colors.value.reduce((counts, color) => ({...counts, [color]: 0}), {});

      // Initialize an object to track the last grid index where each color was used
      lastColorIndex.value = colors.value.reduce((indices, color) => ({...indices, [color]: null}), {});

      // Create an array of all the colors that will be used
      let allColors = [];
      for (let i = 0; i < level.value; i++) {
        allColors = allColors.concat(colors.value);
      }

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
              },delay); // Delay each color change by 500 milliseconds
            });
          }
        }
        setTimeout(() => {
          chooseColor.value = true
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
      gamesBeforeLevel3,
      feedbackString,
      gameIsInProgress
    };
  },
};
</script>