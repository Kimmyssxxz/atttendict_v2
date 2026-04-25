<template>
  <div class="flex h-screen bg-white font-sans antialiased text-gray-900">
    <StaffSidebar activeNav="monthly-summary" />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col relative min-w-0 overflow-hidden z-0">
      <!-- Top Header -->
      <header class="bg-[#133e75] md:bg-white md:border-b md:border-gray-200 px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-5 flex justify-between items-center relative z-20">
        <!-- Mobile Header (Back Button + Centered Title) -->
        <div v-if="isMobile" class="w-full flex items-center justify-center relative py-1">
          <button @click="router.back()" class="absolute left-0 p-1 text-white rounded-full transition-colors" aria-label="Go back">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h1 class="text-xl font-semibold text-white">Calendar</h1>
        </div>

        <!-- Desktop Header Layout -->
        <template v-else>
          <h1 class="text-base text-gray-800 font-medium"></h1>
          <div class="flex items-center gap-4">
            <div ref="avatarWrapEl" class="relative flex items-center">
              <button class="w-9 h-9 rounded-full bg-gray-800 text-white border-none cursor-pointer text-sm hover:bg-gray-900 transition-colors duration-200" type="button" @click="toggleAvatarMenu" aria-haspopup="true" :aria-expanded="avatarMenuOpen">
                <img v-if="userPhotoUrl" :src="userPhotoUrl" class="w-full h-full rounded-full object-cover block" alt="Profile" />
                <span v-else class="inline-flex w-full h-full items-center justify-center">{{ userInitials || 'U' }}</span>
              </button>

              <div v-if="avatarMenuOpen" class="absolute top-[calc(100%+10px)] right-0 w-[300px] bg-white border border-slate-900/5 rounded-xl shadow-[0_14px_30px_rgba(0,0,0,0.12)] overflow-hidden z-50 origin-top-right transition-all" role="menu">
                <div class="flex gap-3 p-3.5 border-b border-slate-900/5">
                  <div class="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-900">
                    <img v-if="userPhotoUrl" class="w-full h-full object-cover block" :src="userPhotoUrl" alt="Profile" />
                    <div v-else class="w-full h-full flex items-center justify-center text-white font-bold">{{ userInitials || 'U' }}</div>
                  </div>
                  <div class="flex flex-col justify-center min-w-0">
                    <div class="font-bold text-slate-900 text-sm truncate">{{ userDisplayName || 'User' }}</div>
                    <div class="text-xs text-slate-500 truncate">{{ userEmail || '' }}</div>
                  </div>
                </div>

                <button class="w-full flex items-center gap-2.5 px-3.5 py-3 border-none bg-transparent cursor-pointer text-slate-900 font-medium text-sm text-left hover:bg-slate-900/5 transition-colors" type="button" @click="navigateTo('StaffSettings', 'settings')" role="menuitem">
                  <svg class="text-slate-700 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  <span>Settings</span>
                  <span class="ml-auto text-slate-400 text-lg font-bold">›</span>
                </button>

                <button class="w-full flex items-center gap-2.5 px-3.5 py-3 border-none bg-transparent cursor-pointer text-slate-900 font-medium text-sm text-left hover:bg-slate-900/5 transition-colors" type="button" @click="handleLogout" role="menuitem">
                  <svg class="text-slate-700 shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        </template>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8 flex flex-col items-center justify-center">
        <div class="max-w-full mx-auto">
          <div class="mb-8 hidden md:block">
            <h2 class="text-3xl text-gray-900 font-bold">Calendar</h2>
            <p class="text-sm text-gray-500 mt-1">Review your monthly attendance records</p>
          </div>
        </div>

        <div class="w-full max-w-3xl mx-auto">
          <CalendarSkeleton v-if="loading" />
          <template v-else>
            <div class="bg-white rounded-3xl  border border-gray-100 overflow-hidden">
            <div class="flex flex-row justify-between items-center p-4 border-b border-gray-50 bg-white sticky top-0 z-10">
              <button aria-label="Previous month" @click="prevMonth" class="p-2 hover:bg-gray-50 rounded-xl transition-all text-[#133e75] active:scale-95">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              
              <div class="text-center">
                <h2 class="text-xl font-bold text-[#133e75] tracking-tight">{{ monthYearLabel }}</h2>
              </div>

              <button aria-label="Next month" @click="nextMonth" class="p-2 hover:bg-gray-50 rounded-xl transition-all text-[#133e75] active:scale-95">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>

            <div class="p-3 sm:p-4">
              <div class="grid grid-cols-7 gap-1 mb-2">
                <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-2">
                  {{ day }}
                </div>
              </div>

              <div class="grid grid-cols-7 gap-1.5 sm:gap-2">
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  class="aspect-square flex flex-col items-center justify-center relative rounded-xl transition-all overflow-hidden border border-gray-100/50"
                  :class="[
                    !cell.inCurrentMonth ? 'opacity-20 pointer-events-none' : (cell.isToday ? 'bg-[#133e75]' : 'bg-white hover:bg-gray-50 cursor-pointer'),
                  ]"
                >
                  <!-- Background Layers for Sessions -->
                  <div class="absolute inset-x-0 top-0 h-1/2 transition-colors duration-300" :style="getSessionBg(cell.status?.am)"></div>
                  <div class="absolute inset-x-0 bottom-0 h-1/2 transition-colors duration-300" :style="getSessionBg(cell.status?.pm)"></div>
                  
                  <!-- Cell Content -->
                  <div class="relative z-10 flex flex-col items-center justify-center w-full h-full gap-0.5">
                    <span class="text-xs sm:text-sm font-bold" 
                          :class="[
                            cell.isToday ? 'text-white' : (cell.status ? 'text-gray-900' : 'text-gray-700')
                          ]">
                      {{ cell.day }}
                    </span>
                    
                    <!-- Status Label -->
                    <div v-if="cell.status && cell.inCurrentMonth" class="flex flex-col items-center" :class="{'text-white/90': cell.isToday}">
                      <span v-if="isFullDay(cell.status)" class="text-[7px] leading-none font-black uppercase tracking-tighter opacity-70">
                        {{ getStatusLabel(cell.status.am) }}
                      </span>
                      <div v-else class="flex flex-col items-center gap-0">
                        <span v-if="cell.status.am !== 'none'" class="text-[6px] leading-none font-black uppercase tracking-tighter opacity-60">AM</span>
                        <span v-if="cell.status.pm !== 'none'" class="text-[6px] leading-none font-black uppercase tracking-tighter opacity-60">PM</span>
                      </div>
                    </div>
                  </div>

                  <!-- Today indicator label (subtle) -->
                  <div v-if="cell.isToday" class="absolute top-1 left-2 text-[6px] font-bold text-white uppercase tracking-widest">Today</div>
                </div>
              </div>
            </div>

            <!-- Modern Pill Legend -->
            <div class="px-4 py-4 border-t border-gray-50 bg-gray-50/30">
              <div class="flex flex-nowrap justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar pb1">
                <div v-for="item in legendItems" :key="item.label" 
                     class="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[9px] font-semibold"
                     :class="item.bgClass">
                  <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {{ item.label }}
                </div>
              </div>
            </div>
          </div>
          </template>
        </div>
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db } from '../../firebase'
import StaffSidebar from './StaffSidebar.vue'
import CalendarSkeleton from '../../components/skeletons/CalendarSkeleton.vue'

