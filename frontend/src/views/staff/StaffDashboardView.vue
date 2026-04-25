<template>
  <div class="flex h-screen bg-white font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <StaffSidebar activeNav="dashboard" />


    <!-- Main Content -->
    <main class="flex-1 flex flex-col bg-white relative z-0">
      <!-- Top Header -->
      <header class="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex justify-between items-center relative z-20">
        <div v-if="isMobile" class="flex items-center gap-2">
          <img src="/3.png" alt="Logo" class="h-8 w-auto object-contain"/>
          <span class="text-2xl font-bold text-black">ATTENDICT</span>
        </div>
        <h1 v-else class="text-base text-gray-800 font-medium"></h1>
        <div class="flex items-center gap-4">
          <!-- <button class="relative flex items-center justify-center p-2 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 hover:text-gray-800 transition-colors duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span class="absolute top-0.5 right-0.5 bg-red-500 text-white w-[18px] h-[18px] rounded-full text-xs flex items-center justify-center font-semibold">1</span>
          </button> -->
          <div ref="avatarWrapEl" class="relative flex items-center">
            <button class="w-9 h-9 rounded-full bg-gray-800 text-white border-none cursor-pointer text-sm hover:bg-gray-900 transition-colors duration-200" type="button" @click="toggleAvatarMenu" aria-haspopup="true" :aria-expanded="avatarMenuOpen">
              <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full rounded-full object-cover block" alt="Profile" />
              <span v-else class="inline-flex w-full h-full items-center justify-center">{{ userInitials || 'U' }}</span>
            </button>


            <div v-if="avatarMenuOpen" class="absolute top-[calc(100%+10px)] right-0 w-[300px] bg-white border border-slate-900/5 rounded-xl shadow-[0_14px_30px_rgba(0,0,0,0.12)] overflow-hidden z-50 origin-top-right transition-all" role="menu">
              <div class="flex gap-3 p-3.5 border-b border-slate-900/5">
                <div class="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-900">
                  <img v-if="userPhotoUrl" class="w-full h-full object-cover block" :src="userPhotoUrl" alt="Profile" />
                  <div v-else class="w-full h-full flex items-center justify-center text-white font-bold">{{ userInitials || 'U' }}</div>
                </div>
                <div class="flex flex-col justify-center min-w-0">
                  <div class="font-bold text-slate-900 text-sm truncate">{{ userDisplayName || 'User' }}</div>
                  <div class="text-xs text-slate-500 truncate">{{ userEmail || '' }}</div>
                </div>
              </div>


              <button class="w-full flex items-center gap-2.5 px-3.5 py-3 border-none bg-transparent cursor-pointer text-slate-900 font-medium text-sm text-left hover:bg-slate-900/5 transition-colors" type="button" @click="goToSettings" role="menuitem">
                <svg class="text-slate-700 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                </svg>
                <span>Settings</span>
                <span class="ml-auto text-slate-400 text-lg font-bold">›</span>
              </button>


              <button class="w-full flex items-center gap-2.5 px-3.5 py-3 border-none bg-transparent cursor-pointer text-slate-900 font-medium text-sm text-left hover:bg-slate-900/5 transition-colors" type="button" @click="logout" role="menuitem">
                <svg class="text-slate-700 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>


      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- DESKTOP VIEW -->
        <div v-if="!isMobile" class="p-8 md:pb-8">
          <DashboardSkeleton v-if="staffStore.loading" />

          <template v-else>
            <div class="flex justify-between items-start mb-8">
              <div>
                <h2 class="text-2xl text-gray-800 font-bold mb-2">Dashboard Overview</h2>
                <p class="text-sm text-gray-400">Monitor your attendance</p>
              </div>
            </div>

            <!-- Desktop Metrics Grid -->
            <div class="grid grid-cols-4 gap-6 mb-8">
              <!-- Total Records -->
              <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="round" d="M2 19V7.549c0-1.444 0-2.166.243-2.733a3 3 0 0 1 1.573-1.573C4.383 3 5.098 3 6.55 3h.494a2 2 0 0 1 1.557.745L10.418 6m0 0H16c1.4 0 2.1 0 2.635.272a2.5 2.5 0 0 1 1.092 1.093C20 7.9 20 8.6 20 10v1m-9.582-5H7"/><path d="m3.158 15.514l.298-.742c.734-1.827 1.101-2.74 1.866-3.256S7.076 11 9.052 11h8.06c2.688 0 4.033 0 4.63.879c.598.879.098 2.121-.9 4.607l-.298.742c-.734 1.827-1.101 2.74-1.866 3.256s-1.754.516-3.73.516h-8.06c-2.688 0-4.033 0-4.63-.879c-.598-.878-.098-2.121.9-4.607Z"/></g></svg>
                </div>
                <div class="flex flex-col">
                  <h3 class="text-sm text-gray-500 font-medium mb-1">Total Records</h3>
                  <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.totalDays }}</p>
                </div>
              </div>
              <!-- Days Present -->
              <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-500">
                  <svg class="w-6 h-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 2v4m8-4v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></g></svg>
                </div>
                <div class="flex flex-col">
                  <h3 class="text-sm text-gray-500 font-medium mb-1">Days Present</h3>
                  <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.presentDays }}</p>
                </div>
              </div>
              <!-- Total Hours -->
              <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-purple-50 text-purple-500">
                  <svg class="w-6 h-6" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"/></g></svg>
                </div>
                <div class="flex flex-col">
                  <h3 class="text-sm text-gray-500 font-medium mb-1">Total Hours</h3>
                  <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.totalHours }}</p>
                </div>
              </div>
              <!-- Completion Rate -->
              <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:-translate-y-1 flex items-center gap-5">
                <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
                  <svg class="w-6 h-6" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M3.5 4v13.5a3 3 0 0 0 3 3H20"/><path d="m6.5 15l4.5-4.5l3.5 3.5L20 8.5"/></g></svg>
                </div>
                <div class="flex flex-col">
                  <h3 class="text-sm text-gray-500 font-medium mb-1">Attendance Rate</h3>
                  <p class="text-2xl font-bold text-gray-800">{{ dashboardMetrics.completionRate }}%</p>
                </div>
              </div>
            </div>

            <!-- Desktop Charts Grid -->
            <div class="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
              <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col min-h-[400px]">
                <h3 class="text-[17px] text-gray-800 font-semibold mb-6">Hours Worked Trend</h3>
                <div class="flex-1 min-h-0 relative">
                  <VueApexCharts type="area" height="100%" :options="areaOptions" :series="areaSeries" />
                </div>
              </div>
             
              <div class="bg-white rounded-xl p-6 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_10px_15px_-3px_rgba(0,0,0,0.1)] transition-transform duration-300 flex flex-col min-h-[500px]">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="text-xl font-bold text-black">Status Distribution</h3>
                  <span class="text-sm text-gray-400">{{ dashboardMetrics.totalDays * 2 }} units</span>
                </div>
               
                <!-- Status Cards Grid -->
                <div class="grid grid-cols-4 gap-3 mb-10">
                  <div v-for="item in statusLegendData" :key="item.label" 
                       class="flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200"
                       :style="{ borderColor: item.color + '40', backgroundColor: item.color + '05' }">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 shadow-sm"
                         :style="{ backgroundColor: item.color + '20', color: item.color }">
                      {{ item.value }}
                    </div>
                    <span class="text-xs font-semibold text-gray-700 text-center">{{ item.label }}</span>
                  </div>
                </div>

                <!-- Radial Chart -->
                <div class="flex-1 flex items-center justify-center relative">
                  <VueApexCharts type="radialBar" width="100%" height="350" :options="radialOptions" :series="radialSeries" />
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- MOBILE VIEW -->
        <div v-else class="p-4 pb-32">
          <DashboardSkeleton v-if="staffStore.loading" />

          <template v-else>
            <div class="mb-6">
              <h2 class="text-xl text-black font-semibold">Dashboard Overview</h2>
              <p class="text-sm text-gray-600">Monitor your attendance</p>
            </div>

            <div class="space-y-6">            <!-- Mobile Metrics Grid (2x2) -->
              <div class="grid grid-cols-2 gap-3">
                <!-- Total Records -->
                <div class="bg-white rounded-xl p-4  border border-gray-100 flex flex-col gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-blue-50 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="round" d="M2 19V7.549c0-1.444 0-2.166.243-2.733a3 3 0 0 1 1.573-1.573C4.383 3 5.098 3 6.55 3h.494a2 2 0 0 1 1.557.745L10.418 6m0 0H16c1.4 0 2.1 0 2.635.272a2.5 2.5 0 0 1 1.092 1.093C20 7.9 20 8.6 20 10v1m-9.582-5H7"/><path d="m3.158 15.514l.298-.742c.734-1.827 1.101-2.74 1.866-3.256S7.076 11 9.052 11h8.06c2.688 0 4.033 0 4.63.879c.598.879.098 2.121-.9 4.607l-.298.742c-.734 1.827-1.101 2.74-1.866 3.256s-1.754.516-3.73.516h-8.06c-2.688 0-4.033 0-4.63-.879c-.598-.878-.098-2.121.9-4.607Z"/></g></svg>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-sm text-gray-600 font-medium mb-0.5">Total Records</h3>
                    <p class="text-xl font-semibold text-gray-800">{{ dashboardMetrics.totalDays }}</p>
                  </div>
                </div>
                <!-- Days Present -->
                <div class="bg-white rounded-xl p-4  border border-gray-100 flex flex-col gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-emerald-50 text-emerald-500">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M8 2v4m8-4v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/></g></svg>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-sm text-gray-600 font-medium mb-0.5">Days Present</h3>
                    <p class="text-xl font-bold text-gray-800">{{ dashboardMetrics.presentDays }}</p>
                  </div>
                </div>
                <!-- Total Hours -->
                <div class="bg-white rounded-xl p-4  border border-gray-100 flex flex-col gap-3">
                  <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-purple-50 text-purple-500">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"/><path fill="currentColor" d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1"/></g></svg>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-sm text-gray-600 font-medium mb-0.5">Total Hours</h3>
                    <p class="text-xl font-bold text-gray-800">{{ dashboardMetrics.totalHours }}</p>
                  </div>
                </div>
                <!-- Completion Rate -->
                <div class="bg-white rounded-xl p-4  border border-gray-100 flex flex-col gap-3">
                   <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 bg-amber-50 text-amber-500">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M3.5 4v13.5a3 3 0 0 0 3 3H20"/><path d="m6.5 15l4.5-4.5l3.5 3.5L20 8.5"/></g></svg>
                  </div>
                  <div class="flex flex-col">
                    <h3 class="text-sm text-gray-600 font-medium mb-0.5">Attendance Rate</h3>
                    <p class="text-xl font-bold text-gray-800">{{ dashboardMetrics.completionRate }}%</p>
                  </div>
                </div>
              </div>

              <!-- Mobile Charts (Stacked) -->
              <div class="space-y-6">
                <div class="bg-white rounded-xl p-5  border border-gray-100">
                  <h3 class="text-lg text-gray-900 font-semibold mb-6">Hours Worked Trend</h3>
                  <div class="h-[250px] relative">
                    <VueApexCharts type="area" height="100%" :options="areaOptions" :series="areaSeries" />
                  </div>
                </div>
               
                <div class="bg-white rounded-xl p-5  border border-gray-100">
                  <div class="flex justify-between items-center mb-6">
                    <h3 class="text-lg text-gray-900 font-semibold">Status Distribution</h3>
                    <span class="text-sm text-gray-400">{{ dashboardMetrics.totalDays * 2 }} Units</span>
                  </div>

                  <!-- Mobile Status Cards (One Line) -->
                  <div class="grid grid-cols-4 gap-2 mb-8">
                    <div v-for="item in statusLegendData" :key="item.label" 
                         class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200"
                         :style="{ borderColor: item.color + '40', backgroundColor: item.color + '05' }">
                      <div class="w-9 h-9 rounded-full flex items-center justify-center font-semibold mb-1.5"
                           :style="{ backgroundColor: item.color + '20', color: item.color }">
                        {{ item.value }}
                      </div>
                      <span class="text-[10px] font-medium text-gray-600 text-center whitespace-nowrap">{{ item.label }}</span>
                    </div>
                  </div>
                 
                  <div class="flex flex-col items-center relative">
                    <!-- Chart -->
                    <div class="w-full flex justify-center">
                      <VueApexCharts type="radialBar" height="320" :options="radialOptions" :series="radialSeries" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    
    <!-- Logout Confirmation Modal -->
    <div v-if="isLogoutModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/50 transition-opacity" @click.self="closeLogoutModal">
      <div class="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#133e75]">
          <h3 class="text-xl font-semibold text-white">Log Out</h3>
        </div>
        
        <!-- Content -->
        <div class="p-8">
          <div class="space-y-4">
            <p class="text-gray-600 font-medium">Are you sure you want to log out?</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex justify-end gap-3 border-t border-gray-50">
          <button @click="closeLogoutModal" class="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-200 transition-colors">
            Cancel
          </button>
          <button @click="confirmLogout" class="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            Log Out
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import StaffSidebar from './StaffSidebar.vue'
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton.vue'
import { useRouter } from 'vue-router'
import { db } from '../../firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import VueApexCharts from 'vue3-apexcharts'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore.js'


