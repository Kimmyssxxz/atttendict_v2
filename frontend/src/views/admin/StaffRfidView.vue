<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50 font-sans">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white text-gray-900">
        <h1 class="m-0 text-3xl font-semibold">Staff RFID Registration</h1>
      </header>

      <main class="flex-1 px-4 sm:px-8 py-6">
        <section class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden">
          <div class="mb-6">
            <h2 class="m-0 text-2xl font-semibold">Manage Staff RFID</h2>
            <p class="text-gray-500">
              Register or update RFID tags for all staff members in the system.
            </p>
          </div>

          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex-1 relative min-w-[300px]">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                </svg>
              </span>
              <input
                v-model="search"
                type="text"
                class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-[0.95rem] focus:outline-none  focus:ring-blue-500/20  transition-all"
                placeholder="Search staff by name, username, or email..."
              />
            </div>
          </div>

          <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-gray-500">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <span>Loading staff members...</span>
          </div>
          <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
            {{ error }}
          </div>
          <div v-else>
            <div class="overflow-x-auto rounded-xl border border-gray-200">
              <table class="w-full border-collapse text-left text-sm" v-if="filteredStaff.length">
                <thead class="bg-gray-50/80 backdrop-blur-sm border-b border-gray-200">
                  <tr>
                    <th class="px-6 py-4 font-semibold text-gray-700">No</th>
                    <th class="px-6 py-4 font-semibold text-gray-700">Full Name</th>
                    <th class="px-6 py-4 font-semibold text-gray-700">Username</th>
                    <th class="px-6 py-4 font-semibold text-gray-700">Email</th>
                    <th class="px-6 py-4 font-semibold text-gray-700">Position</th>
                    <th class="px-6 py-4 font-semibold text-gray-700">RFID Tag</th>
                    <th class="px-6 py-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(staff, index) in paginatedStaff" :key="staff.id" class="hover:bg-gray-50/50 transition-colors">
                    <td class="px-6 py-4 font-medium text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                    <td class="px-6 py-4 font-semibold text-gray-700">{{ formatName(staff) }}</td>
                    <td class="px-6 py-4 text-gray-600 font-medium">{{ staff.username || '-' }}</td>
                    <td class="px-6 py-4 text-gray-600 font-medium">{{ staff.email || '-' }}</td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {{ staff.position || 'Staff' }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div v-if="staff.rfid" class="flex items-center gap-2">
                        <span class="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-semibold  border border-blue-100">{{ staff.rfid }}</span>
                      </div>
                      <span v-else class="text-gray-400 italic text-xs">No RFID registered</span>
                    </td>
                    <td class="px-6 py-4">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 bg-white text-gray-700 cursor-pointer transition-all hover:bg-[#133e75] hover:text-white hover:border-[#133e75] active:scale-95"
                        @click="openRFIDModal(staff)"
                      >
                        <span class="nav-icon icon-register-rfid"></span>
                        Register RFID
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4" v-if="filteredStaff.length">
              <div class="text-[0.85rem] text-gray-500">
                Showing <span class="font-bold text-gray-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to <span class="font-bold text-gray-900">{{ Math.min(currentPage * itemsPerPage, filteredStaff.length) }}</span> of <span class="font-bold text-gray-900">{{ filteredStaff.length }}</span> staff members
              </div>
              <div class="flex items-center gap-2">
                <button 
                  class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium disabled:opacity-50 cursor-pointer transition-all hover:bg-gray-50 active:scale-95"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >Previous</button>
                <div class="flex items-center gap-1">
                   <button 
                    v-for="page in totalPages" 
                    :key="page"
                    @click="currentPage = page"
                    class="w-10 h-10 rounded-xl text-xs font-semibold transition-all border border-transparent"
                    :class="currentPage === page ? 'bg-[#133e75] text-white shadow-md' : 'text-gray-600 hover:bg-gray-100 hover:border-gray-200'"
                  >
                    {{ page }}
                  </button>
                </div>
                <button 
                  class="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium disabled:opacity-50 cursor-pointer transition-all hover:bg-gray-50 active:scale-95"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >Next</button>
              </div>
            </div>

            <div v-else class="flex flex-col items-center justify-center py-20 text-center">
              <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-3xl mb-4 grayscale opacity-50">👤</div>
              <h3 class="text-lg font-bold text-gray-800">No staff members found</h3>
              <p class="text-gray-500 max-w-xs mt-1">We couldn't find any staff members matching your search criteria.</p>
              <button @click="search = ''" class="mt-4 text-blue-600 font-bold hover:underline">Clear search</button>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- RFID Modal -->
    <Transition name="modal">
      <div v-if="showRFIDModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4" @click.self="closeRFIDModal">
        <div class="bg-white rounded-[24px] p-0 w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
          <div class="bg-white px-8 py-6   relative">
            <h3 class="m-0 text-2xl font-semibold">Register Staff RFID</h3>
            <p class="  text-gray-500 ">Assign a unique RFID tag sequence</p>
            <button @click="closeRFIDModal" class="absolute top-6 right-6 text-white/80 hover:text-white transition-all text-2xl leading-none">&times;</button>
          </div>
          
          <div class="p-8">
            <form @submit.prevent="handleSaveRFID" class="flex flex-col gap-6">
              <div class="flex flex-col gap-1.5">
                <label class="font-medium text-sm text-gray-500 pl-1">Staff Member</label>
                <div class="px-4 py-3 rounded-xl bg-gray-50/80 text-gray-900 font-bold flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs tracking-tighter">{{ formatInitials(selectedStaff) }}</div>
                  {{ formatName(selectedStaff) }}
                </div>
              </div>

              <div class="flex flex-col gap-1.5">
                <label class="font-medium text-sm text-gray-500 pl-1">RFID Sequence (UID)</label>
                <div class="relative group">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <span class="nav-icon icon-register-rfid w-5 h-5"></span>
                  </span>
                  <input
                    v-model="rfidInput"
                    ref="rfidInputField"
                    type="text"
                    required
                    autofocus
                    class="w-full pl-12 pr-24 py-3.5 rounded-2xl border-1 border-gray-100 text-lg font-mono focus:outline-none focus:border-blue-600 focus:bg-white transition-all placeholder:text-gray-300"
                    placeholder="Place card on reader..."
                  />
                  <button 
                    type="button"
                    @click="fetchLastScanned"
                    class="absolute inset-y-2 right-2 px-3 rounded-xl bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    Sync Scan
                  </button>
                </div>
                <p class="text-[0.7rem] text-gray-400 pl-1">Automatic: Tap card while this is open. Manual: Click Sync Scan.</p>
              </div>

              <div class="flex justify-end gap-3 mt-4">
                <button 
                  type="button" 
                  class="flex-1 px-5 py-3.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-50  transition-all hover:bg-gray-100 active:scale-95" 
                  @click="closeRFIDModal" 
                  :disabled="saving"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  class="flex-[2] px-5 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#133e75] border-none transition-all hover:bg-[#133e75]/80 active:scale-[0.98] disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed" 
                  :disabled="saving"
                >
                  <span v-if="saving" class="flex items-center justify-center gap-2">
                    <svg class="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                  <span v-else>Confirm Registration</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { collection, doc, getDocs, query, updateDoc, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'

export default {
  name: 'AdminStaffRFIDView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      staffMembers: [],
      loading: false,
      error: '',
      search: '',
      currentPage: 1,
      itemsPerPage: 10,
      showRFIDModal: false,
      saving: false,
      selectedStaff: null,
      rfidInput: '',
      unsubRfid: null,
      lastDetectedUID: '',
    }
  },
  computed: {
    filteredStaff() {
      const term = this.search.trim().toLowerCase()
      let list = this.staffMembers

      if (!term) return list

      return list.filter((s) => {
        const fullName = this.formatName(s).toLowerCase()
        const username = (s.username || '').toLowerCase()
        const email = (s.email || '').toLowerCase()
        return (
          fullName.includes(term) ||
          username.includes(term) ||
          email.includes(term)
        )
      })
    },
    totalPages() {
      return Math.ceil(this.filteredStaff.length / this.itemsPerPage) || 1
    },
    paginatedStaff() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredStaff.slice(start, end)
    }
  },
  watch: {
    search() {
      this.currentPage = 1
    },
    showRFIDModal(val) {
      if (val) {
        this.$nextTick(() => {
          if (this.$refs.rfidInputField) {
            this.$refs.rfidInputField.focus()
          }
        })
      }
    }
  },
  methods: {
    async fetchStaff() {
      this.loading = true
      this.error = ''

      try {
        const usersRef = collection(db, 'users')
        const q = query(
          usersRef,
          where('role', '==', 'staff')
        )

        const snap = await getDocs(q)
        this.staffMembers = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      } catch (err) {
        console.error('Error fetching staff:', err)
        this.error = 'Failed to load staff members from Firestore.'
      } finally {
        this.loading = false
      }
    },
    formatName(user) {
      if (!user) return ''
      const first = user.firstName || ''
      const middle = user.middleName || ''
      const last = user.lastName || ''
      const joined = [first, middle, last].filter(Boolean).join(' ')
      return joined || user.username || 'Unnamed Staff'
    },
    formatInitials(user) {
      if (!user) return '??'
      const first = (user.firstName || '').charAt(0)
      const last = (user.lastName || '').charAt(0)
      return (first + last).toUpperCase() || (user.username || 'S').slice(0, 2).toUpperCase()
    },
    async openRFIDModal(staff) {
      this.selectedStaff = staff
      this.rfidInput = staff.rfid || ''
      this.showRFIDModal = true
      
      // Enable Register Mode on backend
      try {
        await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/api/rfid/register-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: staff.id, enable: true })
        });
      } catch (e) {
        console.error('Failed to enable Register Mode:', e);
      }
    },
    async closeRFIDModal() {
      if (this.saving) return
      this.showRFIDModal = false
      const oldId = this.selectedStaff?.id
      this.selectedStaff = null
      this.rfidInput = ''

      // Disable Register Mode on backend
      try {
        await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/api/rfid/register-mode', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: oldId, enable: false })
        });
      } catch (e) {
        console.error('Failed to disable Register Mode:', e);
      }
    },
    async handleSaveRFID() {
      if (!this.selectedStaff?.id || !this.rfidInput.trim()) return

      this.saving = true

      try {
        const response = await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/api/rfid/register-manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: this.selectedStaff.id, 
            uid: this.rfidInput.trim() 
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to save RFID');
        }

        // Locally update to avoid full refetch
        const index = this.staffMembers.findIndex(s => s.id === this.selectedStaff.id)
        if (index !== -1) {
          this.staffMembers[index].rfid = this.rfidInput.trim()
        }

        this.showRFIDModal = false
        this.selectedStaff = null
        this.rfidInput = ''
      } catch (err) {
        console.error('Error saving RFID:', err)
        alert(err.message || 'Failed to save RFID. Please try again.')
      } finally {
        this.saving = false
      }
    },
    initRfidListener() {
      const rfidDocRef = doc(db, 'system', 'rfid_scanner')
      this.unsubRfid = onSnapshot(rfidDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data()
          
          if (data.status === 'registered' && this.showRFIDModal) {
            this.rfidInput = data.lastScannedUID
            // Refresh staff list locally
            const index = this.staffMembers.findIndex(s => s.id === this.selectedStaff?.id)
            if (index !== -1) {
              this.staffMembers[index].rfid = data.lastScannedUID
            }
            
            // Auto close after a brief moment
            setTimeout(() => {
              this.showRFIDModal = false
              this.selectedStaff = null
              this.rfidInput = ''
            }, 1500)
            return
          }

          if (data.lastScannedUID && data.lastScannedUID !== this.lastDetectedUID) {
            this.lastDetectedUID = data.lastScannedUID
            // If modal is open, auto-fill the UID
            if (this.showRFIDModal) {
              this.rfidInput = data.lastScannedUID
            }
          }
        }
      })
    },
    async fetchLastScanned() {
      try {
        const { getDoc } = await import('firebase/firestore')
        const rfidDocRef = doc(db, 'system', 'rfid_scanner')
        const snap = await getDoc(rfidDocRef)
        if (snap.exists()) {
          const data = snap.data()
          if (data.lastScannedUID) {
            this.rfidInput = data.lastScannedUID
            this.lastDetectedUID = data.lastScannedUID
          }
        }
      } catch (err) {
        console.error('Error fetching last scanned UID:', err)
      }
    }
  },
  created() {
    this.fetchStaff()
    this.initRfidListener()
  },
  beforeUnmount() {
    if (this.unsubRfid) {
      this.unsubRfid()
    }
  }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .bg-white {
  transform: scale(0.9) translateY(20px);
}