const router = useRouter()
const activeTab = ref('current')
const activeNav = ref('monthly-summary')
const loading = ref(true)

const isMobile = ref(false)
const handleResize = () => {
  isMobile.value = window.innerWidth < 768
}

const today = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const pad2 = (n) => String(n).padStart(2, '0')

const toDateKey = (d) => {
  const dt = new Date(d)
  const yyyy = dt.getFullYear()
  const mm = pad2(dt.getMonth() + 1)
  const dd = pad2(dt.getDate())
  return `${yyyy}-${mm}-${dd}`
}

const visibleMonth = ref(new Date())
visibleMonth.value.setDate(1)
visibleMonth.value.setHours(0, 0, 0, 0)

const monthYearLabel = computed(() => {
  return visibleMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
})

const resolveStaffLocal = () => {
  const keys = ['user', 'staffUser']
  for (const k of keys) {
    const raw = localStorage.getItem(k)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw)
      const resolved = parsed?.user ? parsed.user : parsed
      if (resolved) return resolved
    } catch {
      // ignore
    }
  }
  return null
}

const currentStaff = computed(() => {
  return resolveStaffLocal()
})

const staffId = computed(() => {
  const u = currentStaff.value
  return u?.uid || u?.id || u?.staffId || u?._id || null
})

const staffProfile = ref(null)

const avatarMenuOpen = ref(false)
const avatarWrapEl = ref(null)

