<template>
  <div class="flex justify-center items-center min-h-screen">
    <div class="flex flex-col">

    <button @click="onStart">Start level: {{level}}</button>
      <div v-if="chooseColor">Choose the latest {{Object.keys(lastColorIndex)[currentColorGuess]}}</div>
    <div class="grid grid-cols-3 gap-3">
      <Square
          v-for="(tileColor, index) in squares"
          :key="index"
          :color="tileColor"
          :index="index"
          @choice="onChoice(index)"
      />
    </div>
    <div class="flex flex-col">
      <button @click="levelUp">levelUp</button>
      <button @click="levelDown">levelDown</button></div>

      

    </div>
  </div>


</template>

<script>
import { ref, computed } from 'vue';
import Square from '@/components/MemoryGameSquare.vue';

export default {
  name: 'MemoryGameGrid',
  components: {
    Square
  },
  setup() {
    const squares = ref(Array(9).fill('')); // Initialize with empty strings
    const level = ref(2);
    const allColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']; // All possible colors
    const chooseColor = ref(null);
    const currentColorGuess = ref(0);
    const colors = computed(() => {
      return allColors.slice(0, level.value); // Return the first 'level' colors
    });
    const lastColorIndex = ref(null);
    // Every color has to show up the same as the level

    function levelUp() {
      if (level.value < 6)
      level.value++;
    }
    function levelDown() {
      if (level.value > 2)
      level.value--;
     }

     const onChoice = (index) => {
       console.log(Object.values(lastColorIndex.value)[currentColorGuess.value])
       let currentColorIndex = Object.values(lastColorIndex.value)[currentColorGuess.value]
       console.log(currentColorIndex, index)
       if (currentColorIndex === index) {
        console.log('correct')
      }
       else {
        console.log('wrong')
       }
        squares.value[index] = '';
        if (currentColorGuess.value < level.value - 1) {
          currentColorGuess.value++;
          console.log('next')
        } else {
        currentColorGuess.value = 0;
        chooseColor.value = false;
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

      // Loop over the shuffled colors
      for (let i = 0; i < shuffledColors.length; i++) {
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
          }, 1000);

        }, i * 1000); // Delay each color change by 1000 milliseconds

        chooseColor.value = true;
      }
    }


    return { squares, onStart, levelUp, levelDown, level, allColors, colors, lastColorIndex, onChoice, chooseColor, currentColorGuess };
  },
};
</script>