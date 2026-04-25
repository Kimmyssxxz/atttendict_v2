<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white text-gray-900">
        <h1 class="m-0 text-3xl font-semibold">Student Tagging</h1>
      </header>

      <main class="flex-1 px-6 py-6 font-sans">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else>
          <section class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="mb-4">
            <h2 class="m-0 text-2xl font-semibold text-gray-900">Student Tagging</h2>
            <p class="text-gray-600">
              Configure and review tagging for student interns (AM/PM, normal hours, overtime, etc.).
            </p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  v-model="search" 
                  class="w-full sm:w-[320px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all"
                  placeholder="Search by name, username, or email..."
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <div class="flex items-center gap-3 w-full sm:w-auto">
              <div class="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
                <span>Show:</span>
                <select v-model="roleFilter" class="px-4 py-2 border border-gray-200 rounded-full text-sm bg-white focus:outline-none focus:ring-1 focus:ring-gray-200 cursor-pointer transition-all">
                  <option value="all">All Users</option>
                  <option value="student-intern">Student Interns Only</option>
                </select>
              </div>
              
              <button 
                @click="fetchInterns"
                class="flex items-center justify-center gap-1.5 px-5 py-2 bg-[#133e75] text-white rounded-full hover:bg-[#133e75]/80 text-sm font-medium transition-all"
                :disabled="loading"
              >
                <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Refresh</span>
              </button>
            </div>
          </div>

          <div v-if="error" class="text-[0.95rem] text-red-700 py-4">{{ error }}</div>
          
          <div class="border border-gray-100 rounded-xl overflow-x-auto shadow-sm" v-if="filteredInterns.length">
            <table class="min-w-full divide-y divide-gray-100">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">No.</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tagging</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Today AM</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Today PM</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(intern, index) in filteredInterns" :key="intern.id" class="hover:bg-gray-50 transition-colors duration-150">
                    <td class="px-4 py-3 text-sm text-gray-500">{{ index + 1 }}</td>
                    <td class="px-4 py-3 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">{{ formatName(intern) }}</div>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ intern.username || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ intern.email || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ intern.role || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 capitalize">{{ intern.position || '-' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 font-medium">{{ intern.tagging || '-' }}</td>
                    <td class="px-4 py-3 text-sm">
                      <span :class="[
                        'px-2 py-0.5 rounded-full text-[11px] font-bold uppercase',
                        intern.todayAmTag === 'Overtime' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      ]">
                        {{ intern.todayAmTag || '-' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span :class="[
                        'px-2 py-0.5 rounded-full text-[11px] font-bold uppercase',
                        intern.todayPmTag === 'Overtime' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      ]">
                        {{ intern.todayPmTag || '-' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 hover:border-gray-300 text-xs font-semibold cursor-pointer"
                        @click="openTagModal(intern)"
                        title="Edit Tagging"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                        </svg>
                        <span>Tagging</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else-if="!filteredInterns.length && !error" class="py-12 text-center text-gray-500 font-medium italic">No interns matching your criteria.</div>
          </section>
        </div>
      </main>

      <!-- Edit Tagging Modal -->
      <div v-if="showTagModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
        <div class="bg-white rounded-lg p-6 w-full max-w-[640px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
          <h3 class="m-0 mb-4 text-2xl text-gray-800 font-semibold">Edit Student Tagging</h3>

          <form @submit.prevent="handleSaveTagging" class="flex flex-col gap-4">
            <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-3">
              <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Student</label>
                <input :value="selectedInternName" type="text" disabled class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-gray-100" />
              </div>

              <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Tagging (day-level default)</label>
                <select v-model="tagging" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                  <option value="Normal Hours">Normal Hours</option>
                  <option value="Overtime">Overtime</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Today AM Tag (attendance)</label>
                <select v-model="todayTagAM" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                  <option value="Normal Hours">Normal Hours</option>
                  <option value="Overtime">Overtime</option>
                </select>
              </div>

              <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Today PM Tag (attendance)</label>
                <select v-model="todayTagPM" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                  <option value="Normal Hours">Normal Hours</option>
                  <option value="Overtime">Overtime</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 mt-2">
              <button type="button" class="px-3.5 py-2 rounded-lg text-sm cursor-pointer bg-gray-100 text-gray-900 border-none transition-colors hover:bg-gray-200" @click="closeTagModal" :disabled="savingTag">
                Cancel
              </button>
              <button type="submit" class="px-3.5 py-2 rounded-lg text-sm cursor-pointer bg-[#133e75] text-white border-none transition-colors hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-default" :disabled="savingTag">
                {{ savingTag ? 'Saving...' : 'Save Tagging' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'

export default {
  name: 'AdminStudentTaggingView',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      interns: [],
      loading: false,
      error: '',
      search: '',
      roleFilter: 'student-intern',
      showTagModal: false,
      savingTag: false,
      selectedIntern: null,
      tagging: 'Normal Hours',
      todayTagAM: 'Normal Hours',
      todayTagPM: 'Normal Hours',
    }
  },
  computed: {
    filteredInterns() {
      const term = this.search.trim().toLowerCase()

      let list = this.interns

      if (this.roleFilter === 'student-intern') {
        list = list.filter((i) => {
          const roleIsStudent = (i.role || '').toLowerCase() === 'student'
          const positionIsIntern = (i.position || '').toLowerCase() === 'intern'
          return roleIsStudent && positionIsIntern
        })
      }

      if (!term) return list

      return list.filter((i) => {
        const fullName = this.formatName(i).toLowerCase()
        const username = (i.username || '').toLowerCase()
        const email = (i.email || '').toLowerCase()
        return (
          fullName.includes(term) ||
          username.includes(term) ||
          email.includes(term)
        )
      })
    },
    selectedInternName() {
      if (!this.selectedIntern) return ''
      return this.formatName(this.selectedIntern)
    },
  },
  methods: {
    getLocalDateString() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    async fetchInterns() {
      this.loading = true
      this.error = ''

      try {
        const res = await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/admin/attendance/today-interns')
        const data = await res.json()

        if (!res.ok) {
          console.error('Backend error fetching today intern attendance:', data)
          this.error = data.message || 'Failed to load student interns for tagging.'
          this.interns = []
          return
        }

        this.interns = Array.isArray(data.interns) ? data.interns : []
      } catch (err) {
        console.error('Error fetching interns for tagging:', err)
        this.error = 'Failed to load student interns for tagging.'
      } finally {
        this.loading = false
      }
    },
    formatName(user) {
      const first = user.firstName || ''
      const middle = user.middleName || ''
      const last = user.lastName || ''
      return [first, middle, last].filter(Boolean).join(' ')
    },
    formatTime(timeStr) {
      if (!timeStr) return '--:-- --'
      const parts = timeStr.split(':')
      if (parts.length < 2) return timeStr
      let hour = parseInt(parts[0], 10)
      const minute = parts[1]
      if (Number.isNaN(hour)) return timeStr
      const suffix = hour >= 12 ? 'PM' : 'AM'
      hour = hour % 12
      if (hour === 0) hour = 12
      return `${hour}:${minute} ${suffix}`
    },
    openTagModal(intern) {
      this.selectedIntern = { ...intern }

      if (!this.selectedIntern.tagging) {
        this.selectedIntern.tagging = 'Normal Hours'
      }

      this.tagging = this.selectedIntern.tagging || 'Normal Hours'
      this.todayTagAM = intern.todayAmTag || 'Normal Hours'
      this.todayTagPM = intern.todayPmTag || 'Normal Hours'
      this.showTagModal = true
    },
    closeTagModal() {
      if (this.savingTag) return
      this.showTagModal = false
      this.selectedIntern = null
    },
    async handleSaveTagging() {
      if (!this.selectedIntern?.id) {
        this.closeTagModal()
        return
      }

      this.savingTag = true

      try {
        const internId = this.selectedIntern.id
        const internRef = doc(db, 'users', internId)

        const payload = {
          tagging: this.tagging || 'Normal Hours',
          // Store today's AM/PM attendance tag snapshot on the user for display
          todayAmTag: this.todayTagAM || 'Normal Hours',
          todayPmTag: this.todayTagPM || 'Normal Hours',
          taggingLastResetDate: this.getLocalDateString(),
        }

        await updateDoc(internRef, payload)

        // Also ask backend to sync today's attendance tagging for this intern (day-level default)
        try {
          await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/admin/attendance/update-tagging', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              internId,
              tagging: this.tagging || 'Normal Hours',
            }),
          })

          // Optionally retag today's AM/PM sessions individually
          const baseOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }

          const amTag = this.todayTagAM
          if (amTag) {
            await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/admin/attendance/retag-session', {
              ...baseOptions,
              body: JSON.stringify({
                internId,
                session: 'AM',
                tag: amTag,
              }),
            })
          }

          const pmTag = this.todayTagPM
          if (pmTag) {
            await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/admin/attendance/retag-session', {
              ...baseOptions,
              body: JSON.stringify({
                internId,
                session: 'PM',
                tag: pmTag,
              }),
            })
          }
        } catch (syncErr) {
          console.error('Failed to sync today attendance tagging:', syncErr)
        }

        this.showTagModal = false
        this.selectedIntern = null

        // Refresh list so Tagging / AM Tag / PM Tag columns show latest values from Firestore
        await this.fetchInterns()
      } catch (err) {
        console.error('Error saving tagging:', err)
        alert('Failed to save tagging for intern.')
      } finally {
        this.savingTag = false
      }
    },
  },
  created() {
    this.fetchInterns()
  },
}
</script>