const userDisplayName = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  const firstName = typeof p?.firstName === 'string' ? p.firstName.trim() : ''
  const lastName = typeof p?.lastName === 'string' ? p.lastName.trim() : ''
  const full = `${firstName} ${lastName}`.trim()
  return full || 'Unknown User'
})

const userEmail = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  return (typeof p?.email === 'string' ? p.email.trim() : '') || ''
})

const userPhotoUrl = computed(() => {
  const p = staffProfile.value || currentStaff.value || null
  return p?.photoUrl || p?.photoURL || p?.avatarUrl || p?.profilePicture || p?.profileImage || null
})

const userInitials = computed(() => {
  const name = userDisplayName.value || userEmail.value
  if (!name) return 'U'
  return name.trim().charAt(0).toUpperCase()
})

const toggleAvatarMenu = () => {
  avatarMenuOpen.value = !avatarMenuOpen.value
}

const handleLogout = () => {
  localStorage.removeItem('staffUser')
  localStorage.removeItem('user') // Also clear unified user if it exists
  router.push({ name: 'LoginView' })
}

const onDocumentClick = (e) => {
  if (!avatarMenuOpen.value) return
  const el = avatarWrapEl.value
  if (!el) return
  if (el.contains(e.target)) return
  avatarMenuOpen.value = false
}

const loadStaffProfile = async () => {
  staffProfile.value = null
  if (!staffId.value) return

  try {
    const snap = await getDoc(doc(db, 'users', staffId.value))
    if (snap.exists()) {
      staffProfile.value = { id: snap.id, ...(snap.data() || {}) }
    }
  } catch {
    // ignore; avatar will fall back to localStorage user
  }
}

const monthStartKey = computed(() => {
  const d = new Date(visibleMonth.value)
  d.setDate(1)
  return toDateKey(d)
})

const monthEndKey = computed(() => {
  const d = new Date(visibleMonth.value)
  d.setMonth(d.getMonth() + 1)
  d.setDate(0)
  return toDateKey(d)
})

const attendanceByDate = ref({})
let unsubscribeAttendance = null

const normalizeStatus = (raw) => {
  const s = String(raw || '').toLowerCase()
  if (s.includes('office')) return 'office'
  if (s.includes('present')) return 'office' // legacy fallback
  if (s.includes('travel')) return 'travel'
  if (s.includes('field')) return 'field'
  if (s.includes('leave')) return 'leave'
  return null
}

const resolveDayStatus = (docData) => {
  if (!docData) return null

  // If the whole day has a status (like 'Leave'), only show it if APPROVED
  if (docData.staffStatus === 'Leave') {
    if (docData.validationStatus === 'Approved') {
      return { am: 'leave', pm: 'leave' }
    } else {
      return null // Don't show leave dot if NOT approved
    }
  }

  let am = normalizeStatus(docData.staffStatusAM || docData.statusAM)
  let pm = normalizeStatus(docData.staffStatusPM || docData.statusPM)

  // Fallback to general staffStatus if session-specific status is missing but user clocked in
  if (!am && docData.timeInAM) {
    am = normalizeStatus(docData.staffStatus) || 'office'
  }
  if (!pm && docData.timeInPM) {
    pm = normalizeStatus(docData.staffStatus) || 'office'
  }

  if (!am && !pm) return null

  // Explicitly check for 'leave' in AM/PM and hide if not approved
  const finalAm = (am === 'leave' && docData.validationStatus !== 'Approved') ? 'none' : (am || 'none')
  const finalPm = (pm === 'leave' && docData.validationStatus !== 'Approved') ? 'none' : (pm || 'none')

  if (finalAm === 'none' && finalPm === 'none') return null

  return {
    am: finalAm,
    pm: finalPm
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'office': return '#10b981' // Emerald
    case 'field': return '#3b82f6'  // Blue
    case 'travel': return '#a855f7' // Purple
    case 'leave': return '#f97316'  // Orange
    default: return 'transparent'
  }
}

const getSessionBg = (status) => {
  if (!status || status === 'none') return {}
  const color = getStatusColor(status)
  // Use a softer opacity for AM/PM indicators to keep it modern
  return {
    backgroundColor: color,
    opacity: 0.25
  }
}

const isFullDay = (statusObj) => {
  return statusObj && statusObj.am !== 'none' && statusObj.am === statusObj.pm
}

