<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Time In / Time Out</h1>
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
            <ul v-if="notifications.length" class="notif-list">
              <li v-for="(n, idx) in notifications" :key="idx">{{ n }}</li>
            </ul>
            <p v-else class="notif-empty">No notifications</p>
          </div>
        </div>
      </div>
    </header>

    <main class="time-main">
      <section class="card time-card">
        <h2>Today</h2>
        <p class="note">You can time in and out for both AM and PM sessions.</p>

        <div class="info-grid">
          <div>
            <span class="label">Date</span>
            <span class="value">{{ formatDate(currentDate) }}</span>
          </div>
          <div>
            <span class="label">Last Action</span>
            <span class="value">{{ formatTime(lastActionTime) }}</span>
          </div>
          <div>
            <span class="label">Total Time Today</span>
            <span class="value">{{ formatDuration(record.totalMinutes) }}</span>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <span class="label">Time In </span>
            <span class="value">{{ formatTime(record.timeInAM) }}</span>
          </div>
          <div>
            <span class="label">Time Out </span>
            <span class="value">{{ formatTime(record.timeOutAM) }}</span>
          </div>
          <div>
            <span class="label">Time In</span>
            <span class="value">{{ formatTime(record.timeInPM) }}</span>
          </div>
          <div>
            <span class="label">Time Out </span>
            <span class="value">{{ formatTime(record.timeOutPM) }}</span>
          </div>
        </div>

        <div class="button-group">
          <button class="btn btn-in" :disabled="loading || hasOpenSession" @click="handleTimeIn">
            {{ loading && loadingType === 'in' ? 'Saving...' : 'Time In' }}
          </button>
          <button class="btn btn-out" :disabled="loading || !hasOpenSession" @click="handleTimeOut">
            {{ loading && loadingType === 'out' ? 'Saving...' : 'Time Out' }}
          </button>
        </div>

        <section class="card map-card">
          <h2>Location</h2>
          <p v-if="locationAddress" class="location-address">{{ locationAddress }}</p>
          <div v-if="mapUrl" class="map-container">
            <iframe
              :src="mapUrl"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
          <p v-else class="note">No location recorded yet. Time in or time out to capture your location.</p>
        </section>
      </section>
    </main>
    <div v-if="showModal" class="modal-backdrop">
      <div class="modal">
        <div class="modal-header" :class="modalType === 'error' ? 'modal-header-error' : 'modal-header-success'">
          <h3>{{ modalTitle }}</h3>
        </div>
        <div class="modal-body">
          <p>{{ modalMessage }}</p>
        </div>
        <div class="modal-footer">
          <button class="btn modal-btn" @click="closeModal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InternTimeView',
  data() {
    return {
      currentDate: '',
      lastActionTime: '',
      loading: false,
      loadingType: null,
      internId: null,
      record: {},
      showNotifications: false,
      notifications: ['Welcome to your time tracker.', 'Remember to time out before leaving.'],
      unreadCount: 0,
      locationAddress: '',
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalType: 'success'
    }
  },
  created() {
    // Load logged-in intern from localStorage
    try {
      const stored = localStorage.getItem('internUser');
      if (stored) {
        const user = JSON.parse(stored);
        this.internId = user.id || null;
      }
    } catch (e) {
      this.internId = null;
    }

    // After we know the internId, fetch today's attendance so data persists after refresh
    if (this.internId) {
      this.fetchTodayRecord();
      try {
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
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
      } catch (e) {
      }
    }
  },
  computed: {
    mapUrl() {
      if (!this.record) return '';
      const loc = this.record.locationPM || this.record.locationAM;
      if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
        return '';
      }
      const lat = loc.latitude;
      const lng = loc.longitude;
      return `https://www.google.com/maps?q=${lat},${lng}&hl=en&z=18&output=embed`;
    },
    hasOpenSession() {
      if (!this.record) return false;
      const hasOpenAM = !!this.record.timeInAM && !this.record.timeOutAM;
      const hasOpenPM = !!this.record.timeInPM && !this.record.timeOutPM;
      return hasOpenAM || hasOpenPM;
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const [year, month, day] = dateStr.split('-');
      if (!year || !month || !day) return dateStr;
      const date = new Date(Number(year), Number(month) - 1, Number(day));
      if (Number.isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    addNotification(message) {
      if (!message) return
      this.notifications.unshift(message)
      try {
        if (!this.internId) return
        const key = `internNotifications_${this.internId}`;
        const unreadKey = `internNotificationsUnread_${this.internId}`;
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
        this.unreadCount = unread;
        localStorage.setItem(unreadKey, String(unread));
      } catch (e) {
      }
    },
    formatTime(timeStr) {
      if (!timeStr) return '--:-- --';
      // Expecting HH:MM:SS or HH:MM
      const parts = timeStr.split(':');
      if (parts.length < 2) return timeStr;
      let hour = parseInt(parts[0], 10);
      const minute = parts[1];
      if (Number.isNaN(hour)) return timeStr;
      const suffix = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      if (hour === 0) hour = 12;
      return `${hour}:${minute} ${suffix}`;
    },
    formatDuration(totalMinutes) {
      if (totalMinutes == null || Number.isNaN(totalMinutes)) {
        return '--h --m';
      }
      const minutes = Math.max(0, Math.floor(totalMinutes));
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      if (hours === 0 && mins === 0) return '0h 0m';
      return `${hours}h ${mins}m`;
    },
    async fetchTodayRecord() {
      try {
        const res = await fetch(`http://localhost:3001/attendance/intern/today?internId=${this.internId}`)
        const data = await res.json()

        if (!res.ok) {
          console.error('Fetch today record failed', data)
          return
        }

        if (!data.data) {
          // No record yet for today
          this.currentDate = ''
          this.lastActionTime = ''
          this.record = {}
          return
        }

        const rec = data.data
        this.currentDate = rec.date
        // Prefer PM times if they exist, otherwise AM
        this.lastActionTime = rec.timeOutPM || rec.timeInPM || rec.timeOutAM || rec.timeInAM || ''
        this.record = rec
        this.updateLocationAddress()
      } catch (err) {
        console.error('Error fetching today record', err)
      }
    },
    async handleTimeIn() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error');
        return;
      }
      let location = null;
      if (navigator.geolocation) {
        try {
          location = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                });
              },
              (err) => {
                console.warn('Geolocation error for time-in:', err);
                resolve(null);
              },
              { enableHighAccuracy: true, timeout: 10000 }
            );
          });
        } catch (e) {
          console.warn('Geolocation exception for time-in:', e);
        }
      }
      if (location) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}`)
          if (res.ok) {
            const data = await res.json()
            if (data && data.display_name) {
              location.address = data.display_name
              this.locationAddress = data.display_name
            }
          }
        } catch (e) {
        }
      }
      this.loading = true
      this.loadingType = 'in'
      try {
        const res = await fetch('http://localhost:3001/attendance/intern/time-in', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ internId: this.internId, location })
        })

        const data = await res.json()

        if (!res.ok) {
          this.openModal('Time In Failed', data.message || 'Time in failed', 'error')
          return
        }

        const payload = data.data
        this.currentDate = payload.date
        this.lastActionTime = payload.timeIn || payload.lastActionTime || ''

        // Replace local record so map and times get latest values (including location)
        if (payload.record) {
          this.record = payload.record
        } else {
          if (!this.record) this.record = {}
          if (payload.session === 'AM') {
            this.record.timeInAM = payload.timeIn
          } else if (payload.session === 'PM') {
            this.record.timeInPM = payload.timeIn
          }
        }

        this.updateLocationAddress()

        this.openModal('Time In Successful', `You have successfully timed in for the ${payload.session || ''} session.`, 'success')
        this.addNotification(`Time in for ${payload.session || ''} session at ${this.formatTime(this.lastActionTime)}`)
        this.$router.push('/intern/notifications')
      } catch (err) {
        this.openModal('Connection Error', 'Error connecting to server. Please try again.', 'error')
      } finally {
        this.loading = false
        this.loadingType = null
      }
    },
    async handleTimeOut() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error');
        return;
      }
      this.loading = true
      this.loadingType = 'out'
      try {
        const res = await fetch('http://localhost:3001/attendance/intern/time-out', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ internId: this.internId })
        })

        const data = await res.json()

        if (!res.ok) {
          this.openModal('Time Out Failed', data.message || 'Time out failed', 'error')
          return
        }

        const payload = data.data
        this.currentDate = payload.date
        this.lastActionTime = payload.timeOut || payload.lastActionTime || ''

        // Replace local record so map and times get latest values (including location)
        if (payload.record) {
          this.record = payload.record
        } else {
          if (!this.record) this.record = {}
          if (payload.session === 'AM') {
            this.record.timeOutAM = payload.timeOut
          } else if (payload.session === 'PM') {
            this.record.timeOutPM = payload.timeOut
          }
        }

        // Also update totalMinutes so "Total Time Today" updates immediately
        if (payload.record && typeof payload.record.totalMinutes === 'number') {
          this.record.totalMinutes = payload.record.totalMinutes
        }
        this.updateLocationAddress()
        this.openModal('Time Out Successful', `You have successfully timed out for the ${payload.session || ''} session.`, 'success')
        this.addNotification(`Time out for ${payload.session || ''} session at ${this.formatTime(this.lastActionTime)}`)
        this.$router.push('/intern/notifications')
      } catch (err) {
        this.openModal('Connection Error', 'Error connecting to server. Please try again.', 'error')
      } finally {
        this.loading = false
        this.loadingType = null
      }
    },
    async updateLocationAddress() {
      this.locationAddress = ''
      if (!this.record) return
      const loc = this.record.locationPM || this.record.locationAM
      if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
        return
      }
       if (typeof loc.address === 'string' && loc.address.trim() !== '') {
        this.locationAddress = loc.address
        return
      }
      const lat = loc.latitude
      const lng = loc.longitude
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        if (!res.ok) return
        const data = await res.json()
        if (data && data.display_name) {
          this.locationAddress = data.display_name
        }
      } catch (e) {
      }
    },
    openModal(title, message, type = 'success') {
      this.modalTitle = title
      this.modalMessage = message
      this.modalType = type
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    }
    // Sa ngayon, walang real logic. Pwede mo na lang lagyan ng alert kung gusto mo.
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

.notif-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
}

.notif-list li + li {
  margin-top: 0.25rem;
}

.notif-empty {
  margin: 0;
  font-size: 0.8rem;
  color: #6b7280;
}

.time-main {
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

.map-card {
  margin-top: 1.5rem;
}

.map-container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  overflow: hidden;
  border-radius: 0.75rem;
}

.map-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.time-card h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.note {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 1.25rem;
}

.location-address {
  font-size: 0.85rem;
  color: #4b5563;
  margin-bottom: 0.75rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.btn {
  flex: 1;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-in {
  background: #22c55e;
  color: #052e16;
}

.btn-out {
  background: #ef4444;
  color: #fef2f2;
}

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  background: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
  opacity: 1;
}

.rules {
  margin: 0;
  padding-left: 1.2rem;
  font-size: 0.85rem;
  color: #4b5563;
}

.rules li + li {
  margin-top: 0.25rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal {
  background: #ffffff;
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.35);
  width: min(90%, 360px);
  overflow: hidden;
}

.modal-header {
  padding: 0.75rem 1rem;
  color: #ffffff;
}

.modal-header-success {
  background: #22c55e;
}

.modal-header-error {
  background: #ef4444;
}

.modal-body {
  padding: 1rem 1.25rem;
  font-size: 0.95rem;
  color: #111827;
}

.modal-footer {
  padding: 0.75rem 1rem 1rem;
  display: flex;
  justify-content: flex-end;
}

.modal-btn {
  max-width: 120px;
}
</style>
