<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50 font-sans">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white ">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-3xl font-bold bg-white text-gray-900">Admin Dashboard</h1>
            <p class="text-base text-gray-500">Overview of system status and intern activity</p>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-auto px-8 py-8">
        <DashboardSkeleton v-if="loading" />
        <div v-else>
          <!-- Stats Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div v-for="stat in stats" :key="stat.title" class="bg-white p-6 shadow-xs rounded-xl  border border-gray-100 transition-transform hover:scale-[1.02]">
              <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-full flex items-center justify-center shadow-sm border border-white/50 text-2xl" :class="stat.bgColor">
                  <span class="stat-icon" :class="stat.icon"></span>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 ">{{ stat.title }}</p>
                  <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <!-- Charts Section -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div class="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col min-h-[400px]">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Attendance Heatmap</h2>
                <p class="text-sm text-gray-500">Calendar-style overview showing presence density per day</p>
              </div>
              <div class="flex-1 w-full relative">
                 <VueApexCharts type="heatmap" height="320" :options="heatmapOptions" :series="heatmapSeries" />
                 
                 <div v-if="loadingCharts" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                   <div class="flex flex-col items-center">
                     <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
                   </div>
                 </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col min-h-[400px]">
              <div class="mb-4">
                <h2 class="text-xl font-semibold text-gray-900">Evaluation Scores</h2>
                <p class="text-sm text-gray-500">Distribution of overall rating quality</p>
              </div>
              <div class="flex-1 w-full relative">
                 <VueApexCharts type="bar" height="320" :options="evaluationOptions" :series="evaluationSeries" />
                 
                 <div v-if="loadingCharts" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
                   <div class="flex flex-col items-center">
                     <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 mb-3"></div>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Bottom Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <!-- Internship Status Section -->
            <div class="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col">
              <div class="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 class="text-xl font-semibold text-gray-900">Internship Status</h2>
                <p class="text-sm text-gray-500">Overview of intern placements, required hours, and progress</p>
              </div>
              <div class="flex gap-4">
                <div class="flex flex-col items-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                  <span class="text-sm font-semibold text-blue-600 ">Active</span>
                  <span class="text-xl font-bold text-blue-900">{{ internStats.active }}</span>
                </div>
                <div class="flex flex-col items-center px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span class="text-sm font-semibold text-emerald-600 ">Completed</span>
                  <span class="text-xl font-bold text-emerald-900">{{ internStats.completed }}</span>
                </div>
                <div class="flex flex-col items-center px-4 py-2 bg-orange-50 rounded-xl border border-orange-100">
                  <span class="text-sm font-semibold text-orange-600 ">Unplaced</span>
                  <span class="text-xl font-bold text-orange-900">{{ internStats.unplaced }}</span>
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div v-for="intern in paginatedInterns" :key="intern.id" class="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors gap-4">
                <div class="flex items-center gap-4 w-full md:w-1/3">
                  <div class="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 shrink-0 overflow-hidden">
                    <img v-if="intern.photoUrl" :src="intern.photoUrl" class="w-full h-full object-cover" />
                    <span v-else>{{ intern.initials }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="text-base font-semibold text-gray-900 truncate">{{ intern.name }}</p>
                    <span :class="intern.badgeClass" class="inline-block mt-0.5 text-[0.65rem] font-medium  px-2 py-0.5 rounded-full ">{{ intern.status }}</span>
                  </div>
                </div>
                <div class="flex-1 w-full md:px-8">
                  <div class="flex justify-between text-xs font-semibold text-gray-500 mb-2 ">
                    <span>OJT Progress</span>
                    <span>{{ intern.pct }}% ({{ intern.hours }} / {{ intern.required }} hrs)</span>
                  </div>
                  <div class="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div :class="intern.barClass" class="h-full rounded-full transition-all duration-1000 ease-out" :style="`width: ${intern.pct}%`"></div>
                  </div>
                </div>
              </div>
              <div v-if="internProgressList.length === 0" class="py-8 text-center text-gray-500 text-sm font-medium">
                No intern records available to display.
              </div>
            </div>
            
            <!-- Pagination Controls -->
            <div v-if="internProgressList.length > 0" class="flex flex-col md:flex-row items-center justify-between mt-6 border-t border-gray-100 pt-4 gap-4">
              <p class="text-xs text-gray-500">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, internProgressList.length) }} of {{ internProgressList.length }} entries
              </p>
              
              <div class="flex items-center gap-4 text-xs text-gray-600">
                <div class="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <select 
                    v-model="itemsPerPage" 
                    @change="currentPage = 1"
                    class="border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:border-blue-300"
                  >
                    <option :value="5">5</option>
                    <option :value="10">10</option>
                    <option :value="20">20</option>
                    <option :value="50">50</option>
                  </select>
                </div>
                
                <div class="flex items-center gap-3">
                  <button 
                    @click="currentPage > 1 && currentPage--" 
                    :disabled="currentPage === 1"
                    class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white font-medium shadow-sm"
                  >
                    Previous
                  </button>
                  
                  <span class="font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
                  
                  <button 
                    @click="currentPage < totalPages && currentPage++" 
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1.5 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white font-medium shadow-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>

          </div>

            <!-- Staff Ranking Section -->
            <div class="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col">
              <div class="mb-6">
                <h2 class="text-xl font-semibold text-gray-900">Staff Attendance Ranking</h2>
                <p class="text-sm text-gray-500">Top staff presence (last 30 days)</p>
              </div>
              
              <div class="flex-1 overflow-y-auto pr-2 space-y-3">
                 <div v-for="(staff, index) in topStaffList" :key="staff.id" class="flex items-center gap-3 p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-100 transition-colors">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm border"
                         :class="index === 0 ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : index === 1 ? 'bg-gray-100 text-gray-600 border-gray-300' : index === 2 ? 'bg-orange-50 text-orange-600 border-orange-200' : 'bg-blue-50 text-blue-600 border-blue-100'">
                        {{ formatOrdinal(index + 1) }}



                    </div>
                    <div class="flex-1 min-w-0">
                       <p class="text-base font-bold text-gray-900 truncate">{{ staff.name }}</p>
                       <p class="text-xs font-medium text-gray-500 truncate">{{ staff.position }}</p>
                    </div>
                    <div class="text-right flex flex-col items-end justify-center">
                       <span class="text-lg font-bold text-blue-700 leading-none">{{ staff.count }}</span>
                       <span class="text-xs text-gray-400  font-semibold mt-0.5">Days</span>
                    </div>
                 </div>
                 <div v-if="topStaffList.length === 0" class="py-12 text-center text-gray-500 text-sm font-medium">
                   <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-gray-400 mb-3">
                      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   </div>
                   <p>No staff data available.</p>
                 </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'