const getStatusLabel = (status) => {
  switch (status) {
    case 'office': return 'Office'
    case 'field': return 'Field'
    case 'travel': return 'Travel'
    case 'leave': return 'Leave'
    default: return ''
  }
}

const legendItems = [
  { label: 'At Office', bgClass: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
  { label: 'On Field', bgClass: 'bg-blue-50 text-blue-700 border-blue-100' },
  { label: 'Travel', bgClass: 'bg-purple-50 text-purple-700 border-purple-100' },
  { label: 'Leave', bgClass: 'bg-orange-50 text-orange-700 border-orange-100' }
]

const subscribeToMonthAttendance = () => {
  if (unsubscribeAttendance) {
    unsubscribeAttendance()
    unsubscribeAttendance = null
  }

  attendanceByDate.value = {}
  loading.value = true

  if (!staffId.value) return

  // Widen query range to catch leaves that might have started outside the current month
  const qStart = new Date(visibleMonth.value)
  qStart.setMonth(qStart.getMonth() - 2) // Look back 2 months
  const qStartKey = toDateKey(qStart)

  const q = query(
    collection(db, 'staff_attendance'),
    where('staffId', '==', staffId.value),
    where('date', '>=', qStartKey),
    where('date', '<=', monthEndKey.value),
    orderBy('date', 'asc')
  )

  unsubscribeAttendance = onSnapshot(q, (snapshot) => {
    const map = {}
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {}
      
      // Traditional single-day mapping
      if (data.date) {
        const status = resolveDayStatus(data)
        if (status) {
           map[data.date] = status
        }
      }

      // Expand Leave duration if present AND APPROVED (regardless of daily staffStatus)
      if (data.leaveStartDate && data.leaveEndDate && data.validationStatus === 'Approved') {
        const [sY, sM, sD] = data.leaveStartDate.split('-').map(Number)
        const [eY, eM, eD] = data.leaveEndDate.split('-').map(Number)
        
        const start = new Date(sY, sM - 1, sD)
        const end = new Date(eY, eM - 1, eD)
        
        const iter = new Date(start)
        while (iter <= end) {
          const k = toDateKey(iter)
          map[k] = { am: 'leave', pm: 'leave' }
          iter.setDate(iter.getDate() + 1)
        }
      }
    })
    attendanceByDate.value = map
    loading.value = false
  })
}

const calendarCells = computed(() => {
  const base = new Date(visibleMonth.value)
  base.setDate(1)
  base.setHours(0, 0, 0, 0)

  const firstDayOfWeek = base.getDay() // 0..6 (Sun..Sat)
  const start = new Date(base)
  start.setDate(base.getDate() - firstDayOfWeek)

  const end = new Date(base)
  end.setMonth(base.getMonth() + 1)
  end.setDate(0) // last day of month
  end.setHours(0, 0, 0, 0)
  const lastDayOfWeek = end.getDay()
  const gridEnd = new Date(end)
  gridEnd.setDate(end.getDate() + (6 - lastDayOfWeek))

  const cells = []
  const iter = new Date(start)
  const todayKey = toDateKey(today())
  const month = base.getMonth()

  while (iter <= gridEnd) {
    const key = toDateKey(iter)
    cells.push({
      key,
      dateKey: key,
      day: iter.getDate(),
      inCurrentMonth: iter.getMonth() === month,
      isToday: key === todayKey,
      status: attendanceByDate.value[key] || null
    })
    iter.setDate(iter.getDate() + 1)
  }

  return cells
})

const prevMonth = () => {
  const d = new Date(visibleMonth.value)
  d.setMonth(d.getMonth() - 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  visibleMonth.value = d
}

const nextMonth = () => {
  const d = new Date(visibleMonth.value)
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  visibleMonth.value = d
}

const goToday = () => {
  const d = today()
  d.setDate(1)
  visibleMonth.value = d
}

const navigateTo = (routeName, navItem) => {
  activeNav.value = navItem
  router.push({ name: routeName })
}

onMounted(() => {
  subscribeToMonthAttendance()
  loadStaffProfile()
  document.addEventListener('click', onDocumentClick)
  
  handleResize()
  window.addEventListener('resize', handleResize)
})

watch([monthStartKey, monthEndKey, staffId], () => {
  subscribeToMonthAttendance()
})

watch(staffId, () => {
  loadStaffProfile()
})

onUnmounted(() => {
  if (unsubscribeAttendance) unsubscribeAttendance()
  document.removeEventListener('click', onDocumentClick)
  window.removeEventListener('resize', handleResize)
})
</script>
