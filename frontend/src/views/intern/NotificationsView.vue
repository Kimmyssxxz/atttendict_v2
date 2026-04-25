<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex p-2 md:p-3 lg:p-4 gap-3 relative">
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteModal"></div>
      
      <!-- Modal Content -->
      <div class="bg-white rounded-[2rem] w-full max-w-[400px] p-8 flex flex-col items-center text-center shadow-2xl relative z-10 animate-in fade-in zoom-in duration-300">
        <!-- Lottie Animation -->
        <div class="w-48 h-48 mb-2 flex items-center justify-center">
          <dotlottie-wc 
            src="https://lottie.host/d76493e9-6fcf-44d3-8fa4-19bd816c8297/2wXTY5f7Yg.lottie" 
            style="width: 200px; height: 200px;" 
            autoplay 
            loop
          ></dotlottie-wc>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Delete Notification</h2>
        <p class="text-gray-500 mb-8 max-w-[280px]">Do you really want to delete this notification?</p>
        
        <div class="flex gap-4 w-full mt-4">
          <button 
            @click="closeDeleteModal"
            class="flex-1 py-3.5 px-6 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold  transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            class="flex-1 py-3.5 px-6 rounded-2xl bg-[#b22a0e] hover:bg-[#9a240c] text-white font-semibold  transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
    
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
    <main class="flex-1 w-full flex flex-col gap-3 min-w-0">
      
      <!-- Mobile Header Fallback -->
      <header class="px-4 py-5 flex items-center sticky top-0 z-20 bg-gray-50 lg:hidden rounded-2xl">
        <button @click="$router.back()" class="bg-transparent border-none p-0 cursor-pointer flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="flex-1 text-center pr-7">
          <h1 class="m-0 text-black font-semibold text-xl tracking-wide whitespace-nowrap">Notifications</h1>
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
            <h1 class="m-0 text-3xl font-semibold text-gray-900">Notifications</h1>
          </div>
          <div class="flex items-center gap-3 pr-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden shadow-sm cursor-pointer transition-all" @click="$router.push('/intern/profile')">
               <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
               <span v-else>{{ avatarInitials }}</span>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="w-full flex flex-col gap-4 pb-8">
          <template v-if="isInitialLoading">
            <!-- DESKTOP SKELETON -->
            <section class="hidden md:block bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 mx-4 mt-4 animate-pulse">
              <div class="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div class="w-1/3">
                  <div class="h-6 bg-slate-200 rounded mb-2 w-3/4"></div>
                  <div class="h-4 bg-slate-200 rounded w-full"></div>
                </div>
                <div class="flex gap-2">
                  <div class="h-8 w-24 bg-slate-200 rounded-full"></div>
                  <div class="h-8 w-24 bg-slate-200 rounded-full"></div>
                  <div class="h-8 w-24 bg-slate-200 rounded-full"></div>
                </div>
              </div>
              <ul class="list-none m-0 p-0 pl-1 flex flex-col gap-2">
                <li v-for="i in 5" :key="i" class="bg-slate-50 rounded-lg p-3 border border-slate-100 flex gap-3 items-start">
                   <div class="w-4 h-4 rounded bg-slate-200 shrink-0 mt-1"></div>
                   <div class="flex-1">
                     <div class="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
                     <div class="h-8 bg-slate-200 rounded border border-slate-200/60 w-1/2"></div>
                   </div>
                </li>
              </ul>
            </section>
            
            <!-- MOBILE SKELETON -->
            <section class="md:hidden flex flex-col gap-3 px-2 pt-4 animate-pulse">
              <div class="flex items-center justify-between px-1 mb-1">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-9 bg-slate-200 rounded-full"></div>
                  <div class="w-24 h-6 bg-slate-200 rounded"></div>
                </div>
                <div class="w-20 h-6 bg-slate-200 rounded ml-2"></div>
              </div>
              <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-4 mt-1">
                <div v-for="i in 5" :key="i" class="mx-4 py-4 border-b border-gray-100 flex gap-3 items-start">
                   <div class="w-5 h-5 rounded-[0.2rem] bg-slate-200 shrink-0 mt-[0.2rem]"></div>
                   <div class="flex-1 flex flex-col gap-1.5">
                     <div class="h-5 bg-slate-200 rounded w-full"></div>
                     <div class="h-5 bg-slate-200 rounded w-2/3"></div>
                     <div class="h-4 bg-slate-200 rounded w-1/2 mt-1"></div>
                   </div>
                </div>
              </div>
            </section>
          </template>

          <template v-else>
          <!-- DESKTOP VIEW -->
          <section class="hidden md:block bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 mx-4 mt-4">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
              <div>
                <h2 class="m-0 text-[1.1rem] text-slate-900 font-bold">Your Notifications</h2>
                <p class="mt-1 mb-0 text-[0.85rem] text-slate-500">This page will list your recent time in / time out activity.</p>
              </div>
              <div class="flex flex-wrap gap-2">
                <button class="px-3.5 py-1.5 rounded-full border-none bg-slate-200 text-slate-700 text-[0.8rem] font-semibold cursor-pointer transition-colors hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!unreadCount" @click="markAllAsRead">Mark all as read</button>
                <button class="px-3.5 py-1.5 rounded-full border-none bg-slate-200 text-slate-700 text-[0.8rem] font-semibold cursor-pointer transition-colors hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!selectedIndexes.length" @click="deleteSelected">Delete selected</button>
                <button class="px-3.5 py-1.5 rounded-full border-none bg-red-100 text-red-700 hover:bg-red-200 text-[0.8rem] font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!notifications.length" @click="deleteAll">Delete all</button>
              </div>
            </div>

            <ul v-if="notifications.length" class="list-none m-0 p-0 pl-1 text-[0.9rem] text-slate-900 flex flex-col gap-2">
              <li v-for="(n, idx) in notifications" :key="idx" class="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <label class="flex items-start justify-between gap-3 cursor-pointer w-full">
                  <div class="flex items-start gap-3 w-full">
                    <input type="checkbox" v-model="selectedIndexes" :value="idx" class="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
                    <div class="flex flex-col gap-1.5 w-full">
                      <span class="font-medium text-slate-800 whitespace-pre-wrap" v-html="formatNotification(n)"></span>
                      <div
                        v-if="n.metadata && (n.metadata.timeInLocation || n.metadata.timeOutLocation || n.metadata.location)"
                        class="flex flex-col gap-1 text-[0.8rem] text-slate-500 bg-white p-2 rounded-md border border-slate-200/60"
                      >
                        <span v-if="n.metadata.timeInLocation" class="flex gap-1"><span class="font-semibold shrink-0">Time In:</span> <span class="truncate">{{ formatLocation(n.metadata.timeInLocation) }}</span></span>
                        <span v-if="n.metadata.timeOutLocation" class="flex gap-1"><span class="font-semibold shrink-0">Time Out:</span> <span class="truncate">{{ formatLocation(n.metadata.timeOutLocation) }}</span></span>
                        <span v-else-if="!n.metadata.timeInLocation && !n.metadata.timeOutLocation && n.metadata.location" class="flex gap-1"><span class="font-semibold shrink-0">Location:</span> <span class="truncate">{{ n.metadata.location }}</span></span>
                      </div>
                    </div>
                  </div>
                </label>
              </li>
            </ul>
            <p v-else class="text-[0.85rem] text-slate-500 italic m-0 pt-2 text-center">No notifications yet.</p>
          </section>

          <!-- MOBILE VIEW -->
          <section class="md:hidden flex flex-col gap-3 px-2 pt-4">
            
            <!-- Mobile Header Buttons -->
            <div class="flex items-center justify-between px-1 mb-1">
              <div class="flex items-center gap-4">
                <button class="border-none bg-[#dae9fb] text-[#13438a] font-medium text-sm px-8 py-2 rounded-full cursor-pointer active:scale-95 transition-transform shrink-0" :disabled="!unreadCount" @click="markAllAsRead">
                  All
                </button>
                <button class="border-none bg-transparent text-slate-800 font-medium text-[0.95rem] p-0 cursor-pointer disabled:opacity-50" :disabled="!selectedIndexes.length" @click="deleteSelected">
                  Delete Selected
                </button>
              </div>
              <button class="border-none bg-transparent text-[#d55e5a] font-medium text-[0.95rem] p-0 cursor-pointer disabled:opacity-50 whitespace-nowrap ml-2" :disabled="!notifications.length" @click="deleteAll">
                Delete All
              </button>
            </div>

            <!-- List Card -->
            <div v-if="notifications.length" class="bg-white rounded-lg shadow-sm overflow-hidden  mb-4">
              <div v-for="(n, idx) in notifications" :key="idx" class="mx-4 py-4" :class="{'border-b border-gray-200': idx !== notifications.length - 1}">
                <label class="flex items-start gap-3 cursor-pointer w-full">
                  <input type="checkbox" v-model="selectedIndexes" :value="idx" class="mt-[0.2rem] w-5 h-5 rounded-[0.2rem] border-2 border-gray-400 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0 appearance-none bg-transparent checked:bg-blue-600 checked:border-transparent relative before:content-[''] checked:before:absolute checked:before:w-[5px] checked:before:h-[10px] checked:before:border-r-2 checked:before:border-b-2 checked:before:border-white checked:before:rotate-45 checked:before:left-[6px] checked:before:top-[3px]" />
                  
                  <div class="flex flex-col min-w-0 flex-1 gap-1">
                    <span class="text-sm text-black leading-snug whitespace-pre-wrap font-normal" v-html="formatNotification(n)"></span>
                    
                    <div v-if="n.metadata && (n.metadata.timeInLocation || n.metadata.timeOutLocation || n.metadata.location)" class="flex items-center gap-1.5 mt-1 text-[0.8rem] text-slate-700">
                      <svg class="w-3.5 h-3.5 shrink-0 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span class="truncate" v-if="n.metadata.timeInLocation">{{ formatLocation(n.metadata.timeInLocation) }}</span>
                      <span class="truncate" v-else-if="n.metadata.timeOutLocation">{{ formatLocation(n.metadata.timeOutLocation) }}</span>
                      <span class="truncate" v-else-if="n.metadata.location">{{ n.metadata.location }}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
            
            <div v-else class="text-center p-8 text-slate-500 bg-white rounded-2xl shadow-sm border border-slate-200 mt-2">
              No notifications yet.
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
  </div>
</template>

<script>
export default {
  name: 'InternNotificationsView',
  data() {
    return {
      notifications: [],
      unreadCount: 0,
      internId: null,
      selectedIndexes: [],
      showNotifications: false,
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
      selectedIndexes: [],
      showNotifications: false,
      isInitialLoading: true,
      
      // Delete Modal State
      showDeleteModal: false,
      deleteType: 'selected', // 'selected' or 'all'
    }
  },
  created() {
    this.loadInternProfile();
    try {
      const stored = localStorage.getItem('internUser');
      if (!stored) {
        this.isInitialLoading = false;
        return;
      }
      const user = JSON.parse(stored);
      const internId = user && user.id;
      if (!internId) {
        this.isInitialLoading = false;
        return;
      }
      this.internId = internId;
      // First try to load from backend (Firebase notifications table)
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/notifications/user/${internId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.notifications)) {
            this.notifications = data.notifications;
          }
        })
        .catch(() => {
          // Fallback to localStorage if backend fetch fails
          try {
            const key = `internNotifications_${internId}`;
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              // Support old string-only format from localStorage
              this.notifications = list.map((item) => (
                typeof item === 'string'
                  ? { message: item }
                  : item
              ));
            }
          } catch (e) {}
        })
        .finally(() => {
          this.isInitialLoading = false;
        });

      // Load unread count from localStorage for the bell and buttons
      const unreadKey = `internNotificationsUnread_${internId}`;
      const unreadRaw = localStorage.getItem(unreadKey);
      if (unreadRaw != null) {
        const num = parseInt(unreadRaw, 10);
        if (!Number.isNaN(num) && num >= 0) {
          this.unreadCount = num;
        }
      }
    } catch (e) {
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
    formatLocation(value) {
      if (!value) return ''
      if (typeof value === 'string') return value
      if (typeof value.address === 'string' && value.address.trim() !== '') {
        return value.address
      }
      return ''
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    markAllAsRead() {
      if (!this.internId) return
      this.unreadCount = 0
      try {
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.setItem(unreadKey, '0');
      } catch (e) {
      }
    },
    deleteAll() {
      if (!this.internId) return
      this.deleteType = 'all'
      this.showDeleteModal = true
    },
    deleteSelected() {
      if (!this.internId || !this.selectedIndexes.length) return
      this.deleteType = 'selected'
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      this.showDeleteModal = false
    },
    confirmDelete() {
      if (this.deleteType === 'all') {
        this.executeDeleteAll()
      } else {
        this.executeDeleteSelected()
      }
      this.closeDeleteModal()
    },
    executeDeleteAll() {
      if (!this.internId) return
      // First call backend to delete from Firestore
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/notifications/user/${this.internId}`, {
        method: 'DELETE'
      }).catch(() => {})
      
      this.notifications = []
      this.unreadCount = 0
      this.selectedIndexes = []
      try {
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.removeItem(key);
        localStorage.setItem(unreadKey, '0');
      } catch (e) {}
    },
    executeDeleteSelected() {
      if (!this.internId || !this.selectedIndexes.length) return

      // Collect messages to delete based on selected indexes
      const messagesToDelete = this.selectedIndexes
        .map((i) => {
          const n = this.notifications[i];
          if (!n) return null;
          return typeof n === 'string' ? n : n.message;
        })
        .filter((v) => typeof v === 'string');

      // Call backend to delete matching notifications in Firestore
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/notifications/user/${this.internId}/delete-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToDelete })
      }).catch(() => {})

      // Update local list and unread counter
      const remaining = this.notifications.filter((_, idx) => !this.selectedIndexes.includes(idx));
      this.notifications = remaining;
      this.selectedIndexes = [];
      this.unreadCount = Math.min(this.unreadCount, remaining.length);
      try {
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.setItem(key, JSON.stringify(remaining));
        localStorage.setItem(unreadKey, String(this.unreadCount));
      } catch (e) {}
    }
  }
}
</script>