import VueApexCharts from 'vue3-apexcharts'
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton.vue'

const loading = ref(true)
const stats = ref([
  { title: 'Total Students', value: '...', icon: 'icon-students', bgColor: 'bg-emerald-50 text-emerald-600' },
  { title: 'Total Staff', value: '...', icon: 'icon-staff', bgColor: 'bg-blue-50 text-blue-600' },
  { title: 'Ongoing Interns', value: '...', icon: 'icon-interns', bgColor: 'bg-purple-50 text-purple-600' },
  { title: 'Archived Records', value: '...', icon: 'icon-archive', bgColor: 'bg-orange-50 text-orange-600' }
])

const loadingCharts = ref(true)

const internStats = ref({ active: 0, completed: 0, unplaced: 0 })
const topStaffList = ref([])
const internProgressList = ref([])
const currentPage = ref(1)
const itemsPerPage = ref(5)

const paginatedInterns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return internProgressList.value.slice(start, start + itemsPerPage.value);
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(internProgressList.value.length / itemsPerPage.value));
})

const formatOrdinal = (n) => {
  const j = n % 10, k = n % 100;
  if (j === 1 && k !== 11) return n + "st";
  if (j === 2 && k !== 12) return n + "nd";
  if (j === 3 && k !== 13) return n + "rd";
  return n + "th";
}

const heatmapOptions = ref({
  chart: { type: 'heatmap', toolbar: { show: false }, fontFamily: 'inherit' },
  dataLabels: { enabled: true, style: { colors: ['00000'], fontSize: '11px', fontWeight: 600 } },
  plotOptions: {
    heatmap: {
      enableShades: true,
      shadeIntensity: 0.5,
      radius: 6,
      useFillColorAsStroke: false,
      colorScale: {
        ranges: [
          { from: 0, to: 0, color: '#f3f4f6', name: 'Zero' },
          { from: 1, to: 15, color: '#93c5fd', name: 'Low' },
          { from: 16, to: 30, color: '#3b82f6', name: 'Med' },
          { from: 31, to: 1000, color: '#1d4ed8', name: 'High' }
        ]
      }
    }
  },
  grid: { show: false, padding: { right: 20 } },
  xaxis: { type: 'category', labels: { style: { colors: '#6b7280', fontWeight: 500 } } },
  yaxis: { labels: { style: { colors: '#374151', fontWeight: 500 } } }
})
const heatmapSeries = ref([])

