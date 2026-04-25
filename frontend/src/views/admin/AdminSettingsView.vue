<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white">
        <h1 class="m-0 text-3xl font-semibold">Admin Settings</h1>
      </header>

      <main class="flex-1 px-6 py-6 font-sans">
        <section class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div class="mb-6">
            <h2 class="m-0 text-2xl font-semibold text-gray-800">Change Password</h2>
            <p class="text-gray-500">
              Update your account password below.
            </p>
          </div>

          <form class="flex flex-col gap-4" @submit.prevent="saveSettings">
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="currentPassword">Current Password</label>
              <input 
                id="currentPassword"
                v-model="passwords.current" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
              />
            </div>
            
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="newPassword">New Password</label>
              <input 
                id="newPassword"
                v-model="passwords.new" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
              />
            </div>

            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-800" for="confirmPassword">Confirm New Password</label>
              <input 
                id="confirmPassword"
                v-model="passwords.confirm" 
                type="password" 
                required
                class="py-2 px-3 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" 
              />
            </div>

            <div v-if="errorMessage" class="text-red-500 text-sm mt-1">
              {{ errorMessage }}
            </div>
            <div v-if="successMessage" class="text-green-600 text-sm mt-1">
              {{ successMessage }}
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button 
                type="button" 
                class="px-4 py-2 rounded-xl text-sm cursor-pointer bg-gray-200 text-gray-800 border-none transition-colors hover:bg-gray-300" 
                @click="resetForm"
                :disabled="loading"
              >
                Reset
              </button>
              <button 
                type="submit" 
                class="px-4 py-2 rounded-xl text-sm cursor-pointer bg-[#133e75] text-white border-none transition-colors hover:bg-[#133e75]/80 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Save Changes
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue';

export default {
  name: 'AdminSettingsView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      passwords: {
        current: '',
        new: '',
        confirm: '',
      },
      errorMessage: '',
      successMessage: '',
      loading: false,
      user: null
    };
  },
  mounted() {
    const userStr = localStorage.getItem('adminUser') || localStorage.getItem('user');
    if (userStr) {
      try {
        this.user = JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  },
  methods: {
    resetForm() {
      this.passwords.current = '';
      this.passwords.new = '';
      this.passwords.confirm = '';
      this.errorMessage = '';
      this.successMessage = '';
    },
    async saveSettings() {
      this.errorMessage = '';
      this.successMessage = '';

      if (!this.user || !this.user.id) {
        this.errorMessage = 'You are not logged in properly.';
        return;
      }

      if (this.passwords.new !== this.passwords.confirm) {
        this.errorMessage = 'New password and confirm password do not match.';
        return;
      }

      if (this.passwords.new.length < 6) {
        this.errorMessage = 'New password must be at least 6 characters long.';
        return;
      }

      this.loading = true;

      try {
        const response = await fetch(`http://localhost:3001/users/${this.user.id}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword: this.passwords.current,
            newPassword: this.passwords.new,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to update password.');
        }

        this.successMessage = 'Password changed successfully.';
        this.passwords.current = '';
        this.passwords.new = '';
        this.passwords.confirm = '';
      } catch (error) {
        this.errorMessage = error.message || 'An error occurred while communicating with the server.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

