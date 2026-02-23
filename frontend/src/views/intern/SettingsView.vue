<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Account Settings</h1>
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

    <main class="settings-main">
      <section class="card password-card">
        <h2>Change Password</h2>
        <form class="password-form" @submit.prevent="handleChangePassword">
          <div class="form-group">
            <label for="current">Current Password</label>
            <input id="current" type="password" v-model="passwordForm.currentPassword" />
          </div>
          <div class="form-group">
            <label for="new">New Password</label>
            <input id="new" type="password" v-model="passwordForm.newPassword" />
          </div>
          <div class="form-group">
            <label for="confirm">Confirm New Password</label>
            <input id="confirm" type="password" v-model="passwordForm.confirmNewPassword" />
          </div>
          <button type="submit" class="btn btn-save" :disabled="pwdSaving || !intern.id">
            {{ pwdSaving ? 'Saving...' : 'Save' }}
          </button>
          <p v-if="pwdMessage" class="note">{{ pwdMessage }}</p>
          <p v-if="pwdError" class="note error-note">{{ pwdError }}</p>
        </form>
      </section>

      <section class="card sessions-card">
        <h2>Security</h2>
        <p class="subtitle">Manage your active sessions and login history.</p>

        <div class="sessions-list">
          <h3>Active Sessions</h3>
          <div
            v-for="session in sessions"
            :key="session.id"
            class="session-item"
            :class="{ current: session.isCurrent }"
          >
            <div class="session-icon">
              <span>{{ session.icon }}</span>
            </div>
            <div class="session-info">
              <div class="session-title-row">
                <span class="session-title">{{ session.device }} - {{ session.browser }}</span>
                <span v-if="session.isCurrent" class="current-badge">Current</span>
              </div>
              <div class="session-meta">
                <div>
                  <span class="meta-label">Location</span>
                  <span class="meta-value">{{ session.location }}</span>
                </div>
                <div>
                  <span class="meta-label">Last active</span>
                  <span class="meta-value">{{ session.lastActive }}</span>
                </div>
              </div>
            </div>
            <button
              class="btn btn-revoke"
              type="button"
              @click="revokeSession(session)"
            >
              Revoke
            </button>
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

.intern-header h1 {
  margin: 0;
  font-size: 1.4rem;
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

.settings-main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}

.password-card h2,
.sessions-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.subtitle {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.password-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.form-group input {
  width: 100%;
  padding: 0.5rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}

.btn-save {
  margin-top: 0.5rem;
  padding: 0.7rem 1.2rem;
  border-radius: 999px;
  border: none;
  background: #4b5563;
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.note {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.error-note {
  color: #b91c1c;
}

.sessions-list h3 {
  margin: 0 0 1rem;
  font-size: 1rem;
  color: #0f172a;
}

.session-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.session-item + .session-item {
  margin-top: 0.75rem;
}

.session-item.current {
  background: #ecfdf5;
  border-color: #6ee7b7;
}

.session-icon {
  width: 40px;
  height: 40px;
  border-radius: 999px;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.session-info {
  flex: 1;
}

.session-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.session-title {
  font-weight: 600;
}

.current-badge {
  font-size: 0.75rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: #22c55e;
  color: #f0fdf4;
}

.session-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.85rem;
}

.meta-label {
  display: block;
  color: #6b7280;
}

.meta-value {
  display: block;
  color: #111827;
}

.btn-revoke {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 700px) {
  .session-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .session-meta {
    gap: 0.75rem;
  }
}
</style>
