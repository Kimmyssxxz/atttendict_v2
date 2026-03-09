<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Tagging</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="m-0 text-xl text-gray-800">Student Tagging</h2>
            <p class="mt-1 mb-0 text-sm text-gray-600">
              Configure and review tagging for student interns (AM/PM, normal hours, overtime, etc.).
            </p>
          </div>

          <div class="flex flex-wrap gap-3 mb-4">
            <input
              v-model="search"
              type="text"
              class="flex-1 basis-[240px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
              placeholder="Search by name, username, or email"
            />
            <select v-model="roleFilter" class="flex-none basis-[200px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
              <option value="all">All</option>
              <option value="student-intern">Student Interns Only</option>
            </select>
          </div>

          <div v-if="loading" class="text-[0.95rem] text-gray-600">Loading interns...</div>
          <div v-else-if="error" class="text-[0.95rem] text-red-700">{{ error }}</div>
          <div v-else>
            <table class="w-full border-collapse text-sm" v-if="filteredInterns.length">
              <thead class="bg-gray-100">
                <tr>
                  <th class="border border-gray-300 px-3 py-2 text-left">#</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Full Name</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Username</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Email</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Role</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Position</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Tagging</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Today AM Tag</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Today PM Tag</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(intern, index) in filteredInterns" :key="intern.id">
                  <td class="border border-gray-300 px-3 py-2">{{ index + 1 }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ formatName(intern) }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.username || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.email || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.role || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.position || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.tagging || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.todayAmTag || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.todayPmTag || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">
                    <div class="flex gap-1">
                      <button
                        type="button"
                        class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                        @click="openTagModal(intern)"
                        title="Edit Tagging"
                      >
                        ✏️ Tagging
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="text-[0.95rem] text-gray-600">No student interns found.</div>
          </div>

          <!-- Edit Tagging Modal -->
          <div v-if="showTagModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
            <div class="bg-white rounded-lg p-6 w-full max-w-[640px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
              <h3 class="m-0 mb-4 text-[1.1rem] text-gray-800 font-bold">Edit Student Tagging</h3>

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
                  <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-gray-300 text-gray-800 border-none transition-colors hover:bg-gray-400" @click="closeTagModal" :disabled="savingTag">
                    Cancel
                  </button>
                  <button type="submit" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default" :disabled="savingTag">
                    {{ savingTag ? 'Saving...' : 'Save Tagging' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'

export default {
  name: 'AdminStudentTaggingView',
  components: {
    AdminSidebar,
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
        const res = await fetch('http://localhost:3001/admin/attendance/today-interns')
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
          await fetch('http://localhost:3001/admin/attendance/update-tagging', {
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
            await fetch('http://localhost:3001/admin/attendance/retag-session', {
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
            await fetch('http://localhost:3001/admin/attendance/retag-session', {
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

