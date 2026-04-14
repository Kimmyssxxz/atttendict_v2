<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Client Logbook</h1>
      </header>
      
      <main class="flex-1 px-8 py-6">
        <div class="bg-white p-6 rounded-2xl">
          <!-- Header Section -->
          <div class="mb-6">
            <h2 class="text-2xl font-medium text-gray-900">Client Logbook</h2>
            <p class="text-gray-500 mt-1">Manage and review client service logbook entries.</p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  v-model="filters.search" 
                  class="w-full sm:w-[300px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                  placeholder="Search logbook entries..."
                />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
            
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <!-- Date Range Filter - Minimalist -->
              <div class="flex items-center gap-1">
                <input
                  v-model="filters.dateFrom"
                  type="date"
                  class="px-2 py-1 border border-gray-200 rounded-full text-sm"
                />
                <span class="text-gray-400 text-xs">–</span>
                <input
                  v-model="filters.dateTo"
                  type="date"
                  class="px-2 py-1 border border-gray-200 rounded-full text-sm"
                />
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button 
                  @click="exportToPDF"
                  class="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm"
                 
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                 
                  <span>PDF</span>
                </button>
                <button 
                  @click="fetchLogbooks"
                  class="flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
                 
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                 
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Statistics Cards -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-blue-600">{{ logbooks.length }}</div>
              <div class="text-sm text-gray-600">Total Entries</div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-green-600">{{ todayCount }}</div>
              <div class="text-sm text-gray-600">Today</div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-purple-600">{{ thisWeekCount }}</div>
              <div class="text-sm text-gray-600">This Week</div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="text-2xl font-bold text-orange-600">{{ thisMonthCount }}</div>
              <div class="text-sm text-gray-600">This Month</div>
            </div>
          </div>

          <!-- Table -->
          <div v-if="!loading" class="border border-gray-200 rounded-lg overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="header in headers" :key="header.key" 
                      @click="sortBy(header.key)"
                      class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">
                      {{ header.label }}
                     
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="logbook in paginatedLogbooks" :key="logbook.id" 
                    class="hover:bg-gray-50 transition-colors duration-150">
                  <!-- Client Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img 
                        :src="getAvatarUrl(logbook.emailAddress, logbook.fullName)" 
                        crossorigin="anonymous"
                        alt="Profile" 
                        class="w-8 h-8 rounded-full object-cover mr-3 bg-gray-100 shadow-sm" 
                        style="border-radius: 50%; width: 32px; height: 32px;"
                      />
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ logbook.fullName || 'Unknown Client' }}</div>
                        <div v-if="logbook.emailAddress" class="text-xs text-gray-500 mt-0.5">
                          {{ logbook.emailAddress }}
                        </div>
                      </div>
                    </div>
                  </td>
                  
  <!-- Age -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ logbook.age || 'N/A' }}</span>
                  </td>
                  
                  <!-- Gender -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ logbook.gender || 'N/A' }}</span>
                  </td>
                  
                  <!-- Phone -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ logbook.contactNumber || 'N/A' }}</span>
                  </td>
                  
                  <!-- Address -->
                  <td class="px-6 py-4">
                    <div class="text-sm text-gray-900 max-w-xs truncate" :title="getFullAddress(logbook)">
                      {{ getFullAddress(logbook) }}
                    </div>
                  </td>
                  
                  <!-- Services -->
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-2 max-w-md">
                      <span 
                        v-for="(service, index) in logbook.servicesAvailed" 
                        :key="index"
                        class="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {{ service }}
                      </span>
                    </div>
                  </td>
                  
                  <!-- Sector -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ logbook.sector || 'N/A' }}</span>
                  </td>
                  
                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ formatDate(logbook.createdAt) }}</span>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        @click="viewDetails(logbook)"
                        class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View details"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="openDeleteModal(logbook.id)"
                        class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete entry"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr> 
                
                <!-- Empty state -->
                <tr v-if="paginatedLogbooks.length === 0">
                  <td colspan="9" class="py-8 text-center">
                    <div class="flex flex-col items-center justify-center">
                      <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                      <p class="text-gray-500 font-medium">No logbook found</p>
                      <p class="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        
          <!-- Pagination -->
          <div v-if="!loading && filteredLogbooks.length > 0" class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            <div class="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredLogbooks.length }} entries
            </div>
            <div class="flex gap-2">
              <button 
                @click="previousPage" 
                :disabled="currentPage === 1"
                class="px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-xs sm:text-sm"
                :class="currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'"
              >
                Previous
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
                class="px-2 py-1 sm:px-3 sm:py-1 border rounded-full text-xs sm:text-sm"
                :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50'"
              >
                Next
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="py-8 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading logbook entries...</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div class="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-bold">Client Details</h3>
          <button
            @click="closeDetailsModal"
            class="text-white hover:bg-blue-700 rounded p-1"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div v-if="selectedLogbook">
            <!-- Client Information -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-3">Client Information</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div><strong>Name:</strong> {{ selectedLogbook.fullName || 'N/A' }}</div>
                <div><strong>Email:</strong> {{ selectedLogbook.emailAddress || 'N/A' }}</div>
                <div><strong>Age:</strong> {{ selectedLogbook.age || 'N/A' }}</div>
                <div><strong>Gender:</strong> {{ selectedLogbook.gender || 'N/A' }}</div>
                <div><strong>Phone:</strong> {{ selectedLogbook.contactNumber || 'N/A' }}</div>
                <div><strong>Sector:</strong> {{ selectedLogbook.sector || 'N/A' }}</div>
                <div class="md:col-span-3"><strong>Address:</strong> {{ getFullAddress(selectedLogbook) }}</div>
                <div class="md:col-span-3"><strong>Date:</strong> {{ formatDateTime(selectedLogbook.createdAt) }}</div>
              </div>
            </div>

            <!-- Services -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-3">Services Availed</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="service in selectedLogbook.servicesAvailed"
                  :key="service"
                  class="px-3 py-1.5 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                >
                  {{ service }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div class="p-6">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">Delete Entry</h3>
          <p class="text-gray-600 text-center mb-6">Are you sure you want to delete this logbook entry? This action cannot be undone.</p>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              @click="deleteEntry"
              class="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import { collection, query, where, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Reactive data
const loading = ref(false)
const logbooks = ref([])
const showDetailsModal = ref(false)
const selectedLogbook = ref(null)
const showDeleteModal = ref(false)
const deleteTargetId = ref(null)
const sortKey = ref('createdAt')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filters
const filters = reactive({
  search: '',
  dateFrom: '',
  dateTo: ''
})

// Table headers
const headers = ref([
  { key: 'fullName', label: 'Client Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  { key: 'contactNumber', label: 'Phone' },
  { key: 'address', label: 'Address' },
  { key: 'serviceAvailed', label: 'Services' },
  { key: 'sector', label: 'Sector' },
  { key: 'createdAt', label: 'Date' },
  { key: 'actions', label: 'Actions' }
])

// Computed properties
const filteredLogbooks = computed(() => {
  let filtered = logbooks.value

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(logbook => 
      logbook.fullName?.toLowerCase().includes(searchLower) ||
      logbook.emailAddress?.toLowerCase().includes(searchLower) ||
      logbook.sector?.toLowerCase().includes(searchLower) ||
      logbook.servicesAvailed?.some(service => service.toLowerCase().includes(searchLower))
    )
  }

  // Date filters
  if (filters.dateFrom) {
    filtered = filtered.filter(logbook => {
      if (!logbook.createdAt) return false
      const logbookDate = logbook.createdAt.toDate ? logbook.createdAt.toDate() : new Date(logbook.createdAt)
      return logbookDate >= new Date(filters.dateFrom)
    })
  }

  if (filters.dateTo) {
    filtered = filtered.filter(logbook => {
      if (!logbook.createdAt) return false
      const logbookDate = logbook.createdAt.toDate ? logbook.createdAt.toDate() : new Date(logbook.createdAt)
      return logbookDate <= new Date(filters.dateTo + 'T23:59:59')
    })
  }

  // Sort
  if (sortKey.value) {
    filtered.sort((a, b) => {
      let aValue = getNestedValue(a, sortKey.value)
      let bValue = getNestedValue(b, sortKey.value)
      
      if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
      return 0
    })
  }

  return filtered
})

const paginatedLogbooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogbooks.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredLogbooks.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredLogbooks.value.length))

