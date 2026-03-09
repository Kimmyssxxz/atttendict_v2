<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 m-0 p-5">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-center text-gray-800 mb-6 text-2xl font-bold">Admin Login</h2>
      <form @submit.prevent="handleLogin" class="flex flex-col">
        <div class="mb-4">
          <label for="username" class="block mb-2 text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            v-model="username"
            required
            placeholder="Enter your username"
            class="w-full p-2 border border-gray-300 rounded text-base focus:border-green-500 focus:outline-none"
          />
        </div>
        <div class="mb-4">
          <label for="password" class="block mb-2 text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Enter your password"
            class="w-full p-2 border border-gray-300 rounded text-base focus:border-green-500 focus:outline-none"
          />
        </div>
        <button type="submit" class="w-full p-3 bg-green-500 text-white border-none rounded text-base cursor-pointer transition-colors duration-300 hover:bg-green-600">
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLoginView',
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:3001/auth/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('Admin login successful:', data);
      } catch (error) {
        console.error('Admin login error:', error);
        alert('Admin login failed. Please check your credentials.');
      }
    }
  }
};
</script>

