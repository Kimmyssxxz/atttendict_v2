<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">Time In / Time Out</h1>
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
        <h2 class="mt-0 mb-2 text-[1.1rem] text-slate-900 font-bold">Today</h2>
        <p class="text-[0.8rem] text-slate-500 mb-5">You can time in and out for both AM and PM sessions.</p>

        <div class="flex justify-between items-baseline px-4 py-3 border border-slate-200 rounded-xl mb-4 bg-slate-50">
          <span class="block text-[0.8rem] text-slate-500 mb-0.5">Current Time</span>
          <span class="text-[1.1rem] font-semibold text-slate-900">{{ formatClockTime(clockNow) }}</span>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">Date</span>
            <span class="text-[1.1rem] font-semibold text-slate-900">{{ formatDate(currentDate) }}</span>
          </div>
          <div>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">Last Action</span>
            <span class="text-[1.1rem] font-semibold text-slate-900">{{ formatTime(lastActionTime) }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-6">
          <div>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">Time In (AM)</span>
            <span class="text-[1.1rem] font-semibold text-slate-900 block mb-2">{{ formatTime(record.timeInAM) }}</span>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">AM Tag</span>
            <span class="text-[1.1rem] font-semibold text-slate-900 block">{{ displayAmTag }}</span>
          </div>
          <div>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">Time Out (AM)</span>
            <span class="text-[1.1rem] font-semibold text-slate-900 block mb-2">{{ formatTime(record.timeOutAM) }}</span>
          </div>
          <div>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">Time In (PM)</span>
            <span class="text-[1.1rem] font-semibold text-slate-900 block mb-2">{{ formatTime(record.timeInPM) }}</span>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">PM Tag</span>
            <span class="text-[1.1rem] font-semibold text-slate-900 block">{{ displayPmTag }}</span>
          </div>
          <div>
            <span class="block text-[0.8rem] text-slate-500 mb-0.5">Time Out (PM)</span>
            <span class="text-[1.1rem] font-semibold text-slate-900 block mb-2">{{ formatTime(record.timeOutPM) }}</span>
          </div>
        </div>

        <div class="flex gap-4 mb-5">
          <button class="flex-1 py-3 px-4 rounded-full border-none text-[0.9rem] font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:opacity-100 bg-green-500 text-green-950" :disabled="loading || hasOpenSession" @click="startTimeIn">
            {{ loading && loadingType === 'in' ? 'Saving...' : 'Time In' }}
          </button>
          <button class="flex-1 py-3 px-4 rounded-full border-none text-[0.9rem] font-semibold cursor-pointer transition-opacity hover:opacity-90 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:opacity-100 bg-red-500 text-red-50" :disabled="loading || !hasOpenSession" @click="startTimeOut">
            {{ loading && loadingType === 'out' ? 'Saving...' : 'Time Out' }}
          </button>
        </div>

        <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 mt-6">
          <h2 class="mt-0 mb-2 text-[1.1rem] text-slate-900 font-bold">Location</h2>
          <p v-if="locationAddress" class="text-[0.85rem] text-slate-600 mb-3">{{ locationAddress }}</p>
          <div v-if="hasLocation" class="relative w-full pb-[56.25%] overflow-hidden rounded-xl">
            <div ref="leafletMap" class="absolute top-0 left-0 w-full h-full"></div>
          </div>
          <p v-else class="text-[0.8rem] text-slate-500 mb-5">No location recorded yet. Time in or time out to capture your location.</p>
        </section>
      </section>
    </main>

    <div v-if="showModal" class="fixed inset-0 bg-slate-900/45 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-[0_20px_40px_rgba(15,23,42,0.35)] w-[min(90%,360px)] overflow-hidden">
        <div class="px-4 py-3 text-white" :class="modalType === 'error' ? 'bg-red-500' : 'bg-green-500'">
          <h3 class="m-0 text-[1.1rem] font-semibold">{{ modalTitle }}</h3>
        </div>
        <div class="p-5 text-[0.95rem] text-slate-900">
          <p class="m-0">{{ modalMessage }}</p>
        </div>
        <div class="px-4 pb-4 pt-0 flex justify-end">
          <button class="max-w-[120px] px-5 py-2 rounded-full border-none bg-slate-200 text-slate-900 text-[0.85rem] font-semibold cursor-pointer hover:bg-slate-300" @click="closeModal">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const AUTO_APPROVE_LOCATION = 'M. Roxas Drive, Lalom, Santa Isabel, Calapan, Oriental Mindoro, Mimaropa, Philippines'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow
})

