<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Office Hours Settings</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="m-0 text-xl text-gray-800">Today's Office Hours</h2>
            <p class="mt-1 mb-0 text-sm text-gray-600">
              Set the office hours that will apply for <strong>today only</strong>.
            </p>
          </div>

          <form class="flex flex-col gap-5" @submit.prevent>
            <div class="flex flex-col md:flex-row md:items-center gap-4">
              <label class="w-[110px] font-medium text-gray-800">Today</label>
              <div class="flex gap-3">
                <div class="flex flex-col gap-1 text-sm text-gray-600">
                  <span>Start</span>
                  <input v-model="today.start" type="time" class="py-1.5 px-2 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" />
                </div>
                <div class="flex flex-col gap-1 text-sm text-gray-600">
                  <span>End</span>
                  <input v-model="today.end" type="time" class="py-1.5 px-2 rounded border border-gray-300 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-200" />
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-4">
              <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-gray-300 text-gray-800 border-none transition-colors hover:bg-gray-400" @click="resetTimes">
                Reset
              </button>
              <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700" @click="saveSettings">
                Save Settings
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
      today: {
        start: '08:00',
        end: '17:00',
      },
    };
  },
  methods: {
    resetTimes() {
      this.today.start = '08:00';
      this.today.end = '17:00';
    },
    saveSettings() {
      console.log('Today\'s office hours:', this.today);
      alert("Today's office hours saved (UI only, no backend yet).");
    },
  },
};
</script>

