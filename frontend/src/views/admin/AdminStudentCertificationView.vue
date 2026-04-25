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
        const res = await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/admin/ojt-summary')
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
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'letter' })
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Professional Elegant Borders
      // Outer Navy Blue Border
      doc.setDrawColor(15, 30, 84) // Navy Blue
      doc.setLineWidth(8)
      doc.rect(20, 20, pageWidth - 40, pageHeight - 40)

      // Inner Gold Border
      doc.setDrawColor(212, 175, 55) // Gold
      doc.setLineWidth(2)
      doc.rect(32, 32, pageWidth - 64, pageHeight - 64)

      // Inner Thin Navy Blue Border
      doc.setDrawColor(15, 30, 84)
      doc.setLineWidth(1)
      doc.rect(36, 36, pageWidth - 72, pageHeight - 72)

      // Background accent (very light gray/yellow in the center)
      doc.setFillColor(252, 252, 250)
      doc.rect(37, 37, pageWidth - 74, pageHeight - 74, 'F')

      // Load logos
      try {
        const logo1 = await this.loadImage('/dictlogo2.png')
        const logo2 = await this.loadImage('/Bagongpilipinas.png')
        
        // DICT Logo (Left) - Moved closer to edge
        doc.addImage(logo1, 'PNG', 50, 55, 65, 65)
        // Bagong Pilipinas Logo (Right) - Moved closer to edge
        doc.addImage(logo2, 'PNG', pageWidth - 115, 55, 65, 65)
      } catch (err) {
        console.error('Could not load logos for certificate', err)
      }

      const internName = this.formatName(intern) || intern.username || 'Intern'
      const requiredHours = intern.ojtRequiredHours || ''
      const hoursText = requiredHours ? String(requiredHours) : '[Number of Hours]'

      const now = new Date()
      const day = this.formatOrdinal(now.getDate())
      const monthName = now.toLocaleString('en-US', { month: 'long' })
      const year = now.getFullYear()
      const issuedText = `${day} of ${monthName}, ${year}`

      const centerText = (text, y, size, font = 'Times', style = 'normal', color = [0, 0, 0]) => {
        doc.setFont(font, style)
        doc.setFontSize(size)
        doc.setTextColor(color[0], color[1], color[2])
        const textWidth = doc.getTextWidth(text)
        const x = (pageWidth - textWidth) / 2
        doc.text(text, x, y)
      }

      const centerParagraph = (text, startY, size, lineHeight = 18) => {
        doc.setFont('Times', 'normal')
        doc.setFontSize(size)
        doc.setTextColor(0, 0, 0)
        let y = startY
        const lines = doc.splitTextToSize(text, pageWidth - 160)
        lines.forEach(l => {
          const w = doc.getTextWidth(l)
          doc.text(l, (pageWidth - w) / 2, y)
          y += lineHeight
        })
        return y
      }

      let currentY = 70
      centerText('Republic of the Philippines', currentY, 11)
      currentY += 15
      centerText('Department of Information and Communications Technology', currentY, 13, 'Times', 'bold')
      currentY += 14
      centerText('Oriental Mindoro Provincial Office', currentY, 11, 'Times', 'italic')

      currentY += 50
      centerText('CERTIFICATE OF COMPLETION', currentY, 34, 'Times', 'bold', [15, 30, 84]) // Navy Blue Title
      
      currentY += 35
      centerText('This is to certify that', currentY, 16, 'Times', 'italic')
      
      currentY += 40
      centerText(internName.toUpperCase(), currentY, 28, 'Times', 'bold')
      
      const nameWidth = doc.getTextWidth(internName.toUpperCase())
      const nameX = (pageWidth - nameWidth) / 2
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(1)
      doc.line(nameX - 25, currentY + 8, nameX + nameWidth + 25, currentY + 8)

      currentY += 40
      
      const p1 = `Has successfully completed his/her On-the-Job Training (OJT) at the Department of Information and Communications Technology – Oriental Mindoro Provincial Office.`
      currentY = centerParagraph(p1, currentY, 14, 20)
      
      currentY += 10
      const p2 = `He/She has rendered a total of ${hoursText} hours of service and has satisfactorily complied with all the requirements of the internship program.`
      currentY = centerParagraph(p2, currentY, 14, 20)
      
      currentY += 10
      const p3 = `Throughout the training period, he/she demonstrated dedication, professionalism, and competence in performing assigned tasks and responsibilities in support of the office's programs and initiatives.`
      currentY = centerParagraph(p3, currentY, 14, 20)
      
      currentY += 30
      centerText(`Issued this ${issuedText} at DICT Oriental Mindoro Provincial Office, Philippines.`, currentY, 12, 'Times', 'italic', [40, 40, 40])

      currentY += 40
      const sigX = pageWidth - 300
      doc.setFont('Times', 'bold')
      doc.setFontSize(14)
      const sigName = 'ENGR. MARVIN D. BEJASA'
      const sigWidth = doc.getTextWidth(sigName)
      doc.text(sigName, sigX + (200 - sigWidth)/2, currentY) // Center within right block
      
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(1)
      doc.line(sigX, currentY + 4, sigX + 200, currentY + 4)

      currentY += 18
      doc.setFont('Times', 'normal')
      doc.setFontSize(12)
      const pos1 = 'OIC - Provincial Officer'
      const pos1Width = doc.getTextWidth(pos1)
      doc.text(pos1, sigX + (200 - pos1Width)/2, currentY)
      
      currentY += 16
      const pos2 = 'Department of Information and Communications Technology'
      doc.setFontSize(10)
      const pos2Width = doc.getTextWidth(pos2)
      doc.text(pos2, sigX + (200 - pos2Width)/2, currentY)
      
      currentY += 14
      const pos3 = 'Oriental Mindoro Provincial Office'
      const pos3Width = doc.getTextWidth(pos3)
      doc.text(pos3, sigX + (200 - pos3Width)/2, currentY)

      // Subtle seal/accent in the bottom left - Adjusted position to avoid border
      doc.setDrawColor(212, 175, 55)
      doc.setFillColor(212, 175, 55)
      doc.circle(80, pageHeight - 90, 25, 'F')
      doc.setDrawColor(255, 255, 255)
      doc.setLineWidth(1)
      doc.circle(80, pageHeight - 90, 20, 'S')
      doc.circle(80, pageHeight - 90, 15, 'S')
      doc.setFontSize(8)
      doc.setTextColor(255, 255, 255)
      doc.text('DICT', 72, pageHeight - 87)

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