const evaluationOptions = ref({
  chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
  colors: ['#10b981', '#3b82f6', '#ef4444'], // Green, Blue, Red
  plotOptions: { bar: { columnWidth: '50%', distributed: true, borderRadius: 4 } },
  dataLabels: { enabled: true, style: { fontSize: '14px' } },
  legend: { show: false },
  xaxis: { 
    categories: ['Excellent', 'Good', 'Needs Improvement'],
    labels: { style: { colors: '#374151', fontWeight: 500 } }
  },
  yaxis: { labels: { style: { colors: '#6b7280' } } },
  grid: { strokeDashArray: 4 }
})
const evaluationSeries = ref([{ name: 'Evaluations', data: [0, 0, 0] }])


const fetchDashboardStats = async () => {
  try {
    // 1 & 2. Total Students, Staff & Ongoing Interns
    const usersSnap = await getDocs(collection(db, 'users'))
    let totalStudents = 0
    let totalStaff = 0
    let ongoingInterns = 0
    let archivedRecords = 0

    usersSnap.forEach(doc => {
      const data = doc.data()
      if (data.isArchived) {
        archivedRecords++
      } else {
        if (data.role === 'student' || data.role === 'student-intern') {
          totalStudents++
          // Check if intern is currently active (no end date or end date in future)
          if (data.position === 'intern' || !data.endDate || new Date(data.endDate) >= new Date()) {
             ongoingInterns++ 
          }
        } else if (data.role === 'staff') {
          totalStaff++
        }
      }
    })

    // Add archived attendance records to total archived count
    const archivedStudentAttSnap = await getDocs(query(collection(db, 'attendance'), where('isArchived', '==', true)))
    const archivedStaffAttSnap = await getDocs(query(collection(db, 'staff_attendance'), where('isArchived', '==', true)))
    archivedRecords += archivedStudentAttSnap.size + archivedStaffAttSnap.size

    // Update Stats array map
    stats.value[0].value = totalStudents.toString()
    stats.value[1].value = totalStaff.toString()
    stats.value[2].value = ongoingInterns.toString()
    stats.value[3].value = archivedRecords.toString()

  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  }
}

const fetchTopStaff = async () => {
  try {
     const past = new Date()
     past.setDate(past.getDate() - 30)
     const pastStr = past.toISOString().split('T')[0]

     const [staffAttSnap, usersSnap] = await Promise.all([
         getDocs(query(collection(db, 'staff_attendance'), where('date', '>=', pastStr))),
         getDocs(query(collection(db, 'users'), where('role', '==', 'staff')))
     ])

     const usersMap = {}
     usersSnap.forEach(doc => {
         const data = doc.data()
         if (!data.isArchived) {
             usersMap[doc.id] = {
                 id: doc.id,
                 name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.username || 'Unknown Staff',
                 position: data.position || data.role || 'Staff',
                 count: 0
             }
         }
     })

     staffAttSnap.forEach(doc => {
         const data = doc.data()
         if (data.timeInAM || data.timeInPM || data.status === 'Present' || data.status === 'Late' || data.staffStatusAM === 'At Office' || data.staffStatusPM === 'At Office' || data.staffStatus === 'At Office' || data.staffStatus === 'Present') {
             if (usersMap[data.staffId]) {
                 usersMap[data.staffId].count++
             }
         }
     })

     const sorted = Object.values(usersMap).sort((a, b) => b.count - a.count)
     topStaffList.value = sorted.slice(0, 6) 
  } catch (e) {
     console.error('Error fetching top staff:', e)
  }
}

