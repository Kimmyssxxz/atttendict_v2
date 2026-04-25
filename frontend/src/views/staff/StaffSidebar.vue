<template>
  <div class="contents">
    <!-- Desktop Sidebar -->
    <StaffDesktopSidebar :activeNav="activeNav" />
    
    <!-- Mobile Bottom Navigation Mask -->
    <!-- This creates a solid area at the bottom so content doesn't show in the gap behind the floating dock -->
    <div class="md:hidden fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white to-transparent z-[90] pointer-events-none"></div>

    <!-- Mobile Bottom Navigation -->
    <StaffBottomNav :activeNav="activeNav" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import StaffDesktopSidebar from './StaffDesktopSidebar.vue'
import StaffBottomNav from './StaffBottomNav.vue'

const props = defineProps({
  activeNav: {
    type: String,
    required: true
  }
})
</script>
