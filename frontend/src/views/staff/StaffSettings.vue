<template>
  <div class="flex h-screen bg-[#f5f5f5] font-sans antialiased text-gray-900">
    <!-- Sidebar -->
    <StaffSidebar activeNav="settings" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0 bg-white">
      
      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto px-4 py-8 sm:px-8 pb-32 md:pb-8">
        <div class="max-w-full mx-auto space-y-6 pb-20">
          <SettingsSkeleton v-if="loading" />
          <template v-else>
            <!-- Back Button -->
            <div class="flex items-center mb-1">
              <button 
                @click="navigateTo('StaffDashboard', 'dashboard')" 
                class="p-2 -mt-4 rounded-full hover:bg-gray-100 transition-all active:scale-95 group"
                title="Back to Dashboard"
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='24' viewBox='0 0 12 24'%3E%3Cpath fill='%23000' fill-rule='evenodd' d='m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z'/%3E%3C/svg%3E" class="w-3 h-6 opacity-60 group-hover:opacity-100 transition-opacity" alt="Back" />
              </button>
            </div>

            <!-- Avatar Header Section -->
            <div class="flex flex-col items-center justify-center pb-4">
            <div class="relative mb-3">
              <div class="w-24 h-24 rounded-full text-white flex items-center justify-center text-3xl font-bold  overflow-hidden ring-2 ring-white ring-offset-2 ring-offset-blue-50">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                <span v-else>{{ userInitials || 'U' }}</span>
              </div>
            </div>
            <h2 class="text-xl font-bold text-gray-900">{{ userDisplayName || 'User Name' }}</h2>
            <p class="text-xs text-gray-500 capitalize">{{ userRole || 'user' }}</p>
          </div>

          <!-- Tabs -->
          <div class="flex justify-center gap-8 border-b border-gray-100">
            <button @click="activeTab = 'profile'" :class="['pb-3 px-4 text-sm font-semibold transition-colors', activeTab === 'profile' ? 'text-[#eebb3b] border-b-2 border-[#eebb3b] rounded-t-lg' : 'text-gray-500 hover:text-gray-900']">Profile Info</button>
            <button @click="activeTab = 'security'" :class="['pb-3 px-4 text-sm font-semibold transition-colors', activeTab === 'security' ? 'text-[#eebb3b] border-b-2 border-[#eebb3b]  rounded-t-lg' : 'text-gray-500 hover:text-gray-900']">Security</button>
          </div>
          
          <div class="space-y-6">
            <div v-if="activeTab === 'profile'" class="space-y-6">
              <!-- Personal Information -->
              <section class="bg-white p-6 rounded-xl  border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-5">
                  Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">First Name</label>
                    <input type="text" v-model="form.firstName" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Last Name</label>
                    <input type="text" v-model="form.lastName" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Username</label>
                    <input type="text" v-model="form.username" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Date of Birth</label>
                    <input type="date" v-model="form.dateOfBirth" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all text-gray-500">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Age</label>
                    <input type="number" v-model="form.age" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div class="relative" ref="genderDropdownRef">
                    <label class="block text-[11px] text-gray-500 mb-1">Gender</label>
                    <button 
                      type="button"
                      @click="isGenderDropdownOpen = !isGenderDropdownOpen"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all bg-white flex items-center justify-between"
                    >
                      <span :class="form.gender ? 'text-gray-900' : 'text-gray-400'">{{ form.gender || 'Select Gender' }}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :class="['transition-transform duration-200', isGenderDropdownOpen ? 'rotate-180' : '']">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <div v-if="isGenderDropdownOpen" class="absolute top-full left-0 z-[120] w-full mt-1 bg-white border border-gray-200 rounded-xl  max-h-48 overflow-y-auto shadow-lg">
                        <div class="py-1">
                          <button 
                            v-for="g in ['Male', 'Female', 'Other']" 
                            :key="g"
                            type="button" 
                            @click="form.gender = g; isGenderDropdownOpen = false" 
                            class="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors duration-150 text-xs font-semibold"
                            :class="form.gender === g ? 'bg-blue-50 text-blue-600' : 'text-gray-900'"
                          >
                            {{ g }}
                          </button>
                        </div>
                      </div>
                    </transition>
                  </div>
                </div>
              </section>

              <!-- Contact Information -->
              <section class="bg-white p-6 rounded-xl  border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-5">
                  Contact Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Email</label>
                    <input type="email" v-model="form.email" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 outline-none" disabled>
                  </div>
                  <div class="flex items-end gap-2">
                    <div class="flex-1">
                      <label class="block text-xs text-gray-500 mb-1">Phone</label>
                      <input type="tel" v-model="form.phone" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                    </div>
                    <button class="px-4 py-2 bg-[#eebb3b] text-white text-xs font-medium rounded-lg transition-colors  h-[38px]">Change</button>
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Alternative Email</label>
                    <input type="email" v-model="form.alternativeEmail" placeholder="Enter alternative email" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Position</label>
                    <input type="text" v-model="form.position" placeholder="Enter position" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                </div>
              </section>

              <!-- Address -->
              <section class="bg-white p-6 rounded-xl  border border-gray-100">
                <h3 class="text-lg font-semibold text-gray-700 flex items-center gap-2 mb-5">
                  Address
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-xs text-gray-500 mb-1">Street Address</label>
                    <input type="text" v-model="form.address.streetAddress" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">City</label>
                    <input type="text" v-model="form.address.city" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Province</label>
                    <input type="text" v-model="form.address.province" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Postal Code</label>
                    <input type="text" v-model="form.address.postalCode" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 mb-1">Country</label>
                    <input type="text" v-model="form.address.country" class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none transition-all">
                  </div>
                </div>
              </section>
            </div>

            <!-- Security Tab Content -->
            <div v-if="activeTab === 'security'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Change Profile Card -->
              <section class="bg-white p-6 rounded-xl border border-gray-100 flex flex-col items-center">
                <div class="w-full flex items-center gap-3 mb-6">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">Change Profile</h3>
                    <p class="text-xs text-gray-500">Change your profile picture from here</p>
                  </div>
                </div>

                <div class="flex flex-col items-center justify-center py-6 flex-1">
                  <div class="w-32 h-32 rounded-full text-white flex items-center justify-center text-5xl font-bold shadow-sm overflow-hidden mb-6">
                    <img v-if="userPhotoUrl && !uploadingPhoto" :src="userPhotoUrl" class="w-full h-full object-cover" alt="Profile" />
                    <span v-else-if="!uploadingPhoto">{{ userInitials || 'U' }}</span>
                    <svg v-else class="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  </div>
                  <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handlePhotoUpload" />

                  <div class="flex gap-3 mb-4">
                    <button @click="triggerFileInput" :disabled="uploadingPhoto" class="px-5 py-2 bg-[#eebb3b] text-white text-xs font-semibold rounded-full  flex items-center gap-2 transition-colors disabled:opacity-70">
                      Upload
                    </button>
                    <button @click="resetPhoto" :disabled="uploadingPhoto || !userPhotoUrl" class="px-5 py-2 bg-white  text-[#b92e2b] border border-[#b92e2b] text-xs font-semibold rounded-full flex items-center gap-2 transition-colors disabled:opacity-50">
                      Reset
                    </button>
                  </div>
                  <p class="text-[10px] text-gray-500">Allowed JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </section>

              <!-- Change Password Card -->
              <section class="bg-white p-6 rounded-xl  border border-gray-100 flex flex-col">
                <div class="w-full flex items-center gap-3 mb-6">
                  <div>
                    <h3 class="text-lg font-bold text-gray-900">Change Password</h3>
                    <p class="text-xs text-gray-500">Your password must meet the requirements below</p>
                  </div>
                </div>

                <div class="space-y-4 flex-1">
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">Current Password</label>
                    <div class="relative">
                      <input :type="showCurrentPassword ? 'text' : 'password'" v-model="passwordForm.current" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <button @click="showCurrentPassword = !showCurrentPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg v-if="showCurrentPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">New Password</label>
                    <div class="relative">
                      <input :type="showNewPassword ? 'text' : 'password'" v-model="passwordForm.new" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <button @click="showNewPassword = !showNewPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg v-if="showNewPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs text-gray-500 mb-1.5">Confirm Password</label>
                    <div class="relative mb-6">
                      <input :type="showConfirmPassword ? 'text' : 'password'" v-model="passwordForm.confirm" class="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all">
                      <button @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg v-if="showConfirmPassword" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      </button>
                    </div>
                  </div>
                  
                  <button @click="updatePassword" :disabled="updatingPassword" class="w-full py-2.5 bg-[#133e75] text-white text-sm font-semibold rounded-lg  transition-colors mt-auto disabled:opacity-70 flex justify-center items-center h-[42px]">
                    <svg v-if="updatingPassword" class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span v-else>Update Password</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
          </template>
        </div>

        <!-- Fixed Bottom Action Bar -->
        <div class="fixed bottom-[96px] md:bottom-0 right-0 left-0 md:left-[260px] bg-white border-t border-gray-200 p-4 flex justify-end gap-3 z-50 opacity-95 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:shadow-none">
          <button @click="navigateTo('StaffDashboard', 'dashboard')" class="px-5 py-2 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">Close</button>
          <button @click="saveChanges" :disabled="saving" class="px-5 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2 min-w-[120px]">
             <svg v-if="saving" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
             <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
  </div>

  <!-- Success/Error Modal -->
  <transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all animate-in fade-in zoom-in-95 duration-300">
        <!-- Success Icon -->
        <div v-if="modalType === 'success'" class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <!-- Error Icon -->
        <div v-else class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 mb-2">{{ modalTitle }}</h3>
        <p class="text-sm text-gray-500 mb-6 px-2">{{ modalMessage }}</p>
        
        <button @click="showModal = false" class="w-full inline-flex justify-center items-center rounded-xl px-4 py-3 bg-[#133e75] text-sm font-semibold text-white hover:bg-[#133e75]/90 focus:outline-none transition-colors shadow-lg active:scale-[0.98]">
          {{ modalType === 'success' ? 'Continue' : 'Try Again' }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import StaffSidebar from './StaffSidebar.vue'
import SettingsSkeleton from '../../components/skeletons/SettingsSkeleton.vue'
import { useRouter } from 'vue-router'
import { db, storage } from '../../firebase.js'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const router = useRouter()
const activeNav = ref('settings')
const activeTab = ref('profile') // New state for tabs

const userProfile = ref(null)
const loading = ref(true)
const saving = ref(false)

const fileInput = ref(null)
const uploadingPhoto = ref(false)
const updatingPassword = ref(false)

const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isGenderDropdownOpen = ref(false)
const genderDropdownRef = ref(null)

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

// Modal State
const showModal = ref(false)
const modalType = ref('success')
const modalTitle = ref('')
const modalMessage = ref('')

const showCustomModal = (type, title, message) => {
  modalType.value = type
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = true
}

const form = ref({
  firstName: '',
  lastName: '',
  username: '',
  dateOfBirth: '',
  age: '',
  gender: '',
  email: '',
  phone: '',
  alternativeEmail: '',
  position: '',
  address: {
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    country: ''
  }
})

const userDisplayName = computed(() => {
  if (!userProfile.value) return ''
  const { firstName, lastName, name, fullName, displayName, username } = userProfile.value
  if (firstName || lastName) {
    return `${firstName || ''} ${lastName || ''}`.trim()
  }
  return name || fullName || displayName || username || ''
})

const userEmail = computed(() => {
  if (!userProfile.value) return ''
  return userProfile.value.email || userProfile.value.emailAddress || userProfile.value.username || ''
})

const userRole = computed(() => {
  if (!userProfile.value) return 'user'
  return userProfile.value.role || 'user'
})

const userPhotoUrl = computed(() => {
  return userProfile.value?.photoUrl || userProfile.value?.photoURL || userProfile.value?.avatarUrl || userProfile.value?.profilePicture || userProfile.value?.profileImage || ''
})

const triggerFileInput = () => {
  if (!uploadingPhoto.value && fileInput.value) {
    fileInput.value.click()
  }
}

const handlePhotoUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  const id = getCurrentUserId()
  if (!id) return

  try {
    uploadingPhoto.value = true
    
    // Create a reference to the file in Firebase Storage profilePhotos folder
    const photoRef = storageRef(storage, `profilePhotos/${id}_${Date.now()}_${file.name}`)
    
    // Upload the file
    await uploadBytes(photoRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(photoRef)
    
    // Update Firestore document with new URL
    const userDocRef = doc(db, 'users', String(id))
    await updateDoc(userDocRef, {
      photoUrl: downloadURL
    })
    
    // Update local state to reflect the change immediately
    if (userProfile.value) {
      userProfile.value.photoUrl = downloadURL
    }
    
    showCustomModal('success', 'Update Successful', 'Profile picture updated successfully!')
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    showCustomModal('error', 'Update Failed', 'Failed to upload profile picture. Please try again.')
  } finally {
    uploadingPhoto.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const resetPhoto = async () => {
  const id = getCurrentUserId()
  if (!id) return
  
  try {
    uploadingPhoto.value = true
    
    // Update Firestore document to remove photo URL
    const userDocRef = doc(db, 'users', String(id))
    await updateDoc(userDocRef, {
      photoUrl: '' // or null based on your preference
    })
    
    // Update local state
    if (userProfile.value) {
      userProfile.value.photoUrl = ''
    }
    showCustomModal('success', 'Photo Reset', 'Profile picture has been reset.')
  } catch (error) {
    console.error('Error resetting profile picture:', error)
    showCustomModal('error', 'Reset Failed', 'Failed to reset profile picture. Please try again.')
  } finally {
    uploadingPhoto.value = false
  }
}

const updatePassword = async () => {
  if (!passwordForm.value.current || !passwordForm.value.new || !passwordForm.value.confirm) {
    showCustomModal('error', 'Incomplete Fields', 'Please fill in all password fields.')
    return
  }
  
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    showCustomModal('error', 'Mismatch', 'New password and confirm password do not match.')
    return
  }

  const id = getCurrentUserId()
  if (!id) {
    showCustomModal('error', 'Error', 'Unable to identify user ID.')
    return
  }

  try {
    updatingPassword.value = true
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/users/${id}/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.new,
      }),
    })

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to update password');
    }
    
    showCustomModal('success', 'Password Updated', 'Your password has been changed successfully!')
    
    passwordForm.value.current = ''
    passwordForm.value.new = ''
    passwordForm.value.confirm = ''
  } catch (error) {
    console.error('Error updating password:', error)
    showCustomModal('error', 'Update Failed', error.message || 'Failed to update password. Please check your connection and try again.')
  } finally {
    updatingPassword.value = false
  }
}

