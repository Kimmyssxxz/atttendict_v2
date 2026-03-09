<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">Staff Status</h1>
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
      </div>
    </header>

    <main class="max-w-[1100px] mx-auto my-8 px-4 flex flex-col gap-6">
      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <div class="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h2 class="m-0 text-[1.1rem] text-slate-900">All Staff</h2>
            <p class="mt-1 mb-0 text-[0.85rem] text-slate-500">List of staff accounts retrieved from the system.</p>
          </div>
          <div class="flex justify-end w-full md:w-auto">
            <button class="px-3.5 py-2 rounded-full border-none bg-slate-200 text-slate-900 text-[0.85rem] font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed" :disabled="loading" @click="fetchStaff">
              {{ loading ? 'Loading...' : 'Refresh' }}
            </button>
          </div>
        </div>

        <p v-if="error" class="mt-1 mb-0 text-[0.85rem] text-slate-500">{{ error }}</p>

        <div v-if="!loading && staff.length === 0" class="text-center p-12 text-slate-500 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          No staff found
        </div>

        <div v-else class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6 mt-4">
          <div v-for="s in staff" :key="s.id" class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md">
            <div class="w-16 h-16 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-[1.75rem] font-bold mb-4">
              {{ s.firstName ? s.firstName.charAt(0).toUpperCase() : 'S' }}
            </div>
            <div class="flex flex-col w-full">
              <h3 class="m-0 mb-1 text-[1.1rem] text-slate-800 font-semibold">{{ formatName(s) }}</h3>
              <span class="text-[0.85rem] text-slate-500 mb-4 font-medium pb-4 border-b border-slate-100">{{ s.position || 'No Position' }}</span>
              
              <div class="flex items-center gap-2 text-[0.85rem] text-slate-600 mb-2 text-left">
                <span class="text-slate-400 w-4 text-center">@</span>
                <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1">{{ s.username || '-' }}</span>
              </div>
              
              <div class="flex items-center gap-2 text-[0.85rem] text-slate-600 mb-2 text-left">
                <span class="text-slate-400 w-4 text-center">✉</span>
                <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1" :title="s.email || '-'">{{ s.email || '-' }}</span>
              </div>
              
              <div class="mt-4 px-4 py-2 rounded-full text-[0.85rem] font-semibold inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-600" :class="{'!bg-emerald-50 !text-emerald-600': s.staffStatus, 'bg-slate-50 text-slate-500': !s.staffStatus || s.staffStatus === 'No status yet'}">
                <span class="w-2 h-2 rounded-full bg-slate-400" :class="{'!bg-emerald-500': s.staffStatus}"></span>
                {{ s.staffStatus || 'No status yet' }}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InternStaffStatusView',
  data() {
    return {
      staff: [],
      loading: false,
      error: '',
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    formatName(s) {
      const last = (s && s.lastName) || ''
      const first = (s && s.firstName) || ''
      const middle = (s && s.middleName) || ''

      if (last || first || middle) {
        const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim()
        return middle ? `${main} ${middle}`.trim() : main
      }
      return (s && (s.fullName || s.name)) || ''
    },
    async fetchStaff() {
      this.loading = true
      this.error = ''
      try {
        const res = await fetch('http://localhost:3001/staff')
        const json = await (res.ok ? res.json() : Promise.resolve(null))
        if (!json || !Array.isArray(json.staff)) {
          this.staff = []
          this.error = 'Failed to load staff list.'
          return
        }
        this.staff = json.staff

        await this.fetchStaffStatuses()
      } catch (e) {
        this.staff = []
        this.error = 'Failed to load staff list.'
      } finally {
        this.loading = false
      }
    },

    async fetchStaffStatuses() {
      if (!Array.isArray(this.staff) || this.staff.length === 0) return

      const base = 'http://localhost:3001'

      const results = await Promise.all(
        this.staff.map(async (s) => {
          try {
            if (!s || !s.id) return { id: s && s.id, staffStatus: '' }
            const res = await fetch(`${base}/staff/${encodeURIComponent(s.id)}/status`)
            const json = await (res.ok ? res.json() : Promise.resolve(null))
            return {
              id: s.id,
              staffStatus: (json && typeof json.staffStatus === 'string') ? json.staffStatus : '',
            }
          } catch {
            return { id: s && s.id, staffStatus: '' }
          }
        })
      )

      const map = new Map(results.map((r) => [r.id, r.staffStatus]))
      this.staff = this.staff.map((s) => ({
        ...s,
        staffStatus: map.get(s.id) || s.staffStatus || '',
      }))
    },
  },
}
</script>