export default {
  name: 'InternTimeView',
  data() {
    return {
      currentDate: '',
      lastActionTime: '',
      clockNow: new Date(),
      clockTimer: null,
      loading: false,
      loadingType: null,
      internId: null,
      record: {},
      userTagging: 'Normal Hours',
      userTodayAmTag: 'Normal Hours',
      userTodayPmTag: 'Normal Hours',
      showNotifications: false,
      notifications: ['Welcome to your time tracker.', 'Remember to time out before leaving.'],
      unreadCount: 0,
      locationAddress: '',
      lastGeocodedLat: null,
      lastGeocodedLng: null,
      showModal: false,
      modalTitle: '',
      modalMessage: '',
      modalType: 'success',
      leafletMap: null,
      leafletMarker: null,
      leafletTileLayer: null
    }
  },
  created() {
    this.clockNow = new Date()

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

    // After we know the internId, fetch today's attendance and user tags so data persists after refresh
    if (this.internId) {
      this.fetchTodayRecord();
      this.fetchUserTags();
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
  mounted() {
    this.startClock()
    this.$nextTick(() => {
      this.ensureLeafletMap()
      this.updateLeafletMapFromRecord()
    })
  },
  beforeUnmount() {
    this.stopClock()
    this.destroyLeafletMap()
  },
  computed: {
    currentLocation() {
      if (!this.record) return null
      const loc = this.record.locationPM || this.record.locationAM
      if (!loc || typeof loc.latitude !== 'number' || typeof loc.longitude !== 'number') {
        return null
      }
      return loc
    },
    hasLocation() {
      return !!this.currentLocation
    },
    hasOpenSession() {
      if (!this.record) return false;
      const hasOpenAM = !!this.record.timeInAM && !this.record.timeOutAM;
      const hasOpenPM = !!this.record.timeInPM && !this.record.timeOutPM;
      return hasOpenAM || hasOpenPM;
    },
    displayAmTag() {
      const rec = this.record || {};
      return (
        (rec.tagAM && rec.tagAM.trim()) ||
        (this.userTodayAmTag && this.userTodayAmTag.trim()) ||
        (this.userTagging && this.userTagging.trim()) ||
        'Normal Hours'
      );
    },
    displayPmTag() {
      const rec = this.record || {};
      return (
        (rec.tagPM && rec.tagPM.trim()) ||
        (this.userTodayPmTag && this.userTodayPmTag.trim()) ||
        (this.userTagging && this.userTagging.trim()) ||
        'Normal Hours'
      );
    },
    todayTagLabel() {
      const rec = this.record || {};
      const tag = (rec.tagAM || rec.tagPM || rec.tagging || '').trim();
      return tag || 'Normal Hours';
    },
    countedMinutesToday() {
      const rec = this.record || {};
      const tag = (rec.tagAM || rec.tagPM || rec.tagging || 'Normal Hours').trim();
      const eightHoursMinutes = 8 * 60;

      const totalMinutesAM = typeof rec.totalMinutesAM === 'number' ? rec.totalMinutesAM : null;
      const totalMinutesPM = typeof rec.totalMinutesPM === 'number' ? rec.totalMinutesPM : null;
      const totalMinutesFallback = typeof rec.totalMinutes === 'number' ? rec.totalMinutes : null;

      let rawTotal = 0;
      if (totalMinutesAM != null || totalMinutesPM != null) {
        rawTotal = (totalMinutesAM || 0) + (totalMinutesPM || 0);
      } else if (totalMinutesFallback != null) {
        rawTotal = totalMinutesFallback;
      }

      let dayMinutes = 0;
      if (tag === 'Overtime') {
        dayMinutes = Math.max(0, rawTotal);
      } else {
        const hasNormalField = typeof rec.normalCountMinutes === 'number';
        const normalIsZero = hasNormalField && rec.normalCountMinutes === 0;

        if (hasNormalField && !(normalIsZero && rawTotal > 0)) {
          dayMinutes = Math.max(0, rec.normalCountMinutes);
        } else {
          dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
        }
      }

      return dayMinutes;
    }
  },
  watch: {
    currentLocation: {
      handler() {
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
      },
      immediate: true
    }
  },
  methods: {
    normalizeLocation(value) {
      if (!value) return ''
      return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
    },
    locationMatchesAutoApprove(address) {
      const normalized = this.normalizeLocation(address)
      const target = this.normalizeLocation(AUTO_APPROVE_LOCATION)
      if (!normalized || !target) return false
      return normalized === target || normalized.includes(target)
    },
    async autoApproveIfEligible({ date, session, record, fallbackAddress }) {
      try {
        if (!this.internId || !date) return
        if (!session || (session !== 'AM' && session !== 'PM')) return
        const address =
          (session === 'AM'
            ? (record && record.locationAM && record.locationAM.address)
            : (record && record.locationPM && record.locationPM.address)) ||
          fallbackAddress ||
          ''

        if (!this.locationMatchesAutoApprove(address)) {
          const docId = `${this.internId}_${date}`
          const ref = doc(db, 'intern_attendance', docId)
          await updateDoc(ref, {
            validationStatus: 'Pending',
            validationUpdatedAt: serverTimestamp(),
          })
          if (this.record) {
            this.record.validationStatus = 'Pending'
          }
          return
        }

        const docId = `${this.internId}_${date}`
        const ref = doc(db, 'intern_attendance', docId)
        await updateDoc(ref, {
          validationStatus: 'Approved',
          validationUpdatedAt: serverTimestamp(),
        })

        if (this.record) {
          this.record.validationStatus = 'Approved'
        }
      } catch (e) {
        console.error('Auto-approve failed:', e)
      }
    },
    ensureLeafletMap() {
      if (this.leafletMap) return
      const el = this.$refs.leafletMap
      if (!el) return

      this.leafletMap = L.map(el, {
        zoomControl: true,
        attributionControl: true
      })

      this.leafletTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      })

      this.leafletTileLayer.addTo(this.leafletMap)
    },
    destroyLeafletMap() {
      if (this.leafletMap) {
        this.leafletMap.remove()
      }
      this.leafletMap = null
      this.leafletMarker = null
      this.leafletTileLayer = null
    },
    updateLeafletMapFromRecord() {
      const loc = this.currentLocation
      if (!loc) return
      if (!this.leafletMap) return

      const latlng = [loc.latitude, loc.longitude]

      if (!this.leafletMarker) {
        this.leafletMarker = L.marker(latlng)
        this.leafletMarker.addTo(this.leafletMap)
      } else {
        this.leafletMarker.setLatLng(latlng)
      }

      const targetZoom = this.leafletMap.getZoom() || 18
      this.leafletMap.setView(latlng, targetZoom < 18 ? 18 : targetZoom)
      this.leafletMap.invalidateSize()
    },
    startClock() {
      this.stopClock()
      this.clockTimer = setInterval(() => {
        this.clockNow = new Date()
      }, 1000)
    },
    stopClock() {
      if (this.clockTimer) {
        clearInterval(this.clockTimer)
        this.clockTimer = null
      }
    },
    formatClockTime(d) {
      if (!d) return '--:--:--'
      const date = d instanceof Date ? d : new Date(d)
      if (Number.isNaN(date.getTime())) return '--:--:--'
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      })
    },
    startTimeIn() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error')
        return
      }
      this.handleTimeIn()
    },
    startTimeOut() {
      if (!this.internId) {
        this.openModal('Error', 'No logged-in intern found. Please login again.', 'error')
        return
      }
      this.handleTimeOut()
    },
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
    async fetchUserTags() {
      try {
        const res = await fetch(`http://localhost:3001/users/${encodeURIComponent(this.internId)}`);
        if (!res.ok) return;
        const data = await res.json();
        const user = data && data.user ? data.user : null;
        if (!user) return;
        if (typeof user.tagging === 'string' && user.tagging.trim()) {
          this.userTagging = user.tagging.trim();
        }
        if (typeof user.todayAmTag === 'string' && user.todayAmTag.trim()) {
          this.userTodayAmTag = user.todayAmTag.trim();
        }
        if (typeof user.todayPmTag === 'string' && user.todayPmTag.trim()) {
          this.userTodayPmTag = user.todayPmTag.trim();
        }
      } catch (e) {
      }
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
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
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
      let reverseGeocodedAddress = '';
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
              reverseGeocodedAddress = data.display_name
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
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })

        await this.autoApproveIfEligible({
          date: payload.date,
          session: payload.session,
          record: payload.record || this.record,
          fallbackAddress: reverseGeocodedAddress || this.locationAddress,
        })

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
        this.$nextTick(() => {
          this.ensureLeafletMap()
          this.updateLeafletMapFromRecord()
        })
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
      const lat = loc.latitude
      const lng = loc.longitude

      const hasStoredAddress = typeof loc.address === 'string' && loc.address.trim() !== ''
      const coordsUnchanged = this.lastGeocodedLat === lat && this.lastGeocodedLng === lng

      if (hasStoredAddress) {
        this.locationAddress = loc.address
      }

      if (coordsUnchanged && this.locationAddress) {
        return
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
        if (!res.ok) return
        const data = await res.json()
        if (data && data.display_name) {
          this.locationAddress = data.display_name
          this.lastGeocodedLat = lat
          this.lastGeocodedLng = lng

          if (this.record.locationPM) {
            this.record.locationPM.address = data.display_name
          } else if (this.record.locationAM) {
            this.record.locationAM.address = data.display_name
          }
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


