<template>
  <div class="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
    <!-- Table Header Skeleton -->
    <div class="bg-gray-50/30 border-b border-gray-100 px-6 py-6 flex items-center justify-between">
      <SkeletonBase v-for="i in 5" :key="i" width="w-20" height="h-3" />
      <SkeletonBase width="w-10" height="h-3" />
    </div>

    <!-- Table Rows Skeleton -->
    <div class="divide-y divide-gray-100">
      <div v-for="row in rows" :key="row" class="px-6 py-5 flex items-center justify-between">
        <div class="flex flex-col gap-2 w-24">
          <SkeletonBase width="w-full" height="h-4" />
          <SkeletonBase width="w-2/3" height="h-2" />
        </div>
        <SkeletonBase width="w-20" height="h-8" rounded="rounded-md" />
        <SkeletonBase width="w-20" height="h-8" rounded="rounded-md" />
        <SkeletonBase width="w-24" height="h-6" rounded="rounded-full" />
        <SkeletonBase width="w-32" height="h-4" />
        <div class="flex gap-2">
          <SkeletonBase width="w-8" height="h-8" rounded="rounded-lg" />
          <SkeletonBase width="w-8" height="h-8" rounded="rounded-lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonBase from './SkeletonBase.vue'

defineProps({
  rows: {
    type: Number,
    default: 5
  }
})
</script>
