<template>
  <div 
    class="animate-pulse bg-gray-200 rounded-md" 
    :class="[width, height, rounded, extraClass]"
  ></div>
</template>

<script setup>
defineProps({
  width: {
    type: String,
    default: 'w-full'
  },
  height: {
    type: String,
    default: 'h-4'
  },
  rounded: {
    type: String,
    default: 'rounded-md'
  },
  extraClass: {
    type: String,
    default: ''
  }
})
</script>
