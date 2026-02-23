<template>
  <div class="intern-layout">
    <header class="intern-header">
      <h1>Intern Profile</h1>
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

    <main class="profile-main">
      <section class="card avatar-card">
        <div class="avatar-wrapper">
          <div class="avatar" v-if="intern.photoUrl">
            <img :src="intern.photoUrl" alt="Profile picture" />
          </div>
          <div class="avatar placeholder" v-else>
            <span>{{ avatarInitials }}</span>
          </div>
        </div>
        <div class="avatar-actions">
          <label class="avatar-upload-btn">
            <span>{{ uploadingPhoto ? 'Uploading...' : 'Upload Profile Picture' }}</span>
            <input type="file" accept="image/*" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
          </label>
          <p v-if="photoError" class="note error-note">{{ photoError }}</p>
        </div>
      </section>

      <section class="card info-card">
        <h2>Intern Information</h2>
        <div class="info-grid">
          <div>
            <span class="label">Name</span>
            <span class="value">{{ formattedName }}</span>
          </div>
      
          <div>
            <span class="label">Assigned Office</span>
            <span class="value">{{ intern.assignedOffice || 'N/A' }}</span>
          </div>
        </div>
      </section>

      <section class="card info-card">
        <h2>Edit Information</h2>
        <form class="password-form" @submit.prevent="handleSaveInfo">
          <div class="form-group">
            <label for="editSchool">School</label>
            <input
              id="editSchool"
              type="text"
              v-model="intern.schoolOrUniversity"
            />
          </div>
          <div class="form-group">
            <label for="editRequiredHours">OJT Required Hours</label>
            <input
              id="editRequiredHours"
              type="number"
              min="0"
              v-model.number="intern.ojtRequiredHours"
            />
          </div>
          <div class="form-group">
            <label for="editPhone">Phone Number</label>
            <input
              id="editPhone"
              type="text"
              v-model="intern.phoneNumber"
            />
          </div>
          <div class="form-group">
            <label for="editEmail">Gmail</label>
            <input
              id="editEmail"
              type="email"
              v-model="intern.email"
            />
          </div>
          <button type="submit" class="btn btn-save" :disabled="infoSaving || !intern.id">
            {{ infoSaving ? 'Saving...' : 'Save' }}
          </button>
          <p v-if="infoMessage" class="note">{{ infoMessage }}</p>
          <p v-if="infoError" class="note error-note">{{ infoError }}</p>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase';

