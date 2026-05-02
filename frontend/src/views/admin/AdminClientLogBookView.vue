<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white text-gray-900">
        <h1 class="m-0 text-3xl font-semibold">Client Logbook</h1>
      </header>
      
      <main class="flex-1 px-6 py-6 font-sans">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <!-- Header Section -->
          <div class="mb-6">
            <h2 class="text-2xl font-medium text-gray-900">Client Logbook</h2>
            <p class="text-gray-500">Manage and review client service logbook entries.</p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  v-model="filters.search" 
                  class="w-full sm:w-[300px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
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
                  class="px-5 py-2 border border-gray-200 rounded-full text-sm"
                />
                <span class="text-gray-400 text-xs">–</span>
                <input
                  v-model="filters.dateTo"
                  type="date"
                  class="px-5 py-2 border border-gray-200 rounded-full text-sm"
                />
              </div>
              
              <!-- Action Buttons -->
              <div class="flex gap-2">
                <button 
                  @click="exportToPDF"
                  class="flex items-center justify-center gap-1 px-5 py-2 bg-[#b92e2b] text-white rounded-full hover:bg-[#b92e2b]/80 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>PDF</span>
                </button>
                <button 
                  @click="exportToWord"
                  class="flex items-center justify-center gap-1 px-5 py-2 bg-[#133e75] text-white rounded-full hover:bg-[#133e75]/80 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Word</span>
                </button>
                <button 
                  @click="fetchLogbooks"
                  class="flex items-center justify-center gap-1 px-5 py-2 bg-[#133e75] text-white rounded-full hover:bg-[#133e75]/80 text-sm"
                 
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
          <div v-if="!loading && filteredLogbooks.length > 0" class="mt-6 flex items-center justify-between bg-white px-4 py-3 sm:px-6 border border-gray-200 rounded-lg">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ startIndex + 1 }}</span>
                  to
                  <span class="font-medium">{{ endIndex }}</span>
                  of
                  <span class="font-medium">{{ filteredLogbooks.length }}</span>
                  results
                </p>
              </div>
              <div class="flex items-center gap-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-gray-700">Rows per page:</span>
                  <select
                    v-model="itemsPerPage"
                    @change="currentPage = 1"
                    class="rounded-md border-gray-300 py-1 text-sm focus:border-blue-500 focus:ring-blue-500 outline-none"
                  >
                    <option v-for="size in [10, 20, 30, 40, 50, 60]" :key="size" :value="size">{{ size }}</option>
                  </select>
                </div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span class="sr-only">Previous</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                  <span class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                    Page {{ currentPage }} of {{ totalPages }}
                  </span>
                  <button
                    @click="nextPage"
                    :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                  >
                    <span class="sr-only">Next</span>
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/40  flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative p-8">
        <!-- Close Button -->
        <button 
          @click="closeDetailsModal"
          class="absolute top-6 right-6 text-gray-900 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div v-if="selectedLogbook" class="space-y-6">
          <h2 class="text-3xl font-semibold text-gray-900 mb-8">Client Details</h2>

          <!-- Name -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-400">Name</label>
            <div class="bg-gray-50 p-3 rounded-xl text-gray-900 font-medium">
              {{ selectedLogbook.fullName || 'Unknown Client' }}
            </div>
          </div>

          <!-- Email -->
          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-400">Email</label>
            <div class="bg-gray-50 p-3 rounded-xl text-gray-900">
              {{ selectedLogbook.emailAddress || 'N/A' }}
            </div>
          </div>

          <!-- Age & Address -->
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-1 space-y-1">
              <label class="text-sm font-medium text-gray-400">Age</label>
              <div class="bg-gray-50 p-3 rounded-xl text-gray-900">
                {{ selectedLogbook.age || 'N/A' }}
              </div>
            </div>
            <div class="col-span-2 space-y-1">
              <label class="text-sm font-medium text-gray-400">Address</label>
              <div class="bg-gray-50 p-3 rounded-xl text-gray-900 truncate" :title="getFullAddress(selectedLogbook)">
                {{ getFullAddress(selectedLogbook) }}
              </div>
            </div>
          </div>

          <!-- Sector & Gender -->
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-400">Sector</label>
              <div class="bg-gray-50 p-3 rounded-xl text-gray-900">
                {{ selectedLogbook.sector || 'N/A' }}
              </div>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-400">Gender</label>
              <div class="bg-gray-50 p-3 rounded-xl text-gray-900">
                {{ selectedLogbook.gender || 'N/A' }}
              </div>
            </div>
          </div>

          <!-- Date & Services -->
          <div class="grid grid-cols-5 gap-4">
            <div class="col-span-3 space-y-1">
              <label class="text-sm font-medium text-gray-400">Date</label>
              <div class="bg-gray-50 p-3 rounded-xl text-gray-900 text-sm">
                {{ formatDateTime(selectedLogbook.createdAt) }}
              </div>
            </div>
            <div class="col-span-2 space-y-1">
              <label class="text-sm font-medium text-gray-400">Service Availed</label>
              <div class="flex flex-wrap gap-1 pt-1">
                <span 
                  v-for="service in selectedLogbook.servicesAvailed" 
                  :key="service"
                  class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-lg uppercase"
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
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div class="p-6">
          <h3 class="text-2xl font-semibold text-gray-900 text-center mb-2">Delete Entry</h3>
          <p class="text-gray-600 text-center mb-6">Are you sure you want to delete this logbook entry? This action cannot be undone.</p>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2  rounded-lg text-gray-700 hover:bg-gray-50 bg-gray-200 font-medium"
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
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
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

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = url
  })
}

