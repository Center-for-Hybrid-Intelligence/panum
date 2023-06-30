<template>
  <div
      class="w-24 h-24 bg-gray-800 rounded-2xl bg-gray-200"
      :style="{ backgroundColor: color }"
      @click="emitChoice"
  ></div>
</template>

<script>

export default {
  name: 'MemorySquareGame',
  props: {
    color: {
      type: String,
      default: 'lightgray',
      required: true,
    },
  },
  setup(props) {
    const emitChoice = () => {
      this.$emit('choice', props.color);
    };

    return { emitChoice };
  }
};
</script>
