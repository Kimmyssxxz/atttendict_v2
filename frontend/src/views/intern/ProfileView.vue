<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col lg:flex-row lg:p-2 md:lg:p-3 lg:lg:p-4 gap-0 lg:gap-3">
    
    <!-- Left Sidebar Navbar -->
    <aside class="w-[280px] bg-[#133e75] hidden lg:flex flex-col h-[calc(100vh-1rem)] md:h-[calc(100vh-1.5rem)] lg:h-[calc(100vh-2rem)] rounded-2xl shrink-0 shadow-sm sticky top-2 md:top-3 lg:top-4 overflow-y-auto custom-scrollbar">
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
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.staff, WebkitMaskSize: 'cover', maskImage: icons.staff, maskSize: 'cover' }"></span> Staff Status
          </router-link>
          <router-link to="/intern/notifications" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-gray-100 hover:text-black [&.router-link-active]:bg-gray-100 [&.router-link-active]:text-black border border-transparent flex items-center justify-between group">
            <div class="flex items-center gap-3">
              <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.notification, WebkitMaskSize: 'cover', maskImage: icons.notification, maskSize: 'cover' }"></span> 
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
    <main class="flex-1 w-full flex flex-col min-w-0">
      
      <!-- Mobile Header -->
      <header class="px-6 py-7 flex items-center sticky top-0 z-20 bg-gray-50 border-b border-transparent lg:hidden ">
        <button @click="$router.back()" class="bg-transparent border-none cursor-pointer flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div class="flex-1 text-center pr-7">
          <h1 class="m-0 text-black font-semibold text-xl tracking-wide whitespace-nowrap">Intern Profile</h1>
        </div>
      </header>

      <!-- Content Container -->
      <div class="flex-1 w-full flex flex-col gap-3 px-2 md:px-3 lg:px-0 pt-4 lg:pt-0">
        
        <!-- Desktop Header (Desktop only) -->
        <header v-if="isDesktop" class="flex p-2 items-center justify-between shrink-0 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10">
          <div class="flex items-center gap-2 pl-2">
            <button @click="$router.back()" class="text-gray-500 hover:text-gray-900 transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 class="m-0 text-3xl font-semibold text-gray-900">Intern Profile</h1>
          </div>
          <div class="flex items-center gap-3 pr-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold overflow-hidden shadow-sm cursor-pointer transition-all" @click="$router.push('/intern/profile')">
               <img v-if="intern.photoUrl" :src="intern.photoUrl" alt="Avatar" class="w-full h-full object-cover"/>
               <span v-else>{{ avatarInitials }}</span>
            </div>
          </div>
        </header>
        

        <template v-if="isInitialLoading">
          <!-- SKELETON: Profile Summary -->
          <section class="bg-white rounded-3xl shadow p-5 md:p-6 flex flex-col items-center gap-4 text-center mt-2 lg:mt-0 animate-pulse">
            <div class="w-32 h-32 rounded-full bg-slate-200 border-4 border-white shadow-md mx-auto"></div>
            <div class="w-full flex flex-col items-center gap-2 mt-2">
              <div class="h-8 bg-slate-200 rounded w-48"></div>
              <div class="h-4 bg-slate-200 rounded w-32"></div>
            </div>
            <div class="mt-1 w-full flex justify-center">
              <div class="w-48 h-10 rounded-xl bg-slate-200"></div>
            </div>
          </section>

          <!-- SKELETON: Forms -->
          <div class="flex flex-col gap-6 mb-10 animate-pulse">
            <section class="bg-white rounded-xl shadow p-5 md:p-6">
              <div class="h-6 bg-slate-200 rounded w-40 mb-6"></div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="i in 6" :key="i" class="flex flex-col gap-2 relative" :class="{'md:col-span-2': i === 5}">
                  <div class="h-4 bg-slate-200 rounded w-24"></div>
                  <div class="w-full h-10 rounded-xl bg-slate-200"></div>
                </div>
              </div>
            </section>
          </div>
        </template>
        
        <template v-else>
          <!-- MOBILE VIEW (Handled primarily by Tailwind classes but can be specialized here) -->
          <div v-if="!isDesktop" class="flex flex-col gap-4">
             <!-- Profile Summary Card (Mobile) -->
            <section class="bg-white rounded-3xl shadow p-5 flex flex-col items-center gap-4 text-center mt-2">
              <div class="relative group">
                <div class="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 text-gray-400 text-3xl font-bold border-4 border-white shadow-md mx-auto" v-if="intern.photoUrl">
                  <img :src="intern.photoUrl" alt="Profile picture" class="w-full h-full object-cover" />
                </div>
                <div class="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-bold border-4 border-white shadow-md mx-auto" v-else>
                  <span>{{ avatarInitials }}</span>
                </div>
                
                <label class="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mx-auto w-32 h-32">
                  <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path></svg>
                  <span class="text-[0.7rem] font-medium">{{ uploadingPhoto ? 'Uploading...' : 'Upload' }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
                </label>
              </div>
              
              <div class="w-full">
                <h2 class="m-0 text-2xl font-bold text-gray-900">{{ formattedName !== 'N/A' ? formattedName : 'Intern Profile' }}</h2>
                <p class="m-0 text-sm font-normal text-gray-400">@{{ intern.username || 'Not set' }}</p>
              </div>

              <div class="mt-1 w-full flex justify-center">
                <label class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#eebb3b] text-white hover:bg-[#eebb3b]/90 transition-colors text-base font-normal cursor-pointer">
                  <span>{{ uploadingPhoto ? 'Uploading...' : 'Upload Photo' }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
                </label>
              </div>
              <p v-if="photoError" class="m-0 mt-1 w-full text-center text-xs text-red-500 font-bold">{{ photoError }}</p>
            </section>

            <!-- Forms / Settings (Mobile) -->
            <!-- Simplified basic form for mobile -->
             <section class="bg-white rounded-xl shadow p-5">
              <h3 class="m-0 text-xl text-gray-900 font-semibold mb-6">Basic Information</h3>
              <div class="flex flex-col gap-5">
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-normal text-slate-700">Full Name</label>
                  <input type="text" :value="formattedName" disabled class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
                </div>
                <div class="flex flex-col gap-2">
                   <label class="text-xs font-normal text-slate-700">Email Address</label>
                   <input type="email" v-model="intern.email" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                   <label class="text-xs font-normal text-slate-700">Phone</label>
                   <input type="text" v-model="intern.phoneNumber" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                   <label class="text-xs font-normal text-slate-700">Address</label>
                   <input type="text" v-model="intern.address" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
              </div>
            </section>

             <section class="bg-white rounded-xl shadow p-5">
              <h3 class="m-0 text-xl text-gray-900 font-semibold mb-6">School Information</h3>
              <div class="flex flex-col gap-5">
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-normal text-slate-700">School Name</label>
                  <input type="text" v-model="intern.schoolOrUniversity" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
                <div class="flex flex-col gap-2">
                  <label class="text-xs font-normal text-slate-700">OJT Required Hours</label>
                  <input type="number" v-model.number="intern.ojtRequiredHours" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm" />
                </div>
              </div>
            </section>

            <!-- Account Settings Sections (Mobile) -->
            <div class="flex flex-col gap-6 ">
              <!-- Change Password Card -->
              <section class="bg-white rounded-xl shadow p-5">
                <div class="mb-6">
                  <h3 class="m-0 text-xl text-gray-900 font-semibold">Change Password</h3>
                </div>
                <form class="flex flex-col gap-4" @submit.prevent="handleChangePassword">
                  <div class="flex flex-col gap-2">
                    <label for="m-current" class="text-xs font-normal text-slate-700">Current Password</label>
                    <input id="m-current" type="password" v-model="passwordForm.currentPassword" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-slate-900" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="m-new" class="text-xs font-normal text-slate-700">New Password</label>
                    <input id="m-new" type="password" v-model="passwordForm.newPassword" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-slate-900" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="m-confirm" class="text-xs font-normal text-slate-700">Confirm New Password</label>
                    <input id="m-confirm" type="password" v-model="passwordForm.confirmNewPassword" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-slate-900" />
                  </div>
                  <div class="flex flex-col items-center gap-4 mt-2">
                    <button type="submit" class="w-full py-3 rounded-xl bg-[#eebb3b] text-white font-semibold text-sm" :disabled="pwdSaving || !intern.id">
                      {{ pwdSaving ? 'Saving...' : 'Update Password' }}
                    </button>
                    <p v-if="pwdMessage" class="m-0 text-xs text-emerald-600 font-medium text-center">{{ pwdMessage }}</p>
                    <p v-if="pwdError" class="m-0 text-xs text-red-600 font-medium text-center">{{ pwdError }}</p>
                  </div>
                </form>
              </section>

              <!-- Security Card -->
              <section class="bg-white rounded-xl shadow p-5">
                <div class="mb-4">
                  <h3 class="m-0 text-xl text-gray-900 font-semibold">Security</h3>
                  <p class="mt-1 mb-0 text-xs text-slate-500">Manage your active sessions and login history.</p>
                </div>
                <div class="mt-6">
                  <h4 class="mt-0 mb-4 text-sm text-slate-900 font-semibold">Active Sessions</h4>
                  <div class="flex flex-col gap-3">
                    <div v-for="session in sessions" :key="session.id" class="flex flex-col items-start gap-4 p-4 rounded-xl border border-slate-200 bg-white [&.current]:bg-emerald-50 [&.current]:border-emerald-200 shadow-sm" :class="{ current: session.isCurrent }">
                      <div class="flex items-center gap-3 w-full">
                        <div class="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                          <span class="w-6 h-6 bg-slate-600" :style="{ maskImage: session.icon, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: session.icon, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }"></span>
                        </div>
                        <div class="flex-1 min-w-0">
                           <span class="block font-semibold text-slate-900 truncate text-sm">{{ session.device }}</span>
                           <span class="block text-xs text-slate-500">{{ session.browser }}</span>
                        </div>
                        <span v-if="session.isCurrent" class="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-50 font-medium shrink-0">Current</span>
                      </div>
                      <div class="flex flex-col gap-1 w-full text-xs">
                        <div class="flex justify-between">
                          <span class="text-slate-900 font-semibold">Location</span>
                          <span class="text-slate-500 font-medium">{{ session.location }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-slate-900 font-semibold">Last active</span>
                          <span class="text-slate-500 font-medium">{{ session.lastActive }}</span>
                        </div>
                      </div>
                      <button class="w-full py-2 rounded-xl border-none bg-red-100 text-red-700 text-xs font-semibold cursor-pointer" type="button" @click="revokeSession(session)">Revoke</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Save Profile Button (Mobile) -->
            <div class="flex flex-col items-center gap-4 px-2 mt-4 mb-20">
              <button type="button" @click="confirmLogout" class="w-full py-3.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all shadow-md mb-2">
                Logout
              </button>
              <button @click="handleSaveInfo" :disabled="infoSaving" class="w-full py-3.5 rounded-xl bg-[#133e75] text-white font-semibold text-sm ">
                {{ infoSaving ? 'Saving...' : 'Save Profile Changes' }}
              </button>
            </div>
          </div>


          <!-- DESKTOP VIEW -->
          <div v-if="isDesktop" class="flex flex-col gap-6">
            <!-- Profile Summary Card (Desktop) -->
            <section class="bg-white rounded-3xl shadow p-6 flex flex-col items-center gap-4 text-center mt-2 lg:mt-0">
              <div class="relative group">
                <div class="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-100 text-gray-400 text-3xl font-bold border-4 border-white shadow-md mx-auto" v-if="intern.photoUrl">
                  <img :src="intern.photoUrl" alt="Profile picture" class="w-full h-full object-cover" />
                </div>
                <div class="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-blue-50 text-blue-600 text-4xl font-bold border-4 border-white shadow-md mx-auto" v-else>
                  <span>{{ avatarInitials }}</span>
                </div>
                
                <label class="absolute inset-0 rounded-full bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer mx-auto w-32 h-32">
                  <svg class="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"></path></svg>
                  <span class="text-[0.7rem] font-medium">{{ uploadingPhoto ? 'Uploading...' : 'Upload' }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
                </label>
              </div>
              
              <div class="w-full">
                <h2 class="m-0 text-3xl font-bold text-gray-900">{{ formattedName !== 'N/A' ? formattedName : 'Intern Profile' }}</h2>
                <p class="m-0 text-base font-normal text-gray-400">@{{ intern.username || 'Not set' }}</p>
              </div>

              <div class="mt-1 w-full flex justify-center">
                <label class="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#eebb3b] text-white hover:bg-[#eebb3b]/90 transition-colors text-base font-normal cursor-pointer">
                  <span>{{ uploadingPhoto ? 'Uploading...' : 'Upload Profile Picture' }}</span>
                  <input type="file" accept="image/*" class="hidden" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
                </label>
              </div>
              <p v-if="photoError" class="m-0 mt-1 w-full text-center text-[0.85rem] text-red-500 font-bold">{{ photoError }}</p>
            </section>

            <!-- Main Form (Desktop) -->
            <form class="flex flex-col gap-6" @submit.prevent="handleSaveInfo">
              <!-- Basic Information Card -->
              <section class="bg-white rounded-xl shadow p-6">
                <div class="mb-6">
                  <h3 class="m-0 text-2xl text-gray-900 font-semibold">Basic Information</h3>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-normal text-slate-700">Full Name</label>
                    <input type="text" :value="formattedName" disabled class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label class="text-sm font-normal text-slate-700">Student ID / Intern ID</label>
                    <input type="text" :value="intern.username" disabled class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="editEmail" class="text-sm font-normal text-slate-700">Email Address</label>
                    <input id="editEmail" type="email" v-model="intern.email" placeholder="example@gmail.com" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="editPhone" class="text-sm font-normal text-slate-700">Contact Number</label>
                    <input id="editPhone" type="text" v-model="intern.phoneNumber" placeholder="09XX XXX XXXX" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2 col-span-2">
                    <label for="editAddress" class="text-sm font-normal text-slate-700">Address</label>
                    <input id="editAddress" type="text" v-model="intern.address" placeholder="Full Home Address" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2 relative">
                    <label for="editGender" class="text-sm font-normal text-slate-700">Gender</label>
                    <button id="editGender" type="button" @click="showGenderDropdown = !showGenderDropdown" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] bg-white text-left flex justify-between items-center" :class="intern.gender ? 'text-slate-900' : 'text-slate-400'">
                      {{ intern.gender || 'Select Gender' }}
                      <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showGenderDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div v-if="showGenderDropdown" class="absolute z-50 w-full top-[72px] bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      <button v-for="g in ['Male', 'Female', 'Other', 'Prefer not to say']" :key="g" type="button" @click="intern.gender = g; showGenderDropdown = false" class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 text-sm" :class="intern.gender === g ? 'bg-gray-50 text-blue-600 font-medium' : 'text-slate-900'">{{ g }}</button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="editDob" class="text-[0.85rem] font-semibold text-slate-700">Date of Birth</label>
                    <input id="editDob" type="date" v-model="intern.dateOfBirth" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                </div>
              </section>

              <!-- School Information Card -->
              <section class="bg-white rounded-xl shadow p-6">
                <div class="mb-6">
                  <h3 class="m-0 text-2xl text-gray-900 font-semibold">School Information</h3>
                </div>
                <div class="grid grid-cols-2 gap-6">
                  <div class="flex flex-col gap-2 col-span-2">
                    <label for="editSchool" class="text-sm font-normal text-slate-700">School Name</label>
                    <input id="editSchool" type="text" v-model="intern.schoolOrUniversity" placeholder="Full School Name" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="editCourse" class="text-sm font-normal text-slate-700">Course / Program</label>
                    <input id="editCourse" type="text" v-model="intern.course" placeholder="e.g. BSIT" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2 relative">
                    <label for="editYear" class="text-sm font-normal text-slate-700">Year Level</label>
                    <button id="editYear" type="button" @click="showYearDropdown = !showYearDropdown" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] bg-white text-left flex justify-between items-center">
                      {{ intern.yearLevel || 'Select Year Level' }}
                      <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showYearDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div v-if="showYearDropdown" class="absolute z-50 w-full top-[72px] bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      <button v-for="y in ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year']" :key="y" type="button" @click="intern.yearLevel = y; showYearDropdown = false" class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors text-sm" :class="intern.yearLevel === y ? 'bg-gray-50 text-blue-600 font-medium' : 'text-slate-900'">{{ y }}</button>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="editRequiredHours" class="text-sm font-normal text-slate-700">OJT Required Hours</label>
                    <input id="editRequiredHours" type="number" v-model.number="intern.ojtRequiredHours" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="editStartDate" class="text-sm font-normal text-slate-700">Start Date</label>
                    <input id="editStartDate" type="date" v-model="intern.startDate" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2 col-span-2">
                    <label for="editEndDate" class="text-sm font-normal text-slate-700">End Date</label>
                    <input id="editEndDate" type="date" v-model="intern.endDate" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                </div>
              </section>

            </form>

            <!-- Account Settings Sections (Merged from SettingsView) -->
            <div class="flex flex-col gap-6">
              <!-- Change Password Card -->
              <section class="bg-white rounded-xl shadow p-6">
                <div class="mb-6">
                  <h3 class="m-0 text-2xl text-gray-900 font-semibold">Change Password</h3>
                </div>
                <form class="grid grid-cols-1 gap-4 max-w-[500px]" @submit.prevent="handleChangePassword">
                  <div class="flex flex-col gap-2">
                    <label for="current" class="text-sm font-normal text-slate-700">Current Password</label>
                    <input id="current" type="password" v-model="passwordForm.currentPassword" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="new" class="text-sm font-normal text-slate-700">New Password</label>
                    <input id="new" type="password" v-model="passwordForm.newPassword" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col gap-2">
                    <label for="confirm" class="text-sm font-normal text-slate-700">Confirm New Password</label>
                    <input id="confirm" type="password" v-model="passwordForm.confirmNewPassword" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-[0.9rem] text-slate-900 bg-white" />
                  </div>
                  <div class="flex flex-col md:flex-row items-center gap-4 mt-2">
                    <button type="submit" class="w-full sm:w-auto px-10 py-2.5 rounded-xl bg-[#eebb3b] text-white hover:bg-[#eebb3b]/90 text-[0.9rem] font-semibold cursor-pointer transition-colors" :disabled="pwdSaving || !intern.id">
                      {{ pwdSaving ? 'Saving...' : 'Update Password' }}
                    </button>
                    <p v-if="pwdMessage" class="m-0 text-[0.8rem] text-emerald-600 font-medium">{{ pwdMessage }}</p>
                    <p v-if="pwdError" class="m-0 text-[0.8rem] text-red-600 font-medium">{{ pwdError }}</p>
                  </div>
                </form>
              </section>

              <!-- Security Card -->
              <section class="bg-white rounded-xl shadow p-6">
                <div class="mb-4">
                  <h3 class="m-0 text-2xl text-gray-900 font-semibold">Security</h3>
                  <p class="mt-1 mb-0 text-[0.9rem] text-slate-500">Manage your active sessions and login history.</p>
                </div>
                <div class="mt-6">
                  <h4 class="mt-0 mb-4 text-sm text-slate-900 font-semibold">Active Sessions</h4>
                  <div class="flex flex-col gap-3">
                    <div v-for="session in sessions" :key="session.id" class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white [&.current]:bg-emerald-50 [&.current]:border-emerald-200 shadow-sm" :class="{ current: session.isCurrent }">
                      <div class="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                        <span class="w-6 h-6 bg-slate-600" :style="{ maskImage: session.icon, maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskImage: session.icon, WebkitMaskSize: 'contain', WebkitMaskRepeat: 'no-repeat', WebkitMaskPosition: 'center' }"></span>
                      </div>
                      <div class="flex-1 min-w-0 w-full">
                        <div class="flex items-center gap-1 mb-1">
                          <span class="font-semibold text-slate-900 truncate">{{ session.device }} - {{ session.browser }}</span>
                          <span v-if="session.isCurrent" class="text-[0.65rem] px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-50 font-medium shrink-0">Current</span>
                        </div>
                        <div class="flex flex-col gap-1 w-full text-xs">
                          <div class="flex justify-between">
                            <span class="text-slate-900 font-semibold">Location</span>
                            <span class="text-slate-500 font-medium">{{ session.location }}</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-slate-900 font-semibold">Last active</span>
                            <span class="text-slate-500 font-medium">{{ session.lastActive }}</span>
                          </div>
                        </div>
                      </div>
                      <button class="px-5 py-2 rounded-xl border-none bg-red-100 text-red-700 hover:bg-red-200 text-[0.85rem] font-semibold cursor-pointer transition-colors mt-2 sm:mt-0" type="button" @click="revokeSession(session)">Revoke</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <!-- Save Changes Button (Desktop) -->
            <div class="flex items-center justify-end gap-5 mt-6 mb-10 pr-2">
              <button type="button" @click="confirmLogout" class="px-10 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-md">
                Logout
              </button>
              <button type="button" @click="handleSaveInfo" :disabled="infoSaving" class="px-10 py-3 rounded-xl bg-[#eebb3b] text-white font-bold hover:bg-[#eebb3b]/90 transition-all shadow-md">
                {{ infoSaving ? 'Saving...' : 'Save Profile Changes' }}
              </button>
            </div>
          </div>
        </template>
      </div>
    </main>

    <!-- Mobile Bottom Navigation Bar -->
    <nav v-if="!isDesktop" class="lg:hidden shrink-0 h-[72px] bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center justify-around px-2 z-[1000] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)] sticky bottom-0 rounded-2xl w-full">
      <router-link to="/intern/dashboard" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50">
        <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: icons.dashboard, WebkitMaskSize: 'cover', maskImage: icons.dashboard, maskSize: 'cover' }"></span>
      </router-link>
      <router-link to="/intern/attendance" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50">
        <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: icons.attendance, WebkitMaskSize: 'cover', maskImage: icons.attendance, maskSize: 'cover' }"></span>
      </router-link>
      <router-link to="/intern/time" class="flex flex-col items-center justify-center w-16 h-16 rounded-full transition-all duration-300 bg-[#133e75] text-white shadow-[0_8px_20px_rgba(19,62,117,0.4)] border-[6px] border-gray-50 active:scale-90 -mt-10 z-[110]">
        <span class="w-8 h-8 bg-current inline-block" :style="{ WebkitMaskImage: icons.time, WebkitMaskSize: 'cover', maskImage: icons.time, maskSize: 'cover' }"></span>
      </router-link>
      <router-link to="/intern/staff-status" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50">
        <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: icons.staff, WebkitMaskSize: 'cover', maskImage: icons.staff, maskSize: 'cover' }"></span>
      </router-link>
      <router-link to="/intern/notifications" class="flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 text-gray-400 [&.router-link-active]:text-[#133e75] [&.router-link-active]:bg-blue-50/50 relative">
        <span class="w-6 h-6 bg-current inline-block" :style="{ WebkitMaskImage: icons.notification, WebkitMaskSize: 'cover', maskImage: icons.notification, maskSize: 'cover' }"></span>
        <span v-if="unreadCount > 0" class="absolute top-1 right-1 bg-red-500 text-white rounded-full text-[10px] px-1 py-0 min-w-[16px] text-center shadow-sm font-bold">{{ unreadCount }}</span>
      </router-link>
    </nav>
 
     <!-- Logout Confirmation Modal -->
     <Transition name="modal">
       <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]">
         <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
           <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
             </svg>
           </div>
           <h3 class="text-2xl font-bold text-gray-900 mb-2">Sign Out</h3>
           <p class="text-gray-600 mb-8">
             Are you sure you want to log out of your account?
           </p>
           <div class="flex gap-3">
             <button 
               @click="showLogoutModal = false"
               class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all cursor-pointer"
             >
               Cancel
             </button>
             <button 
               @click="executeLogout"
               class="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all cursor-pointer"
             >
               Logout
             </button>
           </div>
         </div>
       </div>
     </Transition>
   </div>
 </template>