const getBase64Image = async (url) => {
  try {
    const img = await loadImage(url)
    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)
    return canvas.toDataURL('image/png')
  } catch(e) {
    return ''
  }
}

const exportToPDF = async () => {
  try {
    const pdf = new jsPDF('landscape', 'pt', 'legal')
    const pageWidth = pdf.internal.pageSize.getWidth()
    
    try {
      const logo1 = await loadImage('/dictlogo2.png')
      const logo2 = await loadImage('/Bagongpilipinas.png')
      pdf.addImage(logo1, 'PNG', 40, 10, 65, 65)
      pdf.addImage(logo2, 'PNG', pageWidth - 105, 10, 65, 65)
    } catch(e) { console.error('Logo loading failed', e) }

    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(11)
    pdf.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, 35, { align: 'center' })
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(13)
    pdf.text('DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY', pageWidth / 2, 55, { align: 'center' })
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)
    pdf.text('Client Logbook Report', pageWidth / 2, 75, { align: 'center' })
    pdf.setFontSize(10)
    pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 90, { align: 'center' })
    
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
    
    const headers = ['Client Name', 'Age', 'Gender', 'Phone', 'Address', 'Services', 'Sector', 'Date']
    
    autoTable(pdf, {
      head: [headers],
      body: tableData,
      startY: 110,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3, font: 'helvetica', textColor: 0, overflow: 'linebreak' },
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold', fontSize: 10 },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      margin: { left: 40, right: 40, top: 40, bottom: 40 }
    })
    
    const pageCount = pdf.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i)
      pdf.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pdf.internal.pageSize.getHeight() - 20, { align: 'center' })
    }
    
    pdf.save(`client-logbook-${new Date().toISOString().split('T')[0]}.pdf`)
  } catch (error) {
    console.error('Error exporting PDF:', error)
    alert('Error exporting PDF. Please try again.')
  }
}

const exportToWord = async () => {
  const logoDict = await getBase64Image('/dictlogo2.png')
  const logoBp = await getBase64Image('/Bagongpilipinas.png')
  const dictImgHtml = logoDict ? `<img src="${logoDict}" width="75" height="75" />` : ''
  const bpImgHtml = logoBp ? `<img src="${logoBp}" width="75" height="75" />` : ''

  let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <style>
        @page WordSection1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 0.5in; }
        div.WordSection1 { page: WordSection1; }
        table { border-collapse: collapse; width: 100%; font-size: 10pt; font-family: Arial, sans-serif; }
        th, td { border: 1px solid black; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
      </style>
    </head>
    <body style="font-family: Arial, sans-serif;">
      <div class="WordSection1">
        <table width="100%" style="border: none; margin-bottom: 20px;">
          <tr style="border: none;">
            <td width="20%" style="border: none;">${dictImgHtml}</td>
            <td width="60%" align="center" style="border: none;">
              <p style="font-size: 14pt; margin: 0;">REPUBLIC OF THE PHILIPPINES</p>
              <p style="font-size: 12pt; font-weight: bold; margin: 0;">DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY</p>
              <p style="font-size: 12pt; margin: 10px 0 0 0;">Client Logbook Report</p>
              <p style="font-size: 10pt; color: #666;">Generated: ${new Date().toLocaleString()}</p>
            </td>
            <td width="20%" style="border: none;">${bpImgHtml}</td>
          </tr>
        </table>
        <table>
          <thead>
            <tr>
              <th>Client Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Address</th><th>Services</th><th>Sector</th><th>Date</th>
            </tr>
          </thead>
          <tbody>`

  filteredLogbooks.value.forEach(logbook => {
    html += `<tr>
      <td>${logbook.fullName || 'N/A'}</td>
      <td>${logbook.age || 'N/A'}</td>
      <td>${logbook.gender || 'N/A'}</td>
      <td>${logbook.contactNumber || 'N/A'}</td>
      <td>${getFullAddress(logbook)}</td>
      <td>${(logbook.servicesAvailed || []).join(', ')}</td>
      <td>${logbook.sector || 'N/A'}</td>
      <td>${formatDate(logbook.createdAt)}</td>
    </tr>`
  })

  html += `</tbody></table></div></body></html>`

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `client-logbook-${new Date().toISOString().split('T')[0]}.doc`
  link.click()
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
/* Removed fixed background rule to prevent clashing with Tailwind backdrops */
</style>
