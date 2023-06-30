<template>
  <div class="flex justify-center items-center min-h-screen">
    <button @click="onStart">Start level: {{level}}</button>

    <div class="grid grid-cols-3 gap-3">
      <Square
          v-for="(color, index) in squares"
          :key="index"
          :color="color"
      />
    </div>
    <div class="flex flex-col">
      <button @click="levelUp">levelUp</button>
      <button @click="levelDown">levelDown</button></div>
    {{lastColorIndex}}

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
      const timeouts = Array(squares.value.length).fill(null);
      let colorCounts = colors.value.reduce((counts, color) => ({...counts, [color]: 0}), {});
      lastColorIndex.value = colors.value.reduce((indices, color) => ({...indices, [color]: null}), {}); // Add this line

      // Create an array of all the colors that will be used
      let allColors = [];
      for (let lvl = 0; lvl < level.value; lvl++) {
        allColors = allColors.concat(colors.value);
      }

      // Shuffle the array of colors
      let shuffledColors = shuffle(allColors);

      for (let i = 0; i < shuffledColors.length; i++) {
        setTimeout(() => {
          const randomColor = shuffledColors[i];

          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * squares.value.length);
          } while (squares.value[randomIndex] === randomColor);

          console.log(randomIndex, randomColor)
          // Clear existing timeout for this square
          if (timeouts[randomIndex]) {
            clearTimeout(timeouts[randomIndex]);
          }

          squares.value[randomIndex] = randomColor;
          colorCounts[randomColor]++;
          lastColorIndex.value[randomColor] = randomIndex; // Save the index of this color

          // Set a new timeout to revert the color back to gray after 1 second
          timeouts[randomIndex] = setTimeout(() => {
            colorCounts[squares.value[randomIndex]]--; // Decrement the count for the current color
            squares.value[randomIndex] = '';
          }, 200);

        }, i * 200); // Delay each color change by 1 second
      }
    }







    return { squares, onStart, levelUp, levelDown, level, allColors, colors, lastColorIndex };
  },
};
</script>