<template>
  <!-- Mobile View -->
  <div v-if="isMobile" class="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
    <div class="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      <div class="flex flex-row items-center justify-center gap-3 mb-6 w-full">
        <img src="/dictlogo2.png" alt="DICT Logo" class="h-10 sm:h-12 w-auto object-contain"/>
        <img src="/Bagongpilipinas.png" alt="Bagong Pilipinas Logo" class="h-10 sm:h-12 w-auto object-contain"/>
        <img src="/3.png" alt="Attendict Logo" class="h-10 sm:h-12 w-auto object-contain"/>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-1 text-center">Let's Get Started</h1>
      <p class="text-gray-500 text-base mb-8 text-center">Join DICT and be part of our community.</p>

      <form @submit.prevent="handleRegister" class="w-full flex flex-col gap-4">
        <input
          v-model="form.username"
          type="text"
          required
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Username"
        />

        <input
          v-model="form.email"
          type="email"
          required
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Email"
        />

        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="form.firstName"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="First Name"
          />
          <input
            v-model="form.lastName"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="Last Name"
          />
        </div>

        <input
          v-model="form.middleName"
          type="text"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Middle Name (Optional)"
        />

        <!-- Role Dropdown -->
        <div class="relative">
          <button
            type="button"
            @click="showRoleDropdown = !showRoleDropdown"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors bg-white text-left flex justify-between items-center"
            :class="form.role ? 'text-black' : 'text-gray-500'"
          >
            {{ form.role === 'student' ? 'Student / Intern' : (form.role === 'staff' ? 'Staff' : 'Select role') }}
            <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showRoleDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <div v-if="showRoleDropdown" @click="showRoleDropdown = false" class="fixed inset-0 z-40"></div>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div v-if="showRoleDropdown" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
              <div class="py-1">
                <button 
                  type="button" 
                  @click="selectRole('student')" 
                  class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 text-sm"
                  :class="form.role === 'student' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-900'"
                >
                  Student / Intern
                </button>
                <button 
                  type="button" 
                  @click="selectRole('staff')" 
                  class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 text-sm"
                  :class="form.role === 'staff' ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-900'"
                >
                  Staff
                </button>
              </div>
            </div>
          </transition>
        </div>

        <input
          v-model="form.position"
          type="text"
          required
          :readonly="form.role === 'student'"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
          :class="form.role === 'student' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'"
          placeholder="Position"
        />

        <input
          v-model="form.assignedOffice"
          type="text"
          required
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
          placeholder="Assigned Office / Company"
        />

        <template v-if="form.role === 'student'">
          <input
            v-model="form.schoolOrUniversity"
            type="text"
            required
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="School / University"
          />
          <input
            v-model.number="form.ojtRequiredHours"
            type="number"
            min="0"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
            placeholder="OJT Required Hours"
          />
        </template>

        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Password"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
          <div class="relative">
            <input
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              required
              class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Confirm"
            />
            <button 
              type="button" 
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            </button>
          </div>
        </div>

        <button type="submit" :disabled="isLoading" class="w-full px-8 py-3.5 mt-4 bg-[#133e75] text-white font-semibold rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
          <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="mt-4 text-sm text-gray-500 flex justify-center items-center gap-1 w-full">
        Already have an account? <router-link to="/" class="text-[#b92e2b] hover:underline font-semibold">Sign in</router-link>
      </div>
    </div>
  </div>

  <!-- Desktop View -->
  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100/50 p-4 font-sans">
    <div class="flex w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative min-h-[600px] max-h-[90vh]">
      
      <!-- Header links (Top right) & Logo (Top left) -->
      <div class="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <div class="flex flex-row items-center gap-3 font-bold text-xl text-blue-600">
          <img src="/dictlogo2.png" alt="DICT Logo" class="h-12 w-auto object-contain lg:block hidden"/>
          <img src="/Bagongpilipinas.png" alt="Bagong Pilipinas Logo" class="h-12 w-auto object-contain lg:block hidden"/>
          <img src="/3.png" alt="Logo" class="h-12 w-auto object-contain hidden sm:block"/>
          <span class="text-gray-900 text-3xl">ATTENDICT</span>
        </div>
      </div>

      <!-- Left Side Illustration -->
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-white p-12 overflow-hidden">
        <!-- Decorative background blur/shapes -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-[-10%] left-[-10%] w-96 h-96  rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96  rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
        </div>
        
        <!-- Central Circular Graphic area -->
        <div class="relative w-[28rem] h-[28rem]  flex items-center justify-center  z-10">
          <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://lottie.host/eb77402f-d9a7-478c-9ac5-026aa8b6b889/iaB5skKvtQ.lottie" />
        </div>
      </div>

      <!-- Right Side Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 z-10 pt-24 pb-12 overflow-y-auto">
        <div class="w-full max-w-xl ">
          <h1 class="text-4xl text-gray-900 font-semibold text-center">Let's Get Started</h1>
          <p class="text-gray-500 mb-8 mt-2 text-base leading-relaxed text-center">
            Join DICT and be part of our community.
          </p>

          <form @submit.prevent="handleRegister" class="flex flex-col space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="relative">
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Username"
                />
              </div>

              <div class="relative">
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Email"
                />
              </div>

              <div class="relative">
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="First Name"
                />
              </div>

              <div class="relative">
                <input
                  id="middleName"
                  v-model="form.middleName"
                  type="text"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Middle Name (Optional)"
                />
              </div>

              <div class="relative">
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Last Name"
                />
              </div>

              <div class="relative">
                <button
                  id="role"
                  type="button"
                  @click="showRoleDropdown = !showRoleDropdown"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors bg-white text-left flex justify-between items-center"
                  :class="form.role ? 'text-black' : 'text-gray-500'"
                >
                  {{ form.role === 'student' ? 'Student / Intern' : (form.role === 'staff' ? 'Staff' : 'Select role') }}
                  <svg class="w-4 h-4 text-gray-400 transition-transform duration-200" :class="{ 'rotate-180': showRoleDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                <!-- Backdrop -->
                <div v-if="showRoleDropdown" @click="showRoleDropdown = false" class="fixed inset-0 z-40"></div>

                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div v-if="showRoleDropdown" class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    <div class="py-1">
                      <button 
                        type="button" 
                        @click="selectRole('student')" 
                        class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center"
                        :class="form.role === 'student' ? 'bg-gray-50 text-blue-600 font-medium' : 'text-gray-900'"
                      >
                        <span class="text-sm">Student / Intern</span>
                      </button>
                      <button 
                        type="button" 
                        @click="selectRole('staff')" 
                        class="w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center"
                        :class="form.role === 'staff' ? 'bg-gray-50 text-blue-600 font-medium' : 'text-gray-900'"
                      >
                        <span class="text-sm">Staff</span>
                      </button>
                    </div>
                  </div>
                </transition>
              </div>

              <div class="relative sm:col-span-2">
                <input
                  id="position"
                  v-model="form.position"
                  type="text"
                  required
                  :readonly="form.role === 'student'"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  :class="form.role === 'student' ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'"
                  placeholder="Position"
                />
              </div>

              <div class="relative sm:col-span-2">
                <input
                  id="assignedOffice"
                  v-model="form.assignedOffice"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Assigned Office / Company"
                />
              </div>

              <div v-if="form.role === 'student'" class="relative sm:col-span-2">
                <input
                  id="schoolOrUniversity"
                  v-model="form.schoolOrUniversity"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="School / University"
                />
              </div>

              <div v-if="form.role === 'student'" class="relative">
                <input
                  id="ojtRequiredHours"
                  v-model.number="form.ojtRequiredHours"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="OJT Required Hours"
                />
              </div>
              
              <div v-if="form.role === 'student'" class="hidden sm:block"></div> <!-- Empty grid cell for alignment -->

              <div class="relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Password"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>

              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  required
                  class="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                  placeholder="Confirm Password"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
            </div>

            <div>
               <button type="submit" :disabled="isLoading" class="w-full px-8 py-3 mt-4 bg-[#133e75] text-white font-medium rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
                 <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {{ isLoading ? 'Creating Account...' : 'Create Account' }}
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex items-center gap-1">
            Already have an account? <router-link to="/" class="text-[#b92e2b] hover:underline font-medium">Sign in</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Success/Error Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all">
        <!-- Success Icon -->
        <div v-if="modalType === 'success'" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <!-- Error Icon -->
        <div v-else class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
        <p class="text-sm text-gray-500 mb-6 px-2">{{ modalMessage }}</p>
        
        <button @click="closeModal" class="w-full inline-flex justify-center items-center rounded-xl px-4 py-3 bg-[#133e75] text-sm font-semibold text-white hover:bg-[#133e75]/90 focus:outline-none transition-colors">
          {{ modalType === 'success' ? 'Continue' : 'Try Again' }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

export default {
  name: 'RegisterView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      isLoading: false,
      showModal: false,
      modalType: 'error',
      modalTitle: '',
      modalMessage: '',
      showRoleDropdown: false,
      showPassword: false,
      showConfirmPassword: false,
      isMobile: window.innerWidth < 1024,
      form: {
        username: '',
        firstName: '',
        email: '',
        middleName: '',
        lastName: '',
        role: '',
        position: '',
        assignedOffice: '',
        schoolOrUniversity: '',
        ojtRequiredHours: null,
        password: '',
        confirmPassword: ''
      }
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    closeModal() {
      this.showModal = false;
      if (this.modalType === 'success') {
        this.$router.push({ name: 'OtpVerification', query: { email: this.form.email } });
      }
    },
    showCustomModal(type, title, message) {
      this.modalType = type;
      this.modalTitle = title;
      this.modalMessage = message;
      this.showModal = true;
    },
    selectRole(role) {
      this.form.role = role;
      if (role === 'student') {
        this.form.position = 'Intern';
      } else if (role === 'staff' && this.form.position === 'Intern') {
        this.form.position = '';
      }
      this.showRoleDropdown = false;
    },
    async handleRegister() {
      if (!this.form.role) {
        this.showCustomModal('error', 'Role Required', 'Please select a role.');
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.showCustomModal('error', 'Password Mismatch', 'Passwords do not match.');
        return;
      }

      this.isLoading = true;

      try {
        const endpoint = this.form.role === 'staff' ? '/auth/staff/register' : '/auth/intern/register';
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.form.username,
            firstName: this.form.firstName,
            middleName: this.form.middleName || '',
            lastName: this.form.lastName,
            email: this.form.email,
            password: this.form.password,
            position: this.form.position,
            assignedOffice: this.form.assignedOffice,
            schoolOrUniversity: this.form.schoolOrUniversity || '',
            ojtRequiredHours: this.form.ojtRequiredHours ?? null,
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Registration failed');
        }

        const data = await response.json();
        console.log('Registration successful, userId:', data.userId);
        this.showCustomModal('success', 'Registration Successful', 'Please check your email for the verification code.');
      } catch (error) {
        console.error('Registration error:', error);
        this.showCustomModal('error', 'Registration Failed', error.message || 'Please check your inputs.');
      } finally {
        this.isLoading = false;
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    }
  }
};
</script>

