<template>
  <LInfo :show="show">
    <template #title>
      <h1 class="self-center !text-6xl">
      Game End
      </h1>
    </template>
    <template #body>
      You finished all the levels - well done!
      This was your final score:
      <h1 class="font-bold py-4 text-4xl"> {{totalPoints}} / 12</h1>
      Thank you for playing!
    </template>

    <template #button>
      <button @click="end" class="button ">
        Return to homepage
      </button>
    </template>
  </LInfo>
</template>

<script>
import LInfo from "@/components/layout/LInfo.vue";

export default {
  name: "DoneGameModal",
  emits: [
    'start'
  ],
  components: {LInfo},
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    totalPoints: {
      type: Number,
      default: 0,
    },
  },
  setup() {
    const end = () => {
      //GO back to homepage here
      console.log("go home here", )
    }
    return {
      end
    }
  }
}
</script>

<style scoped>

</style>