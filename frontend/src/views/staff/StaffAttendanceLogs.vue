<template>
  <div class="flex h-screen bg-white font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <StaffSidebar activeNav="attendance-logs" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0 ">
      <!-- Top Header -->
      <header class="bg-[#133e75] md:bg-white md:border-b md:border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex justify-between items-center relative z-20">
        <!-- Mobile Header (Back Button + Centered Title) -->
        <div v-if="isMobile" class="w-full flex items-center justify-center relative py-1">
          <button @click="router.back()" class="absolute left-0 p-1 text-white rounded-full transition-colors" aria-label="Go back">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-white">Records</h1>
        </div>

        <!-- Desktop Header Layout -->
        <template v-else>
          <h1 class="text-base text-gray-800 font-medium"></h1>
          <div class="flex items-center gap-4">
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
        </template>
      </header>

      <!-- Page Content -->
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto">
        <!-- MOBILE VIEW -->
        <div v-if="isMobile" class="p-4 pb-32 space-y-6">
          <TableSkeleton v-if="loading" />

          <template v-else>
            <div class="flex flex-col gap-4">
              <div class="flex flex-col gap-3">
                              <div class="relative w-full">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </div>
                  <input type="text" v-model="searchQuery" placeholder="Search records..." class="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none  focus:ring-blue-500/20 focus:border-blue-500 w-full transition-shadow">
                </div>
                <!-- Month/Year Selection -->
                <div class="relative" ref="mobileFilterToggleEl">
                  <button @click="isFilterMenuOpen = !isFilterMenuOpen" class="w-full inline-flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all ">
                    <div class="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      {{ months[selectedMonth] }} {{ selectedYear }}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{'rotate-180': isFilterMenuOpen}" class="transition-transform duration-200">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  <div v-if="isFilterMenuOpen" class="absolute left-0 mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                    <div class="space-y-4">
                      <div>
                        <label class="text-sm font-semibold text-gray-900 mb-2 block ml-1">Select Month</label>
                        <div class="grid grid-cols-3 gap-1">
                          <button v-for="(m, index) in months" :key="m" 
                                  @click="selectedMonth = index; isFilterMenuOpen = false"
                                  :class="selectedMonth === index ? 'bg-[#eebb3b] text-white ' : 'text-gray-400 hover:bg-gray-100'"
                                  class="py-1.5 text-xs font-medium rounded-lg transition-all">
                            {{ m.slice(0, 3) }}
                          </button>
                        </div>
                      </div>
                      <div class="relative" ref="yearDropdownRef">
                        <label class="text-sm font-semibold text-gray-900 mb-2 block ml-1">Select Year</label>
                        <button 
                          @click="isYearDropdownOpen = !isYearDropdownOpen"
                          type="button"
                          class="w-full inline-flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                          {{ selectedYear }}
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{'rotate-180': isYearDropdownOpen}" class="transition-transform duration-200">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>

                        <transition
                          enter-active-class="transition ease-out duration-100"
                          enter-from-class="transform opacity-0 scale-95"
                          enter-to-class="transform opacity-100 scale-100"
                          leave-active-class="transition ease-in duration-75"
                          leave-from-class="transform opacity-100 scale-100"
                          leave-to-class="transform opacity-0 scale-95"
                        >
                          <div v-if="isYearDropdownOpen" class="absolute top-full left-0 z-[120] w-full mt-1 bg-white border border-gray-200 rounded-xl  max-h-48 overflow-y-auto">
                            <div class="py-1">
                              <button 
                                v-for="y in years" 
                                :key="y"
                                type="button" 
                                @click="selectedYear = y; isYearDropdownOpen = false" 
                                class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-xs font-semibold"
                                :class="selectedYear === y ? 'bg-blue-50 text-blue-600' : 'text-gray-900'"
                              >
                                {{ y }}
                              </button>
                            </div>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <!-- DTR Export -->
                  <button @click="exportDTR" class="flex items-center justify-center gap-2 px-4 py-3 bg-[#133e75]/10 text-[#133e75] border border-[#133e75] rounded-xl text-xs font-semibold transition-colors ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                    Export DTR
                  </button>
    
                  <button @click="refreshAttendances" class="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 4v6h-6"></path>
                      <path d="M1 20v-6h6"></path>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <!-- Main Panel (Mobile) -->
            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div v-if="error" class="py-16 text-center px-4">
                <p class="text-gray-900 font-bold mb-2 text-sm">Failed to load data</p>
                <button @click="refreshAttendances" class="px-4 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg">Try Again</button>
              </div>
              
              <div v-else-if="attendances.length === 0" class="py-16 text-center px-4">
                <p class="text-gray-900 font-bold mb-1 text-sm">No records found</p>
              </div>
              
              <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-50/80 border-b border-gray-200">
                      <th class="px-4 py-3 text-xs font-semibold text-gray-500">Date</th>
                      <th class="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                      <th class="px-4 py-3 text-xs font-semibold text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="attendance in paginatedAttendances" :key="attendance.id" class="active:bg-gray-50">
                      <td class="px-4 py-4 whitespace-nowrap">
                        <div class="font-medium text-gray-900 text-xs">{{ formatDate(attendance.date) }}</div>
                        <div class="text-[10px] text-gray-500 mt-0.5">{{ attendance.type }}</div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold"
                              :class="{
                                'bg-emerald-100 text-emerald-800': getStatusClass(attendance) === 'present' && attendance.status !== 'Leave',
                                'bg-yellow-100 text-yellow-800': getStatusClass(attendance) === 'office',
                                'bg-blue-100 text-blue-800': attendance.status === 'On Field',
                                'bg-purple-100 text-purple-800': attendance.status === 'Travel' || getStatusClass(attendance) === 'late',
                                'bg-emerald-100 text-emerald-800': attendance.status === 'Leave',
                                'bg-amber-100 text-amber-800': typeof attendance.status === 'string' && attendance.status.includes('Pending'),
                                'bg-red-100 text-red-800': getStatusClass(attendance) === 'absent' && !attendance.status.includes('Pending') && attendance.status !== 'Leave'
                              }">
                          <div class="w-1 h-1 rounded-full" :class="{'bg-emerald-500': getStatusClass(attendance) === 'present', 'bg-yellow-500': getStatusClass(attendance) === 'office', 'bg-blue-500': attendance.status === 'On Field', 'bg-purple-500': attendance.status === 'Travel', 'bg-emerald-500': attendance.status === 'Leave', 'bg-amber-500': typeof attendance.status === 'string' && attendance.status.includes('Pending'), 'bg-red-500': getStatusClass(attendance) === 'absent'}"></div>
                          {{ attendance.status || 'At Office' }}
                        </span>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-right">
                        <div class="flex items-center justify-end gap-1">
                          <button class="p-2 text-blue-400" @click="viewAttendance(attendance)" title="View Details">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          </button>
                          <button class="p-2 text-red-400 active:text-red-600" @click="openDeleteModal(attendance)" title="Archive Log">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div v-if="!loading && !error && attendances.length > 0" class="px-4 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div class="flex gap-2 w-full justify-between">
                  <button @click="prevPage" :disabled="currentPage === 1" class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 disabled:opacity-50">Prev</button>
                  <div class="flex items-center px-2 py-2 text-[10px] font-medium text-gray-700">Page {{ currentPage }} / {{ totalPages }}</div>
                  <button @click="nextPage" :disabled="currentPage >= totalPages" class="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 disabled:opacity-50">Next</button>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- DESKTOP VIEW -->
        <div v-else class="p-8 pb-8 max-w-full mx-auto space-y-6">
          <TableSkeleton v-if="loading" />
          <template v-else>
            <div class="flex justify-between items-center gap-4 mb-8">
            <div>
              <h2 class="text-3xl font-bold text-gray-900">Attendance Records</h2>
              <p class="text-sm text-gray-500 mt-1">Review your attendance history</p>
            </div>
            <div class="flex gap-3">
              <!-- Month/Year Selection -->
              <div class="relative" ref="filterToggleEl">
                <button @click="isFilterMenuOpen = !isFilterMenuOpen" class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm h-full whitespace-nowrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {{ months[selectedMonth] }} {{ selectedYear }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{'rotate-180': isFilterMenuOpen}" class="transition-transform duration-200 ml-1">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div v-if="isFilterMenuOpen" class="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-4 animate-[fadeIn_0.2s_ease-out]">
                  <div class="space-y-4">
                    <div>
                      <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1">Select Month</label>
                      <div class="grid grid-cols-3 gap-1">
                        <button v-for="(m, index) in months" :key="m" 
                                @click="selectedMonth = index; isFilterMenuOpen = false"
                                :class="selectedMonth === index ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-gray-600 hover:bg-gray-100'"
                                class="py-1.5 text-[11px] font-bold rounded-lg transition-all">
                          {{ m.slice(0, 3) }}
                        </button>
                      </div>
                    </div>
                    <div class="relative" ref="desktopYearDropdownRef">
                      <label class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block ml-1 text-[10px]">Select Year</label>
                      <button 
                        @click="isYearDropdownOpen = !isYearDropdownOpen"
                        type="button"
                        class="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all inline-flex items-center justify-between"
                      >
                        {{ selectedYear }}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="{'rotate-180': isYearDropdownOpen}" class="transition-transform duration-200">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </button>

                      <transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95"
                      >
                        <div v-if="isYearDropdownOpen" class="absolute top-full left-0 z-[120] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                          <div class="py-1">
                            <button 
                              v-for="y in years" 
                              :key="y"
                              type="button" 
                              @click="selectedYear = y; isYearDropdownOpen = false" 
                              class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-xs font-semibold"
                              :class="selectedYear === y ? 'bg-blue-50 text-blue-600' : 'text-gray-900'"
                            >
                              {{ y }}
                            </button>
                          </div>
                        </div>
                      </transition>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Search Filter -->
              <div class="relative max-w-xs w-full">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gray-400">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input type="text" v-model="searchQuery" placeholder="Search records..." class="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full transition-shadow h-full">
              </div>
            
              <div class="flex items-center gap-2">
                <button @click="exportDTR" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors shadow-sm" title="Export as DTR (Form 48)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  Export DTR
                </button>
  
                <button @click="refreshAttendances" class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6"></path>
                    <path d="M1 20v-6h6"></path>
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
                  </svg>
                  Refresh
                </button>
              </div>
            </div>
          </div>

          <!-- Main Panel (Desktop) -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            
            
            <div v-if="error" class="py-20 flex flex-col items-center justify-center text-center px-4">
              <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              </div>
              <p class="text-gray-900 font-bold mb-2">Failed to load data</p>
              <p class="text-gray-500 mb-6 max-w-md">{{ error }}</p>
              <button @click="refreshAttendances" class="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
            </div>
            
            <div v-else-if="attendances.length === 0" class="py-20 flex flex-col items-center justify-center text-center px-4">
              <div class="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <p class="text-gray-900 font-bold mb-1">No records found</p>
              <p class="text-gray-500">You don't have any attendance records yet.</p>
            </div>
            
            <div v-else class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 border-b border-gray-200">
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Time In</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Time Out</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
                    <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-for="attendance in paginatedAttendances" :key="attendance.id" class="hover:bg-blue-50/30 transition-colors group">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div v-if="typeof attendance.status === 'string' && attendance.status.includes('Leave') && attendance.leaveStartDate" class="font-medium text-gray-900 text-xs">
                        {{ formatDate(attendance.leaveStartDate) }} - {{ formatDate(attendance.leaveEndDate) }}
                      </div>
                      <div v-else>
                        <div class="font-medium text-gray-900">{{ formatDate(attendance.date) }}</div>
                        <div class="text-xs text-gray-500 mt-0.5" v-if="attendance.type">{{ attendance.type }} Shift</div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="attendance.status === 'Leave'" class="text-sm text-gray-400 font-medium">N/A</span>
                      <div v-else class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-100">
                        {{ formatTime(attendance.timeIn) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span v-if="attendance.status === 'Leave'" class="text-sm text-gray-400 font-medium">N/A</span>
                      <template v-else>
                        <div v-if="attendance.timeOut" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-orange-700 text-sm font-medium border border-orange-100">
                          {{ formatTime(attendance.timeOut) }}
                        </div>
                        <span v-else class="text-sm text-gray-400 italic">Not clocked out</span>
                      </template>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shrink-0"
                            :class="{
                              'bg-emerald-100 text-emerald-800': getStatusClass(attendance) === 'present' && attendance.status !== 'Leave',
                              'bg-yellow-100 text-yellow-800': getStatusClass(attendance) === 'office',
                              'bg-blue-100 text-blue-800': attendance.status === 'On Field',
                              'bg-purple-100 text-purple-800': attendance.status === 'Travel' || getStatusClass(attendance) === 'late',
                              'bg-emerald-100 text-emerald-800': attendance.status === 'Leave',
                              'bg-amber-100 text-amber-800': typeof attendance.status === 'string' && attendance.status.includes('Pending'),
                              'bg-red-100 text-red-800': getStatusClass(attendance) === 'absent' && !attendance.status.includes('Pending') && attendance.status !== 'Leave'
                            }">
                        <div class="w-1.5 h-1.5 rounded-full"
                             :class="{
                               'bg-emerald-500': getStatusClass(attendance) === 'present' && attendance.status !== 'Leave' && !(typeof attendance.status === 'string' && attendance.status.includes('Pending')),
                               'bg-yellow-500': getStatusClass(attendance) === 'office',
                               'bg-blue-500': attendance.status === 'On Field',
                               'bg-purple-500': attendance.status === 'Travel' || getStatusClass(attendance) === 'late',
                               'bg-emerald-500': attendance.status === 'Leave',
                               'bg-amber-500': typeof attendance.status === 'string' && attendance.status.includes('Pending'),
                               'bg-red-500': getStatusClass(attendance) === 'absent' && !attendance.status.includes('Pending') && attendance.status !== 'Leave'
                             }"></div>
                        {{ attendance.status || 'At Office' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="text-sm text-gray-600 line-clamp-2 max-w-xs" :title="formatLocation(attendance)">
                        {{ formatLocation(attendance) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" @click="viewAttendance(attendance)" title="View Details">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" @click="openDeleteModal(attendance)" title="Archive Log">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div v-if="!loading && !error && attendances.length > 0" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
              <span class="text-sm text-gray-500">
                Showing <span class="font-medium text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-medium text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredAttendances.length) }}</span> of <span class="font-medium text-gray-900">{{ filteredAttendances.length }}</span> records
              </span>
              
              <div class="flex gap-2">
                <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Previous
                </button>
                <div class="flex items-center gap-1">
                  <span class="px-3 py-2 text-sm font-medium text-gray-700">Page {{ currentPage }} of {{ totalPages || 1 }}</span>
                </div>
                <button @click="nextPage" :disabled="currentPage >= totalPages" class="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
          </template>
        </div>
      </div>
    </main>

    <!-- Overlay for Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 transition-opacity" @click.self="closeViewModal">
      <div class="bg-white rounded-2xl  w-full max-w-lg mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#133e75]">
          <h3 class="text-xl font-semibold text-white">Attendance Details</h3>
          
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <div v-if="selectedAttendance" class="space-y-6">
            <!-- Details Grid -->
            <div class="grid grid-cols-2 gap-y-5 gap-x-4">
              <div class="col-span-2 sm:col-span-1">
                <p class="text-xs font-semibold text-gray-400">Date</p>
                <p class="text-sm font-medium text-gray-900">{{ formatDate(selectedAttendance.date) }}</p>
              </div>

              <div class="col-span-2 sm:col-span-1" v-if="selectedAttendance.timeIn">
                <p class="text-xs font-semibold text-gray-400">Time In</p>
                <p class="text-sm font-medium text-emerald-600">{{ formatTime(selectedAttendance.timeIn) }}</p>
              </div>

              <div class="col-span-2 sm:col-span-1" v-if="selectedAttendance.timeOut">
                <p class="text-xs font-semibold text-gray-400">Time Out</p>
                <p class="text-sm font-medium text-red-600">{{ formatTime(selectedAttendance.timeOut) }}</p>
              </div>

              <div class="col-span-2 sm:col-span-1" v-if="selectedAttendance.type">
                <p class="text-xs font-semibold text-gray-400">Type</p>
                <p class="text-sm font-medium text-gray-900">{{ selectedAttendance.type }} {{ selectedAttendance.type !== 'Leave Application' && selectedAttendance.type !== 'Full Day' ? 'Shift' : '' }}</p>
              </div>

              <div class="col-span-2 sm:col-span-1">
                <p class="text-xs font-semibold text-gray-400">Status</p>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shrink-0 mt-1"
                      :class="{
                        'bg-emerald-100 text-emerald-800': getStatusClass(selectedAttendance) === 'present' && selectedAttendance.status !== 'Leave',
                        'bg-yellow-100 text-yellow-800': getStatusClass(selectedAttendance) === 'office',
                        'bg-blue-100 text-blue-800': selectedAttendance.status === 'On Field',
                        'bg-purple-100 text-purple-800': selectedAttendance.status === 'Travel' || getStatusClass(selectedAttendance) === 'late',
                        'bg-emerald-100 text-emerald-800': selectedAttendance.status === 'Leave',
                        'bg-amber-100 text-amber-800': typeof selectedAttendance.status === 'string' && selectedAttendance.status.includes('Pending'),
                        'bg-red-100 text-red-800': getStatusClass(selectedAttendance) === 'absent' && !(typeof selectedAttendance.status === 'string' && selectedAttendance.status.includes('Pending')) && selectedAttendance.status !== 'Leave'
                      }">
                  {{ selectedAttendance.status || 'At Office' }}
                </span>
              </div>

              <div class="col-span-2" v-if="selectedAttendance.address || selectedAttendance.location">
                <p class="text-xs font-semibold text-gray-400">Location</p>
                <p class="text-sm font-medium text-gray-900 leading-relaxed">{{ formatLocation(selectedAttendance) }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex justify-end">
          <button @click="closeViewModal" class="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors ">
            Close
          </button>
        </div>
      </div>
    </div>
    <!-- Delete Confirmation Modal -->
    <div v-if="isDeleteModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 transition-opacity" @click.self="closeDeleteModal">
      <div class="bg-white rounded-2xl w-full max-w-md mx-4 overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#133e75]">
          <h3 class="text-xl font-semibold text-white">Archive Log</h3>
        </div>
        
        <!-- Content -->
        <div class="p-6">
          <div v-if="attendanceToDelete" class="space-y-4">
            <p class="text-sm text-gray-600 font-medium">Are you sure you want to archive this attendance record?</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 flex justify-center gap-3">
          <button @click="closeDeleteModal" class="px-5 py-2.5 bg-gray-100  text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button @click="confirmArchive" class="px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-xl hover:bg-red-700 transition-colors">
            Confirm Archive
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import StaffSidebar from './StaffSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { useRouter } from 'vue-router'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore.js'
import { db } from '../../firebase.js'
import { doc, getDoc } from 'firebase/firestore'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const router = useRouter()
const staffAttendanceStore = useStaffAttendanceStore()

// Reactive data
const activeTab = ref('current')
const activeNav = ref('attendance-logs')

const avatarWrapEl = ref(null)
const avatarMenuOpen = ref(false)

const isFilterMenuOpen = ref(false)
const filterToggleEl = ref(null)
const mobileFilterToggleEl = ref(null)

const isYearDropdownOpen = ref(false)
const yearDropdownRef = ref(null)
const desktopYearDropdownRef = ref(null)

const isMobile = ref(false)
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const isViewModalOpen = ref(false)
const selectedAttendance = ref(null)

const isDeleteModalOpen = ref(false)
const attendanceToDelete = ref(null)

const selectedMonth = ref(new Date().getMonth())
const selectedYear = ref(new Date().getFullYear())
const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const years = computed(() => {
  const current = new Date().getFullYear()
  const start = current - 5
  const end = current + 1
  const result = []
  for (let i = end; i >= start; i--) result.push(i)
  return result
})

const userProfile = ref(null)

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

const fetchUserProfile = async () => {
  const id = getCurrentUserId()
  if (!id) {
    userProfile.value = null
    return
  }

  try {
    const snap = await getDoc(doc(db, 'users', String(id)))
    userProfile.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
  } catch (e) {
    console.error('Failed to load user profile from Firestore users collection:', e)
    userProfile.value = null
  }
}

const toggleAvatarMenu = () => {
  avatarMenuOpen.value = !avatarMenuOpen.value
}

const closeAvatarMenu = () => {
  avatarMenuOpen.value = false
}

const onDocClick = (e) => {
  // Close avatar menu if open
  if (avatarMenuOpen.value) {
    const root = avatarWrapEl.value
    if (root && !root.contains(e.target)) {
      closeAvatarMenu()
    }
  }
  
  // Close filter menu if open
  if (isFilterMenuOpen.value) {
    const filterRoot = filterToggleEl.value
    const mobileFilterRoot = mobileFilterToggleEl.value
    if ((filterRoot && !filterRoot.contains(e.target)) && (mobileFilterRoot && !mobileFilterRoot.contains(e.target))) {
      isFilterMenuOpen.value = false
    }
  }

  // Close year dropdown if open
  if (isYearDropdownOpen.value) {
    const yearRoot = yearDropdownRef.value
    const desktopYearRoot = desktopYearDropdownRef.value
    if ((yearRoot && !yearRoot.contains(e.target)) && (desktopYearRoot && !desktopYearRoot.contains(e.target))) {
      isYearDropdownOpen.value = false
    }
  }
}

const goToSettings = () => {
  closeAvatarMenu()
  router.push({ name: 'StaffSettings' })
}

const logout = () => {
  closeAvatarMenu()
  localStorage.removeItem('user')
  localStorage.removeItem('staffUser')
  router.push({ name: 'Login' })
}

// Computed properties - transform staff attendance data for display
const attendances = computed(() => {
  const staffAttendances = staffAttendanceStore.staffAttendances.filter(att => !att.isArchived)
  
  // Transform staff attendance data to match the table format
  const transformedAttendances = []
  
  staffAttendances.forEach(staffAttendance => {
    // 1. Always evaluate leave applications regardless of today's clock-ins.
    const isLeave = staffAttendance.validationStatus ? true : staffAttendance.staffStatus === 'Leave'
    let skipBaseLeavePush = false
    
    if (isLeave && staffAttendance.leaveStartDate && staffAttendance.leaveEndDate) {
      const isApproved = staffAttendance.validationStatus === 'Approved'
      const statusText = isApproved ? 'Leave (Approved)' : `Leave (${staffAttendance.validationStatus || 'Pending'})`
      
      transformedAttendances.push({
        id: staffAttendance.id + '_leave_app',
        date: staffAttendance.date,
        timeIn: null,
        timeOut: null,
        status: statusText,
        leaveStartDate: staffAttendance.leaveStartDate,
        leaveEndDate: staffAttendance.leaveEndDate,
        leaveDocumentUrl: staffAttendance.leaveDocumentUrl,
        type: 'Leave Application',
        originalId: staffAttendance.id
      })
      skipBaseLeavePush = true
    }

    // 2. Handle cases where the whole day defaults to a status ('Leave'/'Absent') WITHOUT any clock-ins.
    if ((staffAttendance.staffStatus === 'Leave' || staffAttendance.staffStatus === 'Absent') && !staffAttendance.timeInAM && !staffAttendance.timeInPM) {
      if (!skipBaseLeavePush) {
        transformedAttendances.push({
          id: staffAttendance.id + '_status',
          date: staffAttendance.date,
          timeIn: null,
          timeOut: null,
          status: staffAttendance.staffStatus,
          leaveStartDate: staffAttendance.leaveStartDate,
          leaveEndDate: staffAttendance.leaveEndDate,
          leaveDocumentUrl: staffAttendance.leaveDocumentUrl,
          type: 'Full Day',
          originalId: staffAttendance.id
        })
      }
      return
    }

    // Add AM attendance if exists
    if (staffAttendance.timeInAM) {
      transformedAttendances.push({
        id: staffAttendance.id + '_am',
        date: staffAttendance.date,
        timeIn: staffAttendance.timeInAM,
        timeOut: staffAttendance.timeOutAM,
        status: staffAttendance.staffStatusAM || staffAttendance.statusAM || (staffAttendance.staffStatus === 'Leave' ? 'Leave' : null),
        location: staffAttendance.LocAM || staffAttendance.locationAM,
        address: staffAttendance.LocAM?.address,
        photoUrl: staffAttendance.photoUrl,
        leaveStartDate: staffAttendance.leaveStartDate,
        leaveEndDate: staffAttendance.leaveEndDate,
        type: 'AM',
        originalId: staffAttendance.id
      })
    }
    
    // Add PM attendance if exists
    if (staffAttendance.timeInPM) {
      transformedAttendances.push({
        id: staffAttendance.id + '_pm',
        date: staffAttendance.date,
        timeIn: staffAttendance.timeInPM,
        timeOut: staffAttendance.timeOutPM,
        status: staffAttendance.staffStatusPM || staffAttendance.statusPM || (staffAttendance.staffStatus === 'Leave' ? 'Leave' : null),
        location: staffAttendance.LocPM || staffAttendance.locationPM,
        address: staffAttendance.LocPM?.address || staffAttendance.address,
        photoUrl: staffAttendance.photoUrl,
        leaveStartDate: staffAttendance.leaveStartDate,
        leaveEndDate: staffAttendance.leaveEndDate,
        type: 'PM',
        originalId: staffAttendance.id
      })
    }
  })
  
  // Sort by date (newest first)
  return transformedAttendances.sort((a, b) => new Date(b.date) - new Date(a.date))
})

const loading = computed(() => staffAttendanceStore.loading)
const error = computed(() => staffAttendanceStore.error)

// --- Pagination & Filtering State ---
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

const filteredAttendances = computed(() => {
  let filtered = attendances.value

  // Filter by Month and Year
  filtered = filtered.filter(att => {
    if (att.type === 'Leave Application' && att.leaveStartDate && att.leaveEndDate) {
      const start = new Date(att.leaveStartDate)
      const end = new Date(att.leaveEndDate)
      const filterStart = new Date(selectedYear.value, selectedMonth.value, 1)
      const filterEnd = new Date(selectedYear.value, selectedMonth.value + 1, 0, 23, 59, 59)
      
      return start <= filterEnd && end >= filterStart
    } else {
      if (!att.date) return false
      const d = new Date(att.date)
      return d.getMonth() === selectedMonth.value && d.getFullYear() === selectedYear.value
    }
  })

  if (!searchQuery.value) return filtered
  
  const query = searchQuery.value.toLowerCase()
  return filtered.filter(att => 
    (att.date && att.date.toLowerCase().includes(query)) ||
    (att.status && att.status.toLowerCase().includes(query)) ||
    (att.type && att.type.toLowerCase().includes(query)) ||
    (att.address && att.address.toLowerCase().includes(query))
  )
})

const totalPages = computed(() => Math.ceil(filteredAttendances.value.length / itemsPerPage.value))

const paginatedAttendances = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredAttendances.value.slice(start, end)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const getMonthYearString = () => {
  return `${months[selectedMonth.value]} ${selectedYear.value}`
}

const parseMilitaryTime = (timeStr) => {
  if (!timeStr) return ''

  let hours, mins
  const timeParts = timeStr.split(':')
  if (timeParts.length >= 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
    hours = parseInt(timeParts[0], 10)
    mins = parseInt(timeParts[1], 10)
  } else {
    const t = new Date(timeStr)
    if (!isNaN(t)) {
      hours = t.getHours()
      mins = t.getMinutes()
    } else {
      return timeStr // Pass-through if both fail
    }
  }

  const period = hours >= 12 ? 'pm' : 'am'
  
  // Convert 24h to 12h
  hours = hours % 12
  hours = hours ? hours : 12
  
  // Format mm
  mins = mins < 10 ? '0' + mins : mins
  return `${hours}:${mins} ${period}`
}

// Function to draw a single DTR Panel.
const drawDTRPanel = (doc, startX, width) => {
  const centerLine = startX + (width / 2)
  
  doc.setFont('times', 'italic')
  doc.setFontSize(8)
  doc.text('Civil Service Form No. 48', startX + 5, 12)
  
  doc.setFont('times', 'bold')
  doc.setFontSize(14)
  doc.text('DAILY TIME RECORD', centerLine, 18, { align: 'center' })
  
  // User Name
  const userFullName = userDisplayName.value || 'User Name'
  doc.setFontSize(11)
  doc.text(userFullName.toUpperCase(), centerLine, 24, { align: 'center' })
  
  // Dotted/dashed underline spanning full width
  doc.setLineWidth(0.3)
  if (typeof doc.setLineDashPattern === 'function') {
    doc.setLineDashPattern([1, 1], 0)
  } else if (typeof doc.setLineDash === 'function') {
    doc.setLineDash([1, 1], 0)
  }
  doc.line(startX + 5, 25, startX + width - 5, 25)
  if (typeof doc.setLineDashPattern === 'function') {
    doc.setLineDashPattern([], 0)
  } else if (typeof doc.setLineDash === 'function') {
    doc.setLineDash([], 0)
  }
  
  // (Name) label
  doc.setFont('times', 'bolditalic')
  doc.setFontSize(10)
  doc.text('(Name)', centerLine, 29, { align: 'center' })
  
  // Month text
  doc.setFont('times', 'italic')
  doc.setFontSize(9)
  doc.text('For the month of', startX + 5, 34)
  
  const lastDay = new Date(selectedYear.value, selectedMonth.value + 1, 0).getDate()
  const monthString = `${months[selectedMonth.value]} 1-${lastDay}                    ${selectedYear.value}`
  
  const underlineStart = startX + 29
  const underlineEnd = startX + width - 5
  const underlineWidth = underlineEnd - underlineStart
  
  doc.setFont('times', 'italic')
  doc.setFontSize(10)
  doc.text(monthString, underlineStart + underlineWidth / 2, 33, { align: 'center' })
  
  // Solid line underline
  doc.setLineWidth(0.3)
  doc.line(underlineStart, 34, underlineEnd, 34)
  
  // Official hours...
  doc.setFont('times', 'italic')
  doc.setFontSize(9)
  doc.text('Official hours of arrival', startX + 5, 39)
  doc.text('and departure', startX + 13, 43)
  
  doc.text('Regular Days', startX + (width - 40), 39)
  doc.line(startX + (width - 22), 39, startX + width - 5, 39)
  
  doc.text('Saturdays', startX + (width - 40), 43)
  doc.line(startX + (width - 22), 43, startX + width - 5, 43)
  
  // Prepare Table logic (1 to 31)
  const daysInMonth = 31 // Assume 31 for full form view or derive exact days based on month
  const tableDataArr = []
  
  // Convert filtered logs into a Date -> Log map for easy lookup
  const attendanceMap = {}
  filteredAttendances.value.forEach(record => {
    // 1. Expand leaves internally for the DTR only
    if (record.type === 'Leave Application' && record.status === 'Leave (Approved)' && record.leaveStartDate && record.leaveEndDate) {
      let current = new Date(record.leaveStartDate)
      const end = new Date(record.leaveEndDate)
      while (current <= end) {
        if (!isNaN(current) && current.getMonth() === selectedMonth.value && current.getFullYear() === selectedYear.value) {
          const dayNum = current.getDate()
          if (!attendanceMap[dayNum]) attendanceMap[dayNum] = {}
          attendanceMap[dayNum]['AM'] = { timeIn: 'Leave', timeOut: 'Leave' }
          attendanceMap[dayNum]['PM'] = { timeIn: 'Leave', timeOut: 'Leave' }
        }
        current.setDate(current.getDate() + 1)
      }
    } else if (record.date) {
      // 2. Normal processing
      const d = new Date(record.date)
      if (!isNaN(d)) {
        const dayNum = d.getDate()
        if (!attendanceMap[dayNum]) attendanceMap[dayNum] = {}
        // Set standard AM/PM, ignore pure applications unless explicitly mapped
        if (record.type === 'AM' || record.type === 'PM' || record.type === 'Afternoon') {
          const normalizedType = record.type === 'Afternoon' ? 'PM' : record.type
          attendanceMap[dayNum][normalizedType] = {
             timeIn: record.timeIn,
             timeOut: record.timeOut
          }
        }
      }
    }
  })

  // Detect exact month/year
  const refYear = selectedYear.value
  const refMonth = selectedMonth.value

  for (let i = 1; i <= daysInMonth; i++) {
    const curDate = new Date(refYear, refMonth, i)
    const isSaturday = curDate.getDay() === 6
    const isSunday = curDate.getDay() === 0
    // Skip extra days if month < 31
    if (curDate.getMonth() !== refMonth) {
      tableDataArr.push([i.toString(), '', '', '', '', '', '']) // Exceeds month, blank
      continue
    }

    if (isSaturday) {
      tableDataArr.push([{ content: i.toString() }, { content: 'Saturday', colSpan: 4, styles: { align: 'center', textColor: [0, 0, 0] } }, '', ''])
    } else if (isSunday) {
      tableDataArr.push([{ content: i.toString() }, { content: 'Sunday', colSpan: 4, styles: { align: 'center', textColor: [0, 0, 0] } }, '', ''])
    } else {
      // Normal Weekday row
      const logs = attendanceMap[i] || {}
      
      const formatTimeOrStatus = (val) => {
        if (!val) return ''
        if (val === 'LEAVE') return 'LEAVE'
        return parseMilitaryTime(val)
      }

      const amIn = formatTimeOrStatus(logs['AM']?.timeIn)
      const amOut = formatTimeOrStatus(logs['AM']?.timeOut)
      const pmIn = formatTimeOrStatus(logs['PM']?.timeIn)
      const pmOut = formatTimeOrStatus(logs['PM']?.timeOut)
      
      tableDataArr.push([i.toString(), amIn, amOut, pmIn, pmOut, '', ''])
    }
  }
  
  // Add Total Row
  tableDataArr.push([{ content: 'Total', styles: { fontStyle: 'bold', halign: 'center' } }, '', '', '', '', '', ''])

  // AutoTable Config for custom nested headers
  autoTable(doc, {
    margin: { left: startX + 5 },
    tableWidth: width - 10,
    startY: 47,
    theme: 'plain',
    styles: { 
      fontSize: 7, 
      cellPadding: 1, 
      lineColor: [0, 0, 0], 
      lineWidth: 0.2, 
      halign: 'center', 
      valign: 'middle',
      font: 'times'
    },
    headStyles: { fontStyle: 'bold' },
    columns: [
      { header: 'Day', dataKey: 'day' },
      { header: 'Arrival', dataKey: 'am_arr' },
      { header: 'Departure', dataKey: 'am_dep' },
      { header: 'Arrival', dataKey: 'pm_arr' },
      { header: 'Departure', dataKey: 'pm_dep' },
      { header: 'Hours', dataKey: 'ut_hrs' },
      { header: 'Minutes', dataKey: 'ut_min' },
    ],
    // The trick to span subheaders
    head: [
       [
         { content: 'Day', rowSpan: 2, styles: { valign: 'middle' } },
         { content: 'A.M.', colSpan: 2 },
         { content: 'P.M.', colSpan: 2 },
         { content: 'Undertime', colSpan: 2 },
       ],
       ['Arrival', 'Departure', 'Arrival', 'Departure', 'Hours', 'Minutes']
    ],
    body: tableDataArr,
    didDrawCell: function(data) {
       // Allow overriding specific cell styles dynamically if necessary
    }
  })
  
  const finalY = doc.lastAutoTable.finalY || 240
  
  // Footer 1 - Certification paragraph
  doc.setFontSize(8)
  doc.setFont('times', 'italic')
  const certText = "I CERTIFY on my honor that the above is a true and correct report of the hours of work performed, record of which was made daily at the time of arrival and departure from office."
  // SplitTextToSize ensures the paragraph wraps within the panel
  const splitCert = doc.splitTextToSize(certText, width - 10)
  doc.text(splitCert, centerLine, finalY + 5, { align: 'center' })
  
  // Signature Lines
  const finalSigY = finalY + 30
  
  // Staff Signature
  doc.setFontSize(10)
  doc.setFont('times', 'bold')
  doc.text(userFullName.toUpperCase(), centerLine, finalSigY, { align: 'center' })
  
  // Dashed line
  doc.setLineWidth(0.3)
  if (typeof doc.setLineDashPattern === 'function') doc.setLineDashPattern([1, 1], 0)
  else if (typeof doc.setLineDash === 'function') doc.setLineDash([1, 1], 0)
  doc.line(startX + 5, finalSigY + 1.5, startX + width - 5, finalSigY + 1.5)
  if (typeof doc.setLineDashPattern === 'function') doc.setLineDashPattern([], 0)
  else if (typeof doc.setLineDash === 'function') doc.setLineDash([], 0)
  
  // OJT Intern
  doc.setFontSize(9)
  doc.setFont('times', 'normal')
  doc.text('OJT Intern', centerLine, finalSigY + 5, { align: 'center' })
  
  // Thick Solid Line
  doc.setLineWidth(1.0)
  doc.line(startX + 5, finalSigY + 7, startX + width - 5, finalSigY + 7)
  
  // Officer Signature
  const officerY = finalSigY + 22
  doc.setFontSize(10)
  doc.setFont('times', 'bold')
  doc.text('ENGR. MARVIN D. BEJASA', centerLine, officerY, { align: 'center' })
  
  // Thick Solid Line
  doc.setLineWidth(1.0)
  doc.line(startX + 5, officerY + 2, startX + width - 5, officerY + 2)
  
  // OIC- Provincial Officer
  doc.setFontSize(9)
  doc.setFont('times', 'normal')
  doc.text('OIC- Provincial Officer', centerLine, officerY + 6, { align: 'center' })
  
  // In-Charge
  doc.setFontSize(9)
  doc.setFont('times', 'italic')
  doc.text('In-Charge', centerLine, officerY + 10, { align: 'center' })
}

const exportDTR = () => {
  // Use jsPDF directly, default is portrait, A4. (210 x 297 mm)
  const doc = new jsPDF('portrait', 'mm', 'a4')
  
  const pageWidth = doc.internal.pageSize.getWidth() // 210
  const panelWidth = pageWidth / 2 // 105 per panel
  
  // Draw left panel
  drawDTRPanel(doc, 0, panelWidth)
  
  // Draw right panel with offset
  drawDTRPanel(doc, panelWidth, panelWidth)

  // Set the PDF to automatically open the print dialog when opened
  doc.autoPrint()
  
  // Create a blob URL to open in a new tab for printing, or just save it
  const blob = doc.output('bloburl')
  window.open(blob, '_blank')
}
// --- End Pagination & Filtering ---

// Navigation function
const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

// Fetch attendances
const fetchAttendances = async () => {
  try {
    const staffId = getCurrentUserId()
    if (!staffId) return
    await staffAttendanceStore.getStaffAttendancesByStaffId(staffId)
  } catch (err) {
    console.error('Failed to fetch attendances:', err)
  }
}

// Refresh attendances
const refreshAttendances = () => {
  fetchAttendances()
}

// Format date
const formatDate = (date) => {
  if (!date) return 'N/A'
  
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date.trim())) {
    const [year, month, day] = date.split('-').map(Number)
    const dateObj = new Date(year, month - 1, day)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  let dateObj = null
  if (date?.toDate) {
    dateObj = date.toDate()
  } else if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string') {
    dateObj = new Date(date)
  }
  
  if (!dateObj) return 'N/A'
  
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Format location
const formatLocation = (attendance) => {
  if (attendance.address) return attendance.address
  if (typeof attendance.location === 'string') return attendance.location
  if (attendance.location?.address) return attendance.location.address
  return 'N/A'
}

// Format time
const formatTime = (time) => {
  if (!time) return 'N/A'
  
  if (typeof time === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(time.trim())) {
    const parts = time.trim().split(':')
    const hours = parseInt(parts[0], 10)
    const minutes = parseInt(parts[1], 10)
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${displayHours}:${displayMinutes} ${ampm}`
  }

  let timeObj = null
  if (time?.toDate) {
    timeObj = time.toDate()
  } else if (time instanceof Date) {
    timeObj = time
  } else if (typeof time === 'string') {
    const parsed = new Date(time)
    if (!isNaN(parsed.getTime())) {
      timeObj = parsed
    }
  }
  
  if (!timeObj || isNaN(timeObj.getTime())) return 'N/A'
  
  return timeObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get status class
const getStatusClass = (attendance) => {
  const status = attendance.status?.toLowerCase() || 'office'
  switch (status) {
    case 'at office':
    case 'office':
      return 'office'
    case 'on field':
    case 'field':
      return 'present'
    case 'absent':
      return 'absent'
    case 'travel':
      return 'late'
    default:
      if (status.includes('leave')) return 'absent'
      return 'present'
  }
}

// View attendance details
const viewAttendance = (attendance) => {
  selectedAttendance.value = attendance
  isViewModalOpen.value = true
}

const closeViewModal = () => {
  isViewModalOpen.value = false
  selectedAttendance.value = null
}

// Delete/Archive modal
const openDeleteModal = (attendance) => {
  attendanceToDelete.value = attendance
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  attendanceToDelete.value = null
}

// Archive attendance execution
const confirmArchive = async () => {
  if (!attendanceToDelete.value) return
  
  try {
    await staffAttendanceStore.archiveStaffAttendance(attendanceToDelete.value.originalId)
    showNotification('Attendance log archived successfully!', 'success')
    closeDeleteModal()
    await fetchAttendances()
  } catch (err) {
    console.error('Failed to archive:', err)
    showNotification('Failed to archive log', 'error')
  }
}

// Show notification
const showNotification = (message, type = 'info') => {
  const notification = document.createElement('div')
  notification.className = `notification notification-${type}`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 3000)
}

// Lifecycle
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  document.addEventListener('click', onDocClick)
  fetchUserProfile()
  fetchAttendances()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('click', onDocClick)
})
</script>
