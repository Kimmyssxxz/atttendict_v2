<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Certification</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
          <div class="mb-4">
            <h2 class="m-0 text-xl text-gray-800">Student Certification</h2>
            <p class="mt-1 mb-0 text-sm text-gray-600">
              List of student interns with their OJT hours and completion certificate actions.
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
                  <th class="border border-gray-300 px-3 py-2 text-left">OJT Required Hours</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">OJT Remaining Hours</th>
                  <th class="border border-gray-300 px-3 py-2 text-left">OJT Total Hours</th>
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
                  <td class="border border-gray-300 px-3 py-2">{{ intern.ojtRequiredHours ?? '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.ojtRemainingHoursLabel || intern.ojtRemainingHours || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">{{ intern.ojtTotalHoursLabel || intern.ojtTotalHours || '-' }}</td>
                  <td class="border border-gray-300 px-3 py-2">
                    <div class="flex gap-1">
                      <button
                        type="button"
                        class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                        @click="generateCertificate(intern)"
                      >
                        Generate Completion Certificate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-else class="text-[0.95rem] text-gray-600">No student interns found.</div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import jsPDF from 'jspdf'

export default {
  name: 'AdminStudentCertificationView',
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
  },
  methods: {
    async fetchInterns() {
      this.loading = true
      this.error = ''

      try {
        const res = await fetch('http://localhost:3001/admin/ojt-summary')
        const data = await res.json()

        if (!res.ok) {
          this.error = data.message || 'Failed to load student interns for certification.'
          this.interns = []
          return
        }

        this.interns = Array.isArray(data.interns) ? data.interns : []
      } catch (err) {
        console.error('Error fetching interns for certification:', err)
        this.error = 'Failed to load student interns for certification.'
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
    formatOrdinal(day) {
      const d = Number(day)
      if (!Number.isFinite(d)) return String(day)
      const mod10 = d % 10
      const mod100 = d % 100
      if (mod10 === 1 && mod100 !== 11) return `${d}st`
      if (mod10 === 2 && mod100 !== 12) return `${d}nd`
      if (mod10 === 3 && mod100 !== 13) return `${d}rd`
      return `${d}th`
    },
    generateCertificate(intern) {
      const doc = new jsPDF({ unit: 'pt', format: 'letter' })

      const internName = this.formatName(intern) || intern.username || 'Intern'

      const totalHoursLabel = intern.ojtTotalHoursLabel || intern.ojtTotalHours || ''
      const hoursText = totalHoursLabel ? String(totalHoursLabel) : '[Number of Hours]'

      const now = new Date()
      const day = this.formatOrdinal(now.getDate())
      const monthName = now.toLocaleString('en-US', { month: 'long' })
      const year = now.getFullYear()
      const issuedText = `${day} of ${monthName}, ${year}`

      const lines = [
        'Republic of the Philippines',
        'Department of Information and Communications Technology',
        'Oriental Mindoro Provincial Office',
        '',
        'CERTIFICATE OF COMPLETION',
        '',
        'This is to certify that',
        internName,
        'has successfully completed his/her On-the-Job Training (OJT) at the Department of Information and Communications Technology – Oriental Mindoro Provincial Office.',
        `He/She has rendered a total of ${hoursText} hours of service and has satisfactorily complied with all the requirements of the internship program.`,
        'Throughout the training period, he/she demonstrated dedication, professionalism, and competence in performing assigned tasks and responsibilities in support of the office\'s programs and initiatives.',
        `Issued this ${issuedText} at DICT Oriental Mindoro Provincial Office, Philippines.`,
        '',
        'ENGR. MARVIN D. BEJASA',
        'OIC - Provincial Officer',
        'Department of Information and Communications Technology',
        'Oriental Mindoro Provincial Office',
      ]

      const pageWidth = doc.internal.pageSize.getWidth()
      let y = 80

      doc.setFont('Times', 'Normal')
      doc.setFontSize(12)

      lines.forEach((line, index) => {
        let fontSize = 12
        let isTitle = false

        if (index === 4) {
          fontSize = 18
          isTitle = true
        } else if (index === 7) {
          fontSize = 14
        }

        doc.setFontSize(fontSize)

        const text = doc.splitTextToSize(line, pageWidth - 120)
        text.forEach((part) => {
          const textWidth = doc.getTextWidth(part)
          const x = (pageWidth - textWidth) / 2
          doc.text(part, x, y)
          y += isTitle ? 28 : 18
        })

        if (line === '') {
          y += 4
        }
      })

      const safeName = internName.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'intern'
      const filename = `${safeName}_completion_certificate.pdf`
      doc.save(filename)
    },
  },
  created() {
    this.fetchInterns()
  },
}
</script>

