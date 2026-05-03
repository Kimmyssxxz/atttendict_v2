<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white text-gray-900">
        <h1 class="m-0 text-3xl font-semibold">Student Certification</h1>
      </header>

      <main class="flex-1 px-8 py-6 font-sans">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else>
          <section class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div class="mb-4">
            <h2 class="m-0 text-2xl font-semibold text-gray-900">Student Certification</h2>
            <p class=" text-gray-600">
              List of student interns with their OJT hours and completion certificate actions.
            </p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  v-model="search" 
                  class="w-full sm:w-[320px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all font-medium"
                  placeholder="Search by name, username, or email..."
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Required</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Rendered</th>
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
                    <td class="px-4 py-3 text-sm font-semibold text-gray-700">{{ intern.ojtRequiredHours ?? '-' }}h</td>
                    <td class="px-4 py-3 text-sm">
                      <span class="px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold">
                        {{ intern.ojtRemainingHoursLabel || intern.ojtRemainingHours || '-' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <span class="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-bold">
                        {{ intern.ojtTotalHoursLabel || intern.ojtTotalHours || '-' }}
                      </span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        type="button"
                        class="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg transition-all hover:bg-gray-100 hover:border-gray-300 text-xs font-semibold cursor-pointer"
                        @click="generateCertificate(intern)"
                        title="Generate Certificate"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <span>Generate</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else-if="!filteredInterns.length && !error" class="py-12 text-center text-gray-500 font-medium">No results found for your search.</div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import jsPDF from 'jspdf'

export default {
  name: 'AdminStudentCertificationView',
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
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/admin/ojt-summary`)
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
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = url
      })
    },
    async generateCertificate(intern) {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // --- HELPERS ---
      const centerText = (text, y, size, font = 'Helvetica', style = 'normal', color = [0, 0, 0]) => {
        doc.setFont(font, style)
        doc.setFontSize(size)
        doc.setTextColor(color[0], color[1], color[2])
        const textWidth = doc.getTextWidth(text)
        const x = (pageWidth - textWidth) / 2
        doc.text(text, x, y)
      }

      const centerParagraph = (text, startY, size, lineHeight = 18, color = [0,0,0]) => {
        doc.setFont('Helvetica', 'normal')
        doc.setFontSize(size)
        doc.setTextColor(color[0], color[1], color[2])
        let y = startY
        const lines = doc.splitTextToSize(text, pageWidth - 200)
        lines.forEach(l => {
          const w = doc.getTextWidth(l)
          doc.text(l, (pageWidth - w) / 2, y)
          y += lineHeight
        })
        return y
      }

      // --- COLORS ---
      const navyBlue = [26, 77, 140]
      const goldYellow = [255, 204, 0]
      const dictRed = [185, 46, 43]
      const recipientBlue = [36, 79, 145]
      let currentY = 180

      // --- BACKGROUND & BORDER IMAGES ---
      try {
        const bgImg = await this.loadImage('/cert bg 1.jpg')
        doc.addImage(bgImg, 'JPEG', 0, 0, pageWidth, pageHeight)
        
        const borderImg = await this.loadImage('/cert border 4.png')
        doc.addImage(borderImg, 'PNG', 0, 0, pageWidth, pageHeight)
      } catch (err) {
        console.error('Could not load images', err)
        doc.setFillColor(255, 255, 255)
        doc.rect(0, 0, pageWidth, pageHeight, 'F')
      }

      // --- LOGOS (Top Single Row) ---
      try {
        const [logoDict, logoBP, logoILCDB, logoDTC] = await Promise.all([
          this.loadImage('/dictlogo2.png'),
          this.loadImage('/Bagongpilipinas.png'),
          this.loadImage('/ilcdb-removebg-preview.png'),
          this.loadImage('/OIP-removebg-preview.png')
        ])
        
        let logoY = 55
        const logoHeight = 55
        const getWidth = (img, h) => (img.width / img.height) * h
        const w1 = getWidth(logoDict, logoHeight); const w2 = getWidth(logoBP, logoHeight)
        const w3 = getWidth(logoILCDB, logoHeight); const w4 = getWidth(logoDTC, logoHeight)
        const gap = 30
        const totalLogosWidth = w1 + w2 + w3 + w4 + (gap * 3)
        let currentX = (pageWidth - totalLogosWidth) / 2
        
        doc.addImage(logoDict, 'PNG', currentX, logoY, w1, logoHeight); currentX += w1 + gap
        doc.addImage(logoBP, 'PNG', currentX, logoY, w2, logoHeight); currentX += w2 + gap
        doc.addImage(logoILCDB, 'PNG', currentX, logoY, w3, logoHeight); currentX += w3 + gap
        doc.addImage(logoDTC, 'PNG', currentX, logoY, w4, logoHeight)
        
        logoY += logoHeight + 25
        centerText('Republic of the Philippines', logoY, 11, 'Helvetica', 'normal', [0, 0, 0])
        logoY += 15
        centerText('DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY', logoY, 12, 'Helvetica', 'bold', [0, 0, 0])
        logoY += 14
        centerText('STA. ISABEL, CALAPAN CITY ORIENTAL MINDORO', logoY, 11, 'Helvetica', 'normal', [0, 0, 0])
        currentY = logoY + 45 
      } catch (err) {
        console.error('Could not load logos for certificate', err)
        currentY = 220
      }

      const internName = (this.formatName(intern) || intern.username || 'Intern').toUpperCase()
      const now = new Date()
      const day = this.formatOrdinal(now.getDate())
      const monthName = now.toLocaleString('en-US', { month: 'long' })
      const year = now.getFullYear()

      const sigName = 'ENGR. MARVIN D. BEJASA'
      const sigPos1 = 'OIC - PROVINCIAL OFFICER'
      const sigPos2 = 'DICT ORIENTAL MINDORO'

      centerText('CERTIFICATE OF COMPLETION', currentY, 38, 'Helvetica', 'bold', navyBlue)
      currentY += 35
      centerText('This certificate is awarded to', currentY, 18, 'Helvetica', 'normal', [50, 50, 50])
      currentY += 60
      centerText(internName, currentY, 42, 'Helvetica', 'bold', recipientBlue)
      
      doc.setDrawColor(navyBlue[0], navyBlue[1], navyBlue[2]); doc.setLineWidth(2)
      doc.line(80, currentY + 15, pageWidth - 80, currentY + 15)

      currentY += 45
      const description = `For his invaluable contribution as one of our On-the-Job trainee from Mindoro State University- Bongabong Campus that significantly help the institution in delivering extension services to our clients.`
      currentY = centerParagraph(description, currentY, 13, 18, [36, 79, 145])
      
      currentY += 30
      const dateText = `Given this ${day} day of ${monthName} ${year} at the Department of Information and Communications Technology – MIMAROPA Oriental Mindoro.`
      centerText(dateText, currentY, 13, 'Helvetica', 'normal', [36, 79, 145])

      currentY = pageHeight - 100
      doc.setDrawColor(0, 0, 0); doc.setLineWidth(1.5)
      doc.line((pageWidth - 200) / 2, currentY, (pageWidth + 200) / 2, currentY)
      currentY += 20
      centerText(sigName, currentY, 14, 'Helvetica', 'bold')
      currentY += 16
      centerText(sigPos1, currentY, 12, 'Helvetica', 'normal', [80, 80, 80])
      currentY += 14
      centerText(sigPos2, currentY, 12, 'Helvetica', 'normal', [80, 80, 80])

      const safeName = internName.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'intern'
      doc.save(`${safeName}_completion_certificate.pdf`)
    },
  },
  created() {
    this.fetchInterns()
  },
}
</script>