export default {
  name: 'InternProfileView',
  data() {
    return {
      intern: {
        id: null,
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        schoolOrUniversity: '',
        assignedOffice: '',
        position: '',
        phoneNumber: '',
        email: '',
        role: '',
        photoUrl: '',
        ojtRequiredHours: null,
      },
      notifications: [],
      unreadCount: 0,
      showNotifications: false,
      loading: true,
      error: null,
      uploadingPhoto: false,
      photoError: null,
      infoSaving: false,
      infoMessage: null,
      infoError: null,
    };
  },
  computed: {
    formattedName() {
      const { firstName, middleName, lastName } = this.intern;
      if (!firstName && !lastName) return 'N/A';

      const middleInitial = middleName ? `${middleName.charAt(0)}. ` : '';
      return `${firstName} ${middleInitial}${lastName}`.trim();
    },
    avatarInitials() {
      const first = this.intern.firstName ? this.intern.firstName.charAt(0).toUpperCase() : '';
      const last = this.intern.lastName ? this.intern.lastName.charAt(0).toUpperCase() : '';
      const combined = `${first}${last}`;
      return combined || '?';
    },
  },
  created() {
    this.loadInternProfile();
    // Load notifications for header bell
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
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
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
          this.error = 'No logged-in intern found.';
          this.loading = false;
          return;
        }

        const basic = JSON.parse(stored);
        this.intern = {
          ...this.intern,
          ...basic,
          id: basic.id,
        };

        if (!basic.id) {
          this.loading = false;
          return;
        }

        const response = await fetch(`http://localhost:3001/users/${basic.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch full user profile');
        }

        const data = await response.json();
        if (data && data.user) {
          this.intern = {
            ...this.intern,
            ...data.user,
          };
        }
      } catch (err) {
        console.error('Error loading intern profile:', err);
        this.error = 'Failed to load intern information.';
      } finally {
        this.loading = false;
      }
    },
    async handleSaveInfo() {
      try {
        this.infoError = null;
        this.infoMessage = null;

        if (!this.intern.id) {
          this.infoError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        this.infoSaving = true;
        // Keep a copy of previous values to detect which fields changed
        const prevSchool = this.intern.schoolOrUniversity || '';
        const prevPhone = this.intern.phoneNumber || '';
        const prevEmail = this.intern.email || '';
        const prevRequiredHours = Number(this.intern.ojtRequiredHours) || 0;
        const response = await fetch(`http://localhost:3001/users/${this.intern.id}/info`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            schoolOrUniversity: this.intern.schoolOrUniversity || '',
            phoneNumber: this.intern.phoneNumber || '',
            email: this.intern.email || '',
            ojtRequiredHours: Number(this.intern.ojtRequiredHours) || null,
          }),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          const message = data && data.message ? data.message : 'Failed to update information.';
          throw new Error(message);
        }

        if (data && data.user) {
          this.intern = {
            ...this.intern,
            ...data.user,
          };

          const stored = localStorage.getItem('internUser');
          if (stored) {
            const basic = JSON.parse(stored);
            localStorage.setItem('internUser', JSON.stringify({ ...basic, ...data.user }));
          }
        }

        this.infoMessage = 'Information updated successfully.';
        // Add more specific notifications for each changed field
        const newSchool = this.intern.schoolOrUniversity || '';
        const newPhone = this.intern.phoneNumber || '';
        const newEmail = this.intern.email || '';
        const newRequiredHours = Number(this.intern.ojtRequiredHours) || 0;
        if (newSchool !== prevSchool) {
          this.addLocalNotification('Your school information was updated.');
        }
        if (newPhone !== prevPhone) {
          this.addLocalNotification('Your phone number was updated.');
        }
        if (newEmail !== prevEmail) {
          this.addLocalNotification('Your email information was updated.');
        }
        if (newRequiredHours !== prevRequiredHours) {
          this.addLocalNotification('Your OJT required hours were updated.');
        }
      } catch (err) {
        console.error('Error updating intern info:', err);
        this.infoError = err && err.message ? err.message : 'Failed to update information.';
      } finally {
        this.infoSaving = false;
      }
    },
    async onPhotoSelected(event) {
      try {
        this.photoError = null;
        const file = event.target.files && event.target.files[0];
        if (!file) {
          return;
        }
        if (!this.intern.id) {
          this.photoError = 'Walang intern ID. Subukan mag-login ulit.';
          return;
        }

        this.uploadingPhoto = true;
        const fileRef = storageRef(storage, `profilePhotos/${this.intern.id}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const userDocRef = doc(db, 'users', this.intern.id);
        await updateDoc(userDocRef, { photoUrl: url });

        this.intern.photoUrl = url;

        const stored = localStorage.getItem('internUser');
        if (stored) {
          const basic = JSON.parse(stored);
          localStorage.setItem('internUser', JSON.stringify({ ...basic, photoUrl: url }));
        }
      } catch (err) {
        console.error('Error uploading profile photo:', err);
        this.photoError = 'Failed to upload profile picture.';
      } finally {
        this.uploadingPhoto = false;
        if (event && event.target) {
          event.target.value = '';
        }
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

.profile-main {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.avatar-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 999px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #374151;
  font-size: 1.8rem;
  font-weight: 600;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar.placeholder span {
  line-height: 1;
}

.avatar-actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.avatar-upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: #4b5563;
  color: #e5e7eb;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-upload-btn input[type='file'] {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.avatar-upload-btn[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

.card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  padding: 1.5rem;
}

.info-card h2,
.password-card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.label {
  display: block;
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 0.2rem;
}

.value {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
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
  cursor: not-allowed;
}

.note {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.error-note {
  color: #b91c1c;
}

@media (max-width: 700px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
