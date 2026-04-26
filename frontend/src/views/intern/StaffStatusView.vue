<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800">
    
    <!-- DESKTOP VIEW -->
    <div v-if="isDesktop" class="flex p-2 md:p-3 lg:p-4 gap-3 h-screen overflow-hidden">
      <!-- Left Sidebar Navbar -->
      <aside class="w-[280px] bg-[#133e75] hidden lg:flex flex-col h-full rounded-2xl shrink-0 shadow-sm overflow-y-auto custom-scrollbar border-8 border-gray-50/0">
        <div class="px-8 py-8 shrink-0">
          <div class="flex items-center gap-3 mb-6">
            <img src="/4.png" alt="Logo" class="h-10 w-auto object-contain" />
            <h1 class="m-0 text-2xl font-bold text-white uppercase tracking-wider">Attendict</h1>
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
      <main class="flex-1 w-full flex flex-col gap-3 min-w-0">
        <!-- Top Header Bar (Desktop Only) -->
        <header class="flex p-2 items-center justify-between shrink-0">
          <div class="flex items-center gap-2 pl-2">
            <button @click="$router.back()" class="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 class="m-0 text-3xl font-semibold text-gray-900">Staff Status</h1>
          </div>
          <div class="flex items-center gap-3 pr-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden shadow-sm cursor-pointer transition-all" @click="$router.push('/intern/profile')">
               <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
               <span v-else>{{ avatarInitials }}</span>
            </div>
          </div>
        </header>

        <!-- Content Area Desktop -->
        <div class="flex-1 w-full flex flex-col gap-4 overflow-y-auto custom-scrollbar">
          <template v-if="isInitialLoading">
            <!-- SKELETON DESKTOP -->
            <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 mx-4 mt-4 animate-pulse">
              <div class="h-6 bg-slate-200 rounded w-1/4 mb-2"></div>
              <div class="h-4 bg-slate-200 rounded w-1/3 mb-6"></div>
              <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                <div v-for="i in 6" :key="i" class="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center">
                  <div class="w-16 h-16 rounded-full bg-slate-200 mb-4"></div>
                  <div class="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                  <div class="h-3 bg-slate-200 rounded w-1/2 mb-4"></div>
                  <div class="w-full h-8 bg-slate-200 rounded"></div>
                </div>
              </div>
            </section>
          </template>
          <template v-else>
            <!-- Real Desktop Content -->
            <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 mx-4 mt-4 mb-4">
              <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h2 class="m-0 text-[1.1rem] text-slate-900">All Staff</h2>
                  <p class="mt-1 mb-0 text-[0.85rem] text-slate-500">List of staff accounts retrieved from the system.</p>
                </div>
                <div class="flex justify-end w-full md:w-auto">
                  <button class="px-3.5 py-2 rounded-full border-none bg-slate-200 text-slate-900 text-[0.85rem] font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-colors hover:bg-slate-300" :disabled="loading" @click="fetchStaff">
                    {{ loading ? 'Loading...' : 'Refresh' }}
                  </button>
                </div>
              </div>

              <p v-if="error" class="mt-1 mb-0 text-[0.85rem] text-slate-500">{{ error }}</p>

              <div v-if="!loading && staff.length === 0" class="text-center p-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                No staff found
              </div>

              <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mt-4">
                <div v-for="s in staff" :key="s.id" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
                  <div class="w-16 h-16 rounded-full bg-blue-50 text-[#133e75] flex items-center justify-center text-[1.75rem] font-bold mb-4 overflow-hidden border-2 border-white shadow-sm">
                    <img v-if="s.photoUrl" :src="s.photoUrl" :alt="s.lastName" class="w-full h-full object-cover" />
                    <span v-else>{{ (s.firstName || '?').charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="flex flex-col w-full">
                    <h3 class="m-0 mb-1 text-[1.1rem] text-slate-800 font-semibold">{{ formatName(s) }}</h3>
                    <span class="text-[0.85rem] text-slate-500 mb-4 font-medium pb-4 border-b border-slate-100">{{ s.position || s.userType || 'Staff' }}</span>
                    
                    <div class="flex items-center gap-2 text-[0.85rem] text-slate-600 mb-2 text-left">
                      <span class="w-[14px] h-[14px] bg-slate-400 inline-block shrink-0 ml-0.5" :style="{ WebkitMaskImage: icons.username, WebkitMaskSize: 'cover', maskImage: icons.username, maskSize: 'cover' }"></span>
                      <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{{ s.username || '-' }}</span>
                    </div>
                    
                    <div class="flex items-center gap-2 text-[0.85rem] text-slate-600 mb-2 text-left">
                      <span class="w-[14px] h-[14px] bg-slate-400 inline-block shrink-0 ml-0.5" :style="{ WebkitMaskImage: icons.email, WebkitMaskSize: 'cover', maskImage: icons.email, maskSize: 'cover' }"></span>
                      <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1" :title="s.email || '-'">{{ s.email || '-' }}</span>
                    </div>
                    
                    <div class="mt-4 px-4 py-2 rounded-full text-[0.85rem] font-semibold inline-flex items-center justify-center gap-2 border" 
                         :class="getStatusClass(s.staffStatus)">
                      <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(s.staffStatus)"></span>
                      {{ s.staffStatus || 'Off Duty' }}
                    </div>

                    <!-- Detailed Status Section Desktop -->
                    <div v-if="s.staffStatusData && s.staffStatusData.attendanceDate === todayDate && (s.staffStatusData.timeInAM || s.staffStatusData.timeInPM)" class="mt-4 pt-4 border-t border-slate-100 w-full text-left">
                      <div class="text-[0.7rem] font-bold text-slate-400 uppercase tracking-wider mb-3">Today's Log</div>
                      
                      <!-- AM Session Details -->
                      <div v-if="s.staffStatusData.timeInAM" class="mb-4 last:mb-0">
                        <div class="flex items-center justify-between mb-1.5">
                          <span class="text-[0.75rem] font-bold text-slate-700">AM Session</span>
                          <span class="text-[0.7rem] text-slate-400 font-medium">{{ s.staffStatusData.timeInAM }} - {{ s.staffStatusData.timeOutAM || '...' }}</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                          <div class="px-2 py-0.5 rounded text-[0.65rem] font-bold flex items-center gap-1 border shadow-sm" :class="getStatusClass(s.staffStatusData.staffStatusAM)">
                            <span class="opacity-70">IN:</span> {{ s.staffStatusData.staffStatusAM || 'At Office' }}
                          </div>
                          <div v-if="s.staffStatusData.timeOutAM" class="px-2 py-0.5 rounded text-[0.65rem] font-bold flex items-center gap-1 border shadow-sm" :class="getStatusClass(s.staffStatusData.staffStatusOutAM)">
                            <span class="opacity-70">OUT:</span> {{ s.staffStatusData.staffStatusOutAM || 'At Office' }}
                          </div>
                        </div>
                      </div>

                      <!-- PM Session Details -->
                      <div v-if="s.staffStatusData.timeInPM" class="last:mb-0">
                        <div class="flex items-center justify-between mb-1.5">
                          <span class="text-[0.75rem] font-bold text-slate-700">PM Session</span>
                          <span class="text-[0.7rem] text-slate-400 font-medium">{{ s.staffStatusData.timeInPM }} - {{ s.staffStatusData.timeOutPM || '...' }}</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                          <div class="px-2 py-0.5 rounded text-[0.65rem] font-bold flex items-center gap-1 border shadow-sm" :class="getStatusClass(s.staffStatusData.staffStatusPM)">
                            <span class="opacity-70">IN:</span> {{ s.staffStatusData.staffStatusPM || 'At Office' }}
                          </div>
                          <div v-if="s.staffStatusData.timeOutPM" class="px-2 py-0.5 rounded text-[0.65rem] font-bold flex items-center gap-1 border shadow-sm" :class="getStatusClass(s.staffStatusData.staffStatusOutPM)">
                            <span class="opacity-70">OUT:</span> {{ s.staffStatusData.staffStatusOutPM || 'At Office' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </template>
        </div>
      </main>
    </div>

    <!-- MOBILE VIEW -->
    <div v-if="!isDesktop" class="flex flex-col h-screen overflow-hidden">
      <!-- Mobile Header -->
      <header class="px-6 py-7 flex items-center sticky top-0 z-20 bg-gray-50 border-b border-transparent">
        <button @click="$router.back()" class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="flex-1 text-center pr-7">
          <h1 class="m-0 text-black font-semibold text-xl tracking-wide whitespace-nowrap">Staff Status</h1>
        </div>
      </header>

      <!-- Main Content (Mobile) -->
      <main class="flex-1 overflow-y-auto custom-scrollbar px-2 pt-4 flex flex-col gap-3 pb-28">
        <template v-if="isInitialLoading">
          <!-- MOBILE SKELETON -->
          <div v-for="i in 5" :key="i" class="bg-white rounded-2xl shadow-sm overflow-hidden p-5 animate-pulse flex gap-4">
             <div class="w-[90px] h-[90px] shrink-0 bg-slate-200 rounded-xl"></div>
             <div class="flex-1 flex flex-col gap-2 pt-1">
               <div class="h-5 bg-slate-200 rounded w-3/4"></div>
               <div class="h-3 bg-slate-200 rounded w-1/2"></div>
               <div class="h-6 bg-slate-200 rounded-full w-20 self-end mt-4"></div>
             </div>
          </div>
        </template>
        <template v-else>
          <!-- Mobile Real Content -->
          <div class="flex justify-end px-1 pb-1">
            <button class="px-5 py-2 rounded-xl border-none bg-white text-slate-800 text-[0.85rem] font-semibold cursor-pointer shadow-sm border border-gray-100 active:scale-95 transition-transform" @click="fetchStaff" :disabled="loading">
              {{ loading ? 'Updating...' : 'Refresh Status' }}
            </button>
          </div>

          <div v-if="staff.length === 0" class="text-center p-8 text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-200">
            No staff records found.
          </div>

          <div v-for="s in staff" :key="s.id" class="bg-white rounded-2xl shadow-sm border border-gray-50 flex flex-col p-5 gap-4">
            <div class="flex gap-4">
              <!-- Initial Box -->
              <div class="w-[90px] h-[90px] shrink-0 bg-[#133e75] text-white flex items-center justify-center text-[2.5rem] font-bold rounded-xl shadow-sm overflow-hidden border-2 border-white">
                <img v-if="s.photoUrl" :src="s.photoUrl" :alt="s.lastName" class="w-full h-full object-cover" />
                <span v-else>{{ (s.firstName || '?').charAt(0).toUpperCase() }}</span>
              </div>
              
              <!-- Info -->
              <div class="flex flex-col flex-1 min-w-0 pt-1">
                <h3 class="m-0 text-lg font-bold text-gray-900 tracking-tight truncate">{{ formatName(s) }}</h3>
                <span class="text-sm text-gray-500 font-medium pb-2 truncate">{{ s.position || s.userType || 'Staff' }}</span>
                
                <div class="flex flex-col gap-1.5 mt-auto">
                  <div class="flex items-center gap-2 text-[0.7rem] text-gray-500">
                    <span class="w-[13px] h-[13px] bg-gray-400 inline-block shrink-0 ml-0.5" :style="{ WebkitMaskImage: icons.username, WebkitMaskSize: 'cover', maskImage: icons.username, maskSize: 'cover' }"></span>
                    <span class="truncate font-medium">{{ s.username || '-' }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-[0.7rem] text-gray-500">
                    <span class="w-[13px] h-[13px] bg-gray-400 inline-block shrink-0 ml-0.5" :style="{ WebkitMaskImage: icons.email, WebkitMaskSize: 'cover', maskImage: icons.email, maskSize: 'cover' }"></span>
                    <span class="truncate font-medium">{{ s.email || '-' }}</span>
                  </div>
                </div>
              </div>
            </div>

             <!-- Status Pill Mobile -->
             <div class="flex flex-col gap-3 pt-3 border-t border-gray-50">
                <div class="flex justify-end">
                   <div class="px-4 py-1.5 rounded-full text-[0.7rem] font-bold inline-flex items-center justify-center gap-1.5 border" 
                        :class="getStatusClass(s.staffStatus)">
                     <span class="w-[6px] h-[6px] rounded-full" 
                           :class="getStatusDotClass(s.staffStatus)"></span>
                     {{ s.staffStatus || 'Off Duty' }}
                   </div>
                </div>

                <!-- Detailed Status Section Mobile -->
                <div v-if="s.staffStatusData && s.staffStatusData.attendanceDate === todayDate && (s.staffStatusData.timeInAM || s.staffStatusData.timeInPM)" class="bg-gray-50/50 rounded-xl p-3 flex flex-col gap-3 border border-gray-100/50">
                  <div class="text-[0.65rem] font-bold text-gray-400 uppercase tracking-widest px-1">Today's Log</div>
                  
                  <!-- AM Session -->
                  <div v-if="s.staffStatusData.timeInAM" class="flex flex-col gap-2">
                    <div class="flex items-center justify-between px-1">
                      <span class="text-[0.7rem] font-bold text-gray-700">AM Session</span>
                      <span class="text-[0.65rem] text-gray-400 font-medium">{{ s.staffStatusData.timeInAM }} - {{ s.staffStatusData.timeOutAM || '...' }}</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <div class="px-2 py-1 rounded-lg text-[0.65rem] font-bold flex items-center gap-1 border" :class="getStatusClass(s.staffStatusData.staffStatusAM)">
                        <span class="opacity-60">IN:</span> {{ s.staffStatusData.staffStatusAM || 'At Office' }}
                      </div>
                      <div v-if="s.staffStatusData.timeOutAM" class="px-2 py-1 rounded-lg text-[0.65rem] font-bold flex items-center gap-1 border" :class="getStatusClass(s.staffStatusData.staffStatusOutAM)">
                        <span class="opacity-60">OUT:</span> {{ s.staffStatusData.staffStatusOutAM || 'At Office' }}
                      </div>
                    </div>
                  </div>

                  <!-- PM Session -->
                  <div v-if="s.staffStatusData.timeInPM" class="flex flex-col gap-2">
                    <div class="flex items-center justify-between px-1">
                      <span class="text-[0.7rem] font-bold text-gray-700">PM Session</span>
                      <span class="text-[0.65rem] text-gray-400 font-medium">{{ s.staffStatusData.timeInPM }} - {{ s.staffStatusData.timeOutPM || '...' }}</span>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      <div class="px-2 py-1 rounded-lg text-[0.65rem] font-bold flex items-center gap-1 border" :class="getStatusClass(s.staffStatusData.staffStatusPM)">
                        <span class="opacity-60">IN:</span> {{ s.staffStatusData.staffStatusPM || 'At Office' }}
                      </div>
                      <div v-if="s.staffStatusData.timeOutPM" class="px-2 py-1 rounded-lg text-[0.65rem] font-bold flex items-center gap-1 border" :class="getStatusClass(s.staffStatusData.staffStatusOutPM)">
                        <span class="opacity-60">OUT:</span> {{ s.staffStatusData.staffStatusOutPM || 'At Office' }}
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
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
  </div>
</template>

<script>
export default {
  name: 'InternStaffStatusView',
  data() {
    return {
      isInitialLoading: true,
      staff: [],
      loading: false,
      error: '',
      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        photoUrl: '',
      },
      icons: {
        logout: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9'/%3E%3C/svg%3E\")",
        username: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%23000' d='M14.608 12.172c0 .84.239 1.175.864 1.175c1.393 0 2.28-1.775 2.28-4.727c0-4.512-3.288-6.672-7.393-6.672c-4.223 0-8.064 2.832-8.064 8.184c0 5.112 3.36 7.896 8.52 7.896c1.752 0 2.928-.192 4.727-.792l.386 1.607c-1.776.577-3.674.744-5.137.744c-6.768 0-10.393-3.72-10.393-9.456c0-5.784 4.201-9.72 9.985-9.72c6.024 0 9.215 3.6 9.215 8.016c0 3.744-1.175 6.6-4.871 6.6c-1.681 0-2.784-.672-2.928-2.161c-.432 1.656-1.584 2.161-3.145 2.161c-2.088 0-3.84-1.609-3.84-4.848c0-3.264 1.537-5.28 4.297-5.28c1.464 0 2.376.576 2.782 1.488l.697-1.272h2.016v7.057zm-2.951-3.168c0-1.319-.985-1.872-1.801-1.872c-.888 0-1.871.719-1.871 2.832c0 1.68.744 2.616 1.871 2.616c.792 0 1.801-.504 1.801-1.896z'/%3E%3C/svg%3E\")",
        email: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 4H5a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3m-.67 2L12 10.75L5.67 6ZM19 18H5a1 1 0 0 1-1-1V7.25l7.4 5.55a1 1 0 0 0 .6.2a1 1 0 0 0 .6-.2L20 7.25V17a1 1 0 0 1-1 1'/%3E%3C/svg%3E\")",
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
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      isDesktop: window.innerWidth >= 1024,
      todayDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
    }
  },
  created() {
    this.loadInternProfile()
    this.fetchStaff()
    this.syncNotifications()
  },
  mounted() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
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
    }
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
    syncNotifications() {
      try {
        const stored = localStorage.getItem('internUser')
        if (!stored) return
        const user = JSON.parse(stored)
        const internId = user && user.id
        if (!internId) return
        const key = `internNotifications_${internId}`
        const unreadKey = `internNotificationsUnread_${internId}`
        const raw = localStorage.getItem(key)
        if (raw) {
          const list = JSON.parse(raw)
          if (Array.isArray(list)) {
            this.notifications = list
          }
        }
        }
        this.syncUnreadCount()
      } catch (e) {}
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    syncUnreadCount() {
      const count = this.notifications.filter(n => {
        const isRead = typeof n === 'object' ? n.isRead : false;
        return !isRead;
      }).length;
      this.unreadCount = count;
      if (this.internId) {
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.setItem(unreadKey, String(count));
      }
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
    formatName(s) {
      const last = (s && s.lastName) || ''
      const first = (s && s.firstName) || ''
      const middle = (s && s.middleName) || ''

      if (last || first || middle) {
        const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim()
        return middle ? `${main} ${middle}`.trim() : main
      }
      return (s && (s.fullName || s.name)) || ''
    },
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024
    },
    async fetchStaff() {
      this.loading = true
      this.error = ''
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/staff`)
        const json = await (res.ok ? res.json() : Promise.resolve(null))
        if (!json || !Array.isArray(json.staff)) {
          this.staff = []
          this.error = 'Failed to load staff list.'
          return
        }
        this.staff = json.staff

        await this.fetchStaffStatuses()
      } catch (e) {
        this.staff = []
        this.error = 'Failed to load staff list.'
      } finally {
        this.loading = false
        this.isInitialLoading = false
      }
    },

    async fetchStaffStatuses() {
      if (!Array.isArray(this.staff) || this.staff.length === 0) return

      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

      const results = await Promise.all(
        this.staff.map(async (s) => {
          try {
            if (!s || !s.id) return { id: s && s.id, staffStatus: '' }
            const res = await fetch(`${base}/staff/${encodeURIComponent(s.id)}/status`)
            const json = await (res.ok ? res.json() : Promise.resolve(null))
            return {
              id: s.id,
              staffStatus: (json && typeof json.staffStatus === 'string') ? json.staffStatus : '',
              staffStatusData: json || null,
            }
          } catch {
            return { id: s && s.id, staffStatus: '', staffStatusData: null }
          }
        })
      )

      const map = new Map(results.map((r) => [r.id, r]))
      this.staff = this.staff.map((s) => {
        const statusObj = map.get(s.id)
        return {
          ...s,
          staffStatus: statusObj?.staffStatus || s.staffStatus || '',
          staffStatusData: statusObj?.staffStatusData || null
        }
      })
    },
    getStatusClass(status) {
      switch (status) {
        case 'Travel':
          return 'bg-blue-50 text-blue-600 border-blue-100';
        case 'On Field':
          return 'bg-orange-50 text-orange-600 border-orange-100';
        case 'At Office':
          return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'Leave':
          return 'bg-gray-50 text-gray-500 border-gray-100';
        case 'On Duty':
          return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        default:
          return 'bg-slate-50 text-slate-500 border-slate-100';
      }
    },
    getStatusDotClass(status) {
      switch (status) {
        case 'Travel':
          return 'bg-blue-500';
        case 'On Field':
          return 'bg-orange-500';
        case 'At Office':
        case 'On Duty':
          return 'bg-emerald-500';
        case 'Leave':
          return 'bg-gray-400';
        default:
          return 'bg-slate-400';
      }
    },
  },
}
</script>


