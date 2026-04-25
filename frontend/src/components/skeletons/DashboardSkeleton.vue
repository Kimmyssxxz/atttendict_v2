<template>
  <div class="space-y-8">
    <!-- Stats Cards Skeleton -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
      <div v-for="i in 4" :key="i" class="bg-white rounded-xl p-6 shadow-sm flex items-center gap-5 border border-gray-100">
        <SkeletonBase width="w-12" height="h-12" rounded="rounded-full" />
        <div class="flex-1 space-y-2">
          <SkeletonBase width="w-20" height="h-3" />
          <SkeletonBase width="w-16" height="h-6" />
        </div>
      </div>
    </div>

    <!-- Charts Skeleton -->
    <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)]">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
        <SkeletonBase width="w-40" height="h-5" extraClass="mb-8" />
        <SkeletonBase width="w-full" height="h-full" extraClass="flex-1" />
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
        <div class="flex justify-between items-center mb-8">
          <SkeletonBase width="w-32" height="h-5" />
          <SkeletonBase width="w-16" height="h-3" />
        </div>
        <div class="flex flex-col lg:flex-row items-center gap-8 flex-1">
          <SkeletonBase width="w-48" height="h-48" rounded="rounded-full" />
          <div class="flex-1 w-full space-y-6">
            <div v-for="j in 4" :key="j" class="space-y-2">
              <div class="flex justify-between">
                <SkeletonBase width="w-20" height="h-4" />
                <SkeletonBase width="w-8" height="h-4" />
              </div>
              <SkeletonBase width="w-full" height="h-2" rounded="rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonBase from './SkeletonBase.vue'
</script>