<script>
import { doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

export default {
  name: 'InternProfileView',
  data() {
    return {
      showGenderDropdown: false,
      showYearDropdown: false,
      icons: {
        logout: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9'/%3E%3C/svg%3E\")",
        dashboard: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M11 4.68v3.88a2.45 2.45 0 0 1-1.509 2.258A2.4 2.4 0 0 1 8.56 11H4.68a2.44 2.44 0 0 1-2.43-2.44V4.69a2.44 2.44 0 0 1 2.43-2.44h3.88A2.44 2.44 0 0 1 11 4.68m10.75.01v3.87a2.4 2.4 0 0 1-.71 1.72a2.38 2.38 0 0 1-1.72.72h-3.88a2.45 2.45 0 0 1-2.256-1.502A2.4 2.4 0 0 1 13 8.56V4.69a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.88a2.44 2.44 0 0 1 2.43 2.44M11 15.45v3.87a2.44 2.44 0 0 1-2.44 2.43H4.68a2.45 2.45 0 0 1-1.72-.71a2.4 2.4 0 0 1-.71-1.72v-3.87a2.4 2.4 0 0 1 .71-1.72A2.47 2.47 0 0 1 4.68 13h3.88A2.46 2.46 0 0 1 11 15.45m10.75 1.93A4.37 4.37 0 1 1 17.37 13a4.4 4.4 0 0 1 4.049 2.707c.22.53.332 1.099.331 1.673'/%3E%3C/svg%3E\")",
        time: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0-18 0'/%3E%3Cpath d='M12 7v5l3 3'/%3E%3C/g%3E%3C/svg%3E\")",
        attendance: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2'/%3E%3Cpath d='M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m0 12v-5m3 5v-1m3 1v-3'/%3E%3C/g%3E%3C/svg%3E\")",
        staff: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 4.75a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5M8.25 7a3.75 3.75 0 1 1 7.5 0a3.75 3.75 0 0 1-7.5 0m1.064 5.819c.132.098.302.213.505.327c.513.29 1.265.59 2.18.59s1.668-.3 2.181-.59c.203-.114.373-.229.505-.327q.282.075.559.166l.96.315c.72.237 1.264.812 1.458 1.523l.397 2.864c.075.544-.21.939-.606 1.033c-1.047.25-2.812.53-5.453.53s-4.407-.28-5.454-.53c-.395-.094-.68-.489-.606-1.033l.397-2.864A2.23 2.23 0 0 1 7.796 13.3l.96-.315q.276-.09.558-.166m.71-1.355l-.291-.287l-.402.092q-.526.12-1.044.291l-.96.315a3.72 3.72 0 0 0-2.454 2.616l-.01.04l-.408 2.95c-.161 1.164.462 2.393 1.744 2.698c1.17.279 3.052.571 5.8.571c2.749 0 4.631-.292 5.801-.57c1.282-.306 1.906-1.535 1.745-2.698l-.409-2.95l-.01-.04a3.72 3.72 0 0 0-2.455-2.617l-.959-.315q-.517-.17-1.044-.29l-.402-.093l-.29.286l-.001.001a2 2 0 0 1-.12.101a3 3 0 0 1-.41.274a2.96 2.96 0 0 1-1.445.397a2.96 2.96 0 0 1-1.445-.397a3.2 3.2 0 0 1-.53-.375'/%3E%3C/svg%3E\")",
        notification: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M13 3a1 1 0 1 0-2 0v.75h-.557A4.214 4.214 0 0 0 6.237 7.7l-.221 3.534a7.4 7.4 0 0 1-1.308 3.754a1.617 1.617 0 0 0 1.135 2.529l3.407.408V19a2.75 2.75 0 1 0 5.5 0v-1.075l3.407-.409a1.617 1.617 0 0 0 1.135-2.528a7.4 7.4 0 0 1-1.308-3.754l-.221-3.533a4.214 4.214 0 0 0-4.206-3.951H13zm-2.557 2.25a2.714 2.714 0 0 0-2.709 2.544l-.22 3.534a8.9 8.9 0 0 1-1.574 4.516a.117.117 0 0 0 .082.183l3.737.449c1.489.178 2.993.178 4.482 0l3.737-.449a.117.117 0 0 0 .082-.183a8.9 8.9 0 0 1-1.573-4.516l-.221-3.534a2.714 2.714 0 0 0-2.709-2.544zm1.557 15c-.69 0-1.25-.56-1.25-1.25v-.75h2.5V19c0 .69-.56 1.25-1.25 1.25' clip-rule='evenodd'/%3E%3C/svg%3E\")",
        settings: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='m20.35 8.923l-.366-.204l-.113-.064a2 2 0 0 1-.67-.66c-.018-.027-.034-.056-.066-.112a2 2 0 0 1-.3-1.157l.006-.425c.012-.68.018-1.022-.078-1.328a2 2 0 0 0-.417-.736c-.214-.24-.511-.412-1.106-.754l-.494-.285c-.592-.341-.889-.512-1.204-.577a2 2 0 0 0-.843.007c-.313.07-.606.246-1.191.596l-.003.002l-.354.211c-.056.034-.085.05-.113.066c-.278.155-.588.24-.907.25c-.032.002-.065.002-.13.002l-.13-.001a2 2 0 0 1-.91-.252c-.028-.015-.055-.032-.111-.066l-.357-.214c-.589-.354-.884-.53-1.199-.601a2 2 0 0 0-.846-.006c-.316.066-.612.238-1.205.582l-.003.001l-.488.283l-.005.004c-.588.34-.883.512-1.095.751a2 2 0 0 0-.415.734c-.095.307-.09.649-.078 1.333l.007.424c0 .065.003.097.002.128a2 2 0 0 1-.301 1.027c-.033.056-.048.084-.065.11a2 2 0 0 1-.675.664l-.112.063l-.361.2c-.602.333-.903.5-1.121.738a2 2 0 0 0-.43.73c-.1.307-.1.65-.099 1.338l.002.563c.001.683.003 1.024.104 1.329a2 2 0 0 0 .427.726c.218.236.516.402 1.113.734l.358.199c.061.034.092.05.121.068a2 2 0 0 1 .74.781l.067.12a2 2 0 0 1 .23 1.038l-.007.407c-.012.686-.017 1.03.079 1.337c.085.272.227.523.417.736c.214.24.512.411 1.106.754l.494.285c.593.341.889.512 1.204.577a2 2 0 0 0 .843-.007c.314-.07.607-.246 1.194-.598l.354-.212l.113-.066c.278-.154.588-.24.907-.25l.13-.001h.13c.318.01.63.097.91.252l.092.055l.376.226c.59.354.884.53 1.199.6a2 2 0 0 0 .846.008c.315-.066.613-.239 1.206-.583l.495-.287c.588-.342.883-.513 1.095-.752c.19-.213.33-.463.415-.734c.095-.305.09-.644.078-1.318l-.008-.44v-.127a2 2 0 0 1 .3-1.028l.065-.11a2 2 0 0 1 .675-.664l.11-.061l.002-.001l.361-.2c.602-.334.903-.5 1.122-.738c.194-.21.34-.46.429-.73c.1-.305.1-.647.098-1.327l-.002-.574c-.001-.683-.002-1.025-.103-1.33a2 2 0 0 0-.428-.725c-.217-.236-.515-.402-1.111-.733z'/%3E%3Cpath d='M8 12a4 4 0 1 0 8 0a4 4 0 0 0-8 0'/%3E%3C/g%3E%3C/svg%3E\")"
      },
      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        schoolOrUniversity: '',
        assignedOffice: '',
        position: '',
        phoneNumber: '',
        email: '',
        role: '',
        photoUrl: '',
        ojtRequiredHours: null,
        // Added Profile Fields
        address: '',
        gender: '',
        dateOfBirth: '',
        course: '',
        yearLevel: '',
        startDate: '',
        endDate: '',
      },
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      loading: true,
      error: null,
      uploadingPhoto: false,
      photoError: null,
      infoSaving: false,
      infoMessage: null,
      infoError: null,
      // Merged Settings Data
      pwdSaving: false,
      pwdMessage: null,
      pwdError: null,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      sessions: [],
      isInitialLoading: true,
      isDesktop: window.innerWidth >= 1024,
      showLogoutModal: false,
    };
  },
  computed: {
    formattedName() {
      const { firstName, middleName, lastName } = this.intern;
      if (!firstName && !lastName) return 'N/A';

      const middleInitial = middleName ? `${middleName.charAt(0)}. ` : '';
      return `${firstName} ${middleInitial}${lastName}`.trim();
    },
    avatarInitials() {
      const first = this.intern.firstName ? this.intern.firstName.charAt(0).toUpperCase() : '';
      const last = this.intern.lastName ? this.intern.lastName.charAt(0).toUpperCase() : '';
      const combined = `${first}${last}`;
      return combined || '?';
    },
  },
  created() {
    this.loadInternProfile();
    // Load notifications for header bell
    try {
      const stored = localStorage.getItem('internUser');
      if (stored) {
        const user = JSON.parse(stored);
        const internId = user && user.id;
        if (internId) {
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
        }
      }
    } catch (e) {}
    this.loadSessions();
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    confirmLogout() {
      this.showLogoutModal = true;
    },
    executeLogout() {
      localStorage.removeItem('user');
      localStorage.removeItem('internUser');
      const internId = this.internId || (this.intern && this.intern.id);
      if (internId) {
        localStorage.removeItem('internNotifications_' + internId);
        localStorage.removeItem('internNotificationsUnread_' + internId);
      }
      this.$router.push('/auth/login');
    },
    handleResize() {
      this.isDesktop = window.innerWidth >= 1024;
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
    addLocalNotification(message) {
      try {
        if (!this.intern.id || !message) return;
        const key = `internNotifications_${this.intern.id}`;
        const unreadKey = `internNotificationsUnread_${this.intern.id}`;
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
        localStorage.setItem(unreadKey, String(unread));
      } catch (e) {}
    },
    async loadInternProfile() {
      try {
        const stored = localStorage.getItem('internUser');
        if (!stored) {
          this.error = 'No logged-in intern found.';
          this.loading = false;
          return;
        }

        const basic = JSON.parse(stored);
        this.intern = {
          ...this.intern,
          ...basic,
          id: basic.id,
        };

        if (!basic.id) {
          this.loading = false;
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${basic.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch full user profile');
        }

        const data = await response.json();
        if (data && data.user) {
          this.intern = {
            ...this.intern,
            ...data.user,
          };
        }
      } catch (err) {
        console.error('Error loading intern profile:', err);
        this.error = 'Failed to load intern information.';
      } finally {
        this.loading = false;
        this.isInitialLoading = false;
      }
    },
    async handleSaveInfo() {
      try {
        this.infoError = null;
        this.infoMessage = null;

        if (!this.intern.id) {
          this.infoError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        this.infoSaving = true;
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.intern.id}/info`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            schoolOrUniversity: this.intern.schoolOrUniversity || '',
            phoneNumber: this.intern.phoneNumber || '',
            email: this.intern.email || '',
            ojtRequiredHours: Number(this.intern.ojtRequiredHours) || null,
            address: this.intern.address || '',
            gender: this.intern.gender || '',
            dateOfBirth: this.intern.dateOfBirth || '',
            course: this.intern.course || '',
            yearLevel: this.intern.yearLevel || '',
            startDate: this.intern.startDate || '',
            endDate: this.intern.endDate || '',
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message = data && data.message ? data.message : 'Failed to update information.';
          throw new Error(message);
        }

        if (data && data.user) {
          this.intern = {
            ...this.intern,
            ...data.user,
          };

          const stored = localStorage.getItem('internUser');
          if (stored) {
            const basic = JSON.parse(stored);
            localStorage.setItem('internUser', JSON.stringify({ ...basic, ...data.user }));
          }
        }

        this.infoMessage = 'Profile updated successfully!';
        this.addLocalNotification('Your comprehensive profile information was updated.');
        
        setTimeout(() => {
          this.infoMessage = null;
        }, 4000);
        
      } catch (err) {
        console.error('Error updating intern info:', err);
        this.infoError = err && err.message ? err.message : 'Failed to update information.';
      } finally {
        this.infoSaving = false;
      }
    },
    async onPhotoSelected(event) {
      try {
        this.photoError = null;
        const file = event.target.files && event.target.files[0];
        if (!file) {
          return;
        }
        if (!this.intern.id) {
          this.photoError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        this.uploadingPhoto = true;
        const fileRef = storageRef(storage, `profilePhotos/${this.intern.id}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const userDocRef = doc(db, 'users', this.intern.id);
        await updateDoc(userDocRef, { photoUrl: url });

        this.intern.photoUrl = url;

        const stored = localStorage.getItem('internUser');
        if (stored) {
          const basic = JSON.parse(stored);
          localStorage.setItem('internUser', JSON.stringify({ ...basic, photoUrl: url }));
        }
      } catch (err) {
        console.error('Error uploading profile photo:', err);
        this.photoError = 'Failed to upload profile picture.';
      } finally {
        this.uploadingPhoto = false;
        if (event && event.target) {
          event.target.value = '';
        }
      }
    },
    // Merged Settings Methods
    async loadSessions() {
      try {
        if (!this.intern.id) return;

        try {
          await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.intern.id}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userAgent: navigator.userAgent || '',
              location: 'Philippines',
            }),
          });
        } catch (e) {}

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.intern.id}/sessions`);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          return;
        }

        const list = Array.isArray(data && data.sessions) ? data.sessions : [];
        const mobileIcon = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Crect width='16' height='22' x='4' y='1' rx='3'/%3E%3Cpath d='M10 19h4'/%3E%3C/g%3E%3C/svg%3E\")";
        const edgeIcon = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cpath fill='%23000' d='M14.022 67.699h71.957a4.98 4.98 0 0 0 4.976-4.977V18.628a4.976 4.976 0 0 0-4.976-4.976H14.022a4.976 4.976 0 0 0-4.976 4.976v44.094a4.976 4.976 0 0 0 4.976 4.977m4.976-44.095h62.005v34.142H18.998zm76.327 49.082H4.675a2.294 2.294 0 0 0-2.294 2.294v5.555c0 .58.218 1.135.609 1.559l3.25 3.518a2.3 2.3 0 0 0 1.684.735h83.915c.612 0 1.198-.245 1.631-.681l3.485-3.519a2.3 2.3 0 0 0 .664-1.613V74.98a2.295 2.295 0 0 0-2.294-2.294m-36.656 7.969c0 .28-.185.507-.415.507H41.746c-.23 0-.415-.227-.415-.507v-2.264c0-.28.185-.504.415-.504h16.508c.23 0 .415.224.415.504z'/%3E%3C/svg%3E\")";

        this.sessions = list.map((s) => ({
          id: s.id,
          device: s.device || 'Unknown device',
          browser: s.browser || 'Unknown',
          location: s.location || 'Unknown',
          lastActive: s.lastActive && typeof s.lastActive.seconds === 'number'
            ? new Date(s.lastActive.seconds * 1000).toLocaleString()
            : 'Unknown',
          isCurrent: !!s.isCurrent,
          icon: /Android/i.test(s.device || '') || /phone|mobile/i.test(s.device || '') ? mobileIcon : edgeIcon,
        }));

      } catch (err) {
        console.error('Error loading sessions:', err);
      }
    },
    async handleChangePassword() {
      try {
        this.pwdError = null;
        this.pwdMessage = null;

        if (!this.intern.id) {
          this.pwdError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
          this.pwdError = 'Please fill in all password fields.';
          return;
        }

        if (newPassword !== confirmNewPassword) {
          this.pwdError = 'New password and confirmation do not match.';
          return;
        }

        if (newPassword.length < 6) {
          this.pwdError = 'New password must be at least 6 characters.';
          return;
        }

        this.pwdSaving = true;

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.intern.id}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message = data && data.message ? data.message : 'Failed to update password.';
          throw new Error(message);
        }

        this.pwdMessage = (data && data.message) || 'Password updated successfully.';
        this.addLocalNotification('Your account password was changed.');
        this.passwordForm.currentPassword = '';
        this.passwordForm.newPassword = '';
        this.passwordForm.confirmNewPassword = '';

        setTimeout(() => {
          this.pwdMessage = null;
        }, 4000);

      } catch (err) {
        console.error('Error changing password in settings:', err);
        this.pwdError = err && err.message ? err.message : 'Failed to update password.';
      } finally {
        this.pwdSaving = false;
      }
    },
    async revokeSession(session) {
      try {
        if (!this.intern.id) return;
        if (session && session.isCurrent) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.intern.id}/sessions`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            return;
          }
          try {
            localStorage.removeItem('internUser');
          } catch (e) {}
          this.sessions = [];
          this.$router.push('/auth/login');
        } else if (session && session.id) {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${this.intern.id}/sessions/${session.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            return;
          }
          this.sessions = this.sessions.filter((s) => s.id !== session.id);
        }
      } catch (err) {
        console.error('Error revoking session:', err);
      }
    },
  },
};
</script>
 
 <style scoped>
 .custom-scrollbar::-webkit-scrollbar {
   width: 4px;
 }
 .custom-scrollbar::-webkit-scrollbar-track {
   background: transparent;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb {
   background: #e2e8f0;
   border-radius: 10px;
 }
 .custom-scrollbar::-webkit-scrollbar-thumb:hover {
   background: #cbd5e1;
 }
 
 .modal-enter-active,
 .modal-leave-active {
   transition: opacity 0.3s ease;
 }
 
 .modal-enter-from,
 .modal-leave-to {
   opacity: 0;
 }
 
 .modal-enter-active .bg-white {
   transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
 }
 
 .modal-enter-from .bg-white {
   transform: scale(0.9) translateY(20px);
 }
 </style>


