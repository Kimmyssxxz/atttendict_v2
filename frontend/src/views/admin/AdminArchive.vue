i
<template>
  <div class="flex h-screen bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar activeNav="archive" />


    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0">
      <header class="bg-white px-8 py-5 flex justify-between items-center z-20 sticky top-0">
        <div class="flex flex-col">
          <h1 class="text-3xl font-semibold text-gray-900 ">Archive</h1>
          <p class="text-gray-500 ">Manage archived system items</p>
        </div>
      </header>


      <div class="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6 font-sans">
        <DashboardSkeleton v-if="loading" />
        <div v-else class="space-y-6">
          <div class="bg-white p-6 md:p-8 rounded-xl shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-900 mb-6">Archive Categories</h2>
            <div class="flex gap-6 flex-wrap">
             
              <!-- Users Card -->
              <div class="bg-white rounded-xl  border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer w-64" @click="goToArchivedStaff">
                <div class="pt-6 pb-0 flex flex-col h-full bg-[#E5E9FB]">
                  <!-- Top decorative tab -->
                  <div class="h-6 flex justify-center -mt-6">
                    <div class="h-full w-28 bg-[#C6D2FD] rounded-t-xl"></div>
                  </div>
                  <div class="py-8 flex justify-center flex-1">
                    <!-- The custom user outline icon from screenshot -->
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" class="text-[#5B5CE6]">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"></circle>
                      <path d="M5 20c0-3.5 3-7 7-7 4 0 7 3.5 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                      <path d="M16 8c1.5 0 2.5 1 2.5 2.5a3.5 3.5 0 0 1-2.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                      <path d="M19 20c0-2-1-4-2.5-5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
                    </svg>
                  </div>
                  <div class="bg-white py-4 text-center border-t border-gray-100/50">
                    <h3 class="font-semibold text-gray-900 text-base">Staff</h3>
                    <p class="text-xs text-gray-500">{{ archivedStaffCount }} items</p>
                  </div>
                </div>
              </div>


              <!-- Attendance Logs Card -->
              <div class="bg-white rounded-xl  border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer w-64" @click="goToArchivedLogs">
                <div class="pt-6 pb-0 flex flex-col h-full bg-[#E5E9FB]">
                  <!-- Top decorative tab -->
                  <div class="h-6 flex justify-center -mt-6">
                    <div class="h-full w-28 bg-[#C6D2FD] rounded-t-xl"></div>
                  </div>
                  <div class="py-8 flex justify-center flex-1">
                    <!-- Calendar/Logs icon -->
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" class="text-[#5B5CE6]" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div class="bg-white py-4 text-center border-t border-gray-100/50">
                    <h3 class="font-semibold text-gray-900 text-base">Staff Record</h3>
                    <p class="text-xs text-gray-500">{{ archivedAttendancesCount }} items</p>
                  </div>
                </div>
              </div>


              <!-- Student Logs Card -->
              <div class="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer w-64" @click="goToArchivedStudentLogs">
                <div class="pt-6 pb-0 flex flex-col h-full bg-[#E5E9FB]">
                  <!-- Top decorative tab -->
                  <div class="h-6 flex justify-center -mt-6">
                    <div class="h-full w-28 bg-[#C6D2FD] rounded-t-xl"></div>
                  </div>
                  <div class="py-8 flex justify-center flex-1">
                    <!-- User/Graduation icon for Student Logs -->
                    <svg width="42" height="42" viewBox="0 0 24 24" fill="none" class="text-[#5B5CE6]" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                    </svg>
                  </div>
                  <div class="bg-white py-4 text-center border-t border-gray-100/50">
                    <h3 class="font-semibold text-gray-900 text-base">Student Intern</h3>
                    <p class="text-xs text-gray-500">{{ archivedStudentsCount }} items</p>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import AdminSidebar from './AdminSidebar.vue'
import DashboardSkeleton from '../../components/skeletons/DashboardSkeleton.vue'
import { useRouter } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'

const loading = ref(false)
import { db } from '../../firebase.js'
import { collection, query, where, getDocs } from 'firebase/firestore'


const router = useRouter()
const store = useStaffAttendanceStore()


const archivedStaffCount = ref(0)
const archivedStudentsCount = ref(0)


const archivedAttendancesCount = computed(() => {
  return store.staffAttendances.filter(att => att.isArchived).length
})


const goToArchivedStaff = () => {
  router.push('/admin/archive/staff')
}


const goToArchivedLogs = () => {
  router.push('/admin/archive/attendance-logs')
}


const goToArchivedStudentLogs = () => {
  router.push('/admin/archive/student-logs')
}


const fetchCounts = async () => {
  loading.value = true
  try {
    // Count archived staff
    const qStaff = query(collection(db, 'users'), where('role', 'in', ['staff', 'admin']), where('isArchived', '==', true))
    const snapStaff = await getDocs(qStaff)
    archivedStaffCount.value = snapStaff.size


    // Count archived students
    const qStudents = query(collection(db, 'users'), where('role', 'in', ['student', 'intern']), where('isArchived', '==', true))
    const snapStudents = await getDocs(qStudents)
    archivedStudentsCount.value = snapStudents.size
  } catch (e) {
    console.error('Error fetching archive counts', e)
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  store.fetchAllStaffAttendances()
  fetchCounts()
})
</script>



