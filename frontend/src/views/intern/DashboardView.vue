<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex lg:p-4 lg:gap-3">
    
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
    <main class="flex-1 w-full flex flex-col lg:gap-3 min-w-0">
      
      <!-- Mobile Header -->
      <header class="lg:hidden bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-50 border-b border-gray-200">
        <div class="flex items-center gap-2">
          <img src="/3.png" alt="Logo" class="h-8 w-8 object-contain" />
          <h1 class="m-0 text-2xl font-bold text-gray-900 tracking-tight">ATTENDICT</h1>
        </div>

        <div class="flex items-center gap-2">
          <div class="w-9 h-9 rounded-full bg-blue-100 overflow-hidden border-2 border-white shadow-sm" @click="$router.push('/intern/profile')">
             <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
             <div v-else class="w-full h-full bg-[#133e75] text-white flex items-center justify-center text-xs font-bold">{{ avatarInitials }}</div>
          </div>
        </div>
      </header>


      <!-- Content Container -->
      <div class="flex-1 w-full flex flex-col gap-4 overflow-y-auto custom-scrollbar">
        
        <!-- Top Header Bar (Desktop Only) -->
        <header class="hidden lg:flex p-2 items-center justify-between shrink-0">
          <div class="flex items-center gap-2 pl-2">
            <h1 class="m-0 text-xl font-semibold text-gray-900">Dashboard</h1>
          </div>
          <div class="flex items-center gap-3 pr-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden shadow-sm cursor-pointer transition-all" @click="$router.push('/intern/profile')">
               <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
               <span v-else>{{ avatarInitials }}</span>
            </div>
          </div>
        </header>

        <!-- Main Content -->
        <main class="w-full px-4 flex flex-col gap-5">
          <template v-if="isInitialLoading">
            <!-- Mobile Hero Card Skeleton -->
            <div class="lg:hidden bg-slate-200 animate-pulse rounded-[2rem] p-6 h-[200px] mt-2"></div>

            <!-- Progress Section Skeleton -->
            <div class="lg:hidden animate-pulse">
              <div class="flex justify-between items-end mb-1">
                 <div class="h-3 bg-slate-200 rounded w-48 mb-2"></div>
                 <div class="h-3 bg-slate-200 rounded w-16 mb-2"></div>
              </div>
              <div class="w-full h-1 bg-slate-200 rounded-full"></div>
            </div>

            <!-- Info Cards Skeleton -->
            <div class="lg:hidden grid grid-cols-3 gap-3 animate-pulse">
              <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-4 min-h-[140px] flex flex-col items-center justify-center border border-gray-100 shadow-sm">
                <div class="w-10 h-10 rounded-full bg-slate-200 mb-3"></div>
                <div class="h-3 bg-slate-200 rounded w-16 mb-2"></div>
                <div class="h-4 bg-slate-200 rounded w-20"></div>
              </div>
            </div>

            <!-- Desktop & Shared Grid Skeleton -->
            <div class="w-full grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-6">
              <section class="flex flex-col gap-6">
                <!-- Desktop Welcome Skeleton -->
                <div class="hidden lg:flex bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 flex-col gap-5 animate-pulse">
                  <div class="flex items-center gap-4">
                    <div class="flex flex-col gap-2">
                      <div class="h-6 bg-slate-200 rounded w-64"></div>
                      <div class="h-4 bg-slate-200 rounded w-80"></div>
                    </div>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="i in 5" :key="i">
                      <div class="h-3 bg-slate-200 rounded w-24 mb-1"></div>
                      <div class="h-5 bg-slate-200 rounded w-40"></div>
                    </div>
                  </div>
                  <div class="mt-2">
                    <div class="flex justify-between items-center gap-3">
                      <div class="h-3 bg-slate-200 rounded w-48"></div>
                      <div class="h-3 bg-slate-200 rounded w-32"></div>
                    </div>
                    <div class="w-full mt-2 h-2.5 bg-slate-200 rounded-full"></div>
                  </div>
                </div>

                <!-- Weekly Rendered Hours Skeleton -->
                <div class="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 shadow-sm animate-pulse">
                  <div class="flex justify-between items-center">
                    <div class="h-5 bg-slate-200 rounded w-40"></div>
                    <div class="h-5 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div class="h-[250px] bg-slate-50 rounded-xl"></div>
                </div>

                <!-- Attendance Analytics Skeleton -->
                <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-pulse">
                  <div class="h-5 bg-slate-200 rounded w-40 mb-5"></div>
                  <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    <div v-for="i in 4" :key="i" class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                      <div class="h-3 bg-slate-200 rounded w-20"></div>
                      <div class="h-5 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </section>

              <section class="flex flex-col gap-6">
                <!-- Monthly Attendance Skeleton -->
                <div class="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 shadow-sm animate-pulse">
                  <div class="flex justify-between items-center">
                    <div class="h-5 bg-slate-200 rounded w-40"></div>
                    <div class="h-5 bg-slate-200 rounded w-20"></div>
                  </div>
                  <div class="h-[250px] bg-slate-50 rounded-xl"></div>
                </div>

                <!-- Calendar Skeleton -->
                <div class="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col animate-pulse">
                  <div class="bg-slate-200 p-6 h-[100px]"></div>
                  <div class="p-8">
                    <div class="grid grid-cols-7 gap-y-4 gap-x-1">
                      <div v-for="i in 7" :key="i" class="h-4 bg-slate-200 rounded w-8 mx-auto"></div>
                      <div v-for="i in 35" :key="i" class="flex items-center justify-center h-12">
                        <div class="w-10 h-10 rounded-xl bg-slate-50"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </template>

          <template v-else>
          <!-- Mobile Hero Card -->
          <div class="lg:hidden bg-gradient-to-r from-[#133e75] via-[#1a4f94] to-[#0d2b51] rounded-[2rem] p-6 text-white relative overflow-hidden shadow-lg mt-2">
            <div class="relative z-10 w-[60%]">
              <h2 class="text-2xl font-bold leading-tight mb-1">
                Welcome to DICT, <span class="text-[#fec13d]">{{ intern.firstName || 'Student' }}!</span>
              </h2>
              <p class="text-xs text-white mb-6 font-medium">Here's a quick overview of your OJT progress.</p>
              
              <div class="flex gap-1">
                <button @click="$router.push('/intern/time')" class="bg-[#fec13d] text-[#133e75] font-semibold py-2 px-4 rounded-full text-sm border-none shadow-md active:scale-95 transition-transform">Time in</button>
                <button @click="$router.push('/intern/time')" class="bg-white text-[#133e75] font-semibold py-2 px-4 rounded-full text-sm border-none shadow-md active:scale-95 transition-transform">Time out</button>
              </div>
            </div>

            <dotlottie-wc
              src="https://lottie.host/106d63c9-b70a-47e3-a0a3-8165a60bc7ef/wLVlIv3rXw.lottie"
              style="width: 200px; height: 200px;"
              class="absolute bottom-0 -right-4 pointer-events-none"
              autoplay
              loop
            ></dotlottie-wc>
          </div>

          <!-- Progress Section (Mobile) -->
          <div class="lg:hidden">
            <div class="flex justify-between items-end mb-1">
              <span class="text-xs font-medium text-gray-500">Completed Hours vs Required HoursRemaining:</span>
              <span class="text-xs font-semibold text-gray-900">{{ remainingHoursDisplay }} ({{ progressPercent }}%)</span>
            </div>
            <div class="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-[#22c55e] to-[#3b82f6] transition-all duration-500" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>

          <!-- Info Cards (Mobile) -->
          <div class="lg:hidden grid grid-cols-3 gap-3">
            <div class="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-gray-100 min-h-[140px] justify-center">
              <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                <span class="w-5 h-5 bg-[#3b82f6] inline-block" :style="{ WebkitMaskImage: icons.school, WebkitMaskSize: 'cover', maskImage: icons.school, maskSize: 'cover' }"></span>
              </div>
              <span class="text-xs text-gray-400 font-medium">Course/School</span>
              <span class="text-[0.8rem] font-bold text-gray-900 leading-tight">{{ courseAndSchool }}</span>
            </div>
            <div class="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-gray-100 min-h-[140px] justify-center">
              <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mb-3">
                <span class="w-5 h-5 bg-[#22c55e] inline-block" :style="{ WebkitMaskImage: icons.office, WebkitMaskSize: 'cover', maskImage: icons.office, maskSize: 'cover' }"></span>
              </div>
              <span class="text-xs text-gray-400 font-medium">Assigned Office</span>
              <span class="text-[0.8rem] font-bold text-gray-900 leading-tight">{{ assignedOffice }}</span>
            </div>
            <div class="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm border border-gray-100 min-h-[140px] justify-center">
              <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center mb-3">
                <span class="w-5 h-5 bg-[#a855f7] inline-block" :style="{ WebkitMaskImage: icons.requiredHoursIcon, WebkitMaskSize: 'cover', maskImage: icons.requiredHoursIcon, maskSize: 'cover' }"></span>
              </div>
              <span class="text-xs text-gray-400 font-medium">OJT Required Hours</span>
              <span class="text-[0.8rem] font-bold text-gray-900 leading-tight">{{ requiredHours }} hrs</span>
            </div>
          </div>

          <!-- Existing Desktop Layout & Mobile Charts -->
          <div class="w-full grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-6">
            <section class="flex flex-col gap-6">
              <!-- Desktop Specific Header (Hide on mobile since we have the hero) -->
              <div class="hidden lg:flex bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 flex-col gap-5">
                <div class="flex items-center gap-4">
                  <div>
                    <h2 class="m-0 text-[1.25rem] text-slate-900">Welcome to DICT, {{ intern.firstName || 'Student' }}!</h2>
                    <p class="m-0 mt-1 text-[0.85rem] text-slate-500">Here's a quick overview of your OJT progress.</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span class="block text-[0.8rem] text-slate-500 mb-1">Student Name</span>
                    <span class="text-[1.1rem] font-semibold text-slate-900">{{ studentName }}</span>
                  </div>
                  <div>
                    <span class="block text-[0.8rem] text-slate-500 mb-1">Course / School</span>
                    <span class="text-[1.1rem] font-semibold text-slate-900">{{ courseAndSchool }}</span>
                  </div>
                  <div>
                    <span class="block text-[0.8rem] text-slate-500 mb-1">Assigned Office / Supervisor</span>
                    <span class="text-[1.1rem] font-semibold text-slate-900">{{ assignedOffice }}</span>
                  </div>
                  <div>
                    <span class="block text-[0.8rem] text-slate-500 mb-1">OJT Required Hours</span>
                    <span class="text-[1.1rem] font-semibold text-slate-900">{{ requiredHours }} hrs</span>
                  </div>
                  <div>
                    <span class="block text-[0.8rem] text-slate-500 mb-1">OJT Remaining Hours</span>
                    <span class="text-[1.1rem] font-semibold text-slate-900">{{ remainingHoursDisplay }}</span>
                  </div>
                </div>

                <div class="mt-2">
                  <div class="flex justify-between items-center gap-3">
                    <span class="text-[0.8rem] text-slate-500">Completed Hours vs Required Hours</span>
                    <span class="text-[0.8rem] text-slate-600">
                      Remaining: {{ remainingHoursDisplay }} ({{ progressPercent }}%)
                    </span>
                  </div>
                  <div class="w-full mt-2 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-[width] duration-300 ease-in-out" :style="{ width: progressPercent + '%' }"></div>
                  </div>
                </div>
              </div>

              <!-- Weekly Rendered Hours -->
              <div class="bg-white rounded-2xl p-6 flex flex-col gap-4 border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center">
                  <h3 class="m-0 text-slate-900 font-semibold">Weekly Rendered Hours</h3>
                  <span class="text-[0.7rem] font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">This week</span>
                </div>
                <apexchart
                  type="area"
                  height="250"
                  :options="chartOptions"
                  :series="chartSeries"
                ></apexchart>
              </div>

              <!-- Attendance Analytics -->
              <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h3 class="mt-0 mb-5 text-[1rem] text-slate-900 font-semibold">Attendance Analytics</h3>
                <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                  <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                    <span class="block text-xs text-gray-400 font-medium ">Average Time In</span>
                    <span class="block text-[1rem] font-semibold text-gray-900">{{ averageTimeIn }}</span>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                    <span class="block text-xs text-gray-400 font-medium">Work Hours / Day</span>
                    <span class="block text-[1rem] font-semibold text-gray-900">{{ averageWorkingHoursPerDay }} hrs</span>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                    <span class="block text-xs text-gray-400 font-medium">Attendance Rate</span>
                    <span class="block text-[1rem] font-semibold text-gray-900">{{ attendanceRate }}%</span>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-xl flex flex-col gap-1">
                    <span class="block text-xs text-gray-400 font-medium">Most Active Day</span>
                    <span class="block text-[1rem] font-semibold text-gray-900">{{ mostActiveDay }}</span>
                  </div>
                </div>
              </div>
            </section>

            <section class="flex flex-col gap-6">
              <!-- Monthly Attendance -->
              <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div class="flex justify-between items-center mb-6">
                  <h3 class="m-0 text-slate-900 font-semibold">Monthly Attendance</h3>
                  <span class="text-[0.7rem] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{{ monthlyAttendance.monthLabel }}</span>
                </div>
                <apexchart
                  type="bar"
                  height="250"
                  :options="monthlyChartOptions"
                  :series="monthlyChartSeries"
                ></apexchart>
              </div>

              <!-- Calendar View -->
              <div class="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col">
                <!-- Header Section -->
                <div class="bg-gradient-to-r from-[#133e75] via-[#1a4f94] to-[#0d2b51] p-6 text-white">
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="m-0 text-xl font-bold leading-none mb-4">{{ calendarMonthLabel }}</h3>
                      <div class="flex gap-3">
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 rounded-full text-[0.7rem] font-bold border border-blue-500/20 backdrop-blur-sm">
                          <span class="w-1.5 h-1.5 rounded-full bg-blue-400"></span> Present
                        </div>
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full text-[0.7rem] font-bold border border-red-500/20 backdrop-blur-sm">
                          <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span> Holiday
                        </div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button @click="prevMonth" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors shadow-sm [&:active]:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m15 18-6-6 6-6"/></svg>
                      </button>
                      <button @click="nextMonth" class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border-none cursor-pointer transition-colors shadow-sm [&:active]:scale-95">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m9 18 6-6-6-6"/></svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Calendar Body -->
                <div class="p-8">
                  <div class="grid grid-cols-7 gap-y-4 gap-x-1">
                    <div v-for="d in ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']" :key="d" class="text-center text-[0.9rem] font-semibold text-gray-900 mb-2">
                      {{ d }}
                    </div>
                    
                    <div v-for="(day, idx) in calendarWeeksFlat" :key="day.dateKey + '_' + idx" class="flex items-center justify-center relative h-12">
                      <button
                        type="button"
                        @click="handleCalendarDayClick(day)"
                        :class="[
                          'w-10 h-10 border-none rounded-xl text-[0.95rem] font-semibold flex items-center justify-center cursor-pointer transition-all relative z-10',
                          !day.isCurrentMonth ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100',
                          day.dateKey === calendarSelectedDate ? 'bg-[#133e75] !text-white shadow transform scale-110' : 'bg-transparent',
                          day.status === 'present' && day.dateKey !== calendarSelectedDate ? 'after:content-[\'\'] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-blue-500 after:rounded-full' : '',
                          day.status === 'holiday' && day.dateKey !== calendarSelectedDate ? 'after:content-[\'\'] after:absolute after:bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-red-500 after:rounded-full' : ''
                        ]"
                      >
                        {{ day.dayOfMonth }}
                      </button>
                    </div>
                  </div>

                  <!-- Selected Day Details -->
                  <div v-if="calendarSelectedDetails" class="mt-8 pt-8 border-t border-gray-100 animate-fadeIn">
                    <div class="flex justify-between items-center mb-4">
                      <h4 class="m-0 text-base font-semibold text-gray-900">{{ calendarSelectedDetails.displayDate }}</h4>
                      <div :class="['px-3 py-1 rounded-full text-[0.7rem] font-semibold', 
                        calendarSelectedDetails.statusLabel === 'Present' ? 'bg-green-100 text-green-700' : 
                        calendarSelectedDetails.statusLabel === 'Holiday' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600']">
                        {{ calendarSelectedDetails.statusLabel }}
                      </div>
                    </div>
                    <div v-if="calendarSelectedDetails.hasRecord" class="bg-gray-50 rounded-2xl p-5 grid grid-cols-2 gap-4 border border-gray-100">
                      <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray-400 font-semibold ">AM In/Out</span>
                        <span class="text-[0.9rem] font-semibold text-gray-900">{{ calendarSelectedDetails.timeInAM || '--' }} - {{ calendarSelectedDetails.timeOutAM || '--' }}</span>
                      </div>
                      <div class="flex flex-col gap-1">
                        <span class="text-xs text-gray-400 font-semibold ">PM In/Out</span>
                        <span class="text-[0.9rem] font-semibold text-gray-900">{{ calendarSelectedDetails.timeInPM || '--' }} - {{ calendarSelectedDetails.timeOutPM || '--' }}</span>
                      </div>
                      <div class="col-span-2 flex justify-between items-center pt-4 border-t border-gray-200/50">
                        <span class="text-base font-semibold text-gray-900">Total Hours Worked</span>
                        <span class="text-xl font-bold text-[#133e75]">{{ calendarSelectedDetails.totalHours }}h</span>
                      </div>
                    </div>
                    <p v-else class="text-center py-6 text-gray-400 italic text-[0.85rem] bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      No attendance record for this day.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
          </template>
        </main>

      </div>
      
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
    </main>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'InternDashboardView',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      studentName: '',
      courseAndSchool: '',
      assignedOffice: '',
      requiredHours: 0,
      completedHours: 0,
      remainingHours: null,
      chartOptions: {
        chart: {
          type: 'area',
          height: 300,
          stacked: true,
          toolbar: { show: false },
          fontFamily: 'Poppins, sans-serif',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: { enabled: true, delay: 150 },
            dynamicAnimation: { enabled: true, speed: 350 }
          }
        },
        colors: ['#3b82f6', '#10b981'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.45,
            opacityTo: 0.05,
            stops: [20, 100]
          }
        },
        markers: {
          size: 0,
          hover: { size: 5 }
        },
        grid: {
          borderColor: '#f1f5f9',
          strokeDashArray: 4,
          padding: { left: 10, right: 10 }
        },
        legend: { position: 'top', horizontalAlign: 'right', fontWeight: 600 },
        xaxis: { 
          categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        tooltip: {
          theme: 'light',
          x: { show: true },
          y: { formatter: (val) => val + ' hrs' }
        }
      },
      chartSeries: [
        { name: 'Normal Hours', data: [0, 0, 0, 0, 0] },
        { name: 'Overtime', data: [0, 0, 0, 0, 0] },
      ],
      monthlyAttendance: {
        monthLabel: '',
      },
      monthlyChartOptions: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false },
          fontFamily: 'Poppins, sans-serif',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: '45%',
            distributed: true,
            dataLabels: { position: 'top' }
          }
        },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
        dataLabels: { 
          enabled: true,
          offsetY: -20,
          style: { fontSize: '10px', colors: ['#64748b'] },
          formatter: (val) => val + 'd'
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100]
          }
        },
        grid: {
          show: true,
          borderColor: '#f1f5f9',
          strokeDashArray: 2,
          yaxis: { lines: { show: true } },
          xaxis: { lines: { show: false } }
        },
        xaxis: { 
          categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { style: { fontWeight: 500 } }
        },
        yaxis: {
          min: 0,
          max: 7,
          tickAmount: 7,
          labels: { 
            formatter: (val) => Math.round(val),
            style: { colors: '#94a3b8' }
          }
        },
        tooltip: {
          theme: 'light',
          y: { formatter: (val) => val + ' days present' }
        }
      },
      monthlyChartSeries: [
        { name: 'Days Present', data: [0, 0, 0, 0] }
      ],
      averageTimeIn: '--:--',
      averageWorkingHoursPerDay: 0,
      attendanceRate: 0,
      mostActiveDay: 'N/A',
      longestWorkingStreak: 0,
      mostCommonTimeIn: '--:--',
      lowHourDaysCount: 0,
      consistencyScore: 0,
      notifications: [],
      unreadCount: 0,
      internId: null,
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
        settings: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='m20.35 8.923l-.366-.204l-.113-.064a2 2 0 0 1-.67-.66c-.018-.027-.034-.056-.066-.112a2 2 0 0 1-.3-1.157l.006-.425c.012-.68.018-1.022-.078-1.328a2 2 0 0 0-.417-.736c-.214-.24-.511-.412-1.106-.754l-.494-.285c-.592-.341-.889-.512-1.204-.577a2 2 0 0 0-.843.007c-.313.07-.606.246-1.191.596l-.003.002l-.354.211c-.056.034-.085.05-.113.066c-.278.155-.588.24-.907.25c-.032.002-.065.002-.13.002l-.13-.001a2 2 0 0 1-.91-.252c-.028-.015-.055-.032-.111-.066l-.357-.214c-.589-.354-.884-.53-1.199-.601a2 2 0 0 0-.846-.006c-.316.066-.612.238-1.205.582l-.003.001l-.488.283l-.005.004c-.588.34-.883.512-1.095.751a2 2 0 0 0-.415.734c-.095.307-.09.649-.078 1.333l.007.424c0 .065.003.097.002.128a2 2 0 0 1-.301 1.027c-.033.056-.048.084-.065.11a2 2 0 0 1-.675.664l-.112.063l-.361.2c-.602.333-.903.5-1.121.738a2 2 0 0 0-.43.73c-.1.307-.1.65-.099 1.338l.002.563c.001.683.003 1.024.104 1.329a2 2 0 0 0 .427.726c.218.236.516.402 1.113.734l.358.199c.061.034.092.05.121.068a2 2 0 0 1 .74.781l.067.12a2 2 0 0 1 .23 1.038l-.007.407c-.012.686-.017 1.03.079 1.337c.085.272.227.523.417.736c.214.24.512.411 1.106.754l.494.285c.593.341.889.512 1.204.577a2 2 0 0 0 .843-.007c.314-.07.607-.246 1.194-.598l.354-.212l.113-.066c.278-.154.588-.24.907-.25l.13-.001h.13c.318.01.63.097.91.252l.092.055l.376.226c.59.354.884.53 1.199.6a2 2 0 0 0 .846.008c.315-.066.613-.239 1.206-.583l.495-.287c.588-.342.883-.513 1.095-.752c.19-.213.33-.463.415-.734c.095-.305.09-.644.078-1.318l-.008-.44v-.127a2 2 0 0 1 .3-1.028l.065-.11a2 2 0 0 1 .675-.664l.11-.061l.002-.001l.361-.2c.602-.334.903-.5 1.122-.738c.194-.21.34-.46.429-.73c.1-.305.1-.647.098-1.327l-.002-.574c-.001-.683-.002-1.025-.103-1.33a2 2 0 0 0-.428-.725c-.217-.236-.515-.402-1.111-.733z'/%3E%3Cpath d='M8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0'/%3E%3C/g%3E%3C/svg%3E\")",
        school: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'%3E%3Cpath fill='%23000' d='M990.848 696.304V438.16l16.096-8.496c10.464-5.44 17.055-16.225 17.183-28.032c.128-11.777-6.256-22.689-16.592-28.368l-481.44-257.6c-9.631-5.28-21.28-5.249-30.976.095l-478.8 257.92C6.126 379.36-.177 390.143-.113 401.84s6.496 22.4 16.817 27.97l210.384 111.983c-2.64 4.656-4.272 9.968-4.272 15.696v270.784a32.03 32.03 0 0 0 10.72 23.904c6.945 6.16 73.441 60.096 276.753 60.096c202.592 0 270.88-50.976 278-56.784c7.44-6.064 11.744-15.152 11.744-24.784V552.976c0-4.496-.944-8.768-2.608-12.64l129.424-68.369V696.48c-18.976 11.104-31.84 31.472-31.84 55.024c0 35.344 28.656 64 64 64s64-28.656 64-64c0-23.697-13.04-44.145-32.16-55.2zM736.031 812.368c-25.152 12.096-91.712 35.904-225.744 35.904c-134.88 0-199.936-25.344-223.472-37.536V573.6l207.808 110.624a31.9 31.9 0 0 0 15.184 3.84a31.7 31.7 0 0 0 14.816-3.664l211.408-111.664zM510.063 619.81l-411.6-218.561l412.32-220.976l413.6 220.336z'/%3E%3C/svg%3E\")",
        office: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='M248 208h-16V96a8 8 0 0 0 0-16h-48V48a8 8 0 0 0 0-16H40a8 8 0 0 0 0 16v160H24a8 8 0 0 0 0 16h224a8 8 0 0 0 0-16M216 96v112h-32V96ZM56 48h112v160h-24v-48a8 8 0 0 0-8-8H88a8 8 0 0 0-8 8v48H56Zm72 160H96v-40h32ZM72 80a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H80a8 8 0 0 1-8-8m48 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8m-48 40a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16H80a8 8 0 0 1-8-8m48 0a8 8 0 0 1 8-8h16a8 8 0 0 1 0 16h-16a8 8 0 0 1-8-8'/%3E%3C/svg%3E\")",
        requiredHoursIcon: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 2a1 1 0 0 1 .993.883L13 7v4.586l2.707 2.707a1 1 0 0 1-1.32 1.497l-.094-.083l-3-3a1 1 0 0 1-.284-.576L11 12V7a1 1 0 0 1 1-1'/%3E%3C/g%3E%3C/svg%3E\")",
      },

      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        photoUrl: '',
      },
      calendarWeeks: [],
      calendarMonthLabel: '',
      calendarSelectedDate: null,
      calendarSelectedDetails: null,
      attendanceByDate: {},
      currentCalendarDate: new Date(),
      isInitialLoading: true,
    }
  },
  created() {
    try {
      const stored = localStorage.getItem('internUser');
      if (!stored) return;
      const basicUser = JSON.parse(stored);
      const internId = basicUser && basicUser.id;
      if (!internId) return;
      this.internId = internId;

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

      this.loadDashboardData(basicUser);
      this.loadInternProfile();
    } catch (e) {}
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
    progressPercent() {
      if (!this.requiredHours || this.requiredHours <= 0) return 0;
      const raw = (this.completedHours / this.requiredHours) * 100;
      const clamped = Math.max(0, Math.min(raw, 100));
      return Math.round(clamped);
    },
    remainingHoursDisplay() {
      const v = this.remainingHours;
      if (v == null || !Number.isFinite(v)) return '-';
      const totalMinutes = Math.round(v * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}h ${m}m`;
    },
    calendarWeeksFlat() {
      return this.calendarWeeks.reduce((all, week) => all.concat(week.days), []);
    },
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
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
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
      } finally {
        // Initial profile fetch complete
      }
    },
    async loadDashboardData(basicUser) {
      try {
        const internId = this.internId;
        if (!internId) {
          this.isInitialLoading = false;
          return;
        }

        let user = basicUser || {};
        try {
          const userRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${encodeURIComponent(internId)}`);
          if (userRes.ok) {
            const userJson = await userRes.json().catch(() => null);
            if (userJson && userJson.user) {
              user = userJson.user;
            }
          }
        } catch (e) {}

        this.studentName = this.buildStudentName(user, basicUser);
        this.courseAndSchool = this.buildCourseAndSchool(user, basicUser);
        this.assignedOffice = (user.assignedOffice || basicUser.assignedOffice || 'Not assigned yet');

        const rawRequired = user.requiredHours || user.ojtRequiredHours || basicUser.requiredHours || basicUser.ojtRequiredHours;
        const parsedRequired = Number(rawRequired);
        this.requiredHours = Number.isFinite(parsedRequired) && parsedRequired > 0 ? parsedRequired : 486;

        const rawRemaining = user.ojtRemainingHours;
        const parsedRemaining = Number(rawRemaining);
        this.remainingHours = Number.isFinite(parsedRemaining) && parsedRemaining >= 0 ? parsedRemaining : null;

        try {
          const attRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/attendance/intern/history?internId=${encodeURIComponent(internId)}`);
          if (attRes.ok) {
            const json = await attRes.json().catch(() => null);
            const records = Array.isArray(json && json.data) ? json.data : [];
            this.updateAttendanceAnalytics(records);
          }
        } catch (e) {} finally {
          this.isInitialLoading = false;
        }
      } catch (e) {
        this.isInitialLoading = false;
      }
    },
    buildStudentName(user, fallback) {
      const src = user || fallback || {};
      const first = src.firstName || src.firstname || '';
      const last = src.lastName || src.lastname || '';
      const middle = src.middleName || src.middlename || src.middleInitial || '';

      if (last || first || middle) {
        const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
        const withMiddle = middle ? `${main} ${middle}`.trim() : main;
        return withMiddle;
      }
      return src.fullName || src.name || 'Student Intern';
    },
    buildCourseAndSchool(user, fallback) {
      const src = user || fallback || {};
      const course = src.course || src.position || 'OJT Intern';
      const school = src.schoolOrUniversity || src.school || '';
      if (school) {
        return `${course} - ${school}`;
      }
      return course;
    },
    updateAttendanceAnalytics(records) {
      if (!Array.isArray(records) || !records.length) {
        this.completedHours = 0;
        this.chartSeries = [
          { name: 'Normal Hours', data: [0, 0, 0, 0, 0] },
          { name: 'Overtime', data: [0, 0, 0, 0, 0] },
        ];
        this.monthlyAttendance = {
          monthLabel: '',
        };
        this.monthlyChartSeries = [
          { name: 'Days Present', data: [0, 0, 0, 0] }
        ];
        this.averageTimeIn = '--:--';
        this.averageWorkingHoursPerDay = 0;
        this.attendanceRate = 0;
        this.mostActiveDay = 'N/A';
        this.longestWorkingStreak = 0;
        this.mostCommonTimeIn = '--:--';
        this.lowHourDaysCount = 0;
        this.consistencyScore = 0;
        this.attendanceByDate = {};
        this.calendarWeeks = [];
        this.calendarMonthLabel = '';
        this.calendarSelectedDate = null;
        this.calendarSelectedDetails = null;
        return;
      }

      let totalMinutesAll = 0;
      const byDate = {};
      const allTimeInsMinutes = [];

      records.forEach((r) => {
        const dateStr = r.date;
        if (!dateStr) return;

        const totalMinutesAM = typeof r.totalMinutesAM === 'number' ? r.totalMinutesAM : null;
        const totalMinutesPM = typeof r.totalMinutesPM === 'number' ? r.totalMinutesPM : null;

        const tagAM = (r.tagAM || r.tagging || 'Normal Hours').trim();
        const tagPM = (r.tagPM || r.tagging || 'Normal Hours').trim();
        const fourHoursMinutes = 4 * 60;

        let countedAM = 0;
        let countedPM = 0;

        if (r.validationStatusAM === 'Approved' && (r.timeInAM || r.timeOutAM)) {
          if (tagAM === 'Overtime') {
            countedAM = Math.max(0, totalMinutesAM || 0);
          } else {
            countedAM = Math.min(Math.max(0, totalMinutesAM || 0), fourHoursMinutes);
          }
        }

        if (r.validationStatusPM === 'Approved' && (r.timeInPM || r.timeOutPM)) {
          if (tagPM === 'Overtime') {
            countedPM = Math.max(0, totalMinutesPM || 0);
          } else {
            countedPM = Math.min(Math.max(0, totalMinutesPM || 0), fourHoursMinutes);
          }
        }

        const dayMinutes = countedAM + countedPM;
        totalMinutesAll += dayMinutes;

        if (!byDate[dateStr]) {
          byDate[dateStr] = {
            minutes: 0,
            normalMinutes: 0,
            overtimeMinutes: 0,
            hasRecord: false,
          };
        }
        
        byDate[dateStr].minutes += dayMinutes;
        
        if (r.validationStatusAM === 'Approved' && (r.timeInAM || r.timeOutAM)) {
          if (tagAM === 'Overtime') {
            byDate[dateStr].overtimeMinutes += countedAM;
          } else {
            byDate[dateStr].normalMinutes += countedAM;
          }
        }
        
        if (r.validationStatusPM === 'Approved' && (r.timeInPM || r.timeOutPM)) {
          if (tagPM === 'Overtime') {
            byDate[dateStr].overtimeMinutes += countedPM;
          } else {
            byDate[dateStr].normalMinutes += countedPM;
          }
        }
        byDate[dateStr].hasRecord = true;

        const timeIn = r.timeInAM || r.timeInPM;
        const timeInMinutes = this.parseTimeToMinutes(timeIn);
        if (timeInMinutes != null) {
          allTimeInsMinutes.push(timeInMinutes);
        }
      });

      const completedHoursRaw = totalMinutesAll / 60;
      this.completedHours = Math.round(completedHoursRaw * 10) / 10;
      
      // Update the remaining hours here to reflect real-time calculations from history
      this.remainingHours = Math.max(0, this.requiredHours - this.completedHours);

      this.updateWeeklyRenderedHours(byDate);
      this.updateMonthlyAttendance(byDate);
      this.updateAverageTimeIn(allTimeInsMinutes);
      this.updateAverageWorkingHours(byDate);
      this.updateAttendanceRate(byDate);
      this.updateExtraAnalytics(byDate, allTimeInsMinutes);

      const rawMap = {};
      records.forEach((r) => {
        if (r && r.date) {
          rawMap[r.date] = r;
        }
      });
      this.attendanceByDate = rawMap;
      this.buildCalendar(byDate, rawMap);
    },
    parseTimeToMinutes(timeStr) {
      if (!timeStr || typeof timeStr !== 'string') return null;
      const parts = timeStr.split(':');
      if (parts.length < 2) return null;
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) || 0;
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    },
    minutesTo12hString(totalMinutes) {
      if (totalMinutes == null || !Number.isFinite(totalMinutes)) return '--:--';
      const minutes = Math.round(totalMinutes);
      let h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const suffix = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      const mm = m.toString().padStart(2, '0');
      return `${h}:${mm} ${suffix}`;
    },
    updateWeeklyRenderedHours(byDate) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const normalData = [];
      const overtimeData = [];

      labels.forEach((label, index) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + index);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const key = `${y}-${m}-${day}`;
        const info = byDate[key] || { normalMinutes: 0, overtimeMinutes: 0 };
        
        normalData.push(Math.round((info.normalMinutes / 60) * 10) / 10);
        overtimeData.push(Math.round((info.overtimeMinutes / 60) * 10) / 10);
      });

      this.chartSeries = [
        { name: 'Normal Hours', data: normalData },
        { name: 'Overtime', data: overtimeData }
      ];
    },
    updateMonthlyAttendance(byDate) {
      const today = new Date();
      const year = today.getFullYear();
      const monthIndex = today.getMonth();
      const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      const weeks = [
        { label: 'W1', daysPresent: 0 },
        { label: 'W2', daysPresent: 0 },
        { label: 'W3', daysPresent: 0 },
        { label: 'W4', daysPresent: 0 },
      ];

      Object.keys(byDate).forEach((dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return;
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
        if (y !== year || m !== monthIndex) return;

        const date = new Date(y, m, d);
        const dayOfMonth = date.getDate();
        let weekIndex = 0;
        if (dayOfMonth <= 7) weekIndex = 0;
        else if (dayOfMonth <= 14) weekIndex = 1;
        else if (dayOfMonth <= 21) weekIndex = 2;
        else weekIndex = 3;

        if (byDate[dateStr].minutes > 0) {
          weeks[weekIndex].daysPresent += 1;
        }
      });

      const maxDays = weeks.reduce((max, w) => Math.max(max, w.daysPresent), 0);
      
      this.monthlyChartSeries = [
        { name: 'Days Present', data: weeks.map(w => w.daysPresent) }
      ];

      this.monthlyAttendance = {
        monthLabel,
      };
    },
    prevMonth() {
      const d = new Date(this.currentCalendarDate);
      d.setMonth(d.getMonth() - 1);
      this.currentCalendarDate = d;
      this.buildCalendar(this.attendanceByDate, this.attendanceByDate);
    },
    nextMonth() {
      const d = new Date(this.currentCalendarDate);
      d.setMonth(d.getMonth() + 1);
      this.currentCalendarDate = d;
      this.buildCalendar(this.attendanceByDate, this.attendanceByDate);
    },
    buildCalendar(byDate, rawMap) {
      const today = new Date();
      const calendarTarget = this.currentCalendarDate || today;
      const year = calendarTarget.getFullYear();
      const monthIndex = calendarTarget.getMonth();
      const firstOfMonth = new Date(year, monthIndex, 1);
      const startDayOfWeek = (firstOfMonth.getDay() + 6) % 7; // Monday is 0, Sunday is 6
      const calendarStart = new Date(year, monthIndex, 1 - startDayOfWeek);

      const weeks = [];
      const nowDateKey = today.toISOString().slice(0, 10);

      for (let week = 0; week < 6; week += 1) {
        const days = [];
        for (let i = 0; i < 7; i += 1) {
          const d = new Date(calendarStart);
          d.setDate(calendarStart.getDate() + week * 7 + i);
          const y = d.getFullYear();
          const m = (d.getMonth() + 1).toString().padStart(2, '0');
          const dayNum = d.getDate().toString().padStart(2, '0');
          const key = `${y}-${m}-${dayNum}`;
          const info = byDate[key] || { minutes: 0 };
          const rec = rawMap[key];

          let status = 'none';
          const isFuture = d.getTime() > today.getTime();
          const isSunday = d.getDay() === 0;
          if (rec) {
            const tag = (rec.tagAM || rec.tagPM || '').toLowerCase();
            if (tag && tag.includes('holiday')) {
              status = 'holiday';
            } else if (info.minutes > 0) {
              status = 'present';
            }
          } else if (!isFuture) {
            if (info.minutes > 0) {
              status = 'present';
            }
          }

          days.push({
            dateKey: key,
            dayOfMonth: parseInt(dayNum, 10),
            isCurrentMonth: d.getMonth() === monthIndex,
            isToday: key === nowDateKey,
            isWeekend: isSunday,
            status,
          });
        }
        weeks.push({ days });
      }

      this.calendarWeeks = weeks;
      this.calendarMonthLabel = calendarTarget.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Only attempt to auto-select today if today is actually in the rendered month grid
      const todayEntry = weeks.flatMap((w) => w.days).find((day) => day.dateKey === nowDateKey);
      if (todayEntry && calendarTarget.getMonth() === today.getMonth() && calendarTarget.getFullYear() === today.getFullYear()) {
        this.handleCalendarDayClick(todayEntry);
      } else {
        this.calendarSelectedDate = null;
        this.calendarSelectedDetails = null;
      }
    },
    handleCalendarDayClick(day) {
      if (!day) return;
      this.calendarSelectedDate = day.dateKey;
      const rec = this.attendanceByDate[day.dateKey] || null;

      let statusLabel = 'No record';
      if (day.status === 'present') statusLabel = 'Present';
      else if (day.status === 'holiday') statusLabel = 'Holiday';

      let totalHours = 0;
      if (rec) {
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
        } else if (typeof rec.totalHours === 'number' || typeof rec.totalHours === 'string') {
          const h = parseFloat(rec.totalHours);
          if (Number.isFinite(h) && h > 0) {
            rawTotal = Math.round(h * 60);
          }
        }

        let dayMinutes = 0;
        if (tag === 'Overtime') {
          if (typeof rec.overtimeMinutes === 'number') {
            dayMinutes = Math.max(0, rec.overtimeMinutes);
          } else {
            dayMinutes = Math.max(0, rawTotal - eightHoursMinutes);
          }
        } else {
          if (typeof rec.normalCountMinutes === 'number') {
            dayMinutes = Math.max(0, rec.normalCountMinutes);
          } else {
            dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
          }
        }

        totalHours = Math.round((dayMinutes / 60) * 10) / 10;
      }

      this.calendarSelectedDetails = {
        displayDate: this.formatCalendarDisplayDate(day.dateKey),
        statusLabel,
        hasRecord: !!rec,
        timeInAM: rec && rec.timeInAM,
        timeOutAM: rec && rec.timeOutAM,
        timeInPM: rec && rec.timeInPM,
        timeOutPM: rec && rec.timeOutPM,
        totalHours,
      };
    },
    formatCalendarDisplayDate(dateKey) {
      if (!dateKey) return '';
      const parts = dateKey.split('-');
      if (parts.length !== 3) return dateKey;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return dateKey;
      const dt = new Date(y, m, d);
      if (Number.isNaN(dt.getTime())) return dateKey;
      return dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    updateAverageTimeIn(allTimeInsMinutes) {
      if (!Array.isArray(allTimeInsMinutes) || !allTimeInsMinutes.length) {
        this.averageTimeIn = '--:--';
        return;
      }
      const total = allTimeInsMinutes.reduce((sum, v) => sum + v, 0);
      const avg = total / allTimeInsMinutes.length;
      this.averageTimeIn = this.minutesTo12hString(avg);
    },
    updateAverageWorkingHours(byDate) {
      const entries = Object.values(byDate).filter((v) => v && v.minutes > 0);
      if (!entries.length) {
        this.averageWorkingHoursPerDay = 0;
        return;
      }
      const totalMinutes = entries.reduce((sum, v) => sum + Math.max(0, v.minutes), 0);
      const avgMinutes = totalMinutes / entries.length;
      const avgHours = avgMinutes / 60;
      this.averageWorkingHoursPerDay = Math.round(avgHours * 10) / 10;
    },
    updateAttendanceRate(byDate) {
      const dates = Object.keys(byDate);
      if (!dates.length) {
        this.attendanceRate = 0;
        return;
      }

      const sortedDates = dates.slice().sort();
      const first = sortedDates[0];
      const last = sortedDates[sortedDates.length - 1];
      const firstDate = new Date(first);
      const lastDate = new Date(last);
      if (Number.isNaN(firstDate.getTime()) || Number.isNaN(lastDate.getTime())) {
        this.attendanceRate = 0;
        return;
      }

      const diffMs = lastDate.getTime() - firstDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
      const windowDays = Math.max(diffDays, 1);

      const daysPresent = dates.filter((d) => byDate[d] && byDate[d].minutes > 0).length;
      const rate = (daysPresent / windowDays) * 100;
      const clamped = Math.max(0, Math.min(rate, 100));
      this.attendanceRate = Math.round(clamped);
    },
    updateExtraAnalytics(byDate, allTimeInsMinutes) {
      const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
      const dateKeys = Object.keys(byDate);
      const attendedDates = [];

      dateKeys.forEach((dateStr) => {
        const info = byDate[dateStr];
        if (!info || info.minutes <= 0) return;
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return;
        const weekday = date.getDay();
        weekdayTotals[weekday] += info.minutes;
        attendedDates.push(dateStr);
      });

      if (attendedDates.length === 0) {
        this.mostActiveDay = 'N/A';
        this.longestWorkingStreak = 0;
        this.mostCommonTimeIn = '--:--';
        this.lowHourDaysCount = 0;
        this.consistencyScore = 0;
        return;
      }

      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let maxIdx = 0;
      let maxVal = weekdayTotals[0];
      for (let i = 1; i < weekdayTotals.length; i += 1) {
        if (weekdayTotals[i] > maxVal) {
          maxVal = weekdayTotals[i];
          maxIdx = i;
        }
      }
      this.mostActiveDay = maxVal > 0 ? weekdayNames[maxIdx] : 'N/A';

      const sortedDateObjs = attendedDates
        .map((d) => new Date(d))
        .filter((d) => !Number.isNaN(d.getTime()))
        .sort((a, b) => a - b);

      let longest = 1;
      let current = 1;
      for (let i = 1; i < sortedDateObjs.length; i += 1) {
        const prev = sortedDateObjs[i - 1];
        const cur = sortedDateObjs[i];
        const diffMs = cur.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          current += 1;
          if (current > longest) longest = current;
        } else {
          current = 1;
        }
      }
      this.longestWorkingStreak = longest;

      if (!Array.isArray(allTimeInsMinutes) || !allTimeInsMinutes.length) {
        this.mostCommonTimeIn = '--:--';
      } else {
        const bucketCounts = {};
        allTimeInsMinutes.forEach((mins) => {
          if (!Number.isFinite(mins)) return;
          const bucket = Math.round(mins / 5) * 5;
          bucketCounts[bucket] = (bucketCounts[bucket] || 0) + 1;
        });
        let bestBucket = null;
        let bestCount = 0;
        Object.keys(bucketCounts).forEach((key) => {
          const count = bucketCounts[key];
          const bucket = Number(key);
          if (count > bestCount || (count === bestCount && bucket < bestBucket)) {
            bestCount = count;
            bestBucket = bucket;
          }
        });
        this.mostCommonTimeIn = bestBucket != null ? this.minutesTo12hString(bestBucket) : '--:--';
      }

      const LOW_HOURS_THRESHOLD_MINUTES = 4 * 60;
      let lowDays = 0;
      let daysWithHours = 0;
      dateKeys.forEach((dateStr) => {
        const info = byDate[dateStr];
        if (!info || info.minutes <= 0) return;
        daysWithHours += 1;
        if (info.minutes < LOW_HOURS_THRESHOLD_MINUTES) {
          lowDays += 1;
        }
      });
      this.lowHourDaysCount = lowDays;

      if (daysWithHours === 0) {
        this.consistencyScore = 0;
      } else {
        const consistentDays = daysWithHours - lowDays;
        const score = (consistentDays / daysWithHours) * 100;
        this.consistencyScore = Math.round(Math.max(0, Math.min(score, 100)));
      }
    },
  }
}
</script>



<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
