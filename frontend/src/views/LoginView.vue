<template>
  <!-- Mobile View -->
  <div v-if="isMobile" class="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
    <div class="w-full max-w-[400px] bg-white rounded-xl shadow-lg p-8 sm:p-12 flex flex-col items-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-1">Hello Again!</h1>
      <p class="text-gray-500 text-base mb-8">Welcome back, you've been missed.</p>

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

        <div>
           <button type="submit" class="w-full px-8 py-3.5 mt-4 bg-[#133e75] text-white font-semibold rounded-xl cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80">
             Login
           </button>
        </div>
      </form>

      <div class="mt-4 text-sm text-gray-500 flex justify-center items-center gap-1 w-full">
        Don't have an account? <router-link to="/auth/register" class="text-[#b92e2b] hover:underline font-semibold">Sign up</router-link>
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
      <div class="hidden lg:flex lg:w-1/2 relative items-center justify-center  p-12">

        
        <!-- Central Graphic area -->
        <div class="relative w-[28rem] h-[28rem] flex items-center justify-center z-10">
          <DotLottieVue style="height: 1000px; width: 1000px" autoplay loop src="https://lottie.host/b37b7748-1dc6-4cb4-8bf0-05a0b4f7e988/0t7UBpQlw6.lottie" />
        </div>
      </div>

      <!-- Right Side Form -->
      <div class="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12 z-10 pt-24 ">
        <div class="w-full max-w-md flex flex-col items-center lg:items-stretch text-center lg:text-left">
          <h1 class="text-4xl text-gray-900 font-semibold ">Hello Again!</h1>
          <p class="text-gray-500 mb-8 mt-2 text-base leading-relaxed">
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

            <div>
               <button type="submit" class="w-full px-8 py-3 mt-4 bg-[#133e75] text-white font-medium rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[#133e75]/80">
                 Login
               </button>
            </div>
          </form>

          <div class="mt-8 text-sm text-gray-500 flex justify-center lg:justify-start items-center gap-1 w-full">
            Don't have an account?<router-link to="/auth/register" class="text-[#b92e2b] hover:underline font-medium">Sign up</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

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
    };
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3001/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        const user = data.user;

        if (!user || !user.role) {
          throw new Error('Invalid login response');
        }

        if (user.role === 'student') {
          localStorage.setItem('internUser', JSON.stringify(user));
          this.$router.push({ name: 'InternDashboard' });
        } else if (user.role === 'staff') {
          localStorage.setItem('staffUser', JSON.stringify(user));
          this.$router.push({ name: 'StaffDashboard' });
        } else {
          throw new Error('This login page is only for intern and staff accounts.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
      }
    },
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    }
  },
};
</script>