const userInitials = computed(() => {
  const name = userDisplayName.value || userEmail.value
  if (!name) return ''
  const parts = String(name).trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase()
  return (parts[0].slice(0, 1) + parts[parts.length - 1].slice(0, 1)).toUpperCase()
})

const resolveStaffLocal = () => {
  const keys = ['user', 'staffUser']
  for (const k of keys) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw)
      const resolved = parsed?.user ? parsed.user : parsed
      if (resolved) return resolved
    } catch {
      // ignore
    }
  }
  return null
}

const getCurrentUserId = () => {
  const staffLocal = resolveStaffLocal()
  return staffLocal?.uid || staffLocal?.id || staffLocal?.staffId || staffLocal?._id || null
}

const fetchUserProfile = async () => {
  loading.value = true
  const id = getCurrentUserId()
  if (!id) {
    userProfile.value = null
    loading.value = false
    return
  }
  try {
    const snap = await getDoc(doc(db, 'users', String(id)))
    if (snap.exists()) {
      const data = snap.data()
      userProfile.value = { id: snap.id, ...data }
      
      form.value = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        username: data.username || '',
        dateOfBirth: data.dateOfBirth || '',
        age: data.age || '',
        gender: data.gender || '',
        email: data.email || data.emailAddress || '',
        phone: data.phone || data.contactNumber || '',
        alternativeEmail: data.alternativeEmail || '',
        position: data.position || '',
        address: {
          streetAddress: data.address?.streetAddress || data.streetAddress || '',
          city: data.address?.city || data.city || '',
          province: data.address?.province || data.province || '',
          postalCode: data.address?.postalCode || data.postalCode || '',
          country: data.address?.country || data.country || ''
        }
      }
    } else {
      userProfile.value = null
    }
  } catch (e) {
    console.error('Failed to load user profile from Firestore users collection:', e)
    userProfile.value = null
  } finally {
    loading.value = false
  }
}

