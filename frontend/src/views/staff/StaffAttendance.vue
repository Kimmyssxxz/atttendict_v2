<template>
  <div class="flex h-screen bg-white font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <StaffSidebar activeNav="attendance" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0">
      <header class="bg-[#133e75] md:bg-white md:border-b md:border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex justify-between items-center relative z-20">
        <!-- Mobile Header (Back Button + Centered Title) -->
        <div v-if="isMobile" class="w-full flex items-center justify-center relative py-1">
          <button @click="router.back()" class="absolute left-0 p-1 text-white rounded-full transition-colors" aria-label="Go back">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-white">Attendance</h1>
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
      <div class="bg-white flex-1 overflow-y-auto">
        <AttendanceSkeleton v-if="staffAttendanceStore.loading" />
        
        <template v-else>
          <!-- MOBILE VIEW (Fully Optimized) -->
          <div v-if="isMobile" class="p-4 pb-36 space-y-6">
              <div class="bg-gray-50/80 rounded-xl p-4 border border-gray-100/50 mt-auto relative z-[60]">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-xl font-semibold text-black">Current status</span>
                  <span class="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-900 border border-gray-100  flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full" :class="{'bg-emerald-500': selectedStatus === 'At Office','bg-blue-500': selectedStatus === 'On Field','bg-purple-500': selectedStatus === 'Travel','bg-orange-500': selectedStatus === 'Leave'}"></span>
                    {{ selectedStatus }}
                  </span>
                </div>
                <div class="space-y-1 relative" ref="mobileStatusDropdownEl">
                  <label class="block text-sm font-semibold text-gray-500 ml-1 mb-1">Update Status</label>
                  <button 
                    type="button"
                    @click="toggleStatusDropdown"
                    class="flex items-center justify-between w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  >
                    <span>{{ selectedStatus }}</span>
                    <svg class="h-5 w-5 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': statusDropdownOpen }" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
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
                    <div v-if="statusDropdownOpen" class="absolute top-full left-0 z-[120] w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      <div class="py-1">
                        <button 
                          v-for="status in availableStatuses" 
                          :key="status.value"
                          type="button" 
                          @click="selectStatus(status.value)" 
                          class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-sm font-semibold"
                          :class="selectedStatus === status.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'"
                        >
                          {{ status.label }}
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>
  

            <!-- Actions Panel -->
            <div class="bg-white rounded-xl p-6 border border-gray-200 flex flex-col relative">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-black">Quick Actions</h3>
                <div class="flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs border"
                     :class="isClockedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-200'">
                  <div class="w-2 h-2 rounded-full relative">
                    <div class="absolute inset-0 rounded-full" :class="isClockedIn ? 'bg-emerald-500 animate-ping opacity-75' : 'bg-gray-400'"></div>
                    <div class="relative w-full h-full rounded-full" :class="isClockedIn ? 'bg-emerald-500' : 'bg-gray-400'"></div>
                  </div>
                  {{ isClockedIn ? 'Clocked In' : 'Clocked Out' }}
                </div>
              </div>

              <!-- RFID (Office) -->
              <div v-if="selectedStatus === 'At Office'" class="flex flex-col items-center py-4">
                <div class="relative w-32 h-32 mb-6 flex items-center justify-center">
                   <iframe src="https://lottie.host/embed/06249617-eef8-4e7e-8296-a5e249383bca/GVeOismIuA.lottie" style="pointer-events: none; border: none; width:120%; height:120%;"></iframe>
                   <div v-if="isScanning" class="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.6)] animate-[scan_2s_ease-in-out_infinite]"></div>
                </div>
                <div class="w-full text-center">
                   <h3 class="font-semibold text-gray-900">RFID Access</h3>
                   <p class="text-sm text-gray-500 mb-3">{{ getBiometricMessage() }}</p>
                   <input type="password" id="rfid-attendance-input" placeholder="Waiting for scan..." 
                          class="w-full text-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 outline-none mb-2 font-mono tracking-widest" 
                          @keyup.enter="checkRfidAndAction" />
                   <button @click="checkRfidAndAction" :disabled="isScanning || staffAttendanceStore.loading" 
                           class="w-full h-12 rounded-xl bg-[#eebb3b] text-white font-medium mt-4">
                     <span v-if="isScanning" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span>
                     <span class="tracking-wide">{{ isScanning ? 'Verifying...' : getBiometricButtonText() }}</span>
                   </button>
                </div>
              </div>

              <!-- GPS + Photo (Field/Travel) -->
              <div v-else-if="selectedStatus === 'On Field' || selectedStatus === 'Travel'" class="space-y-6">
                <!-- Map -->
                <div class="rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 h-44 relative shadow-inner">
                  <div v-if="!userLocation" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-10">
                    <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
                  </div>
                  <div ref="leafletMapEl" class="w-full h-full z-0"></div>
                  <div v-if="userLocation" class="absolute bottom-2 inset-x-2 bg-white/90 backdrop-blur-md rounded-lg p-2.5 shadow-sm border border-gray-100 z-20 text-[10px] font-medium text-gray-600 truncate">
                    {{ userLocation.address || 'Location Identified' }}
                  </div>
                </div>
                <!-- Camera -->
                <div class="relative rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 bg-gray-50 aspect-video flex items-center justify-center cursor-pointer group"
                     @click="!capturedPhoto && !cameraActive && startCamera()">
                  <video ref="videoElement" class="absolute inset-0 w-full h-full object-cover z-10" v-show="cameraActive && !capturedPhoto" autoplay playsinline></video>
                  <img v-if="capturedPhoto" :src="capturedPhoto" class="absolute inset-0 w-full h-full object-cover z-30" />
                  <div v-if="!cameraActive && !capturedPhoto" class="text-center p-4">
                    <div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 text-blue-500 shadow-sm"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></div>
                    <p class="font-semibold text-gray-600">Take Verification Photo</p>
                  </div>
                  <div v-if="cameraActive && !capturedPhoto" class="absolute bottom-4 inset-x-0 flex justify-center z-20">
                    <button @click.stop="capturePhoto" class="bg-white text-gray-900 rounded-full px-6 py-2.5 font-bold shadow-2xl flex items-center gap-2 active:scale-95 transition-all">
                      <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div> Capture
                    </button>
                  </div>
                  <button v-if="capturedPhoto" @click.stop="retakePhoto" class="absolute top-3 right-3 z-40 bg-black/60 text-white p-2.5 rounded-full backdrop-blur-sm"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></button>
                </div>
                <div class="flex gap-4">
                  <button @click="timeInWithPhoto" :disabled="!capturedPhoto || isClockedIn || staffAttendanceStore.loading || isTimingIn" 
                          class="flex-1 h-12 rounded-xl bg-[#eebb3b] text-white font-semibold flex items-center justify-center gap-2">
                    <span v-if="isTimingIn" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                    <span>{{ isTimingIn ? 'Processing...' : 'Time In' }}</span>
                  </button>
                  <button @click="timeOutWithPhoto" :disabled="!capturedPhoto || !isClockedIn || staffAttendanceStore.loading || isTimingOut" 
                          class="flex-1 h-12 rounded-xl bg-[#b92e2b] text-white font-semibold flex items-center justify-center gap-2">
                    <span v-if="isTimingOut" class="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></span>
                    <span>{{ isTimingOut ? 'Processing...' : 'Time Out' }}</span>
                  </button>
                </div>
              </div>

              <!-- Leave -->
              <div v-else class="flex flex-col items-center py-6 text-center">
                <h4 class="text-xl font-semibold text-gray-900 ">Leave Request</h4>
                <p class="text-sm text-gray-500 mb-6 max-w-[300px]">Specify your leave dates below to submit your request.</p>
                <div class="w-full space-y-3 bg-purple-50/50 p-5 rounded-2xl border border-purple-100">
                   <div class="text-left"><label class="text-xs font-medium   ml-1">Start Date</label><input type="date" v-model="leaveStartDate" class="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm font-medium mt-1" /></div>
                   <div class="text-left"><label class="text-xs font-medium   ml-1">End Date</label><input type="date" v-model="leaveEndDate" class="w-full bg-white border border-purple-100 rounded-xl px-4 py-3 text-sm font-medium mt-1" /></div>
                   <button @click="submitLeaveDetails" :disabled="!leaveStartDate || !leaveEndDate || submittingLeave" 
                           class="w-full h-12 rounded-xl bg-[#eebb3b] text-white font-medium mt-4">
                     {{ submittingLeave ? 'Submitting...' : 'Submit Request' }}
                   </button>
                </div>
              </div>
            </div>

            <!-- Logs Panel -->
            <div class="bg-white rounded-xl p-6 border border-gray-200 ">
               <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                 <h3 class="text-lg font-semibold text-black">Today's Records</h3>
                 <span class="text-sm text-gray-400 font-medium">{{ todayLogs.length }} Log(s)</span>
               </div>
               <div v-if="todayLogs.length === 0" class="py-10 text-center flex flex-col items-center">
                 <p class="text-sm font-MEDIUM text-gray-400">No attendance data for today</p>
               </div>
               <div v-else class="space-y-4">
                 <div v-for="log in getDisplayLogs()" :key="log.id || log.tempId" class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                    <div class="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-sm text-gray-900">{{ getLogTime(log) }}</div>
                    <div class="flex-1 min-w-0">
                       <div class="flex items-center gap-2 mb-0.5">
                          <span class="text-[10px] font-black uppercase" :class="getLogType(log) === 'time-in' ? 'text-emerald-600' : 'text-orange-600'">{{ getLogType(log).replace('time-', '') }}</span>
                          <span class="text-[9px] font-bold text-gray-300">|</span>
                          <span class="text-[10px] font-bold text-gray-400">{{ log.status }}</span>
                       </div>
                       <p class="text-[10px] text-gray-500 truncate" v-if="getLogAddress(log)">{{ getLogAddress(log) }}</p>
                    </div>
                    <div class="w-2 h-2 rounded-full shadow-inner" :class="getLogType(log) === 'time-in' ? 'bg-emerald-500' : 'bg-orange-500'"></div>
                 </div>
               </div>
            </div>
          </div>

          <!-- DESKTOP VIEW (Refined Original) -->
          <div v-else class="p-8 pb-8 max-w-full mx-auto space-y-8">
            <div class="mb-8 hidden md:flex justify-between items-end">
              <div>
                <h2 class="text-3xl text-gray-900 font-bold">My Attendance</h2>
                <p class="text-sm text-gray-500 mt-1">Mark your attendance and track your work hours</p>
              </div>
              <div class="text-right">
                <div class="text-3xl font-bold text-gray-900 tabular-nums">{{ currentTime }}</div>
                <div class="text-xs text-gray-500 font-medium mt-0.5 uppercase tracking-wider">{{ currentDate }}</div>
              </div>
            </div>

            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <!-- Status Selection Panel -->
              <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative">
                <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-50 -z-0"></div>
                <div class="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">Current Status</h3>
                    <p class="text-sm text-gray-500 mt-1">Select your working location</p>
                  </div>
                  <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg relative"
                       :class="{
                         'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30': selectedStatus === 'At Office',
                         'bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30': selectedStatus === 'On Field',
                         'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/30': selectedStatus === 'Travel',
                         'bg-gradient-to-br from-orange-400 to-orange-600 shadow-orange-500/30': selectedStatus === 'Leave'
                       }">
                    <div class="absolute inset-0 rounded-2xl animate-ping opacity-20 bg-white"></div>
                    <span class="relative z-10 filter drop-shadow-md"></span>
                  </div>
                </div>
                <div class="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100/50 mt-auto relative z-[60]">
                  <div class="flex items-center justify-between mb-5">
                    <span class="text-sm font-semibold text-gray-500 uppercase tracking-wider">You are currently</span>
                    <span class="px-4 py-1.5 bg-white rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100 flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full" :class="{'bg-emerald-500': selectedStatus === 'At Office','bg-blue-500': selectedStatus === 'On Field','bg-purple-500': selectedStatus === 'Travel','bg-orange-500': selectedStatus === 'Leave'}"></span>
                      {{ selectedStatus }}
                    </span>
                  </div>
                  <div class="space-y-2 relative" ref="desktopStatusDropdownEl">
                    <label class="block text-sm font-medium text-gray-700 ml-1">Change Status</label>
                    <button 
                      type="button"
                      @click="toggleStatusDropdown"
                      class="flex items-center justify-between w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 font-medium shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-blue-300"
                    >
                      <span>{{ selectedStatus }}</span>
                      <svg class="h-5 w-5 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': statusDropdownOpen }" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
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
                      <div v-if="statusDropdownOpen" class="absolute top-full left-0 z-[120] w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                        <div class="py-1">
                          <button 
                            v-for="status in availableStatuses" 
                            :key="status.value"
                            type="button" 
                            @click="selectStatus(status.value)" 
                            class="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
                            :class="selectedStatus === status.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'"
                          >
                            {{ status.label }}
                          </button>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </div>

              <!-- Attendance Actions Panel (Desktop) -->
              <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col relative">
                <div class="flex justify-between items-start mb-6">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">Quick Actions</h3>
                    <p class="text-sm text-gray-500 mt-1">Record your attendance</p>
                  </div>
                  <div class="flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm  border transition-all duration-300"
                       :class="isClockedIn ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-600 border-gray-200'">
                    <div class="w-2.5 h-2.5 rounded-full relative">
                      <div class="absolute inset-0 rounded-full" :class="isClockedIn ? 'bg-emerald-500 animate-ping opacity-75' : 'bg-gray-400'"></div>
                      <div class="relative w-full h-full rounded-full" :class="isClockedIn ? 'bg-emerald-500' : 'bg-gray-400'"></div>
                    </div>
                    {{ isClockedIn ? 'Clocked In' : 'Clocked Out' }}
                  </div>
                </div>

                <!-- RFID Section -->
                <div v-if="selectedStatus === 'At Office'" class="flex-1 flex flex-col bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <div class="flex flex-col items-center flex-1 justify-center relative py-6">
                    <div class="relative w-32 h-32 mb-6"><div class="absolute inset-0 rounded-3xl bg-white shadow-xl border border-blue-50 flex items-center justify-center transform transition-transform duration-300" :class="{ 'scale-95 shadow-inner': isScanning }"><iframe src="https://lottie.host/embed/06249617-eef8-4e7e-8296-a5e249383bca/GVeOismIuA.lottie" style="pointer-events: none; border: none;" width="100%" height="100%"></iframe><div v-if="isScanning" class="absolute left-0 right-0 h-1 bg-blue-500 shadow-[0_0_15px_3px_rgba(59,130,246,0.6)] animate-[scan_2s_ease-in-out_infinite]"></div></div></div>
                    <div class="mb-4 flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm"><span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>Waiting for RFID scan...</div>
                    <div class="text-center w-full max-w-sm mb-6"><h4 class="text-lg font-bold text-gray-900 mb-2">RFID Verification</h4><p class="text-sm text-gray-600 min-h-[40px] px-4">{{ getBiometricMessage() }}</p><div class="mt-4 w-full"><input type="password" id="rfid-attendance-input" placeholder="" class="w-full text-center px-4 py-3 bg-white border border-gray-300 rounded-xl outline-none shadow-inner transition-all" @keyup.enter="checkRfidAndAction" autofocus /></div></div>
                    <button @click="checkRfidAndAction" :disabled="isScanning || staffAttendanceStore.loading" class="w-full sm:w-auto min-w-[200px] h-14 rounded-2xl bg-gray-900 text-white font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 group relative overflow-hidden">
                      <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                      <div v-if="staffAttendanceStore.loading" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                      <span class="relative z-10 tracking-wide">{{ isScanning ? 'Scanning...' : getBiometricButtonText() }}</span>
                    </button>
                  </div>
                </div>

                <!-- Field/Travel Section -->
                <div v-else-if="selectedStatus === 'On Field' || selectedStatus === 'Travel'" class="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 custom-scrollbar">
                  <div class="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                    <div class="flex items-center gap-2 mb-3"><h4 class="font-bold text-gray-900">Location tracking</h4></div>
                    <div class="rounded-xl overflow-hidden border border-blue-200 bg-white relative h-48 shadow-sm">
                      <div v-if="!userLocation" class="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/90 z-10"><div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div></div>
                      <div ref="leafletMapEl" class="w-full h-full z-0 relative"></div>
                      <div v-if="userLocation" class="absolute bottom-2 inset-x-2 bg-white/95 backdrop-blur-md rounded-lg p-3 shadow-lg border border-gray-100 z-20 text-xs text-gray-700 font-medium truncate">{{ userLocation.address || 'Location identified' }}</div>
                    </div>
                  </div>
                  <div class="bg-gray-50 rounded-2xl p-5">
                    <div class="relative rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-white aspect-video flex flex-col items-center justify-center cursor-pointer transition-all" @click="!capturedPhoto && !cameraActive && startCamera()">
                      <video ref="videoElement" class="absolute inset-0 w-full h-full object-cover z-10" v-show="!capturedPhoto && cameraActive" autoplay playsinline></video>
                      <div v-if="!capturedPhoto && !cameraActive" class="text-center p-6"><p class="font-bold text-gray-700 mb-1">Click to start camera</p></div>
                      <div v-if="!capturedPhoto && cameraActive" class="absolute bottom-4 inset-x-0 flex justify-center z-20"><button @click.stop="capturePhoto" class="bg-white text-gray-900 rounded-full px-5 py-2.5 font-bold shadow-lg">Capture Photo</button></div>
                      <div v-if="capturedPhoto" class="absolute inset-0 w-full h-full z-30"><img :src="capturedPhoto" class="w-full h-full object-cover" /><button @click.stop="retakePhoto" class="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg></button></div>
                    </div>
                    <div class="flex gap-3 mt-4">
                      <button @click="timeInWithPhoto" :disabled="!capturedPhoto || isClockedIn || staffAttendanceStore.loading || isTimingIn" class="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-emerald-600 disabled:opacity-50">
                        <span v-if="isTimingIn" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span>
                        <span>{{ isTimingIn ? 'Processing...' : 'Time In' }}</span>
                      </button>
                      <button @click="timeOutWithPhoto" :disabled="!capturedPhoto || !isClockedIn || staffAttendanceStore.loading || isTimingOut" class="flex-1 h-12 rounded-xl flex items-center justify-center gap-2 font-bold text-white bg-orange-600 disabled:opacity-50">
                        <span v-if="isTimingOut" class="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></span>
                        <span>{{ isTimingOut ? 'Processing...' : 'Time Out' }}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Leave Section -->
                <div v-else class="flex-1 flex flex-col bg-gray-50 rounded-2xl p-6 border border-gray-200 text-center py-8">

                  <h4 class="text-2xl font-bold text-gray-900 mb-2">Leave Mode</h4>
                  <p class="text-gray-500 mb-8">Enjoy your time off! Your status has been noted.</p>
                  <div class="grid grid-cols-2 gap-3 mb-4 max-w-sm mx-auto">
                    <input type="date" v-model="leaveStartDate" class="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" />
                    <input type="date" v-model="leaveEndDate" class="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold" />
                  </div>
                  <button @click="submitLeaveDetails" :disabled="!leaveStartDate || !leaveEndDate" class="max-w-sm mx-auto w-full h-12 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:-translate-y-0.5 transition-all">Submit Request</button>
                </div>
              </div>
            </div>

            <!-- Visual Separator -->
            <div class="flex items-center justify-center py-4"><div class="h-px bg-gray-200 flex-1"></div><div class="px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Activity</div><div class="h-px bg-gray-200 flex-1"></div></div>

            <!-- Today's Log Panel (Desktop) -->
            <div class="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
              <div class="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100"><div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg></div><h3 class="text-xl font-bold text-gray-900">Attendance Log</h3></div>
              <div v-if="todayLogs.length === 0" class="py-12 flex flex-col items-center justify-center text-center"><h4 class="text-lg font-bold text-gray-800 mb-1">No attendance records</h4><p class="text-gray-500">You haven't marked any attendance today</p></div>
              <div v-else class="relative before:absolute before:inset-y-0 before:left-[140px] before:w-[2px] before:bg-gray-100 pl-2">
                <div v-for="log in getDisplayLogs()" :key="log.id || log.tempId" class="relative flex items-start mb-8 last:mb-0 group">
                  <div class="w-[120px] shrink-0 pt-1 text-right pr-8"><div class="inline-block px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 shadow-sm">{{ getLogTime(log) }}</div></div>
                  <div class="absolute left-[141px] -ml-[7px] mt-[10px] w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm z-10" :class="getLogType(log) === 'time-in' ? 'bg-emerald-500' : 'bg-orange-500'"></div>
                  <div class="flex-1 ml-12 bg-gray-50 p-5 rounded-2xl border border-gray-100 hover:bg-white hover:border-blue-100 transition-all">
                    <div class="flex items-center gap-3 mb-4"><span class="px-3 py-1 rounded-md text-xs font-bold uppercase" :class="getLogType(log) === 'time-in' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'">{{ getLogType(log) === 'time-in' ? 'Time In' : 'Time Out' }}</span><span class="text-xs text-gray-500 font-medium">{{ log.status }}</span></div>
                    <div v-if="getLogAddress(log)" class="text-sm text-gray-600 mb-4">{{ getLogAddress(log) }}</div>
                    <div class="flex gap-4" v-if="(log.latitude && log.longitude) || getLogPhoto(log)">
                      <div v-if="log.latitude && log.longitude" class="flex-1 rounded-xl overflow-hidden border border-gray-200 h-32 bg-gray-100 shadow-inner"><iframe :src="getOsmEmbedUrl(log.latitude, log.longitude)" class="w-full h-full border-0"></iframe></div>
                      <div v-if="getLogPhoto(log)" class="w-40 rounded-xl overflow-hidden border border-gray-200 h-32 cursor-pointer relative group-img" @click="openModal('Photo Preview', '', 'image', getLogPhoto(log))">
                         <img :src="getLogPhoto(log)" class="w-full h-full object-cover transition-transform group-img:scale-105" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </main>


    <!-- Modal Overlay -->
    <div v-if="modalVisible" class="fixed inset-0 bg-gray-900/60  flex items-center justify-center z-[100] px-4 animate-[fadeIn_0.2s_ease-out]" @click.self="closeModal">
      <div class="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-[modalSlideUp_0.3s_ease-out]" role="dialog" aria-modal="true">
        <!-- Modal Header -->
        <div class="px-6 py-4 text-white border-b border-gray-100" 
             :class="{
               'bg-blue-900': modalType === 'info',
               'bg-emerald-900': modalType === 'success',
               'bg-amber-900': modalType === 'warning',
               'bg-red-900': modalType === 'error'
             }">
          <div class="flex items-center gap-3">
            
            <h3 class="text-xl font-semibold text-white">{{ modalTitle }}</h3>
          </div>
        </div>
        
        <!-- Modal Body -->
        <div class="px-6 py-6 ">
          <p class="text-gray-900 text-SM leading-relaxed">{{ modalMessage }}</p>
          <div v-if="modalType === 'image'" class="mt-4 rounded-xl overflow-hidden border border-gray-200">
            <img :src="modalMessage" alt="Full Preview" class="w-full h-auto max-h-[60vh] object-contain bg-gray-900" />
          </div>
        </div>
        
        <!-- Modal Footer -->
        <div class="px-6 py-4  flex justify-end">
          <button class="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all" @click="closeModal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import StaffSidebar from './StaffSidebar.vue'
  import AttendanceSkeleton from '../../components/skeletons/AttendanceSkeleton.vue'
  import { useRouter } from 'vue-router'
  import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore.js'
  import { db } from '../../firebase.js'
  import { doc, getDoc } from 'firebase/firestore'
  import L from 'leaflet'
  import 'leaflet/dist/leaflet.css'
  import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png?url'
  import iconUrl from 'leaflet/dist/images/marker-icon.png?url'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png?url'

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
  const GEO_API_BASE_URL = import.meta.env.DEV ? '' : API_BASE_URL

  const router = useRouter()
  const staffAttendanceStore = useStaffAttendanceStore()
  const activeTab = ref('current')
  const activeNav = ref('attendance')

  const staffId = ref(null)

  const avatarWrapEl = ref(null)
  const avatarMenuOpen = ref(false)
  const mobileStatusDropdownEl = ref(null)
  const desktopStatusDropdownEl = ref(null)
  const statusDropdownOpen = ref(false)
  const isMobile = ref(false)

  const availableStatuses = [
    { value: 'At Office', label: 'At Office', emoji: '' },
    { value: 'On Field', label: 'On Field', emoji: '' },
    { value: 'Travel', label: 'Travel', emoji: '' },
    { value: 'Leave', label: 'Leave', emoji: '' }
  ]

  const handleResize = () => {
    isMobile.value = window.innerWidth < 768
  }
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
      console.error('Failed to load user profile:', e)
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
    // Handle Avatar Menu click outside
    if (avatarMenuOpen.value) {
      const root = avatarWrapEl.value
      if (root && !root.contains(e.target)) {
        closeAvatarMenu()
      }
    }

    // Handle Status Dropdown click outside
    if (statusDropdownOpen.value) {
      const root = isMobile.value ? mobileStatusDropdownEl.value : desktopStatusDropdownEl.value
      if (root && !root.contains(e.target)) {
        statusDropdownOpen.value = false
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

  const toggleStatusDropdown = () => {
    statusDropdownOpen.value = !statusDropdownOpen.value
  }

  const selectStatus = (status) => {
    selectedStatus.value = status
    statusDropdownOpen.value = false
    onStatusChange()
  }

  // Attendance state
  const selectedStatus = ref('At Office')
  const capturedPhoto = ref(null)
  const cameraActive = ref(false)
  const userLocation = ref(null)
  const currentTime = ref('')
  const currentDate = ref('')
  const currentAttendanceId = ref(null)
  const isScanning = ref(false)
  const submittingLeave = ref(false)
  const isTimingIn = ref(false)
  const isTimingOut = ref(false)
  const videoElement = ref(null)
  const canvasElement = ref(null)

  const modalVisible = ref(false)
  const modalTitle = ref('')
  const modalMessage = ref('')
  const modalType = ref('info')

  const leafletMapEl = ref(null)
  const leafletMap = ref(null)
  const leafletMarker = ref(null)

  const openModal = (title, message, type = 'info') => {
    modalTitle.value = title
    modalMessage.value = message
    modalType.value = type
    modalVisible.value = true
  }

  const closeModal = () => {
    modalVisible.value = false
  }

  // Time tracking
  let timeInterval = null

  // Computed properties
  const currentStatusClass = computed(() => {
    const statusClasses = {
      'At Office': 'status-office',
      'On Field': 'status-field',
      'Travel': 'status-travel',
      'Leave': 'status-leave'
    }
    return statusClasses[selectedStatus.value] || 'status-office'
  })

  const isClockedIn = computed(() => {
    const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!currentAttendance) return false
    
    // Check if clocked in AM and not clocked out AM
    if (currentAttendance.timeInAM && !currentAttendance.timeOutAM) return true
    
    // Check if clocked in PM and not clocked out PM
    if (currentAttendance.timeInPM && !currentAttendance.timeOutPM) return true
    
    return false
  })

  const leaveDocumentUrl = computed(() => {
    return staffAttendanceStore.getCurrentStaffAttendance?.leaveDocumentUrl || null
  })

  const leaveDocumentUrls = computed(() => {
    const urls = staffAttendanceStore.getCurrentStaffAttendance?.leaveDocumentUrls
    if (Array.isArray(urls)) return urls
    // Fallback for legacy data
    const single = staffAttendanceStore.getCurrentStaffAttendance?.leaveDocumentUrl
    return single ? [single] : []
  })

  const leaveStartDate = ref('')
  const leaveEndDate = ref('')

  // Watch for changes in store and update local refs
  watch(() => staffAttendanceStore.getCurrentStaffAttendance, (newVal) => {
    if (newVal) {
      if (newVal.leaveStartDate) leaveStartDate.value = newVal.leaveStartDate
      if (newVal.leaveEndDate) leaveEndDate.value = newVal.leaveEndDate
    }
  }, { immediate: true })

  const todayLogs = computed(() => {
    const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!currentAttendance) return []

    const logs = []

    if (currentAttendance.timeInAM) {
      logs.push({
        id: currentAttendance.id + '_am_in',
        type: 'time-in',
        timeIn: currentAttendance.timeInAM,
        timeOut: currentAttendance.timeOutAM,
        status: currentAttendance.staffStatusAM || currentAttendance.statusAM,
        location: currentAttendance.LocAM || currentAttendance.locationAM,
        address: currentAttendance.LocAM?.address || currentAttendance.address,
        latitude: currentAttendance.LocAM?.latitude ?? currentAttendance.latitude,
        longitude: currentAttendance.LocAM?.longitude ?? currentAttendance.longitude,
        addressOut: currentAttendance.timeOutAddressAM || null,
        latitudeOut: currentAttendance.timeOutLatitudeAM ?? null,
        longitudeOut: currentAttendance.timeOutLongitudeAM ?? null,
        photoUrl: currentAttendance.photoUrl,
        photoOutUrl: currentAttendance.photoOutUrlAM || null
      })
    }

    if (currentAttendance.timeInPM) {
      logs.push({
        id: currentAttendance.id + '_pm_in',
        type: 'time-in',
        timeIn: currentAttendance.timeInPM,
        timeOut: currentAttendance.timeOutPM,
        status: currentAttendance.staffStatusPM || currentAttendance.statusPM,
        location: currentAttendance.LocPM || currentAttendance.locationPM,
        address: currentAttendance.LocPM?.address || currentAttendance.address,
        latitude: currentAttendance.LocPM?.latitude ?? currentAttendance.latitude,
        longitude: currentAttendance.LocPM?.longitude ?? currentAttendance.longitude,
        addressOut: currentAttendance.timeOutAddressPM || null,
        latitudeOut: currentAttendance.timeOutLatitudePM ?? null,
        longitudeOut: currentAttendance.timeOutLongitudePM ?? null,
        photoUrl: currentAttendance.photoUrl,
        photoOutUrl: currentAttendance.photoOutUrlPM || null
      })
    }

    return logs.sort((a, b) => String(b.timeIn || '').localeCompare(String(a.timeIn || '')))
  })

  const getStatusEmoji = (status) => {
    return ''
  }

  // Initialize time display
  const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
    currentDate.value = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Navigation function
  const navigateTo = (routeName, navItem) => {
    activeNav.value = navItem
    router.push({ name: routeName })
  }

  // Status change handler
  const onStatusChange = async () => {
    showNotification(`Status changed to ${selectedStatus.value}`, 'info')
    if (selectedStatus.value === 'On Field' || selectedStatus.value === 'Travel') {
      getUserLocation()
    } else if (selectedStatus.value === 'Leave') {
      try {
        const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
        const res = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
        if (res.success && res.data?.id) {
          await staffAttendanceStore.updateStaffAttendance(res.data.id, { staffStatus: selectedStatus.value })
        }
      } catch (e) {
        console.error('Failed to update status in background:', e)
      }
    }
  }

  const handleLeaveFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    // Filter and validate files
    const validFiles = files.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        showNotification(`Skipped ${file.name}: Invalid file type.`, 'warning')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`Skipped ${file.name}: File too large (>5MB).`, 'warning')
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    try {
      showNotification(`Uploading ${validFiles.length} file(s)...`)
      
      const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
      const res = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
      
      if (!res.success || !res.data?.id) {
         showNotification('Failed to find daily attendance record.', 'error')
         return
      }
      
      const attendanceId = res.data.id
      const uploadedUrls = [...leaveDocumentUrls.value]

      for (const file of validFiles) {
        const url = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = async (e) => {
            const base64Data = e.target.result
            const filename = `leave_${attendanceId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${file.name.split('.').pop()}`
            const downloadUrl = await staffAttendanceStore.uploadLeaveDocument(base64Data, filename)
            resolve(downloadUrl)
          }
          reader.onerror = reject
          reader.readAsDataURL(file)
        })

        if (url) {
          uploadedUrls.push({ url: url, name: file.name })
        }
      }

      const updateRes = await staffAttendanceStore.updateLeaveStatus(
        attendanceId, 
        uploadedUrls,
        leaveStartDate.value,
        leaveEndDate.value
      )

      if (updateRes.success) {
        openModal('Success', `${validFiles.length} document(s) uploaded successfully!`, 'success')
      } else {
        showNotification(updateRes.error || 'Failed to update leave status.', 'error')
      }
    } catch (error) {
      console.error('File upload error:', error)
      showNotification('An error occurred during file upload.', 'error')
    }
  }

  const removeLeaveDocument = async (index) => {
    const attendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!attendance?.id) return

    try {
      const updatedUrls = [...leaveDocumentUrls.value]
      updatedUrls.splice(index, 1)

      const res = await staffAttendanceStore.updateLeaveStatus(
        attendance.id, 
        updatedUrls,
        leaveStartDate.value,
        leaveEndDate.value
      )

      if (res.success) {
        showNotification('Document removed.', 'info')
      }
    } catch (error) {
      showNotification('Failed to remove document.', 'error')
    }
  }

  const submitLeaveDetails = async () => {
    if (!leaveStartDate.value || !leaveEndDate.value) {
      openModal('Missing Dates', 'Please select both start and end dates for your leave.', 'warning')
      return
    }

    try {
      submittingLeave.value = true
      showNotification('Submitting leave request...', 'info')
      
      const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
      const res = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
      
      if (!res.success || !res.data?.id) {
         showNotification('Failed to find daily attendance record.', 'error')
         submittingLeave.value = false
         return
      }

      const attendanceId = res.data.id
      const updateRes = await staffAttendanceStore.updateLeaveStatus(
        attendanceId, 
        leaveDocumentUrls.value,
        leaveStartDate.value,
        leaveEndDate.value
      )

      if (updateRes.success) {
        openModal('Success', 'Your leave request has been submitted successfully!', 'success')
      } else {
        showNotification(updateRes.error || 'Failed to submit leave request.', 'error')
      }
    } catch (error) {
      console.error('Leave submission error:', error)
      showNotification('An error occurred during submission.', 'error')
    } finally {
      submittingLeave.value = false
    }
  }

  const handleLeaveDurationChange = async () => {
    const attendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!attendance?.id) return

    try {
      const res = await staffAttendanceStore.updateLeaveStatus(
        attendance.id, 
        attendance.leaveDocumentUrl,
        leaveStartDate.value, 
        leaveEndDate.value
      )
      if (res.success) {
        showNotification('Leave duration updated.', 'success')
      }
    } catch (error) {
      console.error('Failed to update leave duration:', error)
      showNotification('Failed to save leave duration.', 'error')
    }
  }

  const clearLeaveDocument = async () => {
    const attendance = staffAttendanceStore.getCurrentStaffAttendance
    if (!attendance?.id) return

    try {
      const res = await staffAttendanceStore.updateLeaveStatus(
        attendance.id, 
        [], // clear all doc urls
        leaveStartDate.value,
        leaveEndDate.value
      )
      if (res.success) {
        showNotification('All documents removed.', 'info')
      }
    } catch (error) {
      showNotification('Failed to remove documents.', 'error')
    }
  }

  // Biometric helper functions
  const getBiometricMessage = () => {
    if (isScanning.value) {
      return 'Scanning fingerprint... Please hold your finger on the scanner'
    }
    
    if (todayLogs.value.length === 0) {
      return 'Tap your RFID card to record attendance'
    }
    
    const lastLog = todayLogs.value[0]
    if (lastLog.type === 'time-in' && !lastLog.timeOut) {
      return 'You are currently clocked in. Scan to clock out for lunch/break'
    } else if (lastLog.type === 'time-out') {
      return 'Welcome back! Scan to clock in and resume work'
    }
    
    return 'Tap your RFID card to record attendance'
  }

  const getBiometricButtonText = () => {
    if (todayLogs.value.length === 0) {
      return 'Clock In'
    }
    
    const lastLog = todayLogs.value[0]
    if (lastLog.type === 'time-in' && !lastLog.timeOut) {
      return 'Clock Out'
    } else if (lastLog.type === 'time-out') {
      return 'Clock In'
    }
    
    return 'Clock In'
  }

  const getCurrentAttendanceStatus = () => {
    if (todayLogs.value.length === 0) {
      return 'Not clocked in today'
    }
    
    const lastLog = todayLogs.value[0]
    if (lastLog.type === 'time-in' && !lastLog.timeOut) {
      return 'Currently working'
    } else if (lastLog.type === 'time-out') {
      return 'On break'
    }
    
    return 'Not clocked in'
  }

  const normalizeLogTime = (value) => {
    if (!value) return new Date(0)
    if (value?.toDate) return value.toDate()

    if (typeof value === 'string') {
      const hhmmss = /^\d{2}:\d{2}:\d{2}$/
      if (hhmmss.test(value)) {
        const [h, m, s] = value.split(':').map(Number)
        const now = new Date()
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s || 0)
      }

      const d = new Date(value)
      if (!Number.isNaN(d.getTime())) return d
    }

    return new Date(0)
  }

  const formatLogTime = (value) => {
    const d = normalizeLogTime(value)
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getLastCheckInTime = () => {
    if (todayLogs.value.length === 0) return ''
    const lastLog = todayLogs.value[0]
    const t = lastLog.type === 'time-in' ? lastLog.timeIn : lastLog.timeOut
    if (!t) return ''
    return `Last: ${formatLogTime(t)}`
  }

  const getDisplayLogs = () => {
    const displayLogs = []

    todayLogs.value.forEach(log => {
      if (log.timeIn) {
        displayLogs.push({
          id: log.id + '_timein',
          tempId: log.id + '_timein',
          type: 'time-in',
          time: log.timeIn,
          status: log.status,
          location: log.location,
          address: log.address || null,
          latitude: log.latitude ?? null,
          longitude: log.longitude ?? null,
          photo: log.photoUrl,
          notes: log.notes,
          originalLog: log
        })
      }

      if (log.timeOut) {
        displayLogs.push({
          id: log.id + '_timeout',
          tempId: log.id + '_timeout',
          type: 'time-out',
          time: log.timeOut,
          status: log.status,
          location: log.locationOut,
          address: log.addressOut || log.address || null,
          latitude: log.latitudeOut ?? log.latitude ?? null,
          longitude: log.longitudeOut ?? log.longitude ?? null,
          photo: log.photoOutUrl,
          notes: log.notesOut,
          originalLog: log
        })
      }
    })

    return displayLogs.sort((a, b) => normalizeLogTime(b.time) - normalizeLogTime(a.time))
  }

  const getLogType = (log) => {
    return log.type || 'time-in'
  }

  const getLogTime = (log) => {
    if (!log.time) return ''
    return formatLogTime(log.time)
  }

  const getLogLocation = (log) => {
    return log.location || null
  }

  const getLogAddress = (log) => {
    return log.address || null
  }

  const getLogPhoto = (log) => {
    return log.photo || null
  }

  // Enhanced geolocation function with proper error handling and validation
  const getUserLocation = async () => {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser')
    }

    try {
      showNotification('Detecting your location...')
      
      // Get high-accuracy location with proper error handling
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          (error) => {
            let errorMessage = 'Failed to get location'
            
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Location permission denied. Please enable location services in your browser settings.'
                break
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Please check your GPS/connection.'
                break
              case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.'
                break
              default:
                errorMessage = `Location error: ${error.message}`
                break
            }
            
            reject(new Error(errorMessage))
          },
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        )
      })

      const { latitude, longitude, accuracy } = position.coords
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates received from GPS')
      }

      // Get address from coordinates using OpenStreetMap Nominatim reverse geocoding
      let address = null
      try {
        const { addressLine } = await reverseGeocode(latitude, longitude)
        address = addressLine || null
      } catch (error) {
        console.error('Geocoding error (non-blocking):', error)
        showNotification(error.message, 'warning')
        address = null
      }

      userLocation.value = {
        lat: latitude.toFixed(6),
        lng: longitude.toFixed(6),
        address: address ? address.trim() : null,
        accuracy: accuracy.toFixed(2),
        timestamp: new Date().toISOString()
      }

      showNotification(
        userLocation.value.address
          ? `Location detected: ${userLocation.value.address}`
          : `Location detected: ${userLocation.value.lat}, ${userLocation.value.lng}`,
        'success'
      )
      console.log('Location detected successfully:', userLocation.value)
      
      return userLocation.value
      
    } catch (error) {
      console.error('Geolocation error:', error)
      showNotification(error.message, 'error')
      throw error // Re-throw to prevent saving invalid location data
    }
  }

  // Camera functions - explicitly defined to resolve HMR issues
  const startCamera = async () => {
    try {
      console.log('Starting camera... Step 1: Requesting user-facing camera')
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        })
        console.log('Step 2: User-facing camera obtained!', stream)
      } catch (err) {
        console.log('Step 2: Failed user-facing camera, falling back to any camera.', err)
        // Fallback to any available camera if 'user' facing mode fails (e.g. desktop without default user facing camera)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false 
        })
        console.log('Step 3: Fallback camera obtained!', stream)
      }

      console.log('Step 4: Checking videoElement.value:', videoElement.value)
      if (videoElement.value && stream) {
        videoElement.value.srcObject = stream
        cameraActive.value = true
        showNotification('Camera started successfully!', 'success')
        console.log('Step 5: Camera active!')
      } else if (!stream) {
        showNotification('Camera stream is not available. Please allow permissions.', 'error')
        console.log('Step 5: Stream is falsy')
      } else {
        console.error('Video element not found in DOM.')
      }
    } catch (error) {
      console.log('Camera error caught:', error)
      if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        showNotification('No camera found on this device.', 'error')
      } else {
        showNotification('Failed to access camera. Please check permissions.', 'error')
        console.error('Camera error details:', error)
      }
    }
  }

  const stopCamera = () => {
    if (videoElement.value && videoElement.value.srcObject) {
      const stream = videoElement.value.srcObject
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      videoElement.value.srcObject = null
      cameraActive.value = false
    }
  }

  const capturePhoto = () => {
    if (videoElement.value) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.width = videoElement.value.videoWidth
      canvas.height = videoElement.value.videoHeight
      context.drawImage(videoElement.value, 0, 0)
      
      capturedPhoto.value = canvas.toDataURL('image/jpeg')
      stopCamera()
      showNotification('Photo captured successfully!', 'success')
    }
  }

  const retakePhoto = () => {
    capturedPhoto.value = null
    startCamera()
  }

  // Expose functions to template for HMR compatibility
  defineExpose({
    startCamera,
    stopCamera,
    capturePhoto,
    retakePhoto
  })

  const getOsmEmbedUrl = (latitude, longitude) => {
    const lat = Number(latitude)
    const lon = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return ''

    const delta = 0.005
    const left = lon - delta
    const right = lon + delta
    const top = lat + delta
    const bottom = lat - delta
    const bbox = `${left},${bottom},${right},${top}`
    return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lon}`)}`
  }

  const showNotification = (message, type = 'info') => {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message
    
    // Add to DOM
    document.body.appendChild(notification)
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 3000)
  }

  const handleBiometricAction = async () => {
    if (isScanning.value) return
    
    isScanning.value = true
    
    try {
      // Simulate biometric scanning process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Determine action based on current state
      if (todayLogs.value.length === 0) {
        // First time in - clock in
        await performTimeIn()
      } else {
        const lastLog = todayLogs.value[0]
        if (lastLog.type === 'time-in' && !lastLog.timeOut) {
          // Currently clocked in - clock out for lunch/break
          await performTimeOut()
        } else {
          // Was on break - clock back in
          await performTimeIn()
        }
      }
      
      showNotification('Biometric verification successful!', 'success')
    } catch (error) {
      showNotification('Biometric verification failed. Please try again.', 'error')
      console.error('Biometric error:', error)
    } finally {
      isScanning.value = false
    }
  }

  const performTimeIn = async () => {
    try {
      // Create or get today's attendance
      const ensuredStaffId = staffId.value || (await staffAttendanceStore.ensureCurrentStaffId())
      staffId.value = ensuredStaffId
      const result = await staffAttendanceStore.createOrGetDailyAttendance(ensuredStaffId)
      const attendance = result.data

      if (!result?.success || !attendance?.id) {
        showNotification(result?.error || 'Failed to prepare today\'s attendance record.', 'error')
        return
      }
      
      // Determine if it's AM or PM time
      const currentHour = new Date().getHours()
      const isAM = currentHour < 12

      // Restrict multiple clock-ins per session (AM/PM)
      const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
      if (currentAttendance) {
        if (isAM && currentAttendance.timeInAM) {
          openModal('Already Clocked In', 'You already clocked in for AM.', 'warning')
          return
        }

        if (!isAM && currentAttendance.timeInPM) {
          openModal('Already Clocked In', 'You already clocked in for PM.', 'warning')
          return
        }
      }
      
      // Build location data only with valid values
      const locationData = {
        staffStatus: selectedStatus.value
      }
      
      if (selectedStatus.value === 'At Office') {
        // Resolve exact location even when at office
        try {
          await getUserLocation()
        } catch (error) {
          return
        }

        if (!userLocation.value?.lat || !userLocation.value?.lng) {
          showNotification('Invalid location data. Please try again.', 'error')
          return
        }

        locationData.location = 'Office'
        if (userLocation.value.address) locationData.address = userLocation.value.address
        locationData.latitude = parseFloat(userLocation.value.lat)
        locationData.longitude = parseFloat(userLocation.value.lng)
        if (!Number.isFinite(locationData.latitude) || !Number.isFinite(locationData.longitude)) {
          showNotification('Invalid location coordinates. Please try again.', 'error')
          return
        }
      } else if (selectedStatus.value === 'On Field' || selectedStatus.value === 'Travel') {
        // For travel/field, always resolve location (GPS + reverse geocode) before saving
        try {
          await getUserLocation()
        } catch (error) {
          // getUserLocation already shows a notification; block save to avoid writing blank location
          return
        }

        if (!userLocation.value?.lat || !userLocation.value?.lng) {
          showNotification('Invalid location data from GPS. Please try again.', 'error')
          return
        }
        
        locationData.location = 'Field Location'
        if (userLocation.value.address) locationData.address = userLocation.value.address
        locationData.latitude = parseFloat(userLocation.value.lat)
        locationData.longitude = parseFloat(userLocation.value.lng)
        if (!Number.isFinite(locationData.latitude) || !Number.isFinite(locationData.longitude)) {
          showNotification('Invalid location coordinates parsed. Please try again.', 'error')
          return
        }
        
        // Only add photo URL for travel/field status if photo exists
        if (capturedPhoto.value) {
          locationData.photoUrl = capturedPhoto.value
        }
      }
      
      let updateResult
      if (isAM) {
        updateResult = await staffAttendanceStore.clockInAM(attendance.id, locationData)
      } else {
        updateResult = await staffAttendanceStore.clockInPM(attendance.id, locationData)
      }
      
      if (!updateResult?.success) {
        const msg = updateResult?.error || 'Failed to clock in. Please try again.'
        if (String(msg).toLowerCase().includes('already clocked in')) {
          openModal('Already Clocked In', msg, 'warning')
        } else {
          showNotification(msg, 'error')
        }
        return
      }

      if (updateResult.success) {
        currentAttendanceId.value = attendance.id
        // Clear photo only for travel/field status after successful save
        if (selectedStatus.value === 'Travel' || selectedStatus.value === 'On Field') {
          capturedPhoto.value = null
        }
        openModal('Success', 'Clocked in successfully!', 'success')
      } else {
        showNotification(updateResult?.error || 'Unknown error occurred during saving.', 'error')
      }
    } catch (error) {
      console.error('Time in error block triggered:', error)
      showNotification(error?.message || 'Failed to clock in. Please try again.', 'error')
    }
  }

  const performTimeOut = async () => {
    try {
      const currentAttendance = staffAttendanceStore.getCurrentStaffAttendance
      if (!currentAttendance) {
        showNotification('No active attendance found', 'error')
        return
      }
      
      // Determine if it's AM or PM time
      const currentHour = new Date().getHours()
      const isAM = currentHour < 12

      // Restrict multiple clock-outs per session (AM/PM)
      if (isAM) {
        if (!currentAttendance.timeInAM) {
          showNotification('You have not clocked in for AM yet.', 'warning')
          return
        }
        if (currentAttendance.timeOutAM) {
          showNotification('You already clocked out for AM.', 'warning')
          return
        }
      } else {
        if (!currentAttendance.timeInPM) {
          showNotification('You have not clocked in for PM yet.', 'warning')
          return
        }
        if (currentAttendance.timeOutPM) {
          showNotification('You already clocked out for PM.', 'warning')
          return
        }
      }
      
      // Resolve exact location for clock-out too
      try {
        await getUserLocation()
      } catch (error) {
        return
      }

      if (!userLocation.value?.lat || !userLocation.value?.lng) {
        showNotification('Invalid location data. Please try again.', 'error')
        return
      }

      const locationData = {
        staffStatus: selectedStatus.value,
        ...(userLocation.value.address ? { address: userLocation.value.address } : {}),
        latitude: parseFloat(userLocation.value.lat),
        longitude: parseFloat(userLocation.value.lng)
      }

      if (selectedStatus.value === 'Travel' || selectedStatus.value === 'On Field') {
        if (capturedPhoto.value) {
          locationData.photoUrl = capturedPhoto.value
        }
      }

      let updateResult
      if (isAM && currentAttendance.timeInAM && !currentAttendance.timeOutAM) {
        updateResult = await staffAttendanceStore.clockOutAM(currentAttendance.id, locationData)
      } else if (!isAM && currentAttendance.timeInPM && !currentAttendance.timeOutPM) {
        updateResult = await staffAttendanceStore.clockOutPM(currentAttendance.id, locationData)
      } else {
        showNotification('No active clock-in found to clock out', 'error')
        return
      }
      
      if (!updateResult?.success) {
        showNotification(updateResult?.error || 'Failed to clock out. Please try again.', 'error')
        return
      }

      if (updateResult.success) {
        if (selectedStatus.value === 'Travel' || selectedStatus.value === 'On Field') {
          capturedPhoto.value = null
        }
        openModal('Success', 'Clocked out successfully!', 'success')
      }
    } catch (error) {
      console.error('Time out error:', error)
      showNotification(error?.message || 'Failed to clock out. Please try again.', 'error')
    }
  }

  const timeInWithPhoto = async () => {
    if (capturedPhoto.value && !isClockedIn.value) {
      isTimingIn.value = true
      try {
        await performTimeIn()
      } finally {
        isTimingIn.value = false
      }
    }
  }

  const timeOutWithPhoto = async () => {
    if (capturedPhoto.value && isClockedIn.value) {
      isTimingOut.value = true
      try {
        await performTimeOut()
      } finally {
        isTimingOut.value = false
      }
    }
  }

  const initOrUpdateLeafletMap = () => {
    if (!leafletMapEl.value) return
    if (!userLocation.value?.lat || !userLocation.value?.lng) return

    const lat = parseFloat(userLocation.value.lat)
    const lng = parseFloat(userLocation.value.lng)
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return

    L.Icon.Default.mergeOptions({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
    })

    if (!leafletMap.value) {
      leafletMap.value = L.map(leafletMapEl.value, {
        zoomControl: true,
        attributionControl: true,
      }).setView([lat, lng], 16)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(leafletMap.value)

      leafletMarker.value = L.marker([lat, lng]).addTo(leafletMap.value)
      if (userLocation.value?.address) {
        leafletMarker.value.bindPopup(userLocation.value.address).openPopup()
      }
    } else {
      leafletMap.value.setView([lat, lng], 16)
      if (leafletMarker.value) {
        leafletMarker.value.setLatLng([lat, lng])
      } else {
        leafletMarker.value = L.marker([lat, lng]).addTo(leafletMap.value)
      }
      
      if (userLocation.value?.address) {
        leafletMarker.value.bindPopup(userLocation.value.address).openPopup()
      }
    }

    setTimeout(() => {
      try {
        leafletMap.value?.invalidateSize()
      } catch {
        // ignore
      }
    }, 0)
  }

  const reverseGeocode = async (latitude, longitude) => {
    const lat = Number(latitude)
    const lon = Number(longitude)
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return { json: null, addressLine: null }

    const addressFromObject = (obj) => {
      if (!obj || typeof obj !== 'object') return null
      const parts = [
        obj.house_number,
        obj.road || obj.street,
        obj.neighbourhood,
        obj.suburb || obj.village || obj.locality,
        obj.city_district || obj.district,
        obj.city || obj.town || obj.municipality,
        obj.state || obj.region,
        obj.postcode,
        obj.country
      ].filter(Boolean)
      
      const uniqueParts = [...new Set(parts)]
      return uniqueParts.length ? uniqueParts.join(', ') : null
    }

    const extractAddress = (json) => {
      if (!json) return null;
      return (
        (typeof json?.display_name === 'string' && json.display_name.trim() !== '' ? json.display_name : null) ||
        addressFromObject(json?.address) ||
        addressFromObject(json?.raw?.address) ||
        addressFromObject(json?.raw?.properties) ||
        (typeof json?.address === 'string' ? json.address : null) ||
        (typeof json?.addressLine === 'string' ? json.addressLine : null) ||
        null
      )
    }

    let jsonResult = null;
    let addressLineResult = null;

    // 1. Try backend proxy first
    try {
      const url = `${GEO_API_BASE_URL}/geo/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
      if (res.ok) {
        const json = await res.json().catch(() => null)
        const addr = extractAddress(json)
        if (addr) {
          jsonResult = json;
          addressLineResult = addr;
        }
      }
    } catch (e) {
      // Backend failed (e.g. 500 error or network issue)
      console.warn('Backend reverse search failed, using client fallback...');
    }

    // 2. Client side fallback to photon if backend failed or returned null address
    if (!addressLineResult) {
      try {
        const pUrl = `https://photon.komoot.io/reverse?lat=${lat}&lon=${lon}`
        const pRes = await fetch(pUrl)
        if (pRes.ok) {
          const pJson = await pRes.json()
          const feature = pJson?.features?.[0]?.properties
          const pAddr = addressFromObject(feature) || (feature?.name ? feature.name : null)
          if (pAddr) {
            jsonResult = pJson
            addressLineResult = pAddr
          }
        }
      } catch (e) {
        // ignore fallback error
      }
    }

    return { 
      json: jsonResult, 
      addressLine: addressLineResult ? addressLineResult.trim() : null 
    }
  }

  let attendanceUnsub = null
  
  onMounted(() => {
    document.addEventListener('click', onDocClick)
    window.addEventListener('resize', handleResize)
    handleResize()
    fetchUserProfile()
    updateTime()
    timeInterval = setInterval(updateTime, 1000)

    ;(async () => {
      staffId.value = await staffAttendanceStore.ensureCurrentStaffId()
      if (staffId.value) {
        const res = await staffAttendanceStore.createOrGetDailyAttendance(staffId.value)
        if (res.success && res.data?.staffStatus) {
          selectedStatus.value = res.data.staffStatus
        }
        if (res.success && res.data?.id) {
          import('firebase/firestore').then(({ onSnapshot }) => {
             attendanceUnsub = onSnapshot(doc(db, 'staff_attendance', res.data.id), (docSnap) => {
               if (docSnap.exists()) {
                 staffAttendanceStore.currentStaffAttendance = { id: docSnap.id, ...docSnap.data() }
               }
             })
          })
        }
      }
    })()
  })

  watch(
    () => userLocation.value,
    () => {
      initOrUpdateLeafletMap()
    },
    { deep: true }
  )

  onUnmounted(() => {
    document.removeEventListener('click', onDocClick)
    window.removeEventListener('resize', handleResize)
    if (timeInterval) {
      clearInterval(timeInterval)
    }

    try {
      leafletMap.value?.remove()
    } catch {
      // ignore
    }
    leafletMap.value = null
    leafletMarker.value = null

    // Stop camera if active
    stopCamera()
    if (attendanceUnsub) { attendanceUnsub() }
  })

  const checkRfidAndAction = () => {
    const el = document.getElementById('rfid-attendance-input')
    const scannedRfid = el ? el.value.trim() : ''
    
    if (!scannedRfid) {
      openModal('RFID Not Detected', 'Please tap your RFID card on the scanner before clocking in.', 'error')
      return
    }

    if (!userProfile.value || !userProfile.value.rfid) {
      openModal('No RFID Registered', 'Your account does not have a registered RFID card. Please contact the administrator.', 'error')
      if (el) el.value = ''
      return
    }

    if (scannedRfid !== userProfile.value.rfid) {
      openModal('Invalid RFID', 'The scanned RFID card does not match your registered account. Please use your own RFID card.', 'error')
      if (el) el.value = ''
      return
    }

    handleBiometricAction()
    if (el) el.value = ''
  }
</script>