.nav-icon {
  width: 18px;
  height: 18px;
  background-color: currentColor;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  display: inline-block;
}

.icon-register-rfid {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 4a2 2 0 0 0-2 2v1.043a5 5 0 0 0-2.879 1.421l-2.828 2.829a1 1 0 1 0 1.414 1.414L6.536 9.88A3 3 0 0 1 8 9.073v3.646l-.625.5a1 1 0 0 0 1.25 1.562l2.903-2.323a2 2 0 0 1 2.664.148l.286.286L7.933 17.8a1 1 0 0 1-.6.2H3a1 1 0 1 0 0 2h4.333a3 3 0 0 0 1.8-.6L15 15h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 7.12l.279-.223a4 4 0 0 1 5.327.295l.286.286c.421.421.612.978.583 1.522H20V9H10zM20 7V6H10v1z'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 4a2 2 0 0 0-2 2v1.043a5 5 0 0 0-2.879 1.421l-2.828 2.829a1 1 0 1 0 1.414 1.414L6.536 9.88A3 3 0 0 1 8 9.073v3.646l-.625.5a1 1 0 0 0 1.25 1.562l2.903-2.323a2 2 0 0 1 2.664.148l.286.286L7.933 17.8a1 1 0 0 1-.6.2H3a1 1 0 1 0 0 2h4.333a3 3 0 0 0 1.8-.6L15 15h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 7.12l.279-.223a4 4 0 0 1 5.327.295l.286.286c.421.421.612.978.583 1.522H20V9H10zM20 7V6H10v1z'/%3E%3C/g%3E%3C/svg%3E");
}
</style>