const saveChanges = async () => {
  saving.value = true
  try {
    const id = getCurrentUserId()
    if (!id) throw new Error('No user ID found')
    
    const userRef = doc(db, 'users', String(id))
    
    const updateData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      username: form.value.username,
      dateOfBirth: form.value.dateOfBirth,
      age: form.value.age,
      gender: form.value.gender,
      phone: form.value.phone,
      alternativeEmail: form.value.alternativeEmail,
      position: form.value.position,
      address: {
        streetAddress: form.value.address.streetAddress,
        city: form.value.address.city,
        province: form.value.address.province,
        postalCode: form.value.address.postalCode,
        country: form.value.address.country
      }
    }
    
    await updateDoc(userRef, updateData)
    await fetchUserProfile()
    showCustomModal('success', 'Changes Saved', 'Your profile information has been updated.')
  } catch (error) {
    console.error('Error saving profile changes:', error)
    showCustomModal('error', 'Save Failed', 'Failed to save changes. Please try again.')
  } finally {
    saving.value = false
  }
}

const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

const onDocumentClick = (e) => {
  if (isGenderDropdownOpen.value && genderDropdownRef.value) {
    if (!genderDropdownRef.value.contains(e.target)) {
      isGenderDropdownOpen.value = false
    }
  }
}

onMounted(() => {
  fetchUserProfile()
  document.addEventListener('click', onDocumentClick)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>
