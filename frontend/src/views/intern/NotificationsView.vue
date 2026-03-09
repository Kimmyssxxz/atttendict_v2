<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">Notifications</h1>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <nav class="flex flex-wrap gap-3">
          <router-link to="/intern/dashboard" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Dashboard</router-link>
          <router-link to="/intern/time" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Time In / Out</router-link>
          <router-link to="/intern/attendance" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">My Attendance</router-link>
          <router-link to="/intern/staff-status" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Staff Status</router-link>
          <router-link to="/intern/notifications" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Notifications</router-link>
          <router-link to="/intern/profile" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Profile</router-link>
          <router-link to="/intern/settings" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Settings</router-link>
        </nav>

        <div class="relative cursor-pointer" @click="toggleNotifications">
          <div class="relative w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition-colors hover:bg-slate-700">
            <span class="text-base">🔔</span>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1.5 py-0 min-w-[18px] text-center shadow-sm">{{ unreadCount }}</span>
          </div>
          <div v-if="showNotifications" class="absolute right-0 mt-2 bg-white text-slate-900 min-w-[220px] rounded-xl shadow-[0_10px_25px_rgba(15,23,42,0.25)] p-3 z-20" @click.stop>
            <h3 class="m-0 mb-2 text-sm font-semibold">Notifications</h3>
            <ul v-if="notifications.length" class="list-none p-0 m-0 text-[0.85rem]">
              <li v-for="(n, idx) in notifications" :key="idx" class="mt-1 first:mt-0">{{ n }}</li>
            </ul>
            <p v-else class="m-0 text-[0.8rem] text-gray-500">No notifications</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[800px] mx-auto my-8 px-4 pb-8">
      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 class="m-0 text-[1.1rem] text-slate-900 font-bold">Your Notifications</h2>
            <p class="mt-1 mb-0 text-[0.85rem] text-slate-500">This page will list your recent time in / time out activity.</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="px-3.5 py-1.5 rounded-full border-none bg-slate-200 text-slate-700 text-[0.8rem] font-semibold cursor-pointer transition-colors hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!unreadCount" @click="markAllAsRead">Mark all as read</button>
            <button class="px-3.5 py-1.5 rounded-full border-none bg-slate-200 text-slate-700 text-[0.8rem] font-semibold cursor-pointer transition-colors hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!selectedIndexes.length" @click="deleteSelected">Delete selected</button>
            <button class="px-3.5 py-1.5 rounded-full border-none bg-red-100 text-red-700 hover:bg-red-200 text-[0.8rem] font-semibold cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed" :disabled="!notifications.length" @click="deleteAll">Delete all</button>
          </div>
        </div>

        <ul v-if="notifications.length" class="list-none m-0 p-0 pl-1 text-[0.9rem] text-slate-900 flex flex-col gap-2">
          <li v-for="(n, idx) in notifications" :key="idx" class="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <label class="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" v-model="selectedIndexes" :value="idx" class="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <div class="flex flex-col gap-1.5 w-full">
                <span class="font-medium text-slate-800">{{ n.message || n }}</span>
                <div
                  v-if="n.metadata && (n.metadata.timeInLocation || n.metadata.timeOutLocation || n.metadata.location)"
                  class="flex flex-col gap-1 text-[0.8rem] text-slate-500 bg-white p-2 rounded-md border border-slate-200/60"
                >
                  <span v-if="n.metadata.timeInLocation" class="flex gap-1"><span class="font-semibold shrink-0">Time In:</span> <span class="truncate">{{ formatLocation(n.metadata.timeInLocation) }}</span></span>
                  <span v-if="n.metadata.timeOutLocation" class="flex gap-1"><span class="font-semibold shrink-0">Time Out:</span> <span class="truncate">{{ formatLocation(n.metadata.timeOutLocation) }}</span></span>
                  <span v-else-if="!n.metadata.timeInLocation && !n.metadata.timeOutLocation && n.metadata.location" class="flex gap-1"><span class="font-semibold shrink-0">Location:</span> <span class="truncate">{{ n.metadata.location }}</span></span>
                </div>
              </div>
            </label>
          </li>
        </ul>
        <p v-else class="text-[0.85rem] text-slate-500 italic m-0 pt-2 text-center">No notifications yet.</p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InternNotificationsView',
  data() {
    return {
      notifications: [],
      unreadCount: 0,
      internId: null,
      selectedIndexes: [],
      showNotifications: false
    }
  },
  created() {
    try {
      const stored = localStorage.getItem('internUser');
      if (!stored) return;
      const user = JSON.parse(stored);
      const internId = user && user.id;
      if (!internId) return;
      this.internId = internId;
      // First try to load from backend (Firebase notifications table)
      fetch(`http://localhost:3001/notifications/user/${internId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && Array.isArray(data.notifications)) {
            this.notifications = data.notifications;
          }
        })
        .catch(() => {
          // Fallback to localStorage if backend fetch fails
          try {
            const key = `internNotifications_${internId}`;
            const raw = localStorage.getItem(key);
            if (!raw) return;
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              // Support old string-only format from localStorage
              this.notifications = list.map((item) => (
                typeof item === 'string'
                  ? { message: item }
                  : item
              ));
            }
          } catch (e) {}
        });

      // Load unread count from localStorage for the bell and buttons
      const unreadKey = `internNotificationsUnread_${internId}`;
      const unreadRaw = localStorage.getItem(unreadKey);
      if (unreadRaw != null) {
        const num = parseInt(unreadRaw, 10);
        if (!Number.isNaN(num) && num >= 0) {
          this.unreadCount = num;
        }
      }
    } catch (e) {
    }
  },
  methods: {
    formatLocation(value) {
      if (!value) return ''
      if (typeof value === 'string') return value
      if (typeof value.address === 'string' && value.address.trim() !== '') {
        return value.address
      }
      return ''
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    markAllAsRead() {
      if (!this.internId) return
      this.unreadCount = 0
      try {
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.setItem(unreadKey, '0');
      } catch (e) {
      }
    },
    deleteAll() {
      if (!this.internId) return
      if (!window.confirm('Delete all notifications? This cannot be undone.')) return
      // First call backend to delete from Firestore
      fetch(`http://localhost:3001/notifications/user/${this.internId}`, {
        method: 'DELETE'
      }).catch(() => {})
      this.notifications = []
      this.unreadCount = 0
      this.selectedIndexes = []
      try {
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.removeItem(key);
        localStorage.setItem(unreadKey, '0');
      } catch (e) {
      }
    },
    deleteSelected() {
      if (!this.internId || !this.selectedIndexes.length) return
      if (!window.confirm('Delete selected notifications?')) return

      // Collect messages to delete based on selected indexes
      const messagesToDelete = this.selectedIndexes
        .map((i) => {
          const n = this.notifications[i];
          if (!n) return null;
          return typeof n === 'string' ? n : n.message;
        })
        .filter((v) => typeof v === 'string');

      // Call backend to delete matching notifications in Firestore
      fetch(`http://localhost:3001/notifications/user/${this.internId}/delete-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToDelete })
      }).catch(() => {})

      // Update local list and unread counter
      const remaining = this.notifications.filter((_, idx) => !this.selectedIndexes.includes(idx));
      this.notifications = remaining;
      this.selectedIndexes = [];
      this.unreadCount = Math.min(this.unreadCount, remaining.length);
      try {
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
        localStorage.setItem(key, JSON.stringify(remaining));
        localStorage.setItem(unreadKey, String(this.unreadCount));
      } catch (e) {
      }
    }
  }
}
</script>


