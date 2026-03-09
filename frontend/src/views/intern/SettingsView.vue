<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">Account Settings</h1>
      <div class="flex items-center gap-4">
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

    <main class="max-w-[900px] mx-auto my-8 px-4 pb-8 flex flex-col gap-6">
      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <h2 class="mt-0 mb-2 text-[1.1rem] text-slate-900 font-bold">Change Password</h2>
        <form class="grid grid-cols-1 gap-3 max-w-[500px]" @submit.prevent="handleChangePassword">
          <div class="flex flex-col">
            <label for="current" class="mb-1 text-[0.85rem] text-slate-600 font-medium">Current Password</label>
            <input id="current" type="password" v-model="passwordForm.currentPassword" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="flex flex-col">
            <label for="new" class="mb-1 text-[0.85rem] text-slate-600 font-medium">New Password</label>
            <input id="new" type="password" v-model="passwordForm.newPassword" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div class="flex flex-col">
            <label for="confirm" class="mb-1 text-[0.85rem] text-slate-600 font-medium">Confirm New Password</label>
            <input id="confirm" type="password" v-model="passwordForm.confirmNewPassword" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>
          <button type="submit" class="mt-2 py-2.5 px-6 w-full sm:w-auto self-start rounded-full border-none bg-slate-700 text-white text-[0.9rem] font-semibold cursor-pointer transition-colors hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed" :disabled="pwdSaving || !intern.id">
            {{ pwdSaving ? 'Saving...' : 'Save' }}
          </button>
          <p v-if="pwdMessage" class="mt-2 mb-0 text-[0.8rem] text-emerald-600 font-medium">{{ pwdMessage }}</p>
          <p v-if="pwdError" class="mt-2 mb-0 text-[0.8rem] text-red-600 font-medium">{{ pwdError }}</p>
        </form>
      </section>

      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <h2 class="mt-0 mb-2 text-[1.1rem] text-slate-900 font-bold">Security</h2>
        <p class="mt-0 mb-4 text-[0.9rem] text-slate-500">Manage your active sessions and login history.</p>

        <div>
          <h3 class="mt-0 mb-4 text-[1rem] text-slate-900 font-bold">Active Sessions</h3>
          <div class="flex flex-col gap-3">
            <div
              v-for="session in sessions"
              :key="session.id"
              class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-200 bg-white [&.current]:bg-emerald-50 [&.current]:border-emerald-200"
              :class="{ current: session.isCurrent }"
            >
              <div class="w-10 h-10 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-lg">
                <span>{{ session.icon }}</span>
              </div>
              <div class="flex-1 min-w-0 w-full">
                <div class="flex items-center gap-2 mb-1">
                  <span class="font-semibold text-slate-900 truncate">{{ session.device }} - {{ session.browser }}</span>
                  <span v-if="session.isCurrent" class="text-[0.75rem] px-2 py-0.5 rounded-full bg-emerald-500 text-emerald-50 font-medium shrink-0">Current</span>
                </div>
                <div class="flex flex-wrap gap-x-6 gap-y-2 text-[0.85rem]">
                  <div>
                    <span class="block text-slate-500 text-[0.75rem]">Location</span>
                    <span class="block text-slate-900 font-medium">{{ session.location }}</span>
                  </div>
                  <div>
                    <span class="block text-slate-500 text-[0.75rem]">Last active</span>
                    <span class="block text-slate-900 font-medium">{{ session.lastActive }}</span>
                  </div>
                </div>
              </div>
              <button
                class="px-4 py-1.5 rounded-full border-none bg-red-100 text-red-700 hover:bg-red-200 text-[0.85rem] font-semibold cursor-pointer transition-colors mt-2 sm:mt-0"
                type="button"
                @click="revokeSession(session)"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InternSettingsView',
  data() {
    return {
      intern: {
        id: null,
        firstName: '',
        lastName: '',
      },
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      pwdSaving: false,
      pwdMessage: null,
      pwdError: null,
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      },
      sessions: [],
    };
  },
  created() {
    this.loadInternProfile();
    try {
      const stored = localStorage.getItem('internUser');
      if (stored) {
        const user = JSON.parse(stored);
        const internId = user && user.id;
        if (internId) {
          const key = `internNotifications_${internId}`;
          const unreadKey = `internNotificationsUnread_${internId}`;
          const raw = localStorage.getItem(key);
          if (raw) {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              this.notifications = list;
            }
          }
          const unreadRaw = localStorage.getItem(unreadKey);
          if (unreadRaw != null) {
            const num = parseInt(unreadRaw, 10);
            if (!Number.isNaN(num) && num >= 0) {
              this.unreadCount = num;
            }
          } else {
            this.unreadCount = this.notifications.length;
          }
        }
      }
    } catch (e) {}
    this.loadSessions();
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications;
    },
    addLocalNotification(message) {
      try {
        if (!this.intern.id || !message) return;
        const key = `internNotifications_${this.intern.id}`;
        const unreadKey = `internNotificationsUnread_${this.intern.id}`;
        const existingRaw = localStorage.getItem(key);
        let list = [];
        if (existingRaw) {
          const parsed = JSON.parse(existingRaw);
          if (Array.isArray(parsed)) {
            list = parsed;
          }
        }
        list.unshift(message);
        localStorage.setItem(key, JSON.stringify(list));
        const unreadRaw = localStorage.getItem(unreadKey);
        let unread = 0;
        if (unreadRaw != null) {
          const num = parseInt(unreadRaw, 10);
          if (!Number.isNaN(num) && num >= 0) {
            unread = num;
          }
        }
        unread += 1;
        localStorage.setItem(unreadKey, String(unread));
      } catch (e) {}
    },
    async loadInternProfile() {
      try {
        const stored = localStorage.getItem('internUser');
        if (!stored) {
          return;
        }
        const basic = JSON.parse(stored);
        this.intern = {
          ...this.intern,
          ...basic,
          id: basic.id,
        };
      } catch (err) {
        console.error('Error loading intern profile in settings:', err);
      }
    },
    async loadSessions() {
      try {
        if (!this.intern.id) return;

        try {
          await fetch(`http://localhost:3001/users/${this.intern.id}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userAgent: navigator.userAgent || '',
              location: 'Philippines',
            }),
          });
        } catch (e) {}

        const res = await fetch(`http://localhost:3001/users/${this.intern.id}/sessions`);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          return;
        }

        const list = Array.isArray(data && data.sessions) ? data.sessions : [];
        this.sessions = list.map((s) => ({
          id: s.id,
          device: s.device || 'Unknown device',
          browser: s.browser || 'Unknown',
          location: s.location || 'Unknown',
          lastActive: s.lastActive && typeof s.lastActive.seconds === 'number'
            ? new Date(s.lastActive.seconds * 1000).toLocaleString()
            : 'Unknown',
          isCurrent: !!s.isCurrent,
          icon: /Android/i.test(s.device || '') || /phone|mobile/i.test(s.device || '') ? '📱' : '🖥️',
        }));
      } catch (err) {
        console.error('Error loading sessions:', err);
      }
    },
    async handleChangePassword() {
      try {
        this.pwdError = null;
        this.pwdMessage = null;

        if (!this.intern.id) {
          this.pwdError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        const { currentPassword, newPassword, confirmNewPassword } = this.passwordForm;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
          this.pwdError = 'Please fill in all password fields.';
          return;
        }

        if (newPassword !== confirmNewPassword) {
          this.pwdError = 'New password and confirmation do not match.';
          return;
        }

        if (newPassword.length < 6) {
          this.pwdError = 'New password must be at least 6 characters.';
          return;
        }

        this.pwdSaving = true;

        const response = await fetch(`http://localhost:3001/users/${this.intern.id}/change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message = data && data.message ? data.message : 'Failed to update password.';
          throw new Error(message);
        }

        this.pwdMessage = (data && data.message) || 'Password updated successfully.';
        this.addLocalNotification('Your account password was changed.');
        this.passwordForm.currentPassword = '';
        this.passwordForm.newPassword = '';
        this.passwordForm.confirmNewPassword = '';
      } catch (err) {
        console.error('Error changing password in settings:', err);
        this.pwdError = err && err.message ? err.message : 'Failed to update password.';
      } finally {
        this.pwdSaving = false;
      }
    },
    async revokeSession(session) {
      try {
        if (!this.intern.id) return;
        if (session && session.isCurrent) {
          const res = await fetch(`http://localhost:3001/users/${this.intern.id}/sessions`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            return;
          }
          try {
            localStorage.removeItem('internUser');
          } catch (e) {}
          this.sessions = [];
          this.$router.push('/auth/login');
        } else if (session && session.id) {
          const res = await fetch(`http://localhost:3001/users/${this.intern.id}/sessions/${session.id}`, {
            method: 'DELETE',
          });
          if (!res.ok) {
            return;
          }
          this.sessions = this.sessions.filter((s) => s.id !== session.id);
        }
      } catch (err) {
        console.error('Error revoking session:', err);
      }
    },
  },
};
</script>