// Statistics
const todayCount = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return logbooks.value.filter(logbook => {
    if (!logbook.createdAt) return false
    const logbookDate = logbook.createdAt.toDate ? logbook.createdAt.toDate() : new Date(logbook.createdAt)
    return logbookDate >= today
  }).length
})

const thisWeekCount = computed(() => {
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)
  
  return logbooks.value.filter(logbook => {
    if (!logbook.createdAt) return false
    const logbookDate = logbook.createdAt.toDate ? logbook.createdAt.toDate() : new Date(logbook.createdAt)
    return logbookDate >= startOfWeek
  }).length
})

const thisMonthCount = computed(() => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  return logbooks.value.filter(logbook => {
    if (!logbook.createdAt) return false
    const logbookDate = logbook.createdAt.toDate ? logbook.createdAt.toDate() : new Date(logbook.createdAt)
    return logbookDate.getMonth() === currentMonth && logbookDate.getFullYear() === currentYear
  }).length
})

// Methods
const fetchLogbooks = async () => {
  loading.value = true
  try {
    const q = query(
      collection(db, 'client_logbook'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    logbooks.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error fetching logbooks:', error)
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
}

const clearFilters = () => {
  filters.search = ''
  filters.dateFrom = ''
  filters.dateTo = ''
  currentPage.value = 1
}

const clearSearch = () => {
  filters.search = ''
  currentPage.value = 1
}

const clearDateFilter = () => {
  filters.dateFrom = ''
  filters.dateTo = ''
  currentPage.value = 1
}

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj)
}

const getAvatarUrl = (email, fullName) => {
  const name = encodeURIComponent(fullName || 'Unknown')
  const fallback = `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff&rounded=true&bold=true&size=128`
  if (!email) return fallback
  return `https://unavatar.io/${encodeURIComponent(email)}?fallback=${encodeURIComponent(fallback)}`
}

const getFullAddress = (logbook) => {
  if (!logbook) return 'N/A'
  
  // If address field already contains the full address, use it directly
  if (logbook.address) {
    return logbook.address
  }
  
  // Otherwise, combine barangay and city
  const parts = [
    logbook.barangay,
    logbook.city
  ].filter(Boolean)
  
  return parts.length > 0 ? parts.join(', ') : 'N/A'
}
const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const viewDetails = (logbook) => {
  selectedLogbook.value = logbook
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedLogbook.value = null
}



const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString()
}