const router = useRouter()
const staffStore = useStaffAttendanceStore()
const activeTab = ref('current')
const activeNav = ref('dashboard')


const avatarWrapEl = ref(null)
const avatarMenuOpen = ref(false)
const isMobile = ref(false)
const isLogoutModalOpen = ref(false)

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}


const resolveStaffLocal = () => {
  const keys = ['user', 'staffUser']
  for (const k of keys) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw)
      const resolved = parsed?.user ? parsed.user : parsed
      if (resolved) return resolved
    } catch {
      // ignore
    }
  }
  return null
}


const getCurrentUserId = () => {
  const staffLocal = resolveStaffLocal()
  return staffLocal?.uid || staffLocal?.id || staffLocal?.staffId || staffLocal?._id || null
}


const userProfile = ref(resolveStaffLocal())


const userDisplayName = computed(() => {
  if (!userProfile.value) return ''
  const { firstName, lastName, name, fullName, displayName, username } = userProfile.value
  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim()
  }
  return name || fullName || displayName || username || ''
})


const userEmail = computed(() => {
  if (!userProfile.value) return ''
  return userProfile.value.email || userProfile.value.emailAddress || userProfile.value.username || ''
})


const userPhotoUrl = computed(() => {
  return userProfile.value?.photoUrl || userProfile.value?.photoURL || userProfile.value?.avatarUrl || userProfile.value?.profilePicture || userProfile.value?.profileImage || ''
})


