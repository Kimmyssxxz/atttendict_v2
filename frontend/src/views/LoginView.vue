<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 m-0 p-5">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-center text-gray-800 mb-6 text-2xl font-bold">Login</h2>
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
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
    };
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
  },
};
</script>


