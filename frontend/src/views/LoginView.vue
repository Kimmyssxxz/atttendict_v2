<template>
  <!-- Mobile View -->
  <div v-if="isMobile" class="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
    <div class="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8 sm:p-12 flex flex-col items-center">
      <div class="flex flex-row items-center justify-center gap-3 mb-6 w-full">
        <img src="/dictlogo2.png" alt="DICT Logo" class="h-10 sm:h-12 w-auto object-contain"/>
        <img src="/Bagongpilipinas.png" alt="Bagong Pilipinas Logo" class="h-10 sm:h-12 w-auto object-contain"/>
        <img src="/3.png" alt="Attendict Logo" class="h-10 sm:h-12 w-auto object-contain"/>
      </div>
      <h1 class="text-3xl font-bold text-gray-900 mb-1">Hello Again!</h1>
      <p class="text-gray-500 text-base mb-8 text-center">Welcome back, you've been missed.</p>

      <form @submit.prevent="handleLogin" class="w-full flex flex-col gap-4">
        <div class="relative">
          <input
            type="text"
            id="username-mobile"
            v-model="username"
            required
            placeholder="Username"
            class="w-full px-6 py-3 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors placeholder:text-gray-400"
          />
        </div>

        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password-mobile"
            v-model="password"
            required
            placeholder="Password"
            class="w-full px-6 py-3 pr-12 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors placeholder:text-gray-400"
          />
          <button 
            type="button" 
            @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
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

        <div class="flex justify-end w-full -mt-1">
          <router-link to="/auth/forgot-password" class="text-sm text-[#133e75] hover:underline font-medium">Forgot Password?</router-link>
        </div>

        <div>
           <button type="submit" :disabled="isLoading" class="w-full px-8 py-3.5 mt-2 bg-[#133e75] text-white font-semibold rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
             <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             {{ isLoading ? 'Logging in...' : 'Login' }}
           </button>
        </div>
      </form>

      <div class="mt-4 text-sm text-gray-500 flex flex-col items-center gap-2 w-full">
        <div class="flex items-center gap-1">
          Don't have an account? <router-link to="/auth/register" class="text-[#b92e2b] hover:underline font-semibold">Sign up</router-link>
        </div>
        <div class="pt-2 border-t border-gray-100 w-full text-center">
          <router-link to="/auth/admin/login" class="text-xs text-gray-400 hover:text-[#133e75] transition-colors">Admin Portal</router-link>
        </div>
      </div>
    </div>
  </div>

  <!-- Desktop View -->
  <div v-else class="flex justify-center items-center min-h-screen bg-gray-100/50 p-4 font-sans">
    <div class="flex w-full max-w-6xl bg-white rounded-3xl shadow-xl overflow-hidden relative min-h-[600px]">
      
      <!-- Header links (Top right) & Logo (Top left) -->
      <div class="absolute top-0 left-0 w-full p-6 flex justify-center lg:justify-start items-center z-20">
        <div class="flex flex-row items-center gap-3 font-bold text-xl text-blue-600">
          <img src="/dictlogo2.png" alt="DICT Logo" class="h-12 w-auto object-contain lg:block hidden"/>
          <img src="/Bagongpilipinas.png" alt="Bagong Pilipinas Logo" class="h-12 w-auto object-contain lg:block hidden"/>
          <img src="/3.png" alt="Logo" class="h-12 w-auto object-contain hidden sm:block"/>
          <span class="text-gray-900 text-3xl">ATTENDICT</span>
        </div>
      </div>

      <!-- Left Side Illustration -->
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center  p-12">

        
        <!-- Central Circular Graphic area -->
        <div class="relative w-[28rem] h-[28rem]  flex items-center justify-center  z-10">
          <DotLottieVue style="height: 500px; width: 500px" autoplay loop src="https://lottie.host/eb77402f-d9a7-478c-9ac5-026aa8b6b889/iaB5skKvtQ.lottie" />
        </div>
      </div

      <!-- Right Side Form -->
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 z-10 pt-24 ">
        <div class="w-full max-w-md flex flex-col items-center lg:items-stretch text-center lg:text-left">
          <h1 class="text-4xl text-gray-900 font-semibold ">Hello Again!</h1>
          <p class="text-gray-500 mb-8 mt-2 text-base leading-relaxed text-center">
            Welcome back, you've been missed.
          </p>

          <form @submit.prevent="handleLogin" class="flex flex-col space-y-5 w-full">
            <div class="relative">
              <input
                type="text"
                id="username"
                v-model="username"
                required
                placeholder="Username"
                class="w-full px-4 py-3 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
              />
            </div>

            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                required
                placeholder="Password"
                class="w-full px-4 py-3 pr-10 border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
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

            <div class="flex justify-end w-full -mt-2">
              <router-link to="/auth/forgot-password" class="text-sm text-[#133e75] hover:underline font-medium">Forgot Password?</router-link>
            </div>

            <div>
               <button type="submit" :disabled="isLoading" class="w-full px-8 py-3 bg-[#133e75] text-white font-medium rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center">
                 <svg v-if="isLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                   <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {{ isLoading ? 'Logging in...' : 'Login' }}
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex flex-col lg:items-start items-center gap-2 w-full">
            <div class="flex items-center gap-1">
              Don't have an account?<router-link to="/auth/register" class="text-[#b92e2b] hover:underline font-medium">Sign up</router-link>
            </div>
            <div class="pt-2 border-t border-gray-100 w-full lg:text-left text-center">
              <router-link to="/auth/admin/login" class="text-xs text-gray-400 hover:text-[#133e75] transition-colors">Admin Portal Access</router-link>
            </div>
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
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
import { API_BASE_URL } from '../config'