const userInitials = computed(() => {
  const name = userDisplayName.value || userEmail.value
  if (!name) return ''
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase()
})


// Auth helpers moved to top


const fetchUserProfile = async () => {
  const id = getCurrentUserId()
  if (!id) return

  try {
    const snap = await getDoc(doc(db, 'users', String(id)))
    if (snap.exists()) {
      const freshData = { id: snap.id, ...snap.data() }
      // Merge with existing local data to avoid losing fields returned by backend but not in Firestore
      userProfile.value = { ...(userProfile.value || {}), ...freshData }
    }
  } catch (e) {
    console.error('Failed to load user profile from Firestore users collection:', e)
  }
}


const toggleAvatarMenu = () => {
  avatarMenuOpen.value = !avatarMenuOpen.value
}


const closeAvatarMenu = () => {
  avatarMenuOpen.value = false
}


const onDocClick = (e) => {
  if (!avatarMenuOpen.value) return
  const root = avatarWrapEl.value
  if (!root) return
  if (root.contains(e.target)) return
  closeAvatarMenu()
}


const goToSettings = () => {
  closeAvatarMenu()
  router.push({ name: 'StaffSettings' })
}


const logout = () => {
  closeAvatarMenu()
  isLogoutModalOpen.value = true
}


const confirmLogout = () => {
  isLogoutModalOpen.value = false
  localStorage.removeItem('user')
  localStorage.removeItem('staffUser')
  router.push({ name: 'Login' })
}


