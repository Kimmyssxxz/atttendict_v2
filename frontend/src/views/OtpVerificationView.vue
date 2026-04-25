<template>
  <!-- Mobile View -->
  <div v-if="isMobile" class="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
    <div class="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8 sm:p-12 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-1 text-center">Verify Email</h1>
      <p class="text-gray-500 text-base mb-8 text-center px-4">
        We've sent a 6-digit code to <span class="font-medium text-gray-800">{{ email }}</span>.
      </p>

      <form @submit.prevent="verifyOtp" class="w-full flex flex-col gap-4">
        <div class="relative">
          <input
            type="text"
            id="otp-mobile"
            v-model="otpCode"
            required
            maxlength="6"
            placeholder="Enter 6-digit code"
            class="w-full px-6 py-3 border border-gray-300 rounded-xl text-center text-xl tracking-widest focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors placeholder:text-gray-400 placeholder:tracking-normal placeholder:text-base"
          />
        </div>

        <div>
           <button type="submit" :disabled="isLoading" class="w-full px-8 py-3.5 mt-4 bg-[#133e75] text-white font-semibold rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
             <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             {{ isLoading ? 'Verifying...' : 'Verify Account' }}
           </button>
        </div>
      </form>

      <div class="mt-6 text-sm text-gray-500 flex justify-center items-center gap-1 w-full flex-col">
        <span>Didn't receive the code?</span>
        <button @click="resendOtp" :disabled="isResending" class="text-[#b92e2b] hover:underline font-semibold disabled:opacity-50 mt-1">
          {{ isResending ? 'Sending...' : 'Resend Code' }}
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
        <div class="w-full max-w-md flex flex-col justify-center text-center">
          
          <h1 class="text-4xl text-gray-900 font-semibold mb-2">Verify Your Account</h1>
          <p class="text-gray-500 mb-8 mt-2 text-base leading-relaxed">
            We've sent a 6-digit confirmation code to 
            <br/><span class="font-medium text-gray-800">{{ email }}</span>.
            <br/>Please enter it below to continue.
          </p>

          <form @submit.prevent="verifyOtp" class="flex flex-col space-y-6 w-full">
            <div class="relative">
              <input
                type="text"
                id="otp"
                v-model="otpCode"
                required
                maxlength="6"
                placeholder="000000"
                class="w-full px-4 py-4 border border-gray-200 rounded-md text-center text-2xl tracking-[0.5em] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
                style="font-family: monospace;"
              />
            </div>

            <div>
               <button type="submit" :disabled="isLoading" class="w-full px-8 py-3.5 bg-[#133e75] text-white font-medium rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
                 <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {{ isLoading ? 'Verifying...' : 'Verify Account' }}
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex flex-col items-center justify-center gap-2 w-full">
            <span>Didn't receive the email?</span>
            <button @click="resendOtp" :disabled="isResending" class="text-[#b92e2b] hover:underline font-medium text-base disabled:text-gray-400">
               {{ isResending ? 'Sending...' : 'Resend OTP' }}
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
        <p class="text-sm text-gray-500 mb-6 px-2">{{ modalMessage }}</p>
        
        <button @click="closeModal" class="w-full inline-flex justify-center items-center rounded-xl px-4 py-3 bg-[#133e75] text-sm font-semibold text-white hover:bg-[#133e75]/90 focus:outline-none transition-colors">
          {{ modalType === 'success' && modalAction === 'redirectLogin' ? 'Go to Login' : 'Continue' }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

export default {
  name: 'OtpVerificationView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      otpCode: '',
      email: '',
      isMobile: window.innerWidth < 1024,
      isLoading: false,
      isResending: false,
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
      this.showCustomModal('error', 'Missing Information', 'Email not provided for validation.', 'redirectLogin');
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
      if (this.modalAction === 'redirectLogin') {
        this.$router.push('/auth/login');
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
    async verifyOtp() {
      if (this.otpCode.length !== 6) {
        this.showCustomModal('error', 'Invalid Code', 'Please enter a 6-digit code.');
        return;
      }
      this.isLoading = true;
      try {
        const response = await fetch('http://localhost:3001/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email, otp: this.otpCode }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }
        
        this.showCustomModal('success', 'Account Verified', 'Account successfully verified! You can now log in.', 'redirectLogin');
      } catch (error) {
        console.error('OTP Verification Error:', error);
        this.showCustomModal('error', 'Verification Failed', error.message || 'Failed to verify account.');
      } finally {
        this.isLoading = false;
      }
    },
    async resendOtp() {
      if (this.isResending) return;
      this.isResending = true;
      try {
        const response = await fetch('http://localhost:3001/auth/resend-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to resend OTP');
        }
        
        this.showCustomModal('success', 'Code Sent Reminder', 'A new OTP has been sent to your email.');
      } catch (error) {
        console.error('Resend OTP Error:', error);
        this.showCustomModal('error', 'Resend Failed', error.message || 'Failed to resend OTP.');
      } finally {
        // Cooldown for resend
        setTimeout(() => {
          this.isResending = false;
        }, 5000);
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    }
  },
};
</script>

<style scoped>
</style>
