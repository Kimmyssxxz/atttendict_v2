<template>
  <!-- Mobile View -->
  <div v-if="isMobile" class="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
    <div class="w-full max-w-[480px] bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
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
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:border-blue-500 focus:outline-none transition-colors"
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

        <button type="submit" class="w-full px-8 py-3.5 mt-4 bg-[#133e75] text-white font-semibold rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80">
          Create Account
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
        <div class="flex items-center gap-2 font-bold text-xl text-blue-600">
          <img src="/3.png" alt="Logo" class="h-12 w-auto object-contain hidden sm:block"/>
          <span class="text-gray-900 text-3xl">ATTENDICT</span>
        </div>
      </div>

      <!-- Left Side Illustration -->
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center  p-12">
        <!-- Central Graphic area -->
        <div class="relative w-[28rem] h-[28rem] flex items-center justify-center z-10">
          <DotLottieVue style="height: 400px; width: 400px" autoplay loop src="https://lottie.host/b37b7748-1dc6-4cb4-8bf0-05a0b4f7e988/0t7UBpQlw6.lottie" />
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
                  class="w-full px-4 py-2.5 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
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
               <button type="submit" class="w-full px-8 py-3 mt-4 bg-[#133e75] text-white font-medium rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80">
                 Create Account
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
    selectRole(role) {
      this.form.role = role;
      this.showRoleDropdown = false;
    },
    async handleRegister() {
      if (!this.form.role) {
        alert('Please select a role.');
        return;
      }

      if (this.form.password !== this.form.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      try {
        const docRef = await addDoc(collection(db, 'users'), {
          username: this.form.username,
          firstName: this.form.firstName,
          email: this.form.email,
          middleName: this.form.middleName,
          lastName: this.form.lastName,
          role: this.form.role,
          position: this.form.position,
          assignedOffice: this.form.assignedOffice,
          schoolOrUniversity: this.form.schoolOrUniversity || '',
          ojtRequiredHours: this.form.ojtRequiredHours ?? null,
          // Default attendance tagging fields so admin table shows Normal Hours
          tagging: 'Normal Hours',
          todayAmTag: 'Normal Hours',
          todayPmTag: 'Normal Hours',
          password: this.form.password
        });

        console.log('Registration saved with ID:', docRef.id);
        alert('Registration successful!');
        // e.g. this.$router.push('/auth/intern/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please check your inputs.');
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    }
  }
};
</script>