const closeLogoutModal = () => {
  isLogoutModalOpen.value = false
}


const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}


const staffAttendances = computed(() => staffStore.getAllStaffAttendances)


const getMinutesDiff = (start, end) => {
   if (!start || !end) return 0
   try {
     const [sh, sm] = start.split(':').map(Number)
     const [eh, em] = end.split(':').map(Number)
     const diff = (eh * 60 + em) - (sh * 60 + sm)
     return diff > 0 ? diff : 0
   } catch { return 0 }
}


const dashboardMetrics = computed(() => {
  const records = staffAttendances.value || []
  const totalDays = records.length
 
  let presentDays = 0
  let totalMinutes = 0
 
  records.forEach(record => {
    if (record.timeInAM || record.timeInPM) presentDays++
   
    let mins = 0
    if (record.timeInAM && record.timeOutAM) mins += getMinutesDiff(record.timeInAM, record.timeOutAM)
    if (record.timeInPM && record.timeOutPM) mins += getMinutesDiff(record.timeInPM, record.timeOutPM)
    totalMinutes += mins
  })


  const hrs = Math.floor(totalMinutes / 60)
  const remainderMins = totalMinutes % 60
 
  return {
    totalDays,
    presentDays,
    totalHours: `${hrs}h ${remainderMins}m`,
    completionRate: totalDays ? Math.round((presentDays / totalDays) * 100) : 0
  }
})


// Charts Options
const areaSeries = computed(() => {
  const records = [...(staffAttendances.value || [])].sort((a,b) => new Date(a.date) - new Date(b.date))
  const data = records.map(r => {
    let mins = 0
    if (r.timeInAM && r.timeOutAM) mins += getMinutesDiff(r.timeInAM, r.timeOutAM)
    if (r.timeInPM && r.timeOutPM) mins += getMinutesDiff(r.timeInPM, r.timeOutPM)
    return parseFloat((mins / 60).toFixed(1))
  })
  return [{ name: 'Hours Worked', data }]
})


