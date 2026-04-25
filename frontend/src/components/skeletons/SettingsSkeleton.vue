<template>
  <div class="space-y-6">
    <!-- Personal Info Section -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <SkeletonBase width="w-40" height="h-4" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 6" :key="i" class="space-y-2">
          <SkeletonBase width="w-20" height="h-3" />
          <SkeletonBase width="w-full" height="h-10" rounded="rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Contact Info Section -->
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
      <SkeletonBase width="w-40" height="h-4" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="j in 4" :key="j" class="space-y-2">
          <SkeletonBase width="w-20" height="h-3" />
          <SkeletonBase width="w-full" height="h-10" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonBase from './SkeletonBase.vue'
</script>
