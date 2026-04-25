<template>
  <!-- Mobile View -->
  <div v-if="isMobile" class="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
    <div class="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8 sm:p-12 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-1 text-center">Reset Password</h1>
      <p class="text-gray-500 text-base mb-8 text-center px-4">
        We sent a code to <span class="font-medium text-gray-800">{{ email }}</span>.
      </p>

      <form @submit.prevent="resetPassword" class="w-full flex flex-col gap-4">
        <div class="relative">
          <input
            type="text"
            v-model="otpCode"
            required
            maxlength="6"
            placeholder="Enter 6-digit code"
            class="w-full px-6 py-3 border border-gray-300 rounded-xl text-center text-xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-base"
          />
        </div>

        <div class="relative mt-2">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="newPassword"
            required
            placeholder="New Password"
            class="w-full px-6 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors placeholder:text-gray-400"
          />
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
          </button>
        </div>

        <div class="relative">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            required
            placeholder="Confirm New Password"
            class="w-full px-6 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors placeholder:text-gray-400"
          />
          <button 
            type="button" 
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
          </button>
        </div>

        <div>
           <button type="submit" :disabled="isLoading" class="w-full px-8 py-3.5 mt-4 bg-[#133e75] text-white font-semibold rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
             <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             {{ isLoading ? 'Resetting...' : 'Reset Password' }}
           </button>
        </div>
      </form>

      <div class="mt-6 text-sm text-gray-500 flex justify-center items-center gap-1 w-full flex-col">
        <button @click="goBack" class="text-[#b92e2b] hover:underline font-semibold mt-1">
          Back to Login
        </button>
      </div>
    </div>
  </div>

  <!-- Desktop View -->
  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100/50 p-4 font-sans">
    <div class="flex w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative min-h-[600px]">
      
      <!-- Header links (Top right) & Logo (Top left) -->
      <div class="absolute top-0 left-0 w-full p-6 flex justify-center lg:justify-start items-center z-20">
        <div class="flex flex-row items-center gap-2 font-bold text-xl text-blue-600">
          <img src="/3.png" alt="Logo" class="h-12 w-auto object-contain hidden sm:block"/>
          <span class="text-gray-900 text-3xl">ATTENDICT</span>
        </div>
      </div>

      <!-- Left Side Illustration -->
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <!-- Central Circular Graphic area -->
        <div class="relative w-[28rem] h-[28rem] flex items-center justify-center z-10">
          <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://lottie.host/6ad83ae1-839d-473d-98ae-3918a1a36e92/vId07eA74k.json" />
        </div>
      </div>

      <!-- Right Side Form -->
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 z-10 pt-24">
        <div class="w-full max-w-md flex flex-col justify-center text-center lg:text-left">
          
          <h1 class="text-4xl text-gray-900 font-semibold mb-2">Create New Password</h1>
          <p class="text-gray-500 mb-8 mt-2 text-base leading-relaxed">
            Enter the 6-digit code sent to <span class="font-medium text-gray-800">{{ email }}</span> along with your new password.
          </p>

          <form @submit.prevent="resetPassword" class="flex flex-col space-y-6 w-full">
            <div class="relative">
              <input
                type="text"
                v-model="otpCode"
                required
                maxlength="6"
                placeholder="000000"
                class="w-full px-4 py-4 border border-gray-200 rounded-md text-center text-2xl tracking-[0.5em] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                style="font-family: monospace;"
              />
            </div>

            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="newPassword"
                required
                placeholder="New Password"
                class="w-full px-4 py-3 pr-10 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
               />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
               >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              </button>
            </div>

            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="confirmPassword"
                required
                placeholder="Confirm Password"
                class="w-full px-4 py-3 pr-10 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
               />
              <button 
                type="button" 
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
               >
                <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644C3.399 8.049 7.21 5 12 5c4.79 0 8.601 3.049 9.964 6.678.045.166.045.336 0 .502C20.601 15.951 16.79 19 12 19c-4.79 0-8.601-3.049-9.964-6.678z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              </button>
            </div>

            <div>
               <button type="submit" :disabled="isLoading" class="w-full px-8 py-3 bg-[#133e75] text-white font-medium rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
                 <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {{ isLoading ? 'Resetting...' : 'Reset Password' }}
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex justify-center lg:justify-start items-center gap-1 w-full">
            <button @click="goBack" class="text-[#b92e2b] hover:underline font-medium text-base">
               Back to Login
            </button>
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
        <p class="text-sm text-gray-500 mb-6 px-2 whitespace-pre-line">{{ modalMessage }}</p>
        
        <button @click="closeModal" class="w-full inline-flex justify-center items-center rounded-xl px-4 py-3 bg-[#133e75] text-sm font-semibold text-white hover:bg-[#133e75]/90 focus:outline-none transition-colors">
          {{ modalType === 'success' && modalAction ? 'Go to Login' : 'Continue' }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

export default {
  name: 'ResetPasswordView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      otpCode: '',
      email: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      isMobile: window.innerWidth < 1024,
      isLoading: false,
      showModal: false,
      modalType: 'error',
      modalTitle: '',
      modalMessage: '',
      modalAction: null,
    };
  },
  created() {
    this.email = this.$route.query.email || '';
    if (!this.email) {
      this.showCustomModal('error', 'Missing Information', 'Email not provided for password reset.', { type: 'redirect', route: '/auth/login' });
    }
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
      if (this.modalAction && this.modalAction.type === 'redirect') {
        this.$router.push(this.modalAction.route);
      }
      this.modalAction = null;
    },
    showCustomModal(type, title, message, action = null) {
      this.modalType = type;
      this.modalTitle = title;
      this.modalMessage = message;
      this.modalAction = action;
      this.showModal = true;
    },
    async resetPassword() {
      if (this.otpCode.length !== 6) {
        this.showCustomModal('error', 'Invalid Code', 'Please enter a 6-digit code.');
        return;
      }
      if (this.newPassword !== this.confirmPassword) {
        this.showCustomModal('error', 'Password Mismatch', 'Passwords do not match.');
        return;
      }
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3001/auth/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, otp: this.otpCode, newPassword: this.newPassword }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Reset failed');
        }
        
        this.showCustomModal('success', 'Reset Successful!', 'Password reset successfully! You can now log in.', {
          type: 'redirect', route: '/auth/login'
        });
      } catch (error) {
        console.error('Password Reset Error:', error);
        this.showCustomModal('error', 'Reset Failed', error.message || 'Failed to reset password.');
      } finally {
        this.isLoading = false;
      }
    },
    goBack() {
      this.$router.push('/auth/login');
    },
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    }
  },
};
</script>

<style scoped>
</style>