const exportToPDF = async () => {
  try {
    const pdf = new jsPDF('landscape') // Let jsPDF handle default sizing
    
    // Set font to Arial (default is Helvetica, closest to Arial)
    pdf.setFont('helvetica')
    pdf.setFontSize(12)
    
    // Title
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text('Client Logbook Report', pdf.internal.pageSize.getWidth() / 2, 15, { align: 'center' })
    
    // Export date
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pdf.internal.pageSize.getWidth() / 2, 25, { align: 'center' })
    
    // Prepare table data
    const tableData = filteredLogbooks.value.map(logbook => [
      logbook.fullName || 'N/A',
      logbook.age || 'N/A',
      logbook.gender || 'N/A',
      logbook.contactNumber || 'N/A',
      getFullAddress(logbook),
      (logbook.servicesAvailed || []).join(', '),
      logbook.sector || 'N/A',
      formatDate(logbook.createdAt)
    ])
    
    // Table headers
    const headers = [
      'Client Name',
      'Age',
      'Gender',
      'Phone',
      'Address',
      'Services',
      'Sector',
      'Date'
    ]
    
    // Generate table with automatic sizing
    autoTable(pdf, {
      head: [headers],
      body: tableData,
      startY: 35,
      theme: 'grid',
      styles: { 
        fontSize: 12,
        cellPadding: 3,
        font: 'helvetica',
        textColor: 0,
        overflow: 'linebreak',
        minCellHeight: 8
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 12
      },
      alternateRowStyles: { 
        fillColor: [245, 247, 250]
      },
      margin: { 
        left: 10,   // 10mm margin
        right: 10,  // 10mm margin
        top: 10,    // 10mm margin
        bottom: 10  // 10mm margin
      }
    })
    
    // Footer with page numbers
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(128, 128, 128)
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.text(
        `Page ${i} of ${pageCount}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      )
    }
    
    // Save the PDF
    pdf.save(`client-logbook-${new Date().toISOString().split('T')[0]}.pdf`)
    
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Error exporting PDF. Please try again.')
  }
}

const openDeleteModal = (id) => {
  deleteTargetId.value = id
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  deleteTargetId.value = null
}

const deleteEntry = async () => {
  if (!deleteTargetId.value) return
  
  try {
    await deleteDoc(doc(db, 'client_logbook', deleteTargetId.value))
    logbooks.value = logbooks.value.filter(logbook => logbook.id !== deleteTargetId.value)
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting logbook entry:', error)
    alert('Error deleting entry')
  }
}

onMounted(() => {
  fetchLogbooks()
})
</script>

<style scoped>
.fixed {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>