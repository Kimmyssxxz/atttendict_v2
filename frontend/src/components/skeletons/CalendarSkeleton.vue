<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b border-gray-100 flex justify-between items-center">
      <div class="space-y-2">
        <SkeletonBase width="w-48" height="h-8" />
        <SkeletonBase width="w-32" height="h-4" />
      </div>
      <SkeletonBase width="w-40" height="h-10" rounded="rounded-xl" />
    </div>

    <!-- Grid -->
    <div class="p-4">
      <div class="grid grid-cols-7 gap-4 mb-8">
        <SkeletonBase v-for="i in 7" :key="i" width="w-12" height="h-4" extraClass="mx-auto" />
      </div>
      <div class="grid grid-cols-7 gap-4">
        <div v-for="j in 35" :key="j" class="aspect-square bg-gray-50/50 rounded-xl border border-gray-100 p-2 flex flex-col items-center justify-center gap-2">
          <SkeletonBase width="w-6" height="h-6" rounded="rounded-full" />
          <SkeletonBase width="w-4" height="h-4" rounded="rounded-full" />
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="bg-gray-50 border-t border-gray-100 p-4 flex justify-center gap-8">
      <div v-for="k in 4" :key="k" class="flex items-center gap-2">
        <SkeletonBase width="w-3" height="h-3" rounded="rounded-full" />
        <SkeletonBase width="w-16" height="h-3" />
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonBase from './SkeletonBase.vue'
</script>