export default {
  name: 'LoginView',
  components: {
    DotLottieVue
  },
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      isMobile: window.innerWidth < 1024,
      isLoading: false,
      showModal: false,
      modalType: 'error',
      modalTitle: '',
      modalMessage: '',
      modalAction: null,
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
    async handleLogin() {
      console.log('Login attempt started for user:', this.username);
      this.isLoading = true;
      try {
        console.log('Sending request to backend...');
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        console.log('Response received status:', response.status);

        if (!response.ok) {
          let details = '';
          try {
            const errData = await response.json();
            if (errData?.errorCode === 'NOT_VERIFIED') {
              this.showCustomModal('error', 'Not Verified', errData.message || 'Account not verified. Redirecting to verification page.', {
                type: 'redirect', route: { name: 'OtpVerification', query: { email: errData.email || this.username } }
              });
              return;
            }
            details = errData?.message ? `${errData.message}` : `Login failed (${response.status})`;
          } catch {
            details = `Login failed (${response.status})`;
          }
          throw new Error(details);
        }

        const data = await response.json();
        const user = data.user;
        console.log('User data received:', user);

        if (!user || !user.role) {
          console.error('Missing user or role in response');
          throw new Error('Invalid login response');
        }

        console.log('Redirecting based on role:', user.role);
        if (user.role === 'student' || user.role === 'intern') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('internUser', JSON.stringify(user));
          this.showCustomModal('success', 'Login Successful', 'Welcome back! Redirecting to dashboard...', { type: 'redirect', route: { name: 'InternDashboard' } });
        } else if (user.role === 'staff') {
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('staffUser', JSON.stringify(user));
          this.showCustomModal('success', 'Login Successful', 'Welcome back! Redirecting to dashboard...', { type: 'redirect', route: { name: 'StaffDashboard' } });
        } else {
          console.error('Unhandled role type:', user.role);
          throw new Error('This login page is only for intern and staff accounts.');
        }
      } catch (error) {
        console.error('Login error:', error);
        this.showCustomModal('error', 'Login Failed', error?.message || 'Please check your credentials and try again.');
      } finally {
        this.isLoading = false;
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
