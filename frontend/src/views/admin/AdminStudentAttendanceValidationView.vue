<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Attendance Validation</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <div class="border border-gray-200 rounded-xl bg-white p-5 mb-5">
            <div class="min-h-[180px]">
              <div v-if="!selectedInternId" class="min-h-[180px] flex flex-col items-center justify-center gap-1.5 text-center">
                <div class="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-xl text-blue-700 mb-1">▣</div>
                <h3 class="m-0 text-[1.05rem] text-gray-900">Select an intern to review</h3>
                <p class="mt-0.5 mb-0 text-[0.9rem] text-gray-500">Click any intern below to view attendance details</p>
              </div>

              <div v-else>
                <div class="flex flex-col items-start justify-start gap-2 mb-4 md:mb-4">
                  <div>
                    <h3 class="m-0 text-[1.05rem] text-gray-900">Attendance for {{ selectedInternName }}</h3>
                    <p class="mt-0.5 mb-0 text-[0.9rem] text-gray-500">Review and validate student intern attendance.</p>
                  </div>

                  <div class="flex items-center justify-between gap-3 w-full flex-wrap border border-gray-200 bg-slate-50 rounded-xl p-2.5">
                    <div class="flex-1 basis-[420px] min-w-[260px]">
                      <div class="flex items-center gap-2 w-full border border-gray-200 rounded-xl bg-white px-3 py-2">
                        <span class="text-[0.95rem] text-slate-400 leading-none">🔍</span>
                        <input
                          v-model="search"
                          type="text"
                          class="w-full p-0 border-none text-[0.95rem] bg-white focus:outline-none"
                          placeholder="Search by intern name"
                        />
                      </div>
                    </div>
                    <div class="flex items-center justify-end gap-2 flex-none flex-nowrap">
                      <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer bg-white text-slate-900 border border-gray-200 whitespace-nowrap transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-default" @click="toggleFilters">
                        <span class="text-base">⚙️</span> Filters
                      </button>
                      <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer bg-white text-slate-900 border border-gray-200 whitespace-nowrap transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-default" @click="exportAttendance">
                        <span class="text-base">📥</span> Export
                      </button>
                      <input
                        v-model="selectedDate"
                        type="date"
                        class="flex-none basis-[180px] px-3 py-2 rounded-[10px] border border-gray-200 text-[0.95rem] bg-white text-gray-800 focus:outline-none focus:border-blue-400"
                        @change="handleDateChange"
                      />
                      <button type="button" class="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-[0.9rem] font-semibold cursor-pointer bg-white text-slate-900 border border-gray-200 whitespace-nowrap transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-70 disabled:cursor-default" @click="fetchRecords" :disabled="loading">
                        {{ loading ? 'Refreshing...' : 'Refresh' }}
                      </button>
                    </div>
                  </div>
                </div>

                <div v-if="loading" class="text-[0.95rem] text-gray-600">Loading attendance records...</div>
                <div v-else-if="error" class="text-[0.95rem] text-red-700">{{ error }}</div>
                <div v-else>
                  <div class="overflow-x-auto border border-gray-200 rounded-xl bg-white" v-if="filteredRecords.length">
                    <table class="w-full border-collapse text-[0.9rem] bg-white">
                      <thead>
                        <tr>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Date</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">AM In</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">AM Out</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">PM In</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">PM Out</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Total Hours</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Location Status</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Attendance Status</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Validation</th>
                          <th class="px-4 py-3 text-left border-b border-slate-100 bg-slate-50 text-slate-500 font-semibold uppercase text-xs tracking-wide">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="row in paginatedRecords" :key="row.id" class="hover:bg-slate-50">
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ row.date || '-' }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeInAM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeOutAM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeInPM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ formatTime(row.timeOutPM) }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ row.totalHoursLabel || '-' }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">
                            <div class="flex flex-col gap-1">
                              <select v-model="row.locationSlot" class="w-full px-2 py-1 border border-gray-300 rounded text-sm bg-white" @change="updateDisplayedLocation(row)">
                                <option value="AM">AM</option>
                                <option value="PM">PM</option>
                              </select>
                              <div class="text-xs text-slate-500 max-w-[200px] truncate">{{ row.displayedLocation || '-' }}</div>
                            </div>
                          </td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">{{ row.attendanceStatus || '-' }}</td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">
                            <span :class="[
                              'px-2.5 py-1 rounded-full text-xs font-semibold capitalize',
                              (row.validationStatus || 'Pending').toLowerCase() === 'pending' ? 'bg-amber-100 text-amber-800' :
                              (row.validationStatus || 'Pending').toLowerCase() === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            ]">
                              {{ row.validationStatus || 'Pending' }}
                            </span>
                          </td>
                          <td class="px-4 py-3 text-left border-b border-slate-100">
                            <div class="flex flex-wrap gap-1">
                              <button 
                                type="button" 
                                class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200" 
                                :disabled="!!savingRowIds[row.id]"
                                @click="approveRow(row)"
                              >
                                {{ savingRowIds[row.id] ? '...' : 'Approve' }}
                              </button>
                              <button 
                                type="button" 
                                class="px-2.5 py-1 text-xs rounded border border-red-300 text-red-700 bg-red-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-red-100" 
                                :disabled="!!savingRowIds[row.id]"
                                @click="rejectRow(row)"
                              >
                                {{ savingRowIds[row.id] ? '...' : 'Reject' }}
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Pagination Controls -->
                  <div class="flex flex-col sm:flex-row justify-between items-center p-4 bg-slate-50 border-t border-gray-200 rounded-b-xl gap-4" v-if="filteredRecords.length">
                    <div class="text-[0.85rem] text-slate-500">
                      Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredRecords.length) }} of {{ filteredRecords.length }} entries
                    </div>
                    <div class="flex items-center gap-6">
                      <div class="flex items-center gap-2 text-[0.85rem] text-slate-500">
                        <label>Rows per page:</label>
                        <select v-model="itemsPerPage" class="px-2 py-1 rounded-md border border-gray-200 bg-white text-[0.85rem] outline-none" @change="currentPage = 1">
                          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
                        </select>
                      </div>
                      <div class="flex items-center gap-3">
                        <button 
                          class="px-3 py-1.5 text-[0.85rem] rounded-md border border-gray-200 bg-white text-slate-800 cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                          :disabled="currentPage === 1" 
                          @click="currentPage--"
                        >
                          Previous
                        </button>
                        <span class="text-[0.85rem] text-slate-800 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                        <button 
                          class="px-3 py-1.5 text-[0.85rem] rounded-md border border-gray-200 bg-white text-slate-800 cursor-pointer transition-all hover:bg-slate-100 hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed" 
                          :disabled="currentPage === totalPages" 
                          @click="currentPage++"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-[0.95rem] text-gray-600">No attendance records found.</div>
                </div>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-xl bg-white p-5">
            <div class="mb-3">
              <h3 class="m-0 text-base text-gray-900">Available Interns</h3>
            </div>

            <div class="grid grid-cols-[repeat(auto-fill,minmax(240px,240px))] justify-start gap-3">
              <button
                v-for="intern in filteredInternCards"
                :key="intern.id"
                type="button"
                :class="[
                  'text-left bg-white border rounded-[10px] p-3.5 cursor-pointer transition-all',
                  intern.id === selectedInternId 
                    ? 'border-blue-400 shadow-[0_10px_24px_rgba(37,99,235,0.12)]' 
                    : 'border-gray-200 hover:border-blue-200 hover:shadow-[0_8px_22px_rgba(15,23,42,0.08)] hover:-translate-y-[1px]'
                ]"
                @click="selectIntern(intern)"
              >
                <div class="flex items-center justify-between gap-3 mb-2">
                  <div class="font-bold text-gray-900">{{ intern.name || '-' }}</div>
                  <div class="w-[30px] h-[30px] rounded-full bg-blue-50 flex items-center justify-center text-blue-600">▣</div>
                </div>
                <div class="text-gray-500 text-[0.85rem]">
                  <div class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>Review attendance</span>
                  </div>
                </div>
              </button>
            </div>
          </div>

        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import { doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const AUTO_APPROVE_LOCATION = 'M. Roxas Drive, Lalom, Santa Isabel, Calapan, Oriental Mindoro, Mimaropa, Philippines'

export default {
  name: 'AdminStudentAttendanceValidationView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      records: [],
      interns: [],
      loading: false,
      error: '',
      search: '',
      selectedDate: '',
      selectedInternId: '',
      internCardSearch: '',
      savingRowIds: {},
      currentPage: 1,
      itemsPerPage: 10,
      pageSizeOptions: [10, 15, 20, 25],
    }
  },
  computed: {
    selectedInternName() {
      const found = this.interns.find((i) => i.id === this.selectedInternId)
      return found ? found.name : ''
    },
    filteredRecords() {
      const selectedId = this.selectedInternId
      let list = this.records
      if (selectedId) {
        list = list.filter((r) => r.internId === selectedId)
      }

      // REMOVED: Date filter restriction to show all attendance for specific student
      /*
      const selectedDate = (this.selectedDate || '').trim()
      if (selectedDate) {
        list = list.filter((r) => (r.date || '') === selectedDate)
      }
      */

      const term = this.search.trim().toLowerCase()
      if (!term) return list
      return list.filter((r) => (r.internName || '').toLowerCase().includes(term))
    },
    filteredInternCards() {
      const term = this.internCardSearch.trim().toLowerCase()
      if (!term) return this.interns
      return this.interns.filter((i) => (i.name || '').toLowerCase().includes(term))
    },
    totalPages() {
      return Math.ceil(this.filteredRecords.length / this.itemsPerPage)
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredRecords.slice(start, end)
    },
  },
  methods: {
    normalizeLocation(value) {
      if (!value) return ''
      return String(value).trim().replace(/\s+/g, ' ').toLowerCase()
    },
    isAutoApproveLocationMatch(locationLabel) {
      return this.normalizeLocation(locationLabel) === this.normalizeLocation(AUTO_APPROVE_LOCATION)
    },
    async persistValidation(row, status) {
      if (!row || !row.id) return

      const rowId = row.id
      if (this.savingRowIds[rowId]) return

      this.savingRowIds = { ...this.savingRowIds, [rowId]: true }
      try {
        const ref = doc(db, 'intern_attendance', rowId)
        await updateDoc(ref, {
          validationStatus: status,
          validationUpdatedAt: serverTimestamp(),
        })
        row.validationStatus = status
      } catch (e) {
        console.error('Failed to update validation status:', e)
        alert('Failed to save validation status. Please try again.')
      } finally {
        const copy = { ...this.savingRowIds }
        delete copy[rowId]
        this.savingRowIds = copy
      }
    },
    getTodayDateString() {
      const now = new Date()
      const yyyy = now.getFullYear()
      const mm = String(now.getMonth() + 1).padStart(2, '0')
      const dd = String(now.getDate()).padStart(2, '0')
      return `${yyyy}-${mm}-${dd}`
    },
    formatName(user) {
      const first = user.firstName || ''
      const middle = user.middleName || ''
      const last = user.lastName || ''
      return [first, middle, last].filter(Boolean).join(' ')
    },
    formatTime(timeStr) {
      if (!timeStr) return '-'
      const parts = String(timeStr).split(':')
      if (parts.length < 2) return String(timeStr)
      let hour = parseInt(parts[0], 10)
      const minute = parts[1]
      if (Number.isNaN(hour)) return String(timeStr)
      const suffix = hour >= 12 ? 'PM' : 'AM'
      hour = hour % 12
      if (hour === 0) hour = 12
      return `${hour}:${minute} ${suffix}`
    },
    computeTotalHoursLabel(row) {
      const toMinutes = (t) => {
        if (!t) return null
        const parts = String(t).split(':').map((x) => parseInt(x, 10))
        if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
        const h = parts[0]
        const m = parts[1]
        const s = parts[2] || 0
        return h * 60 + m + Math.round(s / 60)
      }

      const amIn = toMinutes(row.timeInAM)
      const amOut = toMinutes(row.timeOutAM)
      const pmIn = toMinutes(row.timeInPM)
      const pmOut = toMinutes(row.timeOutPM)

      let total = 0
      if (amIn !== null && amOut !== null && amOut >= amIn) total += amOut - amIn
      if (pmIn !== null && pmOut !== null && pmOut >= pmIn) total += pmOut - pmIn

      if (!total) return ''
      const h = Math.floor(total / 60)
      const m = total % 60
      return `${h}h ${m}m`
    },
    computeAttendanceStatus(row) {
      const parts = []
      if (row.statusAM) parts.push(`AM: ${row.statusAM}`)
      if (row.statusPM) parts.push(`PM: ${row.statusPM}`)
      return parts.join(' | ')
    },
    extractLocationLabel(loc) {
      if (!loc) return ''
      if (typeof loc === 'string') return loc
      if (typeof loc.address === 'string' && loc.address.trim()) return loc.address.trim()
      const lat = typeof loc.latitude === 'number' ? loc.latitude : null
      const lng = typeof loc.longitude === 'number' ? loc.longitude : null
      if (lat !== null && lng !== null) return `${lat}, ${lng}`
      return ''
    },
    computeLocationStatus(row) {
      const amLabel = this.extractLocationLabel(row.locationAM)
      const pmLabel = this.extractLocationLabel(row.locationPM)

      const parts = []
      if (row.timeInAM || row.timeOutAM) {
        parts.push(`AM: ${amLabel || '-'}`)
      }
      if (row.timeInPM || row.timeOutPM) {
        parts.push(`PM: ${pmLabel || '-'}`)
      }

      if (parts.length) return parts.join(' | ')
      if (amLabel || pmLabel) return [amLabel, pmLabel].filter(Boolean).join(' | ')
      return '-'
    },
    updateDisplayedLocation(row) {
      if (!row) return
      const slot = row.locationSlot === 'PM' ? 'PM' : 'AM'
      row.displayedLocation = slot === 'PM' ? (row.pmLocationLabel || '') : (row.amLocationLabel || '')
    },
    async maybeAutoApproveRow(row) {
      if (!row || !row.id) return
      if (row.validationStatus === 'Approved' || row.validationStatus === 'Rejected') return

      const isMatch = this.isAutoApproveLocationMatch(row.amLocationLabel) || this.isAutoApproveLocationMatch(row.pmLocationLabel)
      if (!isMatch) return

      await this.persistValidation(row, 'Approved')
    },
    async fetchInternHistory(internId) {
      if (!internId) {
        this.records = []
        return
      }

      this.loading = true
      this.error = ''

      try {
        const res = await fetch(
          `http://localhost:3001/attendance/intern/history?internId=${encodeURIComponent(internId)}`
        )
        const data = await res.json()

        if (!res.ok) {
          this.records = []
          this.error = data.message || 'Failed to load attendance history.'
          return
        }

        const history = Array.isArray(data.data) ? data.data : []
        const intern = this.interns.find((i) => i.id === internId)
        const internName = intern ? intern.name : ''

        this.records = history.map((h) => {
          const row = {
            id: h.id || `${internId}_${h.date || ''}`,
            internId,
            internName,
            date: h.date || '',
            timeInAM: h.timeInAM || null,
            timeOutAM: h.timeOutAM || null,
            timeInPM: h.timeInPM || null,
            timeOutPM: h.timeOutPM || null,
            statusAM: h.statusAM || null,
            statusPM: h.statusPM || null,
            locationAM: h.locationAM || null,
            locationPM: h.locationPM || null,
            totalHoursLabel: '',
            locationStatus: '',
            amLocationLabel: '',
            pmLocationLabel: '',
            locationSlot: 'AM',
            displayedLocation: '',
            attendanceStatus: '',
            validationStatus: h.validationStatus || '',
          }

          row.totalHoursLabel = this.computeTotalHoursLabel(row)
          row.attendanceStatus = this.computeAttendanceStatus(row)
          row.amLocationLabel = this.extractLocationLabel(row.locationAM)
          row.pmLocationLabel = this.extractLocationLabel(row.locationPM)
          row.locationStatus = this.computeLocationStatus(row)
          this.updateDisplayedLocation(row)

          return row
        }).sort((a, b) => (b.date || '').localeCompare(a.date || '')) // Show latest first

        for (const row of this.records) {
          // No longer auto-approving here. Validation status is set during time-in.
        }
      } catch (err) {
        console.error('Error fetching intern attendance history:', err)
        this.error = 'Failed to load attendance history.'
        this.records = []
      } finally {
        this.loading = false
      }
    },
    async fetchRecords() {
      this.loading = true
      this.error = ''

      try {
        // Use an empty query to fetch all interns/history or handle based on selected intern
        const qs = '' 
        const res = await fetch(`http://localhost:3001/admin/attendance/today-interns${qs}`)
        const data = await res.json()

        if (!res.ok) {
          this.records = []
          this.error = data.message || 'Failed to load attendance records.'
          return
        }

        const interns = Array.isArray(data.interns) ? data.interns : []

        this.interns = interns
          .map((i) => ({
            id: i.id,
            name: this.formatName(i) || i.username || '',
          }))
          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

        if (this.selectedInternId) {
          await this.fetchInternHistory(this.selectedInternId)
        }
      } catch (err) {
        console.error('Error fetching attendance validation records:', err)
        this.error = 'Failed to load interns.'
        this.interns = []
      } finally {
        this.loading = false
      }
    },
    handleDateChange() {
      if (this.loading) return
      this.search = ''
      this.currentPage = 1
    },
    selectIntern(intern) {
      if (!intern?.id || this.loading) return
      this.selectedInternId = intern.id
      this.search = ''
      this.currentPage = 1
      this.fetchInternHistory(intern.id)
    },
    approveRow(row) {
      this.persistValidation(row, 'Approved')
    },
    rejectRow(row) {
      this.persistValidation(row, 'Rejected')
    },
    toggleFilters() {
      // Implement filter logic or modal here
      alert('Filter functionality triggered');
    },
    exportAttendance() {
      if (!this.filteredRecords.length) {
        alert('No records to export');
        return;
      }
      
      const headers = ['Intern Name', 'Date', 'AM In', 'AM Out', 'PM In', 'PM Out', 'Total Hours', 'Validation Status'];
      const rows = this.filteredRecords.map(r => [
        r.internName,
        r.date,
        this.formatTime(r.timeInAM),
        this.formatTime(r.timeOutAM),
        this.formatTime(r.timeInPM),
        this.formatTime(r.timeOutPM),
        r.totalHoursLabel,
        r.validationStatus || 'Pending'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `attendance_${this.selectedInternName || 'export'}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
  },
  created() {
    this.selectedDate = this.getTodayDateString()
    this.fetchRecords()
  },
}
</script>