const fetchChartData = async () => {
  loadingCharts.value = true
  
  // 1. Fetch Attendance Heatmap
  try {
    const today = new Date()
    const past = new Date()
    past.setDate(today.getDate() - 40) // Buffer for indexing
    const pastStr = past.toISOString().split('T')[0]

    const [studentAttSnap, staffAttSnap] = await Promise.all([
      getDocs(query(collection(db, 'attendance'), where('date', '>=', pastStr))),
      getDocs(query(collection(db, 'staff_attendance'), where('date', '>=', pastStr)))
    ])

    const countsMap = {}
    const countPresence = (snap) => {
      snap.forEach(doc => {
        const data = doc.data()
        // Consider Present if any time in exists or explicit 'Present'/'late' status
        if (data.timeInAM || data.timeInPM || data.status === 'Present' || data.status === 'Late' || data.staffStatusAM === 'At Office' || data.staffStatusPM === 'At Office') {
           countsMap[data.date] = (countsMap[data.date] || 0) + 1
        }
      })
    }
    countPresence(studentAttSnap)
    countPresence(staffAttSnap)

    const seriesRows = { 'Mon': [], 'Tue': [], 'Wed': [], 'Thu': [], 'Fri': [] }
    const curr = new Date()
    
    // Find the exact Monday from 4 full weeks ago
    const dayOf = curr.getDay() === 0 ? 7 : curr.getDay()
    curr.setDate(curr.getDate() - dayOf + 1) // Start of THIS week (Monday)
    curr.setDate(curr.getDate() - 28) // 4 weeks back
    
    for (let w = 0; w < 5; w++) { // Display 5 weeks total
      const weekStartMonth = curr.toLocaleString('en-US', {month:'short', day:'numeric'})
      const weekCat = `${weekStartMonth}`
      
      for (let day = 0; day < 5; day++) {
        const year = curr.getFullYear()
        const month = String(curr.getMonth()+1).padStart(2,'0')
        const d = String(curr.getDate()).padStart(2,'0')
        const dStr = `${year}-${month}-${d}`
        
        const count = countsMap[dStr] || 0
        const dayName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][day]
        seriesRows[dayName].push({ x: weekCat, y: count })
        
        curr.setDate(curr.getDate() + 1)
      }
      // skip exactly to next Monday
      curr.setDate(curr.getDate() + 2)
    }

    heatmapSeries.value = Object.keys(seriesRows).map(k => ({
      name: k,
      data: seriesRows[k]
    }))

  } catch (error) {
    console.error('Error fetching attendance heatmap:', error)
  }

  // 2. Fetch Evaluation Score Distribution
  try {
    const evalSnap = await getDocs(collection(db, 'dtc_training_evaluations'))
    let exc = 0, good = 0, needsImp = 0

    evalSnap.forEach(doc => {
      const e = doc.data()
      const getAvg = (obj) => {
        if (!obj) return 0
        const vals = Object.values(obj).map(v => Number(v)).filter(v => !isNaN(v))
        return vals.length ? vals.reduce((a,b) => a+b, 0) / vals.length : 0
      }
      
      const rp = getAvg(e.resourcePersonEvaluation)
      const cc = getAvg(e.courseContentEvaluation)
      const ve = getAvg(e.venueEvaluation)
      const valid = [rp, cc, ve].filter(x => x > 0)
      const overall = valid.length ? valid.reduce((a,b)=>a+b, 0)/valid.length : 0
      
      if (overall >= 4.5) exc++
      else if (overall >= 3.5) good++
      else if (overall > 0) needsImp++
    })

    evaluationSeries.value = [{ name: 'Evaluations', data: [exc, good, needsImp] }]
  } catch(e) { console.error('Error fetching evaluations:', e) }
  
  // 3. Fetch Internship Status (Progress & Placement)
  try {
    const ojtRes = await fetch((import.meta.env.VITE_API_BASE_URL || '${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}')/admin/ojt-summary')
    if (ojtRes.ok) {
      const ojtData = await ojtRes.json()
      let list = Array.isArray(ojtData.interns) ? ojtData.interns : []
      
      list = list.filter(i => !i.isArchived && (i.role === 'student' || i.role === 'student-intern' || i.position === 'intern'))
      
      let active = 0, completed = 0, unplaced = 0
      const processedList = []

      list.forEach(i => {
        const req = Number(i.ojtRequiredHours) || 500
        const act = Number(i.ojtTotalHours) || 0
        const pct = Math.min(100, Math.round((act / req) * 100))
        
        const name = [i.firstName, i.lastName].filter(Boolean).join(' ') || i.username || 'Intern'
        const initials = name.substring(0,2).toUpperCase()

        let status = 'Unplaced'
        let badgeClass = 'bg-orange-100 text-orange-700 border border-orange-200'
        let barClass = 'bg-orange-500'

        if (pct >= 100) {
           status = 'Completed'
           completed++
           badgeClass = 'bg-emerald-100 text-emerald-700 border border-emerald-200'
           barClass = 'bg-emerald-500'
        } else if (act > 0 || i.position === 'intern') {
           status = 'Active Intern'
           active++
           badgeClass = 'bg-blue-100 text-blue-700 border border-blue-200'
           barClass = 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
        } else {
           unplaced++
        }

        processedList.push({
          id: i.id || Math.random().toString(),
          name, initials, pct, hours: act, required: req,
          status, badgeClass, barClass,
          photoUrl: i.photoUrl || null
        })
      })

      internStats.value = { active, completed, unplaced }
      internProgressList.value = processedList.sort((a,b) => b.pct - a.pct)
      currentPage.value = 1 // Reset to page 1 on new data
    }
  } catch(e) { console.error('Error fetching internship status:', e) }

  loadingCharts.value = false
}


