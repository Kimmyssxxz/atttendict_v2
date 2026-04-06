<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    
    <!-- DESKTOP VIEW (Visible on Large Screens) -->
    <div v-if="isDesktop" class="flex p-2 md:p-3 lg:p-4 gap-3 h-screen overflow-hidden">
      <!-- Left Sidebar Navbar -->
      <aside class="w-[280px] bg-[#133e75] flex flex-col h-full rounded-2xl shrink-0 shadow-sm sticky top-0 overflow-y-auto custom-scrollbar">
        <div class="px-8 py-8 shrink-0">
          <div class="flex items-center gap-3 mb-6">
            <img src="/4.png" alt="Logo" class="h-10 w-auto object-contain" />
            <h1 class="m-0 text-2xl font-bold text-white">ATTENDICT</h1>
          </div>
          <nav class="flex flex-col gap-2">
            <router-link to="/intern/dashboard" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
              <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.dashboard, WebkitMaskSize: 'cover', maskImage: icons.dashboard, maskSize: 'cover' }"></span> Dashboard
            </router-link>
            <router-link to="/intern/time" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
              <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.time, WebkitMaskSize: 'cover', maskImage: icons.time, maskSize: 'cover' }"></span> Time In/Out
            </router-link>
            <router-link to="/intern/attendance" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center gap-3">
              <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.attendance, WebkitMaskSize: 'cover', maskImage: icons.attendance, maskSize: 'cover' }"></span> My Attendance
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
          </nav>
        </div>
      </aside>

      <!-- Main Content Area (Desktop) -->
      <main class="flex-1 flex flex-col gap-4 overflow-hidden">
        <!-- Top Header Bar -->
        <header class="flex p-2 items-center justify-between shrink-0">
          <div class="flex items-center gap-2 pl-2">
            <button @click="$router.back()" class="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-0">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M16.62 2.99a1.25 1.25 0 0 0-1.77 0L6.54 11.3a.996.996 0 0 0 0 1.41l8.31 8.31c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.38 12l7.25-7.25c.48-.48.48-1.28-.01-1.76'/%3E%3C/svg%3E" alt="Back" class="w-[22px] h-[22px] opacity-70" />
            </button>
            <h1 class="m-0 text-3xl font-semibold text-gray-900">Time In / Time Out</h1>
          </div>
          <div class="flex items-center gap-3 pr-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden shadow-sm cursor-pointer transition-all" @click="$router.push('/intern/profile')">
               <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
               <span v-else>{{ avatarInitials }}</span>
            </div>
          </div>
        </header>

        <!-- Main Content (Desktop Scrollable) -->
        <main class="flex-1 overflow-y-auto custom-scrollbar p-1 flex flex-col gap-4">
          <template v-if="isInitialLoading">
            <!-- SKELETON DESKTOP -->
            <!-- Today Summary Card -->
            <section class="bg-[#133e75] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center animate-pulse">
              <div class="h-4 bg-white/20 rounded w-32 mx-auto mb-2 relative z-10"></div>
              <div class="h-10 bg-white/20 rounded w-48 mx-auto my-2 relative z-10"></div>
              <div class="h-6 bg-white/20 rounded w-40 mx-auto mt-2 mb-8 relative z-10"></div>
              <div class="flex gap-4 justify-center relative z-10">
                <div class="flex-1 max-w-[180px] h-12 rounded-xl bg-white/20"></div>
                <div class="flex-1 max-w-[180px] h-12 rounded-xl bg-white/20"></div>
              </div>
            </section>
            <!-- User Clock Card -->
            <section class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 animate-pulse">
              <div class="h-8 bg-slate-200 rounded w-40 mb-6"></div>
              <div class="flex flex-col gap-6">
                <div class="flex items-center justify-between pb-6 border-b border-gray-50">
                  <div class="flex items-center gap-5">
                    <div class="w-14 h-14 rounded-full bg-slate-200 shrink-0"></div>
                    <div class="flex flex-col gap-2">
                       <div class="h-4 bg-slate-200 rounded w-32"></div>
                       <div class="h-4 bg-slate-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div class="h-6 w-24 bg-slate-200 rounded-full"></div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-5">
                    <div class="w-14 h-14 rounded-full bg-slate-200 shrink-0"></div>
                    <div class="flex flex-col gap-2">
                       <div class="h-4 bg-slate-200 rounded w-32"></div>
                       <div class="h-4 bg-slate-200 rounded w-32"></div>
                    </div>
                  </div>
                  <div class="h-6 w-24 bg-slate-200 rounded-full"></div>
                </div>
              </div>
            </section>
          </template>

          <template v-else>
          <!-- Today Summary Card -->
          <section class="bg-[#133e75] rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center">
            <p class="text-white text-base opacity-90">{{ formattedDisplayDate }}</p>
            <h2 class="text-3xl sm:text-4xl font-semibold text-white my-2">Today</h2>
            <div class="flex items-center justify-center gap-2 text-[#eebb3b] font-medium text-lg sm:text-xl mb-6 sm:mb-8">
              <span class="w-4 h-4 bg-current inline-block" :style="{ WebkitMaskImage: icons.goldClock, WebkitMaskSize: 'cover', maskImage: icons.goldClock, maskSize: 'cover' }"></span>
              {{ formatClockTime(clockNow) }}
            </div>
            <div class="flex gap-4 justify-center">
              <button 
                class="flex-1 max-w-[180px] py-3.5 px-4 rounded-xl border-none text-[1rem] font-medium cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-100 bg-[#eebb3b] text-white" 
                :disabled="loading || hasOpenSession" 
                @click="startTimeIn"
              >
                {{ loading && loadingType === 'in' ? 'Saving...' : 'Time in' }}
              </button>
              <button 
                class="flex-1 max-w-[180px] py-3.5 px-4 rounded-xl border-none text-[1rem] font-medium cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-100 bg-[#b92e2b] text-white" 
                :disabled="loading || !hasOpenSession" 
                @click="startTimeOut"
              >
                {{ loading && loadingType === 'out' ? 'Saving...' : 'Time out' }}
              </button>
            </div>
          </section>

          <!-- User Clock Card -->
          <section class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
            <h3 class="text-xl sm:text-2xl text-gray-900 font-semibold mb-6">User Clock</h3>
            <div class="flex flex-col gap-6">
              <div class="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-full bg-[#133e75] flex items-center justify-center text-white font-semibold text-base shrink-0">AM</div>
                  <div class="flex flex-col gap-1.5 min-w-0">
                    <p class="m-0 text-base text-gray-600 font-medium">Time in: <span class="text-gray-600 font-medium ml-1">{{ record.timeInAM ? formatTime(record.timeInAM) : '--:-- --' }}</span></p>
                    <p class="m-0 text-base text-gray-600 font-medium">Time out: <span class="text-gray-600 font-mdeium ml-1">{{ record.timeOutAM ? formatTime(record.timeOutAM) : '--:-- --' }}</span></p>
                  </div>
                </div>
                <div class="shrink-0 bg-[rgba(34,197,94,0.15)] text-[rgb(21,128,61)] px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">{{ displayAmTag }}</div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-5">
                  <div class="w-14 h-14 rounded-full bg-[#133e75] flex items-center justify-center text-white font-semibold text-base shrink-0">PM</div>
                  <div class="flex flex-col gap-1.5 min-w-0">
                    <p class="m-0 text-base text-gray-600 font-medium">Time in: <span class="text-gray-600 font-medium ml-1">{{ record.timeInPM ? formatTime(record.timeInPM) : '--:-- --' }}</span></p>
                    <p class="m-0 text-base text-gray-600 font-medium">Time out: <span class="text-gray-600 font-medium ml-1">{{ record.timeOutPM ? formatTime(record.timeOutPM) : '--:-- --' }}</span></p>
                  </div>
                </div>
                <div class="shrink-0 bg-[rgba(34,197,94,0.15)] text-[rgb(21,128,61)] px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">{{ displayPmTag }}</div>
              </div>
            </div>
          </section>

          <!-- Location Card -->
          <section class="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
            <h3 class="text-xl sm:text-2xl text-gray-900 font-semibold mb-2">Location</h3>
            <div class="flex items-start gap-1 text-gray-600 text-sm mb-5 font-medium min-h-[1.2rem]">
              <span class="w-4 h-4 bg-gray-900 mt-0.5 shrink-0 opacity-60 inline-block" :style="{ WebkitMaskImage: icons.location, WebkitMaskSize: 'cover', maskImage: icons.location, maskSize: 'cover' }"></span>
              <span class="leading-relaxed">{{ locationAddress || 'No location recorded yet.' }}</span>
            </div>
            <div v-if="hasLocation" class="relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[21/9] rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
              <div ref="leafletMap" class="absolute inset-0"></div>
            </div>
            <div v-else class="py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
              <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='m15.5 14l5 5l-1.5 1.5l-5-5v-.79l-.27-.28A6.47 6.47 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27zm-6 0C12 14 14 12 14 9.5S12 5 9.5 5S5 7 5 9.5S7 14 9.5 14'/%3E%3C/svg%3E" class="w-10 h-10 opacity-20" />
              <p class="m-0 text-slate-400 text-sm font-medium">Map will appear after time in/out</p>
            </div>
          </section>
          </template>
        </main>
      </main>
    </div>

    <!-- MOBILE VIEW (Hidden on Large Screens) -->
    <div v-if="!isDesktop" class="flex flex-col h-screen overflow-hidden">
      <!-- Mobile Header -->
      <header class="px-6 py-7 flex items-center sticky top-0 z-20 bg-gray-50 ">
        <button @click="$router.back()" class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="flex-1 text-center pr-7">
          <h1 class="m-0 text-black font-semibold text-xl tracking-wide whitespace-nowrap">Time In / Time Out</h1>
        </div>
      </header>

      <!-- Main Content (Mobile Scrollable) -->
      <main class="flex-1 overflow-y-auto custom-scrollbar p-3 flex flex-col gap-3 pb-28">
        <template v-if="isInitialLoading">
          <!-- SKELETON MOBILE -->
          <!-- Today Summary Card -->
          <section class="bg-[#133e75] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 text-center animate-pulse">
            <div class="h-3 bg-white/20 rounded w-24 mx-auto mb-1 relative z-10"></div>
            <div class="h-8 bg-white/20 rounded w-32 mx-auto my-2 relative z-10"></div>
            <div class="h-5 bg-white/20 rounded w-28 mx-auto mt-1 mb-4 relative z-10"></div>
            <div class="flex gap-4 justify-center relative z-10">
              <div class="flex-1 h-11 rounded-xl bg-white/20"></div>
              <div class="flex-1 h-11 rounded-xl bg-white/20"></div>
            </div>
          </section>
          <!-- User Clock Card -->
          <section class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-5 mt-1 animate-pulse">
            <div class="h-6 bg-slate-200 rounded w-32 mb-4"></div>
            <div class="flex flex-col gap-4">
              <div class="flex items-center gap-4 pb-4 border-b border-gray-50">
                <div class="w-12 h-12 rounded-full bg-slate-200 shrink-0"></div>
                <div class="flex flex-col gap-2 flex-1">
                   <div class="h-3 bg-slate-200 rounded w-28"></div>
                   <div class="h-3 bg-slate-200 rounded w-28"></div>
                </div>
                <div class="h-5 w-16 bg-slate-200 rounded-full shrink-0"></div>
              </div>
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-full bg-slate-200 shrink-0"></div>
                <div class="flex flex-col gap-2 flex-1">
                   <div class="h-3 bg-slate-200 rounded w-28"></div>
                   <div class="h-3 bg-slate-200 rounded w-28"></div>
                </div>
                <div class="h-5 w-16 bg-slate-200 rounded-full shrink-0"></div>
              </div>
            </div>
          </section>
        </template>

        <template v-else>
        <!-- Today Summary Card -->
        <section class="bg-[#133e75] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6 text-center">
          <p class="text-white text-sm opacity-60">{{ formattedDisplayDate }}</p>
          <h2 class="text-3xl font-semibold text-white ">Today</h2>
          <div class="flex items-center justify-center text-[#eebb3b] font-medium text-lg mb-4">
            
            {{ formatClockTime(clockNow) }}
          </div>
          <div class="flex gap-4 justify-center">
            <button 
              class="flex-1 py-2.5 px-1.5 rounded-xl border-none text-base font-medium cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-100 bg-[#eebb3b] text-white" 
              :disabled="loading || hasOpenSession" 
              @click="startTimeIn"
            >
              {{ loading && loadingType === 'in' ? 'Saving...' : 'Time in' }}
            </button>
            <button 
              class="flex-1 py-2.5 px-1.5 rounded-xl border-none text-base font-medium cursor-pointer transition-all hover:opacity-90 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-100 bg-[#b92e2b] text-white" 
              :disabled="loading || !hasOpenSession" 
              @click="startTimeOut"
            >
              {{ loading && loadingType === 'out' ? 'Saving...' : 'Time out' }}
            </button>
          </div>
        </section>

        <!-- User Clock Card -->
        <section class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6">
          <h3 class="text-lg text-black font-semibold mb-4">User Clock</h3>
          <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
               <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-[#133e75] flex items-center justify-center text-white font-semibold text-sm shrink-0">AM</div>
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-600 font-medium">Session</span>
                        <span class="text-black font-semibold">Morning</span>
                    </div>
                  </div>
                  <div class="shrink-0 bg-[rgba(34,197,94,0.15)] text-[rgb(21,128,61)] px-3 py-1 rounded-full text-xs font-medium  ">{{ displayAmTag }}</div>
               </div>
               <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-[0.7rem] text-gray-400 uppercase font-bold ">In</span>
                    <span class="text-black font-semibold">{{ record.timeInAM ? formatTime(record.timeInAM) : '--:-- --' }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-[0.7rem] text-gray-400 uppercase font-bold ">Out</span>
                    <span class="text-black font-semibold">{{ record.timeOutAM ? formatTime(record.timeOutAM) : '--:-- --' }}</span>
                  </div>
               </div>
            </div>
            <div class="flex flex-col gap-4 pb-0">
               <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-[#133e75] flex items-center justify-center text-white font-semibold text-sm shrink-0">PM</div>
                    <div class="flex flex-col">
                        <span class="text-xs text-gray-600 font-medium">Session</span>
                        <span class="text-black font-semibold">Afternoon</span>
                    </div>
                  </div>
                  <div class="shrink-0 bg-[rgba(34,197,94,0.15)] text-[rgb(21,128,61)] px-3 py-1 rounded-full text-xs font-medium  ">{{ displayPmTag }}</div>
               </div>
               <div class="grid grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-[0.7rem] text-gray-400 uppercase font-bold ">In</span>
                    <span class="text-black font-semibold">{{ record.timeInPM ? formatTime(record.timeInPM) : '--:-- --' }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-[0.7rem] text-gray-400 uppercase font-bold ">Out</span>
                    <span class="text-black font-semibold">{{ record.timeOutPM ? formatTime(record.timeOutPM) : '--:-- --' }}</span>
                  </div>
               </div>
            </div>
          </div>
        </section>

        <!-- Location Card -->
        <section class="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-6">
          <h3 class="text-xl text-gray-900 font-semibold mb-2">Location</h3>
          <div class="flex items-start gap-1 text-gray-600 text-xs mb-5 font-medium min-h-[1.2rem]">
            <span class="w-4 h-4 bg-gray-900 mt-0.5 shrink-0 opacity-60 inline-block" :style="{ WebkitMaskImage: icons.location, WebkitMaskSize: 'cover', maskImage: icons.location, maskSize: 'cover' }"></span>
            <span class="leading-relaxed">{{ locationAddress || 'No location recorded yet.' }}</span>
          </div>
          <div v-if="hasLocation" class="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
            <div ref="leafletMap" class="absolute inset-0"></div>
          </div>
          <div v-else class="py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%2394a3b8' d='m15.5 14l5 5l-1.5 1.5l-5-5v-.79l-.27-.28A6.47 6.47 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.57 4.23l.28.27zm-6 0C12 14 14 12 14 9.5S12 5 9.5 5S5 7 5 9.5S7 14 9.5 14'/%3E%3C/svg%3E" class="w-10 h-10 opacity-20" />
            <p class="m-0 text-gray-600 text-xs font-medium">Map will appear after time in/out</p>
          </div>
        </section>
        </template>
      </main>

      <!-- Mobile Bottom Navigation -->
      <nav class="lg:hidden shrink-0 h-[72px] bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-2 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] sticky bottom-2 mb-2 rounded-2xl mt-auto mx-2">
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
    </div>

    <!-- Shared Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm transition-all duration-300">
      <div class="bg-white rounded-2xl  w-full max-w-sm overflow-hidden p-10 flex flex-col items-center text-center gap-2 relative">
        <div class="w-48 h-48 flex items-center justify-center shrink-0">
          <DotLottieVue 
            style="height: 250px; width: 250px;" 
            autoplay 
            loop 
            :src="modalType === 'error' 
              ? 'https://lottie.host/b1636a86-e0f4-42dc-b420-bf9d11d75c71/FLgw0AFgg2.lottie' 
              : 'https://lottie.host/5a2b6a8e-c3f7-4d76-b6b9-ce08829d6b7f/SqD9E9ZlXz.lottie'" 
          />
        </div>
        <h3 class="m-0 text-2xl font-bold text-black">{{ modalTitle }}</h3>
        <p class="m-0 text-gray-600 text-sm mb-4">{{ modalMessage }}</p>
        <button @click="closeModal" class="w-full max-w-[140px] py-3 rounded-full text-white font-semibold text-base cursor-pointer  transition-all hover:opacity-90 active:scale-95 border-none" :class="modalType === 'error' ? 'bg-[#b92e2b]' : 'bg-[#00c853]'">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const AUTO_APPROVE_LOCATION = 'M. Roxas Drive, Lalom, Santa Isabel, Calapan, Oriental Mindoro, Mimaropa, Philippines'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  name: 'InternTimeView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      isDesktop: window.innerWidth >= 1024,
      clockOffset: 0,
      currentDate: '',
      lastActionTime: '',
      clockNow: new Date(),
      clockTimer: null,
      loading: false,
      loadingType: null,
      internId: null,
      record: {},
      userTagging: 'Normal Hours',
      userTodayAmTag: 'Normal Hours',
      userTodayPmTag: 'Normal Hours',
      showNotifications: false,
      notifications: ['Welcome to your time tracker.', 'Remember to time out before leaving.'],
      unreadCount: 0,
      locationAddress: '',
      lastGeocodedLat: null,
      lastGeocodedLng: null,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalType: 'success',
      showGenderDropdown: false,
      showYearDropdown: false,
      isInitialLoading: true,
      icons: {
        dashboard: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11 4.68v3.88a2.45 2.45 0 0 1-1.509 2.258A2.4 2.4 0 0 1 8.56 11H4.68a2.44 2.44 0 0 1-2.43-2.44V4.69a2.44 2.44 0 0 1 2.43-2.44h3.88A2.44 2.44 0 0 1 11 4.68m10.75.01v3.87a2.4 2.4 0 0 1-.71 1.72a2.38 2.38 0 0 1-1.72.72h-3.88a2.45 2.45 0 0 1-2.256-1.502A2.4 2.4 0 0 1 13 8.56V4.69a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.88a2.44 2.44 0 0 1 2.43 2.44M11 15.45v3.87a2.44 2.44 0 0 1-2.44 2.43H4.68a2.45 2.45 0 0 1-1.72-.71a2.4 2.4 0 0 1-.71-1.72v-3.87a2.4 2.4 0 0 1 .71-1.72A2.47 2.47 0 0 1 4.68 13h3.88A2.46 2.46 0 0 1 11 15.45m10.75 1.93A4.37 4.37 0 1 1 17.37 13a4.4 4.4 0 0 1 4.049 2.707c.22.53.332 1.099.331 1.673'/%3E%3C/svg%3E\")",
        dashboardInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M5 12H3l9-9l9 9h-2M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7'/%3E%3Cpath d='M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2-2v6'/%3E%3C/g%3E%3C/svg%3E\")",
        dashboardActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m12.707 2.293l9 9c.63.63.184 1.707-.707 1.707h-1v6a3 3 0 0 1-3 3h-1v-7a3 3 0 0 0-2.824-2.995L13 12h-2a3 3 0 0 0-3 3v7H7a3 3 0 0 1-3-3v-6H3c-.89 0-1.337-1.077-.707-1.707l9-9a1 1 0 0 1 1.414 0M13 14a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883-.993L11 14z'/%3E%3C/svg%3E\")",
        time: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z'/%3E%3Crect width='2' height='7' x='11' y='6' fill='%23000' rx='1'%3E%3CanimateTransform attributeName='transform' dur='9s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/rect%3E%3Crect width='2' height='9' x='11' y='11' fill='%23000' rx='1'%3E%3CanimateTransform attributeName='transform' dur='0.75s' repeatCount='indefinite' type='rotate' values='0 12 12;360 12 12'/%3E%3C/rect%3E%3C/svg%3E\")",
        goldClock: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1'/%3E%3C/g%3E%3C/svg%3E\")",
        attendance: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2'/%3E%3Cpath d='M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 12v-5m3 5v-1m3 1v-3'/%3E%3C/g%3E%3C/svg%3E\")",
        attendanceInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='none' stroke='%23000' stroke-linejoin='round' d='M3.5 4.5v-2h9V6m-10 2h11m-11-3.5v8h11V6h-6L6 4.5z' stroke-width='1'/%3E%3C/svg%3E\")",
        attendanceActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M3 2.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v3h.5a.5.5 0 0 1 .5.5v6.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5H3zM3 5v2.5h10v-1H7.5a.5.5 0 0 1-.354-.146L5.793 5zm9 .5V3H4v1h2a.5.5 0 0 1 .354.146L7.707 5.5z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
        staffInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3Cpath d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/svg%3E\")",
        staffActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='SVGgA8a3bBK'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23fff' stroke='%23fff' d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2'/%3E%3Cpath stroke='%23fff' d='m30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23000' stroke='%23000'/%3E%3Cpath stroke='%23000' d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23SVGgA8a3bBK)'/%3E%3C/svg%3E\")",
        notificationInactive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M5 9a7 7 0 0 1 14 0v3.764l1.822 3.644A1.1 1.1 0 0 1 19.838 18h-3.964a4.002 4.002 0 0 1-7.748 0H4.162a1.1 1.1 0 0 1-.984-1.592L5 12.764zm5.268 9a2 2 0 0 0 3.464 0zM12 4a5 5 0 0 0-5 5v3.764a2 2 0 0 1-.211.894L5.619 16h12.763l-1.17-2.342a2 2 0 0 1-.212-.894V9a5 5 0 0 0-5-5'/%3E%3C/g%3E%3C/svg%3E\")",
        notificationActive: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M12 2a7 7 0 0 0-7 7v3.528a1 1 0 0 1-.105.447l-1.717 3.433A1.1 1.1 0 0 0 4.162 18h15.676a1.1 1.1 0 0 0 .984-1.592l-1.716-3.433a1 1 0 0 1-.106-.447V9a7 7 0 0 0-7-7m0 19a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 12 21'/%3E%3C/g%3E%3C/svg%3E\")",
        settings: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='m20.35 8.923l-.366-.204l-.113-.064a2 2 0 0 1-.67-.66c-.018-.027-.034-.056-.066-.112a2 2 0 0 1-.3-1.157l.006-.425c.012-.68.018-1.022-.078-1.328a2 2 0 0 0-.417-.736c-.214-.24-.511-.412-1.106-.754l-.494-.285c-.592-.341-.889-.512-1.204-.577a2 2 0 0 0-.843.007c-.313.07-.606.246-1.191.596l-.003.002l-.354.211c-.056.034-.085.05-.113.066c-.278.155-.588.24-.907.25c-.032.002-.065.002-.13.002l-.13-.001a2 2 0 0 1-.91-.252c-.028-.015-.055-.032-.111-.066l-.357-.214c-.589-.354-.884-.53-1.199-.601a2 2 0 0 0-.846-.006c-.316.066-.612.238-1.205.582l-.003.001l-.488.283l-.005.004c-.588.34-.883.512-1.095.751a2 2 0 0 0-.415.734c-.095.307-.09.649-.078 1.333l.007.424c0 .065.003.097.002.128a2 2 0 0 1-.301 1.027c-.033.056-.048.084-.065.11a2 2 0 0 1-.675.664l-.112.063l-.361.2c-.602.333-.903.5-1.121.738a2 2 0 0 0-.43.73c-.1.307-.1.65-.099 1.338l.002.563c.001.683.003 1.024.104 1.329a2 2 0 0 0 .427.726c.218.236.516.402 1.113.734l.358.199c.061.034.092.05.121.068a2 2 0 0 1 .74.781l.067.12a2 2 0 0 1 .23 1.038l-.007.407c-.012.686-.017 1.03.079 1.337c.085.272.227.523.417.736c.214.24.512.411 1.106.754l.494.285c.593.341.889.512 1.204.577a2 2 0 0 0 .843-.007c.314-.07.607-.246 1.194-.598l.354-.212l.113-.066c.278-.154.588-.24.907-.25l.13-.001h.13c.318.01.63.097.91.252l.092.055l.376.226c.59.354.884.53 1.199.6a2 2 0 0 0 .846.008c.315-.066.613-.239 1.206-.583l.495-.287c.588-.342.883-.513 1.095-.752c.19-.213.33-.463.415-.734c.095-.305.09-.644.078-1.318l-.008-.44v-.127a2 2 0 0 1 .3-1.028l.065-.11a2 2 0 0 1 .675-.664l.11-.061l.002-.001l.361-.2c.602-.334.903-.5 1.122-.738c.194-.21.34-.46.429-.73c.1-.305.1-.647.098-1.327l-.002-.574c-.001-.683-.002-1.025-.103-1.33a2 2 0 0 0-.428-.725c-.217-.236-.515-.402-1.111-.733z'/%3E%3Cpath d='M8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0'/%3E%3C/g%3E%3C/svg%3E\")",
        location: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m5.252 9.975l11.66-5.552c1.7-.81 3.474.965 2.665 2.666l-5.552 11.659c-.759 1.593-3.059 1.495-3.679-.158L9.32 15.851a2 2 0 0 0-1.17-1.17l-2.74-1.027c-1.652-.62-1.75-2.92-.157-3.679'/%3E%3C/svg%3E\")"
      },
      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        photoUrl: '',
      },
      leafletMap: null,
      leafletMarker: null,
      leafletTileLayer: null
    }
  },
  created() {
    this.clockNow = new Date(Date.now() + this.clockOffset)

    // Load logged-in intern from localStorage
    try {
      const stored = localStorage.getItem('internUser');
      if (stored) {
        const user = JSON.parse(stored);
        this.internId = user.id || null;
      }
    } catch (e) {
      this.internId = null;
    }

    if (!this.internId) {
      this.isInitialLoading = false;
    }

    // After we know the internId, fetch today's attendance and user tags so data persists after refresh
    if (this.internId) {
      this.fetchTodayRecord();
      this.fetchUserTags();
      try {
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
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
      } catch (e) {
      }
    }
    this.loadInternProfile();
  },
  mounted() {
    this.startClock()
    window.addEventListener('resize', this.handleResize)
    this.$nextTick(() => {
      this.ensureLeafletMap()
      this.updateLeafletMapFromRecord()
    })
  },
  beforeUnmount() {
    this.stopClock()
    window.removeEventListener('resize', this.handleResize)
    this.destroyLeafletMap()
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
    currentLocation() {
      if (!this.record) return null
      const loc = this.record.locationPM || this.record.locationAM
      if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
        return null
      }
      return loc
    },
    hasLocation() {
      return !!this.currentLocation
    },
    hasOpenSession() {
      if (!this.record) return false;
      const hasOpenAM = !!this.record.timeInAM && !this.record.timeOutAM;
      const hasOpenPM = !!this.record.timeInPM && !this.record.timeOutPM;
      return hasOpenAM || hasOpenPM;
    },
    displayAmTag() {
      const rec = this.record || {};
      return (
        (rec.tagAM && rec.tagAM.trim()) ||
        (this.userTodayAmTag && this.userTodayAmTag.trim()) ||
        (this.userTagging && this.userTagging.trim()) ||
        'Normal Hours'
      );
    },
    displayPmTag() {
      const rec = this.record || {};
      return (
        (rec.tagPM && rec.tagPM.trim()) ||
        (this.userTodayPmTag && this.userTodayPmTag.trim()) ||
        (this.userTagging && this.userTagging.trim()) ||
        'Normal Hours'
      );
    },
    todayTagLabel() {
      const rec = this.record || {};
      const tag = (rec.tagAM || rec.tagPM || rec.tagging || '').trim();
      return tag || 'Normal Hours';
    },
    countedMinutesToday() {
      const rec = this.record || {};
      const tag = (rec.tagAM || rec.tagPM || rec.tagging || 'Normal Hours').trim();
      const eightHoursMinutes = 8 * 60;

      const totalMinutesAM = typeof rec.totalMinutesAM === 'number' ? rec.totalMinutesAM : null;
      const totalMinutesPM = typeof rec.totalMinutesPM === 'number' ? rec.totalMinutesPM : null;
      const totalMinutesFallback = typeof rec.totalMinutes === 'number' ? rec.totalMinutes : null;

      let rawTotal = 0;
      if (totalMinutesAM != null || totalMinutesPM != null) {
        rawTotal = (totalMinutesAM || 0) + (totalMinutesPM || 0);
      } else if (totalMinutesFallback != null) {
        rawTotal = totalMinutesFallback;
      }

      let dayMinutes = 0;
      if (tag === 'Overtime') {
        dayMinutes = Math.max(0, rawTotal);
      } else {
        const hasNormalField = typeof rec.normalCountMinutes === 'number';
        const normalIsZero = hasNormalField && rec.normalCountMinutes === 0;

        if (hasNormalField && !(normalIsZero && rawTotal > 0)) {
          dayMinutes = Math.max(0, rec.normalCountMinutes);
        } else {
          dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
        }
      }

      return dayMinutes;
    },
    formattedDisplayDate() {
      if (this.currentDate) {
        return this.formatDate(this.currentDate);
      }
      return this.clockNow.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  },
  watch: {
    currentLocation: {
      handler() {
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
      },
      immediate: true
    },
    isDesktop: {
      handler() {
        this.$nextTick(() => {
          this.destroyLeafletMap()
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
      }
    }
  },
  methods: {
    formatNotification(n) {
      const msg = typeof n === 'string' ? n : (n.message || '');
      if (!msg) return '';
      // Bold times (e.g., 10:58 AM)
      let formatted = msg.replace(/(\d{1,2}:\d{2}\s?(?:AM|PM))/gi, '<strong>$1</strong>');
      // Bold keywords (e.g., updated)
      formatted = formatted.replace(/(updated)/gi, '<strong>$1</strong>');
      return formatted;
    },
    normalizeLocation(value) {
      if (!value) return ''
      return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
    },
    locationMatchesAutoApprove(address) {
      const normalized = this.normalizeLocation(address)
      const target = this.normalizeLocation(AUTO_APPROVE_LOCATION)
      if (!normalized || !target) return false
      return normalized === target || normalized.includes(target)
    },
    async autoApproveIfEligible({ date, session, record, fallbackAddress }) {
      try {
        if (!this.internId || !date) return
        if (!session || (session !== 'AM' && session !== 'PM')) return
        const address =
          (session === 'AM'
            ? (record && record.locationAM && record.locationAM.address)
            : (record && record.locationPM && record.locationPM.address)) ||
          fallbackAddress ||
          ''

        if (!this.locationMatchesAutoApprove(address)) {
          const docId = `${this.internId}_${date}`
          const ref = doc(db, 'intern_attendance', docId)
          await updateDoc(ref, {
            validationStatus: 'Pending',
            validationUpdatedAt: serverTimestamp(),
          })
          if (this.record) {
            this.record.validationStatus = 'Pending'
          }
          return
        }

        const docId = `${this.internId}_${date}`
        const ref = doc(db, 'intern_attendance', docId)
        await updateDoc(ref, {
          validationStatus: 'Approved',
          validationUpdatedAt: serverTimestamp(),
        })

        if (this.record) {
          this.record.validationStatus = 'Approved'
        }
      } catch (e) {
        console.error('Auto-approve failed:', e)
      }
    },
    ensureLeafletMap() {
      if (this.leafletMap) return
      const el = this.$refs.leafletMap
      if (!el) return

      this.leafletMap = L.map(el, {
        zoomControl: true,
        attributionControl: true
      })

      this.leafletTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      })

      this.leafletTileLayer.addTo(this.leafletMap)
    },
    destroyLeafletMap() {
      if (this.leafletMap) {
        this.leafletMap.remove()
      }
      this.leafletMap = null
      this.leafletMarker = null
      this.leafletTileLayer = null
    },
    updateLeafletMapFromRecord() {
      const loc = this.currentLocation
      if (!loc) return
      if (!this.leafletMap) return

      const latlng = [loc.latitude, loc.longitude]

      if (!this.leafletMarker) {
        this.leafletMarker = L.marker(latlng)
        this.leafletMarker.addTo(this.leafletMap)
      } else {
        this.leafletMarker.setLatLng(latlng)
      }

      const addressText = this.locationAddress || 'Current Location'
      const popupContent = `<div style="text-align:center;"><b>Your Location</b><br/><span style="font-size: 0.85rem; color: #475569;">${addressText}</span></div>`
      this.leafletMarker.bindPopup(popupContent).openPopup()

      const targetZoom = this.leafletMap.getZoom() || 18
      this.leafletMap.setView(latlng, targetZoom < 18 ? 18 : targetZoom)
      this.leafletMap.invalidateSize()
    },
    startClock() {
      this.stopClock()
      this.clockTimer = setInterval(() => {
        this.clockNow = new Date(Date.now() + this.clockOffset)
      }, 1000)
    },
    stopClock() {
      if (this.clockTimer) {
        clearInterval(this.clockTimer)
        this.clockTimer = null
      }
    },
    formatClockTime(d) {
      if (!d) return '--:--:--'
      const date = d instanceof Date ? d : new Date(d)
      if (Number.isNaN(date.getTime())) return '--:--:--'
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    startTimeIn() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error')
        return
      }
      this.handleTimeIn()
    },
    startTimeOut() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error')
        return
      }
      this.handleTimeOut()
    },
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return dateStr;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      if (Number.isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    async fetchUserTags() {
      try {
        const res = await fetch(`http://localhost:3001/users/${encodeURIComponent(this.internId)}`);
        if (!res.ok) return;
        const data = await res.json();
        const user = data && data.user ? data.user : null;
        if (!user) return;
        if (typeof user.tagging === 'string' && user.tagging.trim()) {
          this.userTagging = user.tagging.trim();
        }
        if (typeof user.todayAmTag === 'string' && user.todayAmTag.trim()) {
          this.userTodayAmTag = user.todayAmTag.trim();
        }
        if (typeof user.todayPmTag === 'string' && user.todayPmTag.trim()) {
          this.userTodayPmTag = user.todayPmTag.trim();
        }
      } catch (e) {
      }
    },
    addNotification(message) {
      if (!message) return
      this.notifications.unshift(message)
      try {
        if (!this.internId) return
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        const existingRaw = localStorage.getItem(key);
        let list = [];
        if (existingRaw) {
          const parsed = JSON.parse(existingRaw);
          if (Array.isArray(parsed)) {
            list = parsed;
          }
        }
        list.unshift(message);
        localStorage.setItem(key, JSON.stringify(list));
        const unreadRaw = localStorage.getItem(unreadKey);
        let unread = 0;
        if (unreadRaw != null) {
          const num = parseInt(unreadRaw, 10);
          if (!Number.isNaN(num) && num >= 0) {
            unread = num;
          }
        }
        unread += 1;
        this.unreadCount = unread;
        localStorage.setItem(unreadKey, String(unread));
      } catch (e) {
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return '--:-- --';
      // Expecting HH:MM:SS or HH:MM
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      let hour = parseInt(parts[0], 10);
      const minute = parts[1];
      if (Number.isNaN(hour)) return timeStr;
      const suffix = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour}:${minute} ${suffix}`;
    },
    formatDuration(totalMinutes) {
      if (totalMinutes == null || Number.isNaN(totalMinutes)) {
        return '--h --m';
      }
      const minutes = Math.max(0, Math.floor(totalMinutes));
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0 && mins === 0) return '0h 0m';
      return `${hours}h ${mins}m`;
    },
    async fetchTodayRecord() {
      try {
        const res = await fetch(`http://localhost:3001/attendance/intern/today?internId=${this.internId}`)
        
        const serverDateStr = res.headers.get('date')
        if (serverDateStr) {
          this.clockOffset = new Date(serverDateStr).getTime() - Date.now()
          this.clockNow = new Date(Date.now() + this.clockOffset)
        }

        const data = await res.json()

        if (!res.ok) {
          console.error('Fetch today record failed', data)
          return
        }

        if (!data.data) {
          // No record yet for today
          this.currentDate = ''
          this.lastActionTime = ''
          this.record = {}
          return
        }

        const rec = data.data
        const { dateString: todayStr } = this.getTodayDateInfo()

        if (rec && rec.date !== todayStr) {
          console.warn('Fetched record date mismatch', rec.date, todayStr)
          this.currentDate = ''
          this.record = {}
          return
        }

        this.currentDate = rec ? rec.date : ''
        this.lastActionTime = rec ? (rec.timeOutPM || rec.timeInPM || rec.timeOutAM || rec.timeInAM || '') : ''
        this.record = rec || {}
        this.updateLocationAddress()
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
      } catch (err) {
        console.error('Error fetching today record', err)
      } finally {
        this.isInitialLoading = false;
      }
    },
    async handleTimeIn() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error');
        return;
      }
      let location = null;
      let reverseGeocodedAddress = '';
      if (navigator.geolocation) {
        try {
          location = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                });
              },
              (err) => {
                console.warn('Geolocation error for time-in:', err);
                resolve(null);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });
        } catch (e) {
          console.warn('Geolocation exception for time-in:', e);
        }
      }
      if (location) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`)
          if (res.ok) {
            const data = await res.json()
            if (data && data.display_name) {
              location.address = data.display_name
              this.locationAddress = data.display_name
              reverseGeocodedAddress = data.display_name
            }
          }
        } catch (e) {
        }
      }
      this.loading = true
      this.loadingType = 'in'
      try {
        const res = await fetch('http://localhost:3001/attendance/intern/time-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ internId: this.internId, location })
        })

        const data = await res.json()

        if (!res.ok) {
          this.openModal('Time In Failed', data.message || 'Time in failed', 'error')
          return
        }

        const payload = data.data
        this.currentDate = payload.date
        this.lastActionTime = payload.timeIn || payload.lastActionTime || ''

        // Replace local record so map and times get latest values (including location)
        if (payload.record) {
          this.record = payload.record
        } else {
          if (!this.record) this.record = {}
          if (payload.session === 'AM') {
            this.record.timeInAM = payload.timeIn
          } else if (payload.session === 'PM') {
            this.record.timeInPM = payload.timeIn
          }
        }

        this.updateLocationAddress()
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })

        await this.autoApproveIfEligible({
          date: payload.date,
          session: payload.session,
          record: payload.record || this.record,
          fallbackAddress: reverseGeocodedAddress || this.locationAddress,
        })

        this.openModal('Time In Successful', `You have successfully timed in for the ${payload.session || ''} session.`, 'success')
        this.addNotification(`Time in for ${payload.session || ''} session at ${this.formatTime(this.lastActionTime)}`)
      } catch (err) {
        this.openModal('Connection Error', 'Error connecting to server. Please try again.', 'error')
      } finally {
        this.loading = false
        this.loadingType = null
      }
    },
    async handleTimeOut() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error');
        return;
      }
      this.loading = true
      this.loadingType = 'out'
      try {
        const res = await fetch('http://localhost:3001/attendance/intern/time-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ internId: this.internId })
        })

        const data = await res.json()

        if (!res.ok) {
          this.openModal('Time Out Failed', data.message || 'Time out failed', 'error')
          return
        }

        const payload = data.data
        this.currentDate = payload.date
        this.lastActionTime = payload.timeOut || payload.lastActionTime || ''

        // Replace local record so map and times get latest values (including location)
        if (payload.record) {
          this.record = payload.record
        } else {
          if (!this.record) this.record = {}
          if (payload.session === 'AM') {
            this.record.timeOutAM = payload.timeOut
          } else if (payload.session === 'PM') {
            this.record.timeOutPM = payload.timeOut
          }
        }

        // Also update totalMinutes so "Total Time Today" updates immediately
        if (payload.record && typeof payload.record.totalMinutes === 'number') {
          this.record.totalMinutes = payload.record.totalMinutes
        }
        this.updateLocationAddress()
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
        this.openModal('Time Out Successful', `You have successfully timed out for the ${payload.session || ''} session.`, 'success')
        this.addNotification(`Time out for ${payload.session || ''} session at ${this.formatTime(this.lastActionTime)}`)
      } catch (err) {
        this.openModal('Connection Error', 'Error connecting to server. Please try again.', 'error')
      } finally {
        this.loading = false
        this.loadingType = null
      }
    },
    async updateLocationAddress() {
      this.locationAddress = ''
      if (!this.record) return
      const loc = this.record.locationPM || this.record.locationAM
      if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
        return
      }
      const lat = loc.latitude
      const lng = loc.longitude

      const hasStoredAddress = typeof loc.address === 'string' && loc.address.trim() !== ''
      const coordsUnchanged = this.lastGeocodedLat === lat && this.lastGeocodedLng === lng

      if (hasStoredAddress) {
        this.locationAddress = loc.address
      }

      if (coordsUnchanged && this.locationAddress) {
        return
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        if (!res.ok) return
        const data = await res.json()
        if (data && data.display_name) {
          this.locationAddress = data.display_name
          this.lastGeocodedLat = lat
          this.lastGeocodedLng = lng

          if (this.record.locationPM) {
            this.record.locationPM.address = data.display_name
          } else if (this.record.locationAM) {
            this.record.locationAM.address = data.display_name
          }
        }
      } catch (e) {
      }
    },
    openModal(title, message, type = 'success') {
      this.modalTitle = title
      this.modalMessage = message
      this.modalType = type
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    async loadInternProfile() {
      try {
        const stored = localStorage.getItem('internUser');
        if (!stored) return;
        const basic = JSON.parse(stored);
        this.intern = { ...this.intern, ...basic, id: basic.id };
        if (!basic.id) return;
        const response = await fetch(`http://localhost:3001/users/${basic.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.user) {
            this.intern = { ...this.intern, ...data.user };
          }
        }
      } catch (err) {
        console.error('Error loading intern profile:', err);
      }
    },
    getTodayDateInfo() {
      // Use Int.DateTimeFormat to consistently get the date string for Asia/Manila (UTC+8)
      const options = { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }
      const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(new Date())
      const find = (type) => parts.find(p => p.type === type).value
      const dateString = `${find('year')}-${find('month')}-${find('day')}`
      return { dateString }
    },
  }
}
</script>


