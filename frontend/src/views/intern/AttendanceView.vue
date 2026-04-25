<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex p-2 md:p-3 lg:p-4 gap-3">
    
    <!-- Left Sidebar Navbar -->
    <aside class="w-[280px] bg-[#133e75] hidden lg:flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-2rem)] rounded-2xl shrink-0 shadow-sm sticky top-2 md:top-3 lg:top-4 overflow-y-auto custom-scrollbar">
      <div class="px-8 py-8 shrink-0">
        <div class="flex items-center gap-3 mb-6">
          <img src="/4.png" alt="Logo" class="h-10 w-auto object-contain" />
          <h1 class="m-0 text-2xl font-bold text-white">ATTENDICT</h1>
        </div>
        <nav class="flex flex-col gap-2">
          <router-link to="/intern/dashboard" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/dashboard' ? icons.dashboardActive : icons.dashboardInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/dashboard' ? icons.dashboardActive : icons.dashboardInactive, maskSize: 'cover' }"></span> Dashboard
          </router-link>
          <router-link to="/intern/time" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.time, WebkitMaskSize: 'cover', maskImage: icons.time, maskSize: 'cover' }"></span> Time In/Out
          </router-link>
          <router-link to="/intern/attendance" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/attendance' ? icons.attendanceActive : icons.attendanceInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/attendance' ? icons.attendanceActive : icons.attendanceInactive, maskSize: 'cover' }"></span> My Attendance
          </router-link>
          <router-link to="/intern/staff-status" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/staff-status' ? icons.staffActive : icons.staffInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/staff-status' ? icons.staffActive : icons.staffInactive, maskSize: 'cover' }"></span> Staff Status
          </router-link>
          <router-link to="/intern/notifications" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center justify-between group">
            <div class="flex items-center gap-3">
              <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/notifications' ? icons.notificationActive : icons.notificationInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/notifications' ? icons.notificationActive : icons.notificationInactive, maskSize: 'cover' }"></span> 
              Notification
            </div>
            <span v-if="unreadCount > 0" class="bg-red-500 text-white rounded-full text-[10px] px-2 py-0.5 min-w-[20px] text-center shadow-sm font-bold group-hover:bg-red-600 transition-colors">{{ unreadCount }}</span>
          </router-link>
        
          <button type="button" @click="confirmLogout" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-red-500/20 hover:text-red-100 border border-transparent flex items-center gap-3 cursor-pointer w-full text-left bg-transparent mt-auto mt-4">
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.logout, WebkitMaskSize: 'cover', maskImage: icons.logout, maskSize: 'cover' }"></span> Logout
          </button>
        </nav>
      </div>


    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 w-full flex flex-col  min-w-0">
      
      <!-- Mobile Header Fallback -->
      <header class="px-4 py-5 flex items-center sticky top-0 z-20 bg-gray-50 lg:hidden rounded-2xl">
        <button @click="$router.back()" class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="flex-1 text-center pr-7">
          <h1 class="m-0 text-black font-semibold text-xl tracking-wide whitespace-nowrap">My Attendance</h1>
        </div>
      </header>

      <!-- Content Container -->
      <div class="flex-1 w-full flex flex-col overflow-y-auto custom-scrollbar">
        
        <!-- Top Header Bar (Desktop Only) -->
        <header class="hidden lg:flex p-2 items-center justify-between shrink-0">
          <div class="flex items-center gap-2 pl-2">
            <button @click="$router.back()" class="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-0">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76'/%3E%3C/svg%3E" alt="Back" class="w-[22px] h-[22px] opacity-70" />
            </button>
            <h1 class="m-0 text-3xl font-semibold text-gray-900">My Attendance Records</h1>
          </div>
          <div class="flex items-center gap-3 pr-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden shadow-sm cursor-pointer transition-all" @click="$router.push('/intern/profile')">
               <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
               <span v-else>{{ avatarInitials }}</span>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="w-full flex flex-col pb-8">
          <template v-if="isInitialLoading">
            <!-- SKELETON -->
            <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-4 md:p-6 mx-4 mt-4 mb-4 animate-pulse">
              <div class="h-5 bg-slate-200 rounded w-1/4 mb-4 hidden md:block"></div>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-end">
                <div class="col-span-2 md:col-span-1"><div class="h-4 bg-slate-200 rounded w-1/2 mb-1.5"></div><div class="h-[42px] bg-slate-200 rounded-lg"></div></div>
                <div class="col-span-1"><div class="h-4 bg-slate-200 rounded w-1/2 mb-1.5"></div><div class="h-[42px] bg-slate-200 rounded-lg"></div></div>
                <div class="col-span-1"><div class="h-4 bg-slate-200 rounded w-1/2 mb-1.5"></div><div class="h-[42px] bg-slate-200 rounded-lg"></div></div>
                <div class="col-span-2 md:col-span-1 mt-2 md:mt-0"><div class="h-[46px] bg-slate-200 rounded-xl"></div></div>
              </div>
            </section>
            
            <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-0 md:p-6 overflow-hidden mx-4 mb-4 animate-pulse">
              <div class="h-5 bg-slate-200 rounded w-1/4 mb-4 hidden md:block mx-6 mt-6"></div>
              <!-- Desktop -->
              <div class="hidden md:block overflow-x-auto px-6 pb-6">
                <div class="h-10 bg-slate-50 w-full mb-2"></div>
                <div v-for="i in 5" :key="i" class="h-12 bg-slate-100 w-full mb-2 rounded"></div>
              </div>
              <!-- Mobile -->
              <div class="md:hidden flex flex-col divide-y divide-gray-100">
                <div v-for="i in 5" :key="i" class="px-4 py-4 w-full flex justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-200"></div>
                    <div class="h-4 w-16 bg-slate-200 rounded"></div>
                  </div>
                  <div class="h-4 w-24 bg-slate-200 rounded mt-2"></div>
                </div>
              </div>
            </section>
          </template>

          <template v-else>
            <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-4 md:p-6 mx-4 mt-4 mb-4">

        <h2 class="hidden md:block mt-0 mb-4 text-[1.1rem] text-slate-900 border-b border-slate-100 pb-2">Filters</h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-end">
          <div class="col-span-2 md:col-span-1 relative">
            <label for="month" class="block mb-1.5 text-sm text-slate-600 font-medium">Month</label>
            <button 
              type="button"
              @click="showMonthDropdown = !showMonthDropdown"
              class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white h-[42px] flex justify-between items-center text-left"
            >
              <span :class="selectedMonth ? 'text-slate-900' : 'text-slate-500'">
                {{ selectedMonthLabel || 'All Months' }}
              </span>
              <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showMonthDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            <!-- Backdrop -->
            <div v-if="showMonthDropdown" @click="showMonthDropdown = false" class="fixed inset-0 z-40"></div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div v-if="showMonthDropdown" class="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                <div class="py-1">
                  <button 
                    type="button" 
                    @click="selectMonth('')" 
                    class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm"
                    :class="selectedMonth === '' ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'"
                  >
                    All Months
                  </button>
                  <button 
                    v-for="m in availableMonths" 
                    :key="m.value"
                    type="button" 
                    @click="selectMonth(m.value)" 
                    class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-sm"
                    :class="selectedMonth === m.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'"
                  >
                    {{ m.label }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
          <div class="col-span-1 md:col-span-1">
            <label for="from" class="block mb-1.5 text-sm text-slate-600 font-medium">From</label>
            <input id="from" type="date" v-model="fromDate" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white h-[42px]" />
          </div>
          <div class="col-span-1 md:col-span-1">
            <label for="to" class="block mb-1.5 text-sm text-slate-600 font-medium">To</label>
            <input id="to" type="date" v-model="toDate" class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white h-[42px]" />
          </div>
          <div class="col-span-2 md:col-span-1 mt-2 md:mt-0">
            <button class="w-full h-[46px] rounded-xl border-none bg-[#eebb3b] text-white text-base font-semibold cursor-pointer transition-all active:scale-[0.98]" @click="exportPdf">Download DTR</button>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-[0_10px_25_rgba(15,23,42,0.08)] p-0 md:p-6 overflow-hidden mx-4 mb-4">
        <h2 class="hidden md:block mt-0 mb-4 text-[1.1rem] text-slate-900 border-b border-slate-100 pb-2">Attendance</h2>
        
        <!-- Desktop Table View -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50">
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Date</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Time In</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Time Out</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Total Hours</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Tag</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Validation</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in paginatedRecords" :key="record.id + '-' + (record.sessionLabel || 'all')" class="hover:bg-slate-50/50 transition-colors cursor-pointer" @click="openDetailsModal(record)">
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatTime12h(record.timeIn) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatTime12h(record.timeOut) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-900 font-medium">{{ record.totalHoursLabel || '0h 0m' }}</td>
                <td class="px-4 py-3 border-b border-slate-100">
                  <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', record.status === 'Overtime' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200']">
                    {{ record.status }}
                  </span>
                </td>
                <td class="px-4 py-3 border-b border-slate-100">
                  <span :class="[
                    'inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-semibold border',
                    (record.validationStatus || 'Pending') === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                    (record.validationStatus || 'Pending') === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  ]">
                    {{ record.validationStatus || 'Pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Accordion View -->
        <div class="md:hidden flex flex-col divide-y divide-gray-100 ">
          <div v-for="record in paginatedRecords" :key="'mob-' + record.id + '-' + (record.sessionLabel || 'all')" class="flex flex-col">
            <div 
              class="flex items-center justify-between pt-2.5 pb-1 px-4 bg-white cursor-pointer transition-colors active:bg-gray-50"
              @click="toggleRow(record.id, record.sessionLabel)"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform"
                  :class="[isRowExpanded(record.id, record.sessionLabel) ? 'bg-[#133e75] text-white rotate-180' : 'bg-[#133e75] text-white']"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-sm text-gray-900 font-semibold">Date</span>
                </div>
              </div>
              <span class="text-sm text-gray-600">{{ formatDate(record.date) }}</span>
            </div>

            <!-- Expanded Details -->
            <div 
              v-show="isRowExpanded(record.id, record.sessionLabel)" 
              class="bg-white px-3 pb-2.5 flex flex-col overflow-hidden transition-all duration-300"
            >
              <div class="pl-12 flex flex-col gap-2.5">
                <div class="flex items-center justify-between text-gray-800">
                  <span class="text-sm font-semibold">Time in</span>
                  <span class="text-sm text-gray-600">{{ formatTime12h(record.timeIn) }}</span>
                </div>
                <div class="flex items-center justify-between text-gray-800">
                  <span class="text-sm font-semibold">Time out</span>
                  <span class="text-sm text-gray-600">{{ formatTime12h(record.timeOut) }}</span>
                </div>
                <div class="flex items-center justify-between text-gray-800">
                  <span class="text-sm font-semibold">Totals hours</span>
                  <span class="text-sm text-gray-600">{{ record.totalHoursLabel || '0h 0m' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold">Tag</span>
                  <span :class="[
                    'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold',
                    record.status === 'Overtime' ? 'bg-red-500 text-white' : 'bg-[#00c853] text-white'
                  ]">
                    {{ record.status }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-semibold">Validation</span>
                  <span :class="[
                    'inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold',
                    (record.validationStatus || 'Pending') === 'Pending' ? 'bg-amber-500 text-white' :
                    (record.validationStatus || 'Pending') === 'Approved' ? 'bg-[#00c853] text-white' :
                    'bg-red-500 text-white'
                  ]">
                    {{ record.validationStatus || 'Pending' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-row justify-between items-center mt-4 md:mt-6 pt-4 px-4 md:px-0 border-t border-slate-200 gap-4 mb-4" v-if="tableRecords.length > 0">
          <div class="flex items-center gap-2 text-[0.75rem] md:text-[0.85rem] text-slate-600 relative">
            <span class="hidden md:inline">Showing</span>
            <span class="md:hidden">Showing</span>
            
            <div class="relative">
              <button 
                type="button"
                @click="showItemsPerPageDropdown = !showItemsPerPageDropdown"
                class="min-w-[50px] px-2 py-1 rounded-md border border-slate-200 text-slate-900 bg-white flex items-center justify-between gap-1"
              >
                <span>{{ itemsPerPage }}</span>
                <svg class="w-3 h-3 text-gray-400" :class="{ 'rotate-180': showItemsPerPageDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>

              <!-- Backdrop -->
              <div v-if="showItemsPerPageDropdown" @click="showItemsPerPageDropdown = false" class="fixed inset-0 z-40"></div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-if="showItemsPerPageDropdown" class="absolute top-full mt-1 left-0 z-50 min-w-full bg-white border border-gray-200 rounded-md shadow-lg py-1">
                  <button 
                    v-for="count in [10, 15, 20, 25, 30]" 
                    :key="count"
                    type="button" 
                    @click="selectItemsPerPage(count)" 
                    class="w-full px-4 py-1.5 text-left hover:bg-gray-50 transition-colors duration-150 text-sm"
                    :class="itemsPerPage === count ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-900'"
                  >
                    {{ count }}
                  </button>
                </div>
              </transition>
            </div>
            
            <span class="whitespace-nowrap">records per page</span>
          </div>

          <div class="flex items-center gap-2 md:gap-4">
            <button 
              class="w-8 h-8 rounded-full border-none bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed" 
              :disabled="currentPage === 1" 
              @click="currentPage--"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span class="hidden md:inline text-[0.85rem] text-slate-600 font-medium whitespace-nowrap">Page {{ currentPage }} of {{ totalPages }}</span>
            <button 
              class="w-8 h-8 rounded-full border-none bg-[#133e75] text-white flex items-center justify-center cursor-pointer transition-colors hover:bg-[#0d2b52] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm" 
              :disabled="currentPage === totalPages" 
              @click="currentPage++"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </section>
      </template>
    </main>
      </div>
      
      <!-- Mobile Bottom Navigation -->
      <nav class="lg:hidden shrink-0 h-[72px] bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-2 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] sticky bottom-0 rounded-2xl mt-auto">
        <router-link to="/intern/dashboard" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50">
          <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/dashboard' ? icons.dashboardActive : icons.dashboardInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/dashboard' ? icons.dashboardActive : icons.dashboardInactive, maskSize: 'cover' }"></span>
        </router-link>
        <router-link to="/intern/attendance" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50">
          <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/attendance' ? icons.attendanceActive : icons.attendanceInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/attendance' ? icons.attendanceActive : icons.attendanceInactive, maskSize: 'cover' }"></span>
        </router-link>
        <router-link to="/intern/time" class="flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 bg-[#133e75] text-white shadow-[0_8px_20px_rgba(19,62,117,0.4)] border-[6px] border-gray-50 active:scale-90 -mt-10 z-[110]">
          <span class="w-8 h-8 bg-current inline-block" :style="{ WebkitMaskImage: icons.time, WebkitMaskSize: 'cover', maskImage: icons.time, maskSize: 'cover' }"></span>
        </router-link>
        <router-link to="/intern/staff-status" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50">
          <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/staff-status' ? icons.staffActive : icons.staffInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/staff-status' ? icons.staffActive : icons.staffInactive, maskSize: 'cover' }"></span>
        </router-link>
        <router-link to="/intern/notifications" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50 relative">
          <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: $route.path === '/intern/notifications' ? icons.notificationActive : icons.notificationInactive, WebkitMaskSize: 'cover', maskImage: $route.path === '/intern/notifications' ? icons.notificationActive : icons.notificationInactive, maskSize: 'cover' }"></span>
          <span v-if="unreadCount > 0" class="absolute top-1 right-1 bg-red-500 text-white rounded-full text-[10px] px-1 py-0 min-w-[16px] text-center shadow-sm font-bold">{{ unreadCount }}</span>
        </router-link>
      </nav>
    </main>

    <!-- Record Details Modal -->
    <div v-if="showDetailsModal && selectedRecord" class="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeDetailsModal"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all">
        <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 class="text-lg font-semibold text-slate-800 m-0">Attendance Details</h3>
          <button @click="closeDetailsModal" class="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer bg-transparent border-none">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6 flex flex-col gap-4">
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Date</span>
            <span class="text-slate-900 font-medium">{{ formatDate(selectedRecord.date) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3" v-if="selectedRecord.sessionLabel">
            <span class="text-slate-500 text-sm font-medium">Session</span>
            <span class="text-slate-900 font-medium">{{ selectedRecord.sessionLabel }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Time In</span>
            <span class="text-slate-900">{{ formatTime12h(selectedRecord.timeIn) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Time Out</span>
            <span class="text-slate-900">{{ formatTime12h(selectedRecord.timeOut) }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Total Hours</span>
            <span class="text-slate-900 font-medium">{{ selectedRecord.totalHoursLabel || '0h 0m' }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Tag</span>
            <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', selectedRecord.status === 'Overtime' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200']">
              {{ selectedRecord.status }}
            </span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-100 pb-3">
            <span class="text-slate-500 text-sm font-medium">Validation</span>
            <span :class="[
              'inline-flex items-center w-fit px-2.5 py-1 rounded-full text-xs font-semibold border',
              (selectedRecord.validationStatus || 'Pending') === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
              (selectedRecord.validationStatus || 'Pending') === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
              'bg-red-100 text-red-800 border-red-200'
            ]">
              {{ selectedRecord.validationStatus || 'Pending' }}
            </span>
          </div>
          <div v-if="(selectedRecord.validationStatus || 'Pending') === 'Rejected' && selectedRecord.rejectReason" class="flex flex-col gap-2 bg-red-50 p-4 rounded-xl border border-red-100 mt-2">
            <span class="text-red-800 text-sm font-semibold flex items-center gap-1.5">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Reason for Rejection
            </span>
            <span class="text-[0.9rem] text-red-700 leading-relaxed">
              {{ selectedRecord.rejectReason }}
            </span>
          </div>
        </div>
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button @click="closeDetailsModal" class="px-5 py-2.5 rounded-full border-none bg-slate-800 text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-slate-700">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternAttendanceView',
  data() {
    return {
      selectedMonth: '',
      fromDate: '',
      toDate: '',
      records: [],
      notifications: [],
      internId: null,
      showNotifications: false,
      currentPage: 1,
      itemsPerPage: 10,
      showDetailsModal: false,
      showMonthDropdown: false,
      showItemsPerPageDropdown: false,
      selectedRecord: null,
      expandedRows: [], // Track expanded records in mobile view
      icons: {
        logout: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9'/%3E%3C/svg%3E\")",
        dashboardInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7'/%3E%3Cpath d='M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6'/%3E%3C/g%3E%3C/svg%3E\")",
        dashboardActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m12.707 2.293l9 9c.63.63.184 1.707-.707 1.707h-1v6a3 3 0 0 1-3 3h-1v-7a3 3 0 0 0-2.824-2.995L13 12h-2a3 3 0 0 0-3 3v7H7a3 3 0 0 1-3-3v-6H3c-.89 0-1.337-1.077-.707-1.707l9-9a1 1 0 0 1 1.414 0M13 14a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883-.993L11 14z'/%3E%3C/svg%3E\")",
        time: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0'/%3E%3Cpath d='M12 7v5l3 3'/%3E%3C/g%3E%3C/svg%3E\")",
        attendanceInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23000' stroke-linejoin='round' d='M3.5 4.5v-2h9V6m-10 2h11m-11-3.5v8h11V6h-6L6 4.5z' stroke-width='1'/%3E%3C/svg%3E\")",
        attendanceActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v3h.5a.5.5 0 0 1 .5.5v6.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5H3zM3 5v2.5h10v-1H7.5a.5.5 0 0 1-.354-.146L5.793 5zm9 .5V3H4v1h2a.5.5 0 0 1 .354.146L7.707 5.5z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
        staffInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3Cpath d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/svg%3E\")",
        staffActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='SVGgA8a3bBK'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23fff' stroke='%23fff' d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2'/%3E%3Cpath stroke='%23fff' d='m30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23000' stroke='%23000'/%3E%3Cpath stroke='%23000' d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23SVGgA8a3bBK)'/%3E%3C/svg%3E\")",
        notificationInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M5 9a7 7 0 0 1 14 0v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 18h-3.964a4.002 4.002 0 0 1-7.748 0H4.162a1.1 1.1 0 0 1-.984-1.592L5 12.764zm5.268 9a2 2 0 0 0 3.464 0zM12 4a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 16h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V9a5 5 0 0 0-5-5'/%3E%3C/g%3E%3C/svg%3E\")",
        notificationActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M12 2a7 7 0 0 0-7 7v3.528a1 1 0 0 1-.105.447l-1.717 3.433A1.1 1.1 0 0 0 4.162 18h15.676a1.1 1.1 0 0 0 .984-1.592l-1.716-3.433a1 1 0 0 1-.106-.447V9a7 7 0 0 0-7-7m0 19a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 12 21'/%3E%3C/g%3E%3C/svg%3E\")",
        settings: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='m20.35 8.923l-.366-.204l-.113-.064a2 2 0 0 1-.67-.66c-.018-.027-.034-.056-.066-.112a2 2 0 0 1-.3-1.157l.006-.425c.012-.68.018-1.022-.078-1.328a2 2 0 0 0-.417-.736c-.214-.24-.511-.412-1.106-.754l-.494-.285c-.592-.341-.889-.512-1.204-.577a2 2 0 0 0-.843.007c-.313.07-.606.246-1.191.596l-.003.002l-.354.211c-.056.034-.085.05-.113.066c-.278.155-.588.24-.907.25c-.032.002-.065.002-.13.002l-.13-.001a2 2 0 0 1-.91-.252c-.028-.015-.055-.032-.111-.066l-.357-.214c-.589-.354-.884-.53-1.199-.601a2 2 0 0 0-.846-.006c-.316.066-.612.238-1.205.582l-.003.001l-.488.283l-.005.004c-.588.34-.883.512-1.095.751a2 2 0 0 0-.415.734c-.095.307-.09.649-.078 1.333l.007.424c0 .065.003.097.002.128a2 2 0 0 1-.301 1.027c-.033.056-.048.084-.065.11a2 2 0 0 1-.675.664l-.112.063l-.361.2c-.602.333-.903.5-1.121.738a2 2 0 0 0-.43.73c-.1.307-.1.65-.099 1.338l.002.563c.001.683.003 1.024.104 1.329a2 2 0 0 0 .427.726c.218.236.516.402 1.113.734l.358.199c.061.034.092.05.121.068a2 2 0 0 1 .74.781l.067.12a2 2 0 0 1 .23 1.038l-.007.407c-.012.686-.017 1.03.079 1.337c.085.272.227.523.417.736c.214.24.512.411 1.106.754l.494.285c.593.341.889.512 1.204.577a2 2 0 0 0 .843-.007c.314-.07.607-.246 1.194-.598l.354-.212l.113-.066c.278-.154.588-.24.907-.25l.13-.001h.13c.318.01.63.097.91.252l.092.055l.376.226c.59.354.884.53 1.199.6a2 2 0 0 0 .846.008c.315-.066.613-.239 1.206-.583l.495-.287c.588-.342.883-.513 1.095-.752c.19-.213.33-.463.415-.734c.095-.305.09-.644.078-1.318l-.008-.44v-.127a2 2 0 0 1 .3-1.028l.065-.11a2 2 0 0 1 .675-.664l.11-.061l.002-.001l.361-.2c.602-.334.903-.5 1.122-.738c.194-.21.34-.46.429-.73c.1-.305.1-.647.098-1.327l-.002-.574c-.001-.683-.002-1.025-.103-1.33a2 2 0 0 0-.428-.725c-.217-.236-.515-.402-1.111-.733z'/%3E%3Cpath d='M8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0'/%3E%3C/g%3E%3C/svg%3E\")"
      },
      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        photoUrl: '',
      },
      unreadCount: 0,
      isInitialLoading: true,
      isDesktop: window.innerWidth >= 1024,
    };
  },
  async created() {
    try {
      await this.loadInternProfile();
      this.syncNotifications();
      await this.fetchAttendanceHistory();
    } finally {
      this.isInitialLoading = false;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    confirmLogout() {
      if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('user');
        localStorage.removeItem('internUser');
        const internId = this.internId || (this.intern && this.intern.id);
        if (internId) {
          localStorage.removeItem('internNotifications_' + internId);
          localStorage.removeItem('internNotificationsUnread_' + internId);
        }
        this.$router.push('/auth/login');
      }
    },
    formatNotification(n) {
      const msg = typeof n === 'string' ? n : (n.message || '');
      if (!msg) return '';
      // Bold times (e.g., 10:58 AM)
      let formatted = msg.replace(/(\d{1,2}:\d{2}\s?(?:AM|PM))/gi, '<strong>$1</strong>');
      // Bold keywords (e.g., updated)
      formatted = formatted.replace(/(updated)/gi, '<strong>$1</strong>');
      return formatted;
    },
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024;
    },
    async fetchAttendanceHistory() {
      if (!this.intern.id) return;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/attendance/intern/history?internId=${encodeURIComponent(this.intern.id)}`);
        if (!res.ok) throw new Error('Failed to fetch attendance history');
        const json = await res.json();
        this.records = (json.data || []).map((r) => ({
          id: r.id,
          date: r.date,
          timeIn: r.timeIn ? r.timeIn.slice(0, 5) : '--:--',
          timeOut: r.timeOut ? r.timeOut.slice(0, 5) : '--:--',
          timeInAM: r.timeInAM ? r.timeInAM.slice(0, 5) : '',
          timeOutAM: r.timeOutAM ? r.timeOutAM.slice(0, 5) : '',
          timeInPM: r.timeInPM ? r.timeInPM.slice(0, 5) : '',
          timeOutPM: r.timeOutPM ? r.timeOutPM.slice(0, 5) : '',
          totalMinutesAM: r.totalMinutesAM ?? null,
          totalMinutesPM: r.totalMinutesPM ?? null,
          totalMinutes: r.totalMinutes ?? null,
          normalCountMinutes: r.normalCountMinutes ?? null,
          overtimeMinutes: r.overtimeMinutes ?? null,
          totalHours: r.totalHours || '0.0',
          statusAM: r.statusAM || null,
          statusPM: r.statusPM || null,
          tagging: r.tagging || null,
          tagAM: r.tagAM || null,
          tagPM: r.tagPM || null,
          validationStatusAM: r.validationStatusAM || 'Pending',
          rejectReasonAM: r.rejectReasonAM || null,
          validationStatusPM: r.validationStatusPM || 'Pending',
          rejectReasonPM: r.rejectReasonPM || null,
        }));
      } catch (err) {
        console.error('Attendance history fetch error:', err);
      }
    },
    syncNotifications() {
      const internId = this.intern.id;
      if (!internId) return;
      try {
        const key = `internNotifications_${internId}`;
        const unreadKey = `internNotificationsUnread_${internId}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const list = JSON.parse(raw);
          if (Array.isArray(list)) {
            this.notifications = list;
          }
        }
        const unreadRaw = localStorage.getItem(unreadKey);
        if (unreadRaw != null) {
          const num = parseInt(unreadRaw, 10);
          if (!Number.isNaN(num) && num >= 0) {
            this.unreadCount = num;
          }
        } else {
          this.unreadCount = this.notifications.length;
        }
      } catch (e) {}
    },
    closeDetailsModal() {
      this.showDetailsModal = false;
      this.selectedRecord = null;
    },
    toggleRow(recordId, sessionLabel) {
      const key = `${recordId}-${sessionLabel || 'all'}`;
      if (this.expandedRows.includes(key)) {
        this.expandedRows = [];
      } else {
        this.expandedRows = [key];
      }
    },
    isRowExpanded(recordId, sessionLabel) {
      const key = `${recordId}-${sessionLabel || 'all'}`;
      return this.expandedRows.includes(key);
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    selectMonth(val) {
      this.selectedMonth = val;
      this.showMonthDropdown = false;
    },
    selectItemsPerPage(val) {
      this.itemsPerPage = val;
      this.currentPage = 1;
      this.showItemsPerPageDropdown = false;
    },
    async loadInternProfile() {
      try {
        const stored = localStorage.getItem('internUser');
        if (!stored) return;
        const basic = JSON.parse(stored);
        const internId = basic.id;
        if (!internId) return;

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${encodeURIComponent(internId)}`);
        if (!res.ok) {
          this.intern = { ...this.intern, ...basic };
          return;
        }
        const data = await res.json();
        if (data && data.user) {
          this.intern = data.user;
        } else {
          this.intern = { ...this.intern, ...basic };
        }
      } catch (err) {
        console.error('Error fetching intern profile:', err);
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    },
    formatTime12h(timeStr) {
      if (!timeStr) return '';
      if (timeStr === '--:--') return '--:--';
      const [hStr, mStr] = timeStr.split(':');
      const hNum = parseInt(hStr, 10);
      if (Number.isNaN(hNum)) return timeStr;
      const period = hNum >= 12 ? 'PM' : 'AM';
      const hour12 = hNum % 12 === 0 ? 12 : hNum % 12;
      return `${hour12}:${mStr} ${period}`;
    },
    formatMinutesToLabel(totalMinutes) {
      const safeMinutes = Number.isFinite(totalMinutes) && totalMinutes > 0 ? totalMinutes : 0;
      const h = Math.floor(safeMinutes / 60);
      const m = safeMinutes % 60;
      return `${h}h ${m}m`;
    },
    exportPdf() {
      if (!this.filteredRecords.length) {
        alert('No attendance records to export.');
        return;
      }

      const parseLocalDate = (ymd) => {
        if (!ymd || typeof ymd !== 'string') return null;
        const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return null;
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const d = parseInt(m[3], 10);
        if ([y, mo, d].some(n => Number.isNaN(n))) return null;
        return new Date(y, mo - 1, d);
      };

      const resolveBaseDate = () => {
        if (this.selectedMonth) {
          const parsed = parseLocalDate(`${this.selectedMonth}-01`);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        if (this.fromDate) {
          const parsed = parseLocalDate(this.fromDate);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        const firstWithDate = this.filteredRecords.find(r => !!r.date);
        if (firstWithDate && firstWithDate.date) {
          const parsed = parseLocalDate(firstWithDate.date);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        return new Date();
      };

      const baseDate = resolveBaseDate();
      const year = baseDate.getFullYear();
      const monthIndex = baseDate.getMonth();
      const monthName = baseDate.toLocaleDateString('en-US', { month: 'long' });
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      const byDay = {};

      this.filteredRecords.forEach((r) => {
        if (!r.date) return;
        const d = parseLocalDate(r.date) || new Date(r.date);
        if (!d || Number.isNaN(d.getTime())) return;
        if (d.getFullYear() !== year || d.getMonth() !== monthIndex) return;

        const dayNum = d.getDate();
        if (dayNum < 1 || dayNum > 31) return;

        const amArrival = r.timeInAM ? this.formatTime12h(r.timeInAM) : '';
        const amDeparture = r.timeOutAM ? this.formatTime12h(r.timeOutAM) : '';
        const pmArrival = r.timeInPM ? this.formatTime12h(r.timeInPM) : '';
        const pmDeparture = r.timeOutPM ? this.formatTime12h(r.timeOutPM) : '';

        byDay[dayNum] = {
          amArrival,
          amDeparture,
          pmArrival,
          pmDeparture,
          hours: (() => {
            const num = parseFloat(r.totalHours || '0');
            const safe = Number.isFinite(num) ? num : 0;
            const totalMinutes = Math.round(safe * 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return { h, m };
          })(),
        };
      });

      let tableHtmlOne = '';
      tableHtmlOne += '<div style="font-family:serif;margin:20px 20px 10px 20px;font-size:11px;">';
      tableHtmlOne += '<div style="text-align:center;margin-bottom:4px;">Civil Service Form No. 48</div>';
      tableHtmlOne += '<div style="text-align:center;font-weight:bold;font-size:14px;margin-bottom:10px;">DAILY TIME RECORD</div>';
      tableHtmlOne += `<div style="text-align:center;margin:10px 0 2px 0;border-bottom:1px solid #000;padding-bottom:2px;">${this.formattedName || '(Name)'}</div>`;
      tableHtmlOne += `<div style="margin-top:6px;">For the month of <span style="text-decoration:underline;">${monthName} ${year}</span></div>`;
      tableHtmlOne += '<div style="margin-top:2px;display:flex;justify-content:space-between;align-items:flex-start;font-size:9px;">';
      tableHtmlOne += '<div>Official hours of arrival<br/>and departure</div>';
      tableHtmlOne += '<div style="text-align:left;">Regular days ________<br/>Saturdays ________</div>';
      tableHtmlOne += '</div>';
      tableHtmlOne += '</div>';

      tableHtmlOne += '<table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;font-family:sans-serif;font-size:9px;width:100%;margin:0 auto;">';
      tableHtmlOne += '<thead>';
      tableHtmlOne += '<tr>';
      tableHtmlOne += '<th rowspan="2" style="width:6%;">Day</th>';
      tableHtmlOne += '<th colspan="2">A.M.</th>';
      tableHtmlOne += '<th colspan="2">P.M.</th>';
      tableHtmlOne += '<th colspan="2">Undertime</th>';
      tableHtmlOne += '</tr>';
      tableHtmlOne += '<tr>';
      tableHtmlOne += '<th style="width:14%;">Arrival</th>';
      tableHtmlOne += '<th style="width:14%;">Departure</th>';
      tableHtmlOne += '<th style="width:14%;">Arrival</th>';
      tableHtmlOne += '<th style="width:14%;">Departure</th>';
      tableHtmlOne += '<th style="width:12%;">Hours</th>';
      tableHtmlOne += '<th style="width:12%;">Minutes</th>';
      tableHtmlOne += '</tr>';
      tableHtmlOne += '</thead>';
      tableHtmlOne += '<tbody>';

      for (let day = 1; day <= daysInMonth; day++) {
        const data = byDay[day];
        const amArr = data ? data.amArrival : '';
        const amDep = data ? data.amDeparture : '';
        const pmArr = data ? data.pmArrival : '';
        const pmDep = data ? data.pmDeparture : '';
        const hoursVal = '';
        const minsVal = '';

        const currentDt = new Date(year, monthIndex, day);
        const dayOfWeek = currentDt.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        tableHtmlOne += '<tr>';
        tableHtmlOne += `<td style="text-align:center;">${day}</td>`;
        
        if (isWeekend && !amArr && !amDep && !pmArr && !pmDep) {
          const dayName = dayOfWeek === 0 ? 'SUNDAY' : 'SATURDAY';
          tableHtmlOne += `<td colspan="4" style="text-align:center; font-weight:bold; letter-spacing: 2px;">${dayName}</td>`;
          tableHtmlOne += `<td style="text-align:center;"></td>`;
          tableHtmlOne += `<td style="text-align:center;"></td>`;
        } else {
          tableHtmlOne += `<td style="text-align:center;">${amArr}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${amDep}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${pmArr}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${pmDep}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${hoursVal}</td>`;
          tableHtmlOne += `<td style="text-align:center;">${minsVal}</td>`;
        }
        tableHtmlOne += '</tr>';
      }

      for (let day = daysInMonth + 1; day <= 31; day++) {
        tableHtmlOne += '<tr>';
        tableHtmlOne += `<td style="text-align:center;">${day}</td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += `<td style="text-align:center;"></td>`;
        tableHtmlOne += '</tr>';
      }

      tableHtmlOne += '<tr>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;">Total</td>';
      tableHtmlOne += '<td></td><td></td><td></td><td></td>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;"></td>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;"></td>';
      tableHtmlOne += '</tr>';

      tableHtmlOne += '</tbody>';
      tableHtmlOne += '</table>';

      tableHtmlOne += `
        <div style="font-family:serif;font-size:9px;margin-top:10px;text-align:justify;">
          I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was
          made daily at the time of arrival and departure from office.
        </div>
        <div style="height:40px;"></div>
        <div style="text-align:center;font-family:sans-serif;font-size:9px;margin-top:10px;">
          <div>${this.formattedName || '&nbsp;'}</div>
          <div style="border-top:1px solid #000;margin:0 20px 2px 20px;height:1px;"></div>
          <div>OJT Intern</div>
        </div>
        <div style="height:30px;"></div>
        <div style="text-align:center;font-family:sans-serif;font-size:9px;margin-top:10px;">
          <div style="font-weight:bold;">ENGR. MARVIN D. BEJASA</div>
          <div style="border-top:1px solid #000;margin:0 20px 2px 20px;height:1px;"></div>
          <div>OIC - Provincial Officer</div>
          <div><i>In-Charge</i></div>
        </div>
      `;

      const tableHtml = `
        <div style="display:flex;justify-content:space-between;padding:0 20px;">
          <div style="width:48%;">${tableHtmlOne}</div>
          <div style="width:48%;">${tableHtmlOne}</div>
        </div>
      `;

      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html><head><title>Daily Time Record</title></head><body>${tableHtml}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }
  },
  computed: {
    formattedName() {
      const { firstName, middleName, lastName } = this.intern;
      if (!firstName && !lastName) return 'Intern';
      const middleInitial = middleName ? `${middleName.charAt(0)}. ` : '';
      return `${firstName} ${middleInitial}${lastName}`.trim();
    },
    avatarInitials() {
      const first = this.intern.firstName ? this.intern.firstName.charAt(0).toUpperCase() : '';
      const last = this.intern.lastName ? this.intern.lastName.charAt(0).toUpperCase() : '';
      const combined = `${first}${last}`;
      return combined || '?';
    },
    selectedMonthLabel() {
      if (!this.selectedMonth) return '';
      const found = this.availableMonths.find(m => m.value === this.selectedMonth);
      return found ? found.label : '';
    },
    availableMonths() {
      const months = [];
      const startYear = 2026;
      let maxDate = new Date();
      
      if (this.records && this.records.length > 0) {
        const recordDates = this.records.map(r => new Date(r.date).getTime()).filter(t => !isNaN(t));
        if (recordDates.length > 0) {
           const maxRecordDate = new Date(Math.max(...recordDates));
           if (maxRecordDate > maxDate) {
               maxDate = maxRecordDate;
           }
        }
      }

      const currentYear = maxDate.getFullYear();
      const currentMonth = maxDate.getMonth();
      for (let y = startYear; y <= currentYear; y++) {
        const maxMonth = y === currentYear ? currentMonth : 11;
        for (let m = 0; m <= maxMonth; m++) {
          const mString = String(m + 1).padStart(2, '0');
          const value = `${y}-${mString}`;
          const date = new Date(y, m, 1);
          const label = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          months.push({ value, label });
        }
      }
      return months.reverse();
    },
    filteredRecords() {
      return this.records.filter(r => {
        if (this.selectedMonth && !r.date.startsWith(this.selectedMonth)) {
          return false;
        }
        if (this.fromDate && r.date < this.fromDate) {
          return false;
        }
        if (this.toDate && r.date > this.toDate) {
          return false;
        }
        return true;
      });
    },
    tableRecords() {
      const rows = [];
      this.filteredRecords.forEach((r) => {
        const hasAM = r.timeInAM || r.timeOutAM;
        const hasPM = r.timeInPM || r.timeOutPM;
        const tagAM = (r.tagAM || r.tagging || 'Normal Hours').trim();
        const tagPM = (r.tagPM || r.tagging || 'Normal Hours').trim();

        const totalMinutesAM = r.totalMinutesAM != null ? r.totalMinutesAM : 0;
        const totalMinutesPM = r.totalMinutesPM != null ? r.totalMinutesPM : 0;
        const totalMinutesDay = r.totalMinutes != null
          ? r.totalMinutes
          : (totalMinutesAM + totalMinutesPM);

        const fourHoursMinutes = 4 * 60;
        const eightHoursMinutes = 8 * 60;
        if (hasAM) {
          let minutesForRow = totalMinutesAM;
          const isOvertimeSession = tagAM === 'Overtime';
          if (isOvertimeSession) {
            // For overtime-tagged session, always show full actual minutes
            minutesForRow = totalMinutesAM;
          } else {
            // Normal Hours session: cap at 4h maximum
            minutesForRow = Math.min(totalMinutesAM, fourHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          const statusTag = r.tagAM || r.tagging || 'Normal Hours';
          rows.push({
            ...r,
            timeIn: r.timeInAM || '--:--',
            timeOut: r.timeOutAM || '--:--',
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            sessionLabel: 'AM',
            validationStatus: r.validationStatusAM || 'Pending',
            rejectReason: r.rejectReasonAM || null,
          });
        }

        if (hasPM) {
          let minutesForRow = totalMinutesPM;
          const isOvertimeSession = tagPM === 'Overtime';
          if (isOvertimeSession) {
            // For overtime-tagged session, always show full actual minutes
            minutesForRow = totalMinutesPM;
          } else {
            // Normal Hours session: cap at 4h maximum
            minutesForRow = Math.min(totalMinutesPM, fourHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          const statusTag = r.tagPM || r.tagging || 'Normal Hours';
          rows.push({
            ...r,
            timeIn: r.timeInPM || '--:--',
            timeOut: r.timeOutPM || '--:--',
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            sessionLabel: 'PM',
            validationStatus: r.validationStatusPM || 'Pending',
            rejectReason: r.rejectReasonPM || null,
          });
        }

        if (!hasAM && !hasPM) {
          const statusTag = r.tagging || 'Normal Hours';
          let minutesForRow;
          const isOvertimeDay = statusTag.trim() === 'Overtime';
          if (isOvertimeDay) {
            minutesForRow = Math.max(0, totalMinutesDay);
          } else {
            minutesForRow = Math.min(Math.max(0, totalMinutesDay), eightHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          rows.push({
            ...r,
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            validationStatus: r.validationStatusAM || 'Pending',
            rejectReason: r.rejectReasonAM || null,
          });
        }
      });

      return rows;
    },
    totalPages() {
      if (!this.tableRecords || this.tableRecords.length === 0) return 1;
      return Math.ceil(this.tableRecords.length / this.itemsPerPage);
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tableRecords.slice(start, end);
    }
  },
  watch: {
    selectedMonth() { this.currentPage = 1; },
    fromDate() { this.currentPage = 1; },
    toDate() { this.currentPage = 1; }
  }
}
</script>

