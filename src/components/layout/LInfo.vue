<template>
  <div
      class="fixed z-50 k1:p-12 p-8  k1:min-h-2/3 min-h-5/6 max-w-screen w-11/12 k1:w-1/2 transform top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      bg-slate-700  bg-opacity-75 backdrop-blur-2xl backdrop-brightness-125
      rounded-3xl shadow-gray-600 shadow-2xl overflow-x-hidden opacity-0
      scale-0 transition-all duration-500"
      :class="{ '!opacity-100  !scale-100': show }">
    <div class="h-full flex flex-col gap-12 justify-around text-white">
      <div class="text-center heading1 rounded-xl bg-opacity-50 ">
        <slot name="title"></slot>
      </div>
      <div class=" text-xl font-custom ">
        <slot name="body"></slot>
      </div>
      <div class="flex justify-center text-xl font-custom">
        <slot name="button"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LInfo",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>

</style>