const areaOptions = computed(() => {
  const records = [...(staffAttendances.value || [])].sort((a,b) => new Date(a.date) - new Date(b.date))
  const categories = records.map(r => {
    const d = new Date(r.date)
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  })
 
  return {
    chart: { 
      type: 'area', 
      height: 300, 
      fontFamily: 'inherit', 
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 }
      }
    },
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 3 },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      padding: { left: 10, right: 10 }
    },
    xaxis: { 
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { 
      title: { text: '' },
      labels: { formatter: (val) => val + ' hrs' }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100]
      }
    },
    tooltip: {
      theme: 'light',
      x: { show: true },
      y: { formatter: (val) => val + ' hrs' }
    }
  }
})


const donutSeries = computed(() => {
  const counts = { Office: 0, OnField: 0, Travel: 0, Leave: 0 }
  staffAttendances.value?.forEach(r => {
    if (r.timeInAM) {
      const amStatus = r.staffStatusAM || r.statusAM || (r.staffStatus === 'Leave' ? 'Leave' : 'At Office')
      if (amStatus === 'Travel') counts.Travel++
      else if (amStatus === 'On Field' || amStatus === 'Travel/On Field') counts.OnField++
      else if (amStatus === 'Leave') counts.Leave++
      else counts.Office++
    }


    if (r.timeInPM) {
      const pmStatus = r.staffStatusPM || r.statusPM || (r.staffStatus === 'Leave' ? 'Leave' : 'At Office')
      if (pmStatus === 'Travel') counts.Travel++
      else if (pmStatus === 'On Field' || pmStatus === 'Travel/On Field') counts.OnField++
      else if (pmStatus === 'Leave') counts.Leave++
      else counts.Office++
    }


    if (!r.timeInAM && !r.timeInPM && r.staffStatus === 'Leave') {
      counts.Leave += 2
    }
  })
  return [counts.Office, counts.OnField, counts.Travel, counts.Leave]
})


const radialSeries = computed(() => {
  const series = donutSeries.value
  const total = series.reduce((a, b) => a + b, 0)
  if (total === 0) return [0, 0, 0, 0]
  // ApexCharts radialBar expects percentages (0-100)
  return series.map(v => Math.round((v / total) * 100))
})


const statusLegendData = computed(() => {
  const labels = ['At Office', 'On Field', 'Travel', 'Leave']
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']
  const icons = ['🏢', '📍', '🚗', '🌴']
  const series = donutSeries.value
  const total = series.reduce((a, b) => a + b, 0)


  return labels.map((label, index) => {
    const value = series[index]
    const percentage = total > 0 ? (value / total) * 100 : 0
    return {
      label,
      value,
      percentage,
      color: colors[index],
      icon: icons[index]
    }
  })
})


const radialOptions = computed(() => {
  const totalStatuses = donutSeries.value.reduce((a, b) => a + b, 0)
  return {
    chart: { type: 'radialBar', fontFamily: 'inherit' },
    plotOptions: {
      radialBar: {
        hollow: { size: '35%' },
        track: { background: '#f1f5f9', strokeWidth: '100%' },
        dataLabels: {
          name: { show: true, fontSize: '12px', color: '#64748b', offsetY: -5 },
          value: { show: true, fontSize: '16px', fontWeight: '700', color: '#1e293b', offsetY: 5 },
          total: {
            show: true,
            label: 'Total',
            color: '#64748b',
            fontSize: '12px',
            formatter: () => totalStatuses
          }
        }
      }
    },
    colors: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'],
    labels: ['Office', 'Field', 'Travel', 'Leave'],
    stroke: { lineCap: 'round' }
  }
})


const fetchAttendanceData = async () => {
  const staffId = getCurrentUserId()
  if (staffId) {
    await staffStore.getStaffAttendancesByStaffId(staffId, 30) // last 30 entries
  }
}


onMounted(async () => {
  document.addEventListener('click', onDocClick)
  window.addEventListener('resize', handleResize)
  handleResize()

  const staffId = getCurrentUserId()
  if (!staffId) {
    console.warn('No staff session found, redirecting to login...')
    router.push({ name: 'Login' })
    return
  }

  // Refresh user profile and attendance
  fetchUserProfile()
  fetchAttendanceData()
})


onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  window.removeEventListener('resize', handleResize)
})
</script>


<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>

