<template>
  <div class="space-y-8">
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <!-- Status Selection Panel Skeleton -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-[300px]">
        <div class="flex justify-between items-start mb-8">
          <div class="space-y-2">
            <SkeletonBase width="w-32" height="h-6" />
            <SkeletonBase width="w-48" height="h-4" />
          </div>
          <SkeletonBase width="w-16" height="h-16" rounded="rounded-2xl" />
        </div>
        <div class="mt-auto bg-gray-50/80 rounded-2xl p-6 space-y-4">
          <div class="flex justify-between">
            <SkeletonBase width="w-24" height="h-4" />
            <SkeletonBase width="w-32" height="h-8" rounded="rounded-full" />
          </div>
          <SkeletonBase width="w-full" height="h-12" rounded="rounded-xl" />
        </div>
      </div>

      <!-- Actions Panel Skeleton -->
      <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col h-[300px]">
        <div class="flex justify-between items-start mb-8">
          <div class="space-y-2">
            <SkeletonBase width="w-32" height="h-6" />
            <SkeletonBase width="w-48" height="h-4" />
          </div>
          <SkeletonBase width="w-24" height="h-8" rounded="rounded-full" />
        </div>
        <div class="flex-1 flex flex-col items-center justify-center space-y-4 bg-slate-50 rounded-2xl p-6 border border-slate-100">
           <SkeletonBase width="w-24" height="h-24" rounded="rounded-3xl" />
           <SkeletonBase width="w-48" height="h-4" />
           <SkeletonBase width="w-full" height="h-12" rounded="rounded-2xl" />
        </div>
      </div>
    </div>

    <!-- Activity Log Skeleton -->
    <div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div class="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100">
        <SkeletonBase width="w-10" height="h-10" rounded="rounded-xl" />
        <div class="space-y-2">
           <SkeletonBase width="w-32" height="h-6" />
           <SkeletonBase width="w-48" height="h-4" />
        </div>
      </div>
      <div class="space-y-8">
        <div v-for="i in 3" :key="i" class="flex gap-4">
          <SkeletonBase width="w-24" height="h-8" rounded="rounded-lg" extraClass="shrink-0" />
          <div class="flex-1 bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-100">
             <div class="flex gap-4">
               <SkeletonBase width="w-20" height="h-6" rounded="rounded-md" />
               <SkeletonBase width="w-32" height="h-5" />
             </div>
             <div class="flex gap-4">
                <SkeletonBase width="w-full" height="h-32" rounded="rounded-xl" />
                <SkeletonBase width="w-40" height="h-32" rounded="rounded-xl" />
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
