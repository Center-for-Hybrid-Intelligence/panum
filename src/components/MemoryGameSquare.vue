<template>
  <button
      class="w-24 h-24 bg-gray-600 rounded-2xl  relative"
      :style="{ backgroundColor: color }"
      :class="{ 'hover:bg-gray-700' :!disabled}"
      @click="emitChoice"
      :disabled="disabled"
  >
    <span class=" opacity-0 transition-all duration-200 scale-50" :class=" {'opacity-100 scale-100': isCorrect && index === chosenIndex }">
          <img src="../assets/Correct.png" alt="" class="p-4 absolute inset-0">
    </span>
    <span class=" opacity-0 transition-all duration-200 scale-50" :class=" {'opacity-100 scale-100': isFalse & index === chosenIndex }">
          <img src="../assets/Wrong.png" alt="" class="p-4 absolute inset-0">
    </span>
  </button>
</template>

<script>


export default {
  name: 'MemorySquareGame',
  emits: ['choice'],
  props: {
    color: {
      type: String,
      default: 'lightgray',
      required: true,
    },
    index: {
      type: Number,
      default: 0,
      required: true,
    },
    disabled: {
      default: true,
      type: Boolean,
      required: true,
    },
    isCorrect: {
      default: false,
      type: Boolean,
      required: true,
    },
    isFalse: {
      default: false,
      type: Boolean,
      required: true,
    },
    chosenIndex: {
      default: -1,
      type: Number,
      required: true,
    }
  },
  setup(props, {emit}) {

    const emitChoice = () => {
      emit('choice', props.index);
    };


    return {emitChoice};
  }
};
</script>
