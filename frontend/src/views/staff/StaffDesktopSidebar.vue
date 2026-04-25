<template>
  <!-- Desktop Sidebar -->
  <aside class="hidden md:flex md:flex-col md:w-[260px] bg-[#133e75]  border-r border-gray-200 py-8 px-5 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 shrink-0 h-screen sticky top-0">
    <!-- Brand -->
    <div class="flex items-center gap-3 mb-10 px-2">
      <img src="/4.png" alt="Logo" class="h-10 w-auto object-contain font-bold text-xl text-blue-600"/>
      <div class="text-2xl font-bold text-white uppercase tracking-tight">
        ATTENDICT
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex flex-col w-full gap-2">
      <!-- Dashboard -->
      <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-lg font-medium transition-all duration-200"
           :class="activeNav === 'dashboard' ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20' : 'text-white/60 hover:bg-white/5 hover:text-white'"
           @click="navigateTo('StaffDashboard')">
        <svg v-if="activeNav === 'dashboard'" width="20" height="20" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1"/>
        </svg>
        <span class="whitespace-nowrap">Dashboard</span>
      </div>

      <!-- Attendance -->
      <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-lg font-medium transition-all duration-200"
           :class="activeNav === 'attendance' ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20' : 'text-white/60 hover:bg-white/5 hover:text-white'"
           @click="navigateTo('StaffAttendance')">
        <svg v-if="activeNav === 'attendance'" width="20" height="20" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="currentColor" d="M2 3h20a2.07 2.07 0 0 1 2 2v14a2.07 2.07 0 0 1-2 2H2a2.07 2.07 0 0 1-2-2V5a2.07 2.07 0 0 1 2-2m6 10.91C6 13.91 2 15 2 17v1h12v-1c0-2-4-3.09-6-3.09M8 6a3 3 0 1 0 3 3a3 3 0 0 0-3-3m9 4v3h4v-3z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="currentColor" d="M22 3H2a2.07 2.07 0 0 0-2 2v14a2.07 2.07 0 0 0 2 2h20a2.07 2.07 0 0 0 2-2V5a2.07 2.07 0 0 0-2-2m0 16H2V5h20m-8 12v-1.25c0-1.66-3.34-2.5-5-2.5s-5 .84-5 2.5V17zM9 7a2.5 2.5 0 1 0 2.5 2.5A2.5 2.5 0 0 0 9 7m6 3v3h4v-3z"/>
        </svg>
        <span class="whitespace-nowrap">Attendance</span>
      </div>

      <!-- Logs -->
      <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-lg font-medium transition-all duration-200"
           :class="activeNav === 'attendance-logs' ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20' : 'text-white/60 hover:bg-white/5 hover:text-white'"
           @click="navigateTo('StaffAttendanceLogs')">
        <svg v-if="activeNav === 'attendance-logs'" width="20" height="20" viewBox="0 0 640 640" class="w-5 h-5">
          <path fill="currentColor" d="M224 64c17.7 0 32 14.3 32 32v32h128V96c0-17.7 14.3-32 32-32s32 14.3 32 32v32h32c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64h32V96c0-17.7 14.3-32 32-32m-64 240v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16m128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16m144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 432v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16m144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 640 640" class="w-5 h-5">
          <path fill="currentColor" d="M216 64c13.3 0 24 10.7 24 24v40h160V88c0-13.3 10.7-24 24-24s24 10.7 24 24v40h32c35.3 0 64 28.7 64 64v288c0 35.3-28.7 64-64 64H160c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64h32V88c0-13.3 10.7-24 24-24m264 432c8.8 0 16-7.2 16-16v-64h-88v80zm16-128v-80h-88v80zm-136 0v-80h-80v80zm-128 0v-80h-88v80zm-88 48v64c0 8.8 7.2 16 16 16h72v-80zm136 0v80h80v-80zm-64-240h-56c-8.8 0-16 7.2-16 16v48h352v-48c0-8.8-7.2-16-16-16z"/>
        </svg>
        <span class="whitespace-nowrap">Logs</span>
      </div>

      <!-- Summary -->
      <div class="flex items-center gap-3 py-3 px-4 rounded-xl cursor-pointer text-lg font-medium transition-all duration-200"
           :class="activeNav === 'monthly-summary' ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/20' : 'text-white/60 hover:bg-white/5 hover:text-white'"
           @click="navigateTo('StaffMonthlySummary')">
        <svg v-if="activeNav === 'monthly-summary'" width="20" height="20" viewBox="0 0 24 24" class="w-5 h-5">
          <path fill="currentColor" d="m21.861 17.43l-3.52-13.24a2.73 2.73 0 0 0-1.26-1.64a2.65 2.65 0 0 0-2-.26l-3.77 1a2 2 0 0 0-.57.25a2.66 2.66 0 0 0-2.15-1.07h-3.9a2.69 2.69 0 0 0-2.69 2.69v13.63a2.69 2.69 0 0 0 2.69 2.7h3.9a2.7 2.7 0 0 0 2.7-2.7v-5.12l1.64 6.14a2.63 2.63 0 0 0 1.26 1.63c.407.236.87.36 1.34.36q.355.004.7-.08l3.77-1a2.67 2.67 0 0 0 1.9-3.3zm-15.26.26a1.81 1.81 0 1 1 1.8-1.81a1.81 1.81 0 0 1-1.8 1.78zm10-.11a1.84 1.84 0 1 1 1.84-1.84a1.84 1.84 0 0 1-1.82 1.81z"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" class="w-5 h-5">
          <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            <path d="M8.593 3.217H4.698A1.95 1.95 0 0 0 2.75 5.164v13.633c0 1.075.872 1.947 1.948 1.947h3.895a1.95 1.95 0 0 0 1.947-1.947V5.164a1.95 1.95 0 0 0-1.947-1.947"/>
            <path d="M6.645 17.379a1.503 1.503 0 1 0 0-3.007a1.503 1.503 0 0 0 0 3.007M10.54 7.93l3.116 11.685a1.95 1.95 0 0 0 2.386 1.373l3.768-.974a1.947 1.947 0 0 0 1.373-2.386L17.658 4.385a1.947 1.947 0 0 0-2.386-1.373l-3.758 1.003c-.406.111-.764.35-1.023.682"/>
            <path d="M16.665 17.241a1.502 1.502 0 1 0 0-3.004a1.502 1.502 0 0 0 0 3.004"/>
          </g>
        </svg>
        <span class="whitespace-nowrap">Summary</span>
      </div>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  activeNav: {
    type: String,
    required: true
  }
})

const router = useRouter()

const navigateTo = (routeName) => {
  router.push({ name: routeName })
}
</script>