onMounted(async () => {
  loading.value = true
  await Promise.all([
    fetchDashboardStats(),
    fetchChartData(),
    fetchTopStaff()
  ])
  loading.value = false
})
</script>

<style scoped>
.stat-icon {
  width: 24px;
  height: 24px;
  background-color: currentColor;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
  display: inline-block;
}

.icon-students {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M23 9A7 7 0 1 1 9 9a7 7 0 0 1 14 0m-2 0a5 5 0 1 0-10 0a5 5 0 0 0 10 0M7.5 18A3.5 3.5 0 0 0 4 21.5v.5c0 2.393 1.523 4.417 3.685 5.793C9.859 29.177 12.802 30 16 30s6.14-.823 8.315-2.207C26.477 26.417 28 24.393 28 22v-.5a3.5 3.5 0 0 0-3.5-3.5zM6 21.5A1.5 1.5 0 0 1 7.5 20h17a1.5 1.5 0 0 1 1.5 1.5v.5c0 1.473-.94 2.949-2.759 4.106C21.434 27.256 18.877 28 16 28s-5.434-.744-7.241-1.894C6.939 24.95 6 23.472 6 22z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M23 9A7 7 0 1 1 9 9a7 7 0 0 1 14 0m-2 0a5 5 0 1 0-10 0a5 5 0 0 0 10 0M7.5 18A3.5 3.5 0 0 0 4 21.5v.5c0 2.393 1.523 4.417 3.685 5.793C9.859 29.177 12.802 30 16 30s6.14-.823 8.315-2.207C26.477 26.417 28 24.393 28 22v-.5a3.5 3.5 0 0 0-3.5-3.5zM6 21.5A1.5 1.5 0 0 1 7.5 20h17a1.5 1.5 0 0 1 1.5 1.5v.5c0 1.473-.94 2.949-2.759 4.106C21.434 27.256 18.877 28 16 28s-5.434-.744-7.241-1.894C6.939 24.95 6 23.472 6 22z'/%3E%3C/svg%3E");
}

.icon-staff {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%23000' d='M10 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8M7 6a3 3 0 1 1 6 0a3 3 0 0 1-6 0m-1.991 5A2 2 0 0 0 3 13c0 1.691.833 2.966 2.135 3.797c1.05.669 2.398 1.049 3.87 1.165q.014-.153.052-.309l.17-.678c-1.413-.093-2.646-.442-3.554-1.022C4.623 15.283 4 14.31 4 13c0-.553.448-1 1.009-1h7.934l1-1zm5.97 4.377l4.83-4.83a1.87 1.87 0 1 1 2.645 2.646l-4.83 4.829a2.2 2.2 0 0 1-1.02.578l-1.498.374a.89.89 0 0 1-1.079-1.078l.375-1.498a2.2 2.2 0 0 1 .578-1.02'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%23000' d='M10 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8M7 6a3 3 0 1 1 6 0a3 3 0 0 1-6 0m-1.991 5A2 2 0 0 0 3 13c0 1.691.833 2.966 2.135 3.797c1.05.669 2.398 1.049 3.87 1.165q.014-.153.052-.309l.17-.678c-1.413-.093-2.646-.442-3.554-1.022C4.623 15.283 4 14.31 4 13c0-.553.448-1 1.009-1h7.934l1-1zm5.97 4.377l4.83-4.83a1.87 1.87 0 1 1 2.645 2.646l-4.83 4.829a2.2 2.2 0 0 1-1.02.578l-1.498.374a.89.89 0 0 1-1.079-1.078l.375-1.498a2.2 2.2 0 0 1 .578-1.02'/%3E%3C/svg%3E");
}

