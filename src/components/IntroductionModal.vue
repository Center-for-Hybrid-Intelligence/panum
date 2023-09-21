<template>
  <LInfo :show="show">
    <template #title>
      <h1 class="self-center">
        Welcome to the
        Memory game!
      </h1>
    </template>
    <template #body>
<div class="flex justify-center w-full">
      <ol class="!text-left k1:text-md text- list-disc" >
        <li class="pb-2"> Colorful squares will appear one at a time, Pay close attention</li>
        <li class="pb-2"> You have to keep track of the last location of each color</li>
        <li class="pb-2"> At the end, you will be asked where each color last appeared</li>
        <li class="pb-2"> If you do not remember the answer, just go with your best guess.</li>
        <li class="pb-2"> There will be a practice round before the game begins.</li>
      </ol>

    </div>

    </template>

    <template #button>
      <button @click="start" class="button !w-60">
        Start practice round
      </button>
    </template>
  </LInfo>
</template>

<script>
import LInfo from "@/components/layout/LInfo.vue";

export default {
  name: "IntroductionModal",
  emits: [
    'start'
  ],
  components: {LInfo},
  props: {
    show: {
      type: Boolean,
      default: false,
    }
  },
  setup(props, {emit}) {
    const start = () => {
      emit("start");
    }
    return {
      start
    }
  }
}
</script>

<style scoped>

</style>