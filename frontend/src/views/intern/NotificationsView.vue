<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Notifications</h1>
      <div class="intern-header-right">
        <nav class="intern-nav">
          <router-link to="/intern/dashboard">Dashboard</router-link>
          <router-link to="/intern/time">Time In / Out</router-link>
          <router-link to="/intern/attendance">My Attendance</router-link>
          <router-link to="/intern/notifications">Notifications</router-link>
          <router-link to="/intern/profile">Profile</router-link>
          <router-link to="/intern/settings">Settings</router-link>
        </nav>

        <div class="notif-wrapper" @click="toggleNotifications">
          <div class="notif-bell">
            <span class="bell-icon">🔔</span>
            <span v-if="unreadCount > 0" class="notif-badge">{{ unreadCount }}</span>
          </div>
          <div v-if="showNotifications" class="notif-panel" @click.stop>
            <h3>Notifications</h3>
            <ul v-if="notifications.length" class="notif-dropdown-list">
              <li v-for="(n, idx) in notifications" :key="idx">{{ n }}</li>
            </ul>
            <p v-else class="notif-empty">No notifications</p>
          </div>
        </div>
      </div>
    </header>

    <main class="notif-main">
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Your Notifications</h2>
            <p class="note">This page will list your recent time in / time out activity.</p>
          </div>
          <div class="card-actions">
            <button class="btn small" :disabled="!unreadCount" @click="markAllAsRead">Mark all as read</button>
            <button class="btn small" :disabled="!selectedIndexes.length" @click="deleteSelected">Delete selected</button>
            <button class="btn small danger" :disabled="!notifications.length" @click="deleteAll">Delete all</button>
          </div>
        </div>

        <ul v-if="notifications.length" class="notif-list">
          <li v-for="(n, idx) in notifications" :key="idx" class="notif-item">
            <label class="notif-row">
              <input type="checkbox" v-model="selectedIndexes" :value="idx" />
              <span class="notif-text">{{ n }}</span>
            </label>
          </li>
        </ul>
        <p v-else class="note">No notifications yet.</p>
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
            this.notifications = data.notifications.map((n) => n.message || '');
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
              this.notifications = list;
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
        .map((i) => this.notifications[i])
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

<style scoped>
.intern-layout {
  min-height: 100vh;
  background: #f5f7fb;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.intern-header {
  background: #1e293b;
  color: #fff;
  padding: 1rem 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.intern-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.intern-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.intern-nav a {
  color: #e5e7eb;
  text-decoration: none;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.9rem;
  border: 1px solid transparent;
}

.intern-nav a.router-link-active {
  background: #f97316;
  color: #111827;
  border-color: #f97316;
}

.intern-nav a:hover {
  background: #111827;
}

.notif-wrapper {
  position: relative;
  cursor: pointer;
}

.notif-bell {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bell-icon {
  font-size: 16px;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: #fef2f2;
  border-radius: 999px;
  font-size: 10px;
  padding: 0 5px;
}

.notif-panel {
  position: absolute;
  right: 0;
  margin-top: 0.5rem;
  background: #ffffff;
  color: #111827;
  min-width: 220px;
  border-radius: 0.75rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
  padding: 0.75rem 0.9rem;
  z-index: 20;
}

.notif-panel h3 {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.notif-dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
}

.notif-dropdown-list li + li {
  margin-top: 0.25rem;
}

.notif-empty {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.notif-main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: #e5e7eb;
  color: #111827;
}

.btn.small {
  padding: 0.3rem 0.8rem;
}

.btn.danger {
  background: #ef4444;
  color: #fef2f2;
}

.btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.note {
  font-size: 0.85rem;
  color: #6b7280;
}

.notif-list {
  margin: 1rem 0 0;
  padding-left: 1.2rem;
  font-size: 0.9rem;
  color: #111827;
}

.notif-item {
  list-style: none;
  margin: 0.25rem 0;
}

.notif-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.notif-text {
  flex: 1;
}
</style>