.icon-interns {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M22.5 18a3.5 3.5 0 0 1 3.5 3.5v.5c0 2.393-1.523 4.417-3.685 5.793C20.141 29.177 17.198 30 14 30s-6.141-.823-8.315-2.207C3.523 26.417 2 24.393 2 22v-.5A3.5 3.5 0 0 1 5.5 18zm-17 2A1.5 1.5 0 0 0 4 21.5v.5c0 1.473.94 2.949 2.759 4.106C8.566 27.256 11.123 28 14 28s5.434-.744 7.241-1.894C23.061 24.95 24 23.472 24 22v-.5a1.5 1.5 0 0 0-1.5-1.5zM14 2a7 7 0 1 1 0 14a7 7 0 0 1 0-14m13.355.092a1 1 0 0 1 1.316.517A15.95 15.95 0 0 1 30 9c0 2.27-.475 4.432-1.33 6.39a1 1 0 0 1-1.833-.798A13.95 13.95 0 0 0 28 9c0-1.99-.416-3.88-1.163-5.592a1 1 0 0 1 .518-1.316M14 4a5 5 0 1 0 0 10a5 5 0 0 0 0-10m10.138.611a1 1 0 0 1 1.262.638c.389 1.18.6 2.442.6 3.751c0 1.31-.212 2.57-.6 3.75a1 1 0 0 1-1.9-.625c.323-.983.5-2.033.5-3.125a10 10 0 0 0-.5-3.126a1 1 0 0 1 .638-1.263'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M22.5 18a3.5 3.5 0 0 1 3.5 3.5v.5c0 2.393-1.523 4.417-3.685 5.793C20.141 29.177 17.198 30 14 30s-6.141-.823-8.315-2.207C3.523 26.417 2 24.393 2 22v-.5A3.5 3.5 0 0 1 5.5 18zm-17 2A1.5 1.5 0 0 0 4 21.5v.5c0 1.473.94 2.949 2.759 4.106C8.566 27.256 11.123 28 14 28s5.434-.744 7.241-1.894C23.061 24.95 24 23.472 24 22v-.5a1.5 1.5 0 0 0-1.5-1.5zM14 2a7 7 0 1 1 0 14a7 7 0 0 1 0-14m13.355.092a1 1 0 0 1 1.316.517A15.95 15.95 0 0 1 30 9c0 2.27-.475 4.432-1.33 6.39a1 1 0 0 1-1.833-.798A13.95 13.95 0 0 0 28 9c0-1.99-.416-3.88-1.163-5.592a1 1 0 0 1 .518-1.316M14 4a5 5 0 1 0 0 10a5 5 0 0 0 0-10m10.138.611a1 1 0 0 1 1.262.638c.389 1.18.6 2.442.6 3.751c0 1.31-.212 2.57-.6 3.75a1 1 0 0 1-1.9-.625c.323-.983.5-2.033.5-3.125a10 10 0 0 0-.5-3.126a1 1 0 0 1 .638-1.263'/%3E%3C/svg%3E");
}

.icon-archive {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h9q.425 0 .713.288T22 7t-.288.713T21 8h-9.825l-2-2H4v12l1.975-6.575q.2-.65.738-1.037T7.9 10h12.9q1.025 0 1.613.813t.312 1.762l-1.8 6q-.2.65-.737 1.038T19 20zm2.1-2H19l1.8-6H7.9zM4 11.45V6zM6.1 18l1.8-6z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h5.175q.4 0 .763.15t.637.425L12 6h9q.425 0 .713.288T22 7t-.288.713T21 8h-9.825l-2-2H4v12l1.975-6.575q.2-.65.738-1.037T7.9 10h12.9q1.025 0 1.613.813t.312 1.762l-1.8 6q-.2.65-.737 1.038T19 20zm2.1-2H19l1.8-6H7.9zM4 11.45V6zM6.1 18l1.8-6z'/%3E%3C/svg%3E");
}
</style>
