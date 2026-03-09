<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">Intern Profile</h1>
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

    <main class="max-w-[900px] mx-auto my-8 px-4 pb-12">
      <form class="flex flex-col gap-6" @submit.prevent="handleSaveInfo">
        
        <!-- 1️⃣ Basic Information -->
        <section class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div class="mb-6 pb-4 border-b border-slate-100">
            <h2 class="m-0 text-[1.25rem] text-slate-900 font-bold">1️⃣ Basic Information</h2>
            <p class="mt-1 mb-0 text-[0.85rem] text-slate-500">Standard details of the intern.</p>
          </div>
          
          <div class="flex items-center gap-6 mb-8 p-4 bg-slate-50 rounded-xl">
            <div class="flex items-center justify-center">
              <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-slate-200 text-slate-700 text-[1.7rem] font-semibold border-4 border-white shadow-sm" v-if="intern.photoUrl">
                <img :src="intern.photoUrl" alt="Profile picture" class="w-full h-full object-cover" />
              </div>
              <div class="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center bg-slate-200 text-slate-700 text-[1.7rem] font-semibold border-4 border-white shadow-sm" v-else>
                <span>{{ avatarInitials }}</span>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <label class="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-100 text-slate-900 border border-slate-300 text-[0.85rem] font-semibold cursor-pointer relative overflow-hidden transition-colors hover:bg-slate-200 [&[disabled]]:opacity-60 [&[disabled]]:cursor-not-allowed">
                <span>{{ uploadingPhoto ? 'Uploading...' : 'Upload Profile Picture' }}</span>
                <input type="file" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" @change="onPhotoSelected" :disabled="uploadingPhoto || !intern.id" />
              </label>
              <p v-if="photoError" class="m-0 text-[0.85rem] text-red-500 font-medium">{{ photoError }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex flex-col gap-2">
              <label class="text-[0.85rem] font-semibold text-slate-700">Full Name (Read Only)</label>
              <input type="text" :value="formattedName" disabled class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
            <div class="flex flex-col gap-2">
              <label class="text-[0.85rem] font-semibold text-slate-700">Student ID / Intern ID</label>
              <input type="text" :value="intern.username" disabled class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] bg-slate-50 text-slate-500 cursor-not-allowed" title="Your username acts as your Intern ID" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="editEmail" class="text-[0.85rem] font-semibold text-slate-700">Email Address</label>
              <input id="editEmail" type="email" v-model="intern.email" placeholder="example@gmail.com" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="editPhone" class="text-[0.85rem] font-semibold text-slate-700">Contact Number</label>
              <input id="editPhone" type="text" v-model="intern.phoneNumber" placeholder="09XX XXX XXXX" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <label for="editAddress" class="text-[0.85rem] font-semibold text-slate-700">Address</label>
              <input id="editAddress" type="text" v-model="intern.address" placeholder="Full Home Address" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="editGender" class="text-[0.85rem] font-semibold text-slate-700">Gender</label>
              <select id="editGender" v-model="intern.gender" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400">
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label for="editDob" class="text-[0.85rem] font-semibold text-slate-700">Date of Birth</label>
              <input id="editDob" type="date" v-model="intern.dateOfBirth" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
          </div>
        </section>

        <!-- 2️⃣ School Information -->
        <section class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div class="mb-6 pb-4 border-b border-slate-100">
            <h2 class="m-0 text-[1.25rem] text-slate-900 font-bold">2️⃣ School Information</h2>
            <p class="mt-1 mb-0 text-[0.85rem] text-slate-500">Educational background and internship duration.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div class="flex flex-col gap-2 md:col-span-2">
              <label for="editSchool" class="text-[0.85rem] font-semibold text-slate-700">School Name</label>
              <input id="editSchool" type="text" v-model="intern.schoolOrUniversity" placeholder="E.g., University of the Philippines" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="editCourse" class="text-[0.85rem] font-semibold text-slate-700">Course / Program</label>
              <input id="editCourse" type="text" v-model="intern.course" placeholder="E.g., BS Information Technology" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="editYear" class="text-[0.85rem] font-semibold text-slate-700">Year Level</label>
              <select id="editYear" v-model="intern.yearLevel" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400">
                <option value="" disabled>Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="5th Year">5th Year</option>
              </select>
            </div>
            <div class="flex flex-col gap-2">
              <label for="editRequiredHours" class="text-[0.85rem] font-semibold text-slate-700">OJT Required Hours</label>
              <input id="editRequiredHours" type="number" min="0" v-model.number="intern.ojtRequiredHours" placeholder="e.g. 486" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="editStartDate" class="text-[0.85rem] font-semibold text-slate-700">Start Date of Internship</label>
              <input id="editStartDate" type="date" v-model="intern.startDate" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
            <div class="flex flex-col gap-2 md:col-span-2">
              <label for="editEndDate" class="text-[0.85rem] font-semibold text-slate-700">End Date of Internship</label>
              <input id="editEndDate" type="date" v-model="intern.endDate" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-[0.9rem] text-slate-900 bg-white transition-colors focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder:text-slate-400" />
            </div>
          </div>
        </section>


        <!-- Actions -->
        <div class="flex flex-col md:flex-row items-stretch md:items-center justify-end gap-4 mt-4">
          <p v-if="infoMessage" class="m-0 text-[0.85rem] font-semibold px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg">{{ infoMessage }}</p>
          <p v-if="infoError" class="m-0 text-[0.85rem] text-red-500 font-medium">{{ infoError }}</p>
          <button type="submit" class="w-full md:w-auto px-8 py-3 rounded-lg border-none bg-orange-500 text-white text-[1rem] font-semibold cursor-pointer shadow-[0_4px_6px_-1px_rgba(249,115,22,0.2)] transition-all hover:bg-orange-600 hover:-translate-y-[1px] disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none" :disabled="infoSaving || !intern.id">
            <span v-if="infoSaving">Saving Profile...</span>
            <span v-else>Save Profile</span>
          </button>
        </div>

      </form>
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
        // Added Profile Fields
        address: '',
        gender: '',
        dateOfBirth: '',
        course: '',
        yearLevel: '',
        startDate: '',
        endDate: '',
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
            address: this.intern.address || '',
            gender: this.intern.gender || '',
            dateOfBirth: this.intern.dateOfBirth || '',
            course: this.intern.course || '',
            yearLevel: this.intern.yearLevel || '',
            startDate: this.intern.startDate || '',
            endDate: this.intern.endDate || '',
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

        this.infoMessage = 'Profile updated successfully!';
        this.addLocalNotification('Your comprehensive profile information was updated.');
        
        setTimeout(() => {
          this.infoMessage = null;
        }, 4000);
        
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


