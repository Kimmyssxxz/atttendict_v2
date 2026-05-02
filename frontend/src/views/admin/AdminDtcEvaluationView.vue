<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white text-gray-900">
        <h1 class="m-0 text-3xl font-semibold">DTC Training Evaluations</h1>
      </header>
      
    <main class="flex-1 px-6 py-6 font-sans">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else class="p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <!-- Header Section -->
          <div class="mb-4 pb-8 border-b border-gray-100">
            <h2 class="text-2xl font-medium text-gray-900">DTC Training Evaluations</h2>
            <p class="text-gray-600">Manage and review DTC training evaluation submissions.</p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  v-model="filters.search" 
                  class="w-full sm:w-[300px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-200"
                  placeholder="Search evaluations..."
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
                  @click="exportAllToPDF"
                  class="flex items-center justify-center gap-1 px-3 py-2 bg-[#b92e2b] text-white rounded-full hover:bg-[#b92e2b]/80 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>PDF</span>
                </button>
                <button 
                  @click="exportAllToWord"
                  class="flex items-center justify-center gap-1 px-3 py-2 bg-[#133e75] text-white rounded-full hover:bg-[#133e75]/80 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>Word</span>
                </button>
                <button 
                  @click="loadEvaluations"
                  class="flex items-center justify-center gap-1 px-3 py-2 bg-[#133e75] text-white rounded-full hover:bg-[#133e75]/80 text-sm"
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

          <!-- Global Averages Row -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-200/50 relative overflow-hidden group">
              <div class="relative z-10">
                <div class="text-3xl font-bold mb-1 flex items-baseline gap-2">
                  {{ statistics.averageOverall.toFixed(1) }}
                  <span class="text-blue-200 text-xs font-normal">/ 5.0</span>
                </div>
                <div class="text-sm font-medium text-blue-100 uppercase tracking-wider">Total Overall Average</div>
              </div>
              <div class="absolute -right-4 -bottom-4 text-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </div>
            
            <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-400">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Resource Person</div>
              <div class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {{ statistics.averageRP.toFixed(1) }}
                <div class="flex text-amber-400 text-xs">
                  <span v-for="i in 5" :key="i">{{ i <= Math.round(statistics.averageRP) ? '★' : '☆' }}</span>
                </div>
              </div>
              <div class="text-[10px] text-gray-500 mt-1">Average of all instructors</div>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-emerald-400">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Course Content</div>
              <div class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {{ statistics.averageContent.toFixed(1) }}
                <div class="flex text-emerald-400 text-xs">
                  <span v-for="i in 5" :key="i">{{ i <= Math.round(statistics.averageContent) ? '★' : '☆' }}</span>
                </div>
              </div>
              <div class="text-[10px] text-gray-500 mt-1">Average of all materials</div>
            </div>

            <div class="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-l-4 border-l-purple-400">
              <div class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Venue & Facilities</div>
              <div class="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {{ statistics.averageVenue.toFixed(1) }}
                <div class="flex text-purple-400 text-xs">
                  <span v-for="i in 5" :key="i">{{ i <= Math.round(statistics.averageVenue) ? '★' : '☆' }}</span>
                </div>
              </div>
              <div class="text-[10px] text-gray-500 mt-1">Average of environment</div>
            </div>
          </div>

          <!-- Table -->
          <div v-if="!loading" class="border border-gray-200 rounded-lg overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Date</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Name</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Training</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">RP</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">RP Avg</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Content Avg</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Venue Avg</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Overall</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    <div class="flex items-center">Actions</div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="filteredEvaluations.length === 0" class="text-center">
                  <td colspan="9" class="px-6 py-8 text-gray-500">
                    No DTC training evaluations found
                  </td>
                </tr>
                <tr v-else v-for="evaluation in paginatedEvaluations" :key="evaluation.id" 
                    class="hover:bg-gray-50 transition-colors duration-150">
                  <!-- Date -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ formatDate(evaluation.submittedAt) }}</span>
                  </td>
                  
                  <!-- Name -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <img 
                        :src="getAvatarUrl(evaluation.email, evaluation.fullName)" 
                        crossorigin="anonymous"
                        alt="Profile" 
                        class="w-8 h-8 rounded-full object-cover mr-3 bg-gray-100 shadow-sm" 
                        style="border-radius: 50%; width: 32px; height: 32px;"
                      />
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ evaluation.fullName || 'Unknown Client' }}</div>
                        <div v-if="evaluation.email" class="text-xs text-gray-500 mt-0.5">
                          {{ evaluation.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Training -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ evaluation.trainingTitle || 'N/A' }}</span>
                  </td>
                  
                  <!-- Resource Person (RP) -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="text-sm text-gray-900">{{ evaluation.resourcePerson || 'N/A' }}</span>
                  </td>
                  
                  <!-- RP Avg -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex text-yellow-400 mr-2">
                        <span v-for="i in 5" :key="i" class="text-sm">
                          {{ i <= calculateAverageRating(evaluation.resourcePersonEvaluation) ? '★' : '☆' }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-600">({{ calculateAverageRating(evaluation.resourcePersonEvaluation).toFixed(1) }})</span>
                    </div>
                  </td>
                  
                  <!-- Content Avg -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex text-yellow-400 mr-2">
                        <span v-for="i in 5" :key="i" class="text-sm">
                          {{ i <= calculateAverageRating(evaluation.courseContentEvaluation) ? '★' : '☆' }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-600">({{ calculateAverageRating(evaluation.courseContentEvaluation).toFixed(1) }})</span>
                    </div>
                  </td>
                  
                  <!-- Venue Avg -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex text-yellow-400 mr-2">
                        <span v-for="i in 5" :key="i" class="text-sm">
                          {{ i <= calculateAverageRating(evaluation.venueEvaluation) ? '★' : '☆' }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-600">({{ calculateAverageRating(evaluation.venueEvaluation).toFixed(1) }})</span>
                    </div>
                  </td>
                  
                  <!-- Overall -->
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex text-yellow-400 mr-2">
                        <span v-for="i in 5" :key="i" class="text-sm">
                          {{ i <= calculateOverallRating(evaluation) ? '★' : '☆' }}
                        </span>
                      </div>
                      <span class="text-sm text-gray-600">({{ calculateOverallRating(evaluation).toFixed(1) }})</span>
                    </div>
                  </td>
                  
                  <!-- Actions -->
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        @click="viewDetails(evaluation)"
                        class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View details"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="exportToPDF(evaluation)"
                        class="text-[#b92e2b] hover:text-[#b92e2b]/80 p-1 hover:bg-red-50 rounded"
                        title="Export to PDF"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                      <button
                        @click="exportToWord(evaluation)"
                        class="text-[#133e75] hover:text-[#133e75]/80 p-1 hover:bg-blue-50 rounded"
                        title="Export to Word"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </button>
                      <button
                        @click="openDeleteModal(evaluation.id)"
                        class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                        title="Delete evaluation"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination Controls -->
          <div class="mt-4 flex items-center justify-between bg-white px-4 py-3 sm:px-6 border border-gray-200 rounded-lg" v-if="filteredEvaluations.length > 0">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
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
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  to
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredEvaluations.length) }}</span>
                  of
                  <span class="font-medium">{{ filteredEvaluations.length }}</span>
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
                    @click="currentPage--"
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
                    @click="currentPage++"
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
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div class="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-3xl font-semibold text-gray-900">Evaluation Details</h2>
          <button
            @click="showDetailsModal = false"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedEvaluation" class="space-y-6">
          <!-- Personal Information -->
          <div class="border-b pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="text-sm font-medium text-gray-500">Name:</span>
                <span class="ml-2 text-sm text-gray-900">{{ selectedEvaluation.fullName }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Email:</span>
                <span class="ml-2 text-sm text-gray-900">{{ selectedEvaluation.email }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Training Title:</span>
                <span class="ml-2 text-sm text-gray-900">{{ selectedEvaluation.trainingTitle }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Training Date:</span>
                <span class="ml-2 text-sm text-gray-900">{{ selectedEvaluation.trainingDate }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Resource Person:</span>
                <span class="ml-2 text-sm text-gray-900">{{ selectedEvaluation.resourcePerson }}</span>
              </div>
              <div>
                <span class="text-sm font-medium text-gray-500">Submitted:</span>
                <span class="ml-2 text-sm text-gray-900">{{ formatDate(selectedEvaluation.submittedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Rating Summary -->
          <div class="border-b pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Rating Summary</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ calculateAverageRating(selectedEvaluation.resourcePersonEvaluation).toFixed(1) }}</div>
                <div class="text-sm text-gray-600">Resource Person</div>
                <div class="flex justify-center text-yellow-400 mt-1">
                  <span v-for="i in 5" :key="i">★</span>
                </div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ calculateAverageRating(selectedEvaluation.courseContentEvaluation).toFixed(1) }}</div>
                <div class="text-sm text-gray-600">Course Content</div>
                <div class="flex justify-center text-yellow-400 mt-1">
                  <span v-for="i in 5" :key="i">★</span>
                </div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">{{ calculateAverageRating(selectedEvaluation.venueEvaluation).toFixed(1) }}</div>
                <div class="text-sm text-gray-600">Venue</div>
                <div class="flex justify-center text-yellow-400 mt-1">
                  <span v-for="i in 5" :key="i">★</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Detailed Ratings -->
          <div class="space-y-4">
            <!-- Resource Person Evaluation -->
            <div class="border-b pb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Resource Person Evaluation</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(rating, key) in selectedEvaluation.resourcePersonEvaluation" :key="key" class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">{{ formatKey(key) }}</span>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-2">
                      <span v-for="i in 5" :key="i" class="text-sm">
                        {{ i <= rating ? '★' : '☆' }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-600">({{ rating }}/5)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Course Content Evaluation -->
            <div class="border-b pb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Course Content Evaluation</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(rating, key) in selectedEvaluation.courseContentEvaluation" :key="key" class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">{{ formatKey(key) }}</span>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-2">
                      <span v-for="i in 5" :key="i" class="text-sm">
                        {{ i <= rating ? '★' : '☆' }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-600">({{ rating }}/5)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Venue Evaluation -->
            <div class="pb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-3">Venue Evaluation</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(rating, key) in selectedEvaluation.venueEvaluation" :key="key" class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">{{ formatKey(key) }}</span>
                  <div class="flex items-center">
                    <div class="flex text-yellow-400 mr-2">
                      <span v-for="i in 5" :key="i" class="text-sm">
                        {{ i <= rating ? '★' : '☆' }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-600">({{ rating }}/5)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        

        <div class="mt-6 flex justify-end gap-4">
          <span class="flex-1"></span>
          <button
            @click="showDetailsModal = false"
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40  flex items-center justify-center p-4 z-50 transition-all duration-300">
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div class="p-6">

          <h3 class="text-2xl font-semibold text-gray-900 text-center mb-2">Delete Evaluation</h3>
          <p class="text-gray-600 text-center mb-6">Are you sure you want to delete this evaluation? This action cannot be undone.</p>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 px-4 py-2  rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium"
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

    <!-- Offscreen PDF Target Container (Hidden from view) -->
    <div
      v-if="pdfTargetEvaluation"
      class="fixed top-[-9999px] left-[-9999px] bg-white text-black p-8"
      style="width: 800px;"
      ref="pdfExportArea"
    >
      <div class="mb-6 pb-4 border-b">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Evaluation Details</h2>
      </div>

      <div class="space-y-6">
        <!-- Personal Information -->
        <div class="border-b pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-sm font-medium text-gray-500">Name:</span>
              <span class="ml-2 text-sm text-gray-900">{{ pdfTargetEvaluation.fullName }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Email:</span>
              <span class="ml-2 text-sm text-gray-900">{{ pdfTargetEvaluation.email }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Training Title:</span>
              <span class="ml-2 text-sm text-gray-900">{{ pdfTargetEvaluation.trainingTitle }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Training Date:</span>
              <span class="ml-2 text-sm text-gray-900">{{ pdfTargetEvaluation.trainingDate }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Resource Person:</span>
              <span class="ml-2 text-sm text-gray-900">{{ pdfTargetEvaluation.resourcePerson }}</span>
            </div>
            <div>
              <span class="text-sm font-medium text-gray-500">Submitted:</span>
              <span class="ml-2 text-sm text-gray-900">{{ formatDate(pdfTargetEvaluation.submittedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- Rating Summary -->
        <div class="border-b pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">Rating Summary</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <div class="text-2xl font-bold text-blue-600">{{ calculateAverageRating(pdfTargetEvaluation.resourcePersonEvaluation).toFixed(1) }}</div>
              <div class="text-sm text-gray-600">Resource Person</div>
              <div class="flex justify-center text-yellow-400 mt-1">
                <span v-for="i in 5" :key="'rp-'+i">★</span>
              </div>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">{{ calculateAverageRating(pdfTargetEvaluation.courseContentEvaluation).toFixed(1) }}</div>
              <div class="text-sm text-gray-600">Course Content</div>
              <div class="flex justify-center text-yellow-400 mt-1">
                <span v-for="i in 5" :key="'cc-'+i">★</span>
              </div>
            </div>
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">{{ calculateAverageRating(pdfTargetEvaluation.venueEvaluation).toFixed(1) }}</div>
              <div class="text-sm text-gray-600">Venue</div>
              <div class="flex justify-center text-yellow-400 mt-1">
                <span v-for="i in 5" :key="'v-'+i">★</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Ratings -->
        <div class="space-y-4">
          <div class="border-b pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Resource Person Evaluation</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(rating, key) in pdfTargetEvaluation.resourcePersonEvaluation" :key="key" class="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span class="text-sm text-gray-700 flex-1 mr-2">{{ formatKey(key) }}</span>
                <div class="flex items-center">
                  <div class="flex text-yellow-400 mr-2 shrink-0">
                    <span v-for="i in 5" :key="'sr-'+key+i" class="text-sm">{{ i <= rating ? '★' : '☆' }}</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-600">({{ rating }}/5)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="border-b pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Course Content Evaluation</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(rating, key) in pdfTargetEvaluation.courseContentEvaluation" :key="key" class="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span class="text-sm text-gray-700 flex-1 mr-2">{{ formatKey(key) }}</span>
                <div class="flex items-center">
                  <div class="flex text-yellow-400 mr-2 shrink-0">
                    <span v-for="i in 5" :key="'sc-'+key+i" class="text-sm">{{ i <= rating ? '★' : '☆' }}</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-600">({{ rating }}/5)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pb-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Venue Evaluation</h3>
            <div class="grid grid-cols-2 gap-4">
              <div v-for="(rating, key) in pdfTargetEvaluation.venueEvaluation" :key="key" class="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span class="text-sm text-gray-700 flex-1 mr-2">{{ formatKey(key) }}</span>
                <div class="flex items-center">
                  <div class="flex text-yellow-400 mr-2 shrink-0">
                    <span v-for="i in 5" :key="'sv-'+key+i" class="text-sm">{{ i <= rating ? '★' : '☆' }}</span>
                  </div>
                  <span class="text-xs font-semibold text-gray-600">({{ rating }}/5)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Offscreen PDF Target Container for Export All (Hidden from view) -->
    <div
      v-if="isExportingAll"
      class="fixed top-[-9999px] left-[-9999px] bg-white text-black p-8"
      style="width: 1400px;"
      ref="pdfExportAllArea"
    >
      <div class="mb-6 pb-4 border-b">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">DTC Training Evaluations Report</h2>
        <p class="text-gray-500">
          <span v-if="filters.dateFrom && filters.dateTo" class="font-medium">Date Range: {{ filters.dateFrom }} to {{ filters.dateTo }} | </span>
          <span v-else-if="filters.dateFrom" class="font-medium">Date Range: From {{ filters.dateFrom }} | </span>
          <span v-else-if="filters.dateTo" class="font-medium">Date Range: Until {{ filters.dateTo }} | </span>
          <span v-else class="font-medium">Date Range: All Time | </span>
          Generated: {{ new Date().toLocaleDateString() }}
        </p>
      </div>

      <!-- Statistics Cards exact replication -->
      <div class="grid grid-cols-4 gap-4 mb-6">
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-blue-600">{{ statistics.totalEvaluations }}</div>
          <div class="text-sm text-gray-600">Total Evaluations</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-green-600">{{ statistics.todayEvaluations }}</div>
          <div class="text-sm text-gray-600">Today</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-purple-600">{{ statistics.thisWeekEvaluations }}</div>
          <div class="text-sm text-gray-600">This Week</div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="text-2xl font-bold text-orange-600">{{ statistics.thisMonthEvaluations }}</div>
          <div class="text-sm text-gray-600">This Month</div>
        </div>
      </div>
      
      <!-- Table exact replication minus actions -->
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg mt-6">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Date</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Name</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Training</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">RP</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">RP Avg</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Content Avg</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Venue Avg</th>
            <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Overall</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="evaluation in filteredEvaluations" :key="'all-'+evaluation.id" class="border-b">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDate(evaluation.submittedAt) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img 
                  :src="getAvatarUrl(evaluation.email, evaluation.fullName)" 
                  crossorigin="anonymous"
                  alt="Profile" 
                  class="mr-3 bg-gray-100" 
                  style="border-radius: 50%; width: 32px; height: 32px; object-fit: cover; display: block;"
                />
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ evaluation.fullName || 'Unknown Client' }}</div>
                  <div v-if="evaluation.email" class="text-xs text-gray-500 mt-0.5">{{ evaluation.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.trainingTitle || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ evaluation.resourcePerson || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-2">
                  <span v-for="i in 5" :key="'rp-'+i" class="text-sm">{{ i <= calculateAverageRating(evaluation.resourcePersonEvaluation) ? '★' : '☆' }}</span>
                </div>
                <span class="text-sm text-gray-600">({{ calculateAverageRating(evaluation.resourcePersonEvaluation).toFixed(1) }})</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-2">
                  <span v-for="i in 5" :key="'cc-'+i" class="text-sm">{{ i <= calculateAverageRating(evaluation.courseContentEvaluation) ? '★' : '☆' }}</span>
                </div>
                <span class="text-sm text-gray-600">({{ calculateAverageRating(evaluation.courseContentEvaluation).toFixed(1) }})</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-2">
                  <span v-for="i in 5" :key="'v-'+i" class="text-sm">{{ i <= calculateAverageRating(evaluation.venueEvaluation) ? '★' : '☆' }}</span>
                </div>
                <span class="text-sm text-gray-600">({{ calculateAverageRating(evaluation.venueEvaluation).toFixed(1) }})</span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex text-yellow-400 mr-2">
                  <span v-for="i in 5" :key="'ov-'+i" class="text-sm">{{ i <= calculateOverallRating(evaluation) ? '★' : '☆' }}</span>
                </div>
                <span class="text-sm text-gray-600">({{ calculateOverallRating(evaluation).toFixed(1) }})</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { getDtcTrainingEvaluations, getDtcTrainingEvaluationsByDateRange, deleteDtcTrainingEvaluation } from '../../services/clientServices'
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'

const currentPage = ref(1)
const itemsPerPage = ref(10)

const loading = ref(false)
const evaluations = ref([])
const showDetailsModal = ref(false)
const selectedEvaluation = ref(null)
const pdfTargetEvaluation = ref(null)
const pdfExportArea = ref(null)
const isExportingAll = ref(false)
const pdfExportAllArea = ref(null)
const showDeleteModal = ref(false)
const deleteTargetId = ref(null)
const filters = reactive({
  search: '',
  dateFrom: '',
  dateTo: ''
})

const statistics = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const thisWeek = new Date()
  thisWeek.setDate(today.getDate() - today.getDay())
  thisWeek.setHours(0, 0, 0, 0)

  const thisMonth = new Date()
  thisMonth.setDate(1)
  thisMonth.setHours(0, 0, 0, 0)

  return {
    totalEvaluations: evaluations.value.length,
    todayEvaluations: evaluations.value.filter(evaluation => {
      const evalDate = evaluation.submittedAt.toDate ? evaluation.submittedAt.toDate() : new Date(evaluation.submittedAt)
      return evalDate >= today
    }).length,
    thisWeekEvaluations: evaluations.value.filter(evaluation => {
      const evalDate = evaluation.submittedAt.toDate ? evaluation.submittedAt.toDate() : new Date(evaluation.submittedAt)
      return evalDate >= thisWeek
    }).length,
    thisMonthEvaluations: evaluations.value.filter(evaluation => {
      const evalDate = evaluation.submittedAt.toDate ? evaluation.submittedAt.toDate() : new Date(evaluation.submittedAt)
      return evalDate >= thisMonth
    }).length,
    
    averageRP: evaluations.value.length ? 
      evaluations.value.reduce((acc, e) => acc + calculateAverageRating(e.resourcePersonEvaluation), 0) / evaluations.value.length : 0,
    
    averageContent: evaluations.value.length ? 
      evaluations.value.reduce((acc, e) => acc + calculateAverageRating(e.courseContentEvaluation), 0) / evaluations.value.length : 0,
    
    averageVenue: evaluations.value.length ? 
      evaluations.value.reduce((acc, e) => acc + calculateAverageRating(e.venueEvaluation), 0) / evaluations.value.length : 0,
    
    averageOverall: evaluations.value.length ? 
      evaluations.value.reduce((acc, e) => acc + calculateOverallRating(e), 0) / evaluations.value.length : 0
  }
})

const filteredEvaluations = computed(() => {
  let filtered = evaluations.value

  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(evaluation => 
      evaluation.fullName?.toLowerCase().includes(searchLower) ||
      evaluation.email?.toLowerCase().includes(searchLower) ||
      evaluation.trainingTitle?.toLowerCase().includes(searchLower) ||
      evaluation.resourcePerson?.toLowerCase().includes(searchLower)
    )
  }

  // Apply date filter
  if (filters.dateFrom || filters.dateTo) {
    filtered = filtered.filter(evaluation => {
      const evalDate = evaluation.submittedAt.toDate ? evaluation.submittedAt.toDate() : new Date(evaluation.submittedAt)
      const dateStr = evalDate.toISOString().split('T')[0]
      
      if (filters.dateFrom && filters.dateTo) {
        return dateStr >= filters.dateFrom && dateStr <= filters.dateTo
      } else if (filters.dateFrom) {
        return dateStr >= filters.dateFrom
      } else if (filters.dateTo) {
        return dateStr <= filters.dateTo
      }
      return true
    })
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredEvaluations.value.length / itemsPerPage.value) || 1
})

const paginatedEvaluations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredEvaluations.value.slice(start, end)
})

const loadEvaluations = async () => {
  loading.value = true
  try {
    evaluations.value = await getDtcTrainingEvaluations()
  } catch (error) {
    console.error('Error loading evaluations:', error)
  } finally {
    loading.value = false
  }
}

const viewDetails = (evaluation) => {
  selectedEvaluation.value = evaluation
  showDetailsModal.value = true
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
    const success = await deleteDtcTrainingEvaluation(deleteTargetId.value)
    if (success) {
      evaluations.value = evaluations.value.filter(e => e.id !== deleteTargetId.value)
      closeDeleteModal()
    } else {
      alert('Error deleting evaluation')
    }
  } catch (error) {
    console.error('Error deleting evaluation:', error)
    alert('Error deleting evaluation')
  }
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

const formatKey = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

const getAvatarUrl = (email, fullName) => {
  const name = encodeURIComponent(fullName || 'Unknown')
  const fallback = `https://ui-avatars.com/api/?name=${name}&background=3b82f6&color=fff&rounded=true&bold=true&size=128`
  if (!email) return fallback
  return `https://unavatar.io/${encodeURIComponent(email)}?fallback=${encodeURIComponent(fallback)}`
}

// Rating calculation functions
const calculateAverageRating = (ratings) => {
  if (!ratings || typeof ratings !== 'object') return 0
  
  const values = Object.values(ratings)
  if (values.length === 0) return 0
  
  const sum = values.reduce((acc, val) => acc + (Number(val) || 0), 0)
  return sum / values.length
}

const calculateOverallRating = (evaluation) => {
  const rpAvg = calculateAverageRating(evaluation.resourcePersonEvaluation)
  const ccAvg = calculateAverageRating(evaluation.courseContentEvaluation)
  const venueAvg = calculateAverageRating(evaluation.venueEvaluation)
  
  // Weight the averages (you can adjust weights as needed)
  return (rpAvg * 0.5 + ccAvg * 0.3 + venueAvg * 0.2)
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

const exportToPDF = async (evaluation) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' })
  const pageWidth = doc.internal.pageSize.getWidth()
  
  try {
    const logo1 = await loadImage('/dictlogo2.png')
    const logo2 = await loadImage('/Bagongpilipinas.png')
    // Logo size: 60x60
    doc.addImage(logo1, 'PNG', 35, 10, 60, 60)
    doc.addImage(logo2, 'PNG', pageWidth - 95, 10, 60, 60)
  } catch(e) { console.error('Error loading logos', e) }

  doc.setFont('Times', 'normal')
  doc.setFontSize(10)
  const text1 = 'REPUBLIC OF THE PHILIPPINES'
  doc.text(text1, pageWidth / 2, 30, { align: 'center' })

  doc.setFont('Times', 'bold')
  doc.setFontSize(11)
  const text2 = 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY'
  doc.text(text2, pageWidth / 2, 45, { align: 'center' })

  doc.setFont('Times', 'normal')
  doc.setFontSize(11)
  const text3 = 'Training Evaluation Individual Report'
  doc.text(text3, pageWidth / 2, 65, { align: 'center' })

  const details = [
    ['Name:', evaluation.fullName || 'N/A'],
    ['Training Title:', evaluation.trainingTitle || 'N/A'],
    ['Reference Person:', evaluation.resourcePerson || 'N/A'],
    ['Date Submitted:', formatDate(evaluation.submittedAt)]
  ]

  autoTable(doc, {
    body: details,
    startY: 110,
    styles: { fontSize: 10 },
    theme: 'plain'
  })

  // Summary Ratings
  const summaryData = [
    ['Category', 'Average Rating'],
    ['Resource Person', calculateAverageRating(evaluation.resourcePersonEvaluation).toFixed(1)],
    ['Course Content', calculateAverageRating(evaluation.courseContentEvaluation).toFixed(1)],
    ['Venue', calculateAverageRating(evaluation.venueEvaluation).toFixed(1)],
    ['Overall Rating', calculateOverallRating(evaluation).toFixed(1)]
  ]

  autoTable(doc, {
    head: [summaryData[0]],
    body: summaryData.slice(1),
    startY: doc.lastAutoTable.finalY + 20,
    headStyles: { fillColor: [59, 130, 246] }
  })

  const fileName = `Evaluation_${evaluation.fullName?.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
  doc.save(fileName)
}

const exportToWord = async (evaluation) => {
  const logoDict = await getBase64Image('/dictlogo2.png')
  const logoBp = await getBase64Image('/Bagongpilipinas.png')
  const dictImgHtml = logoDict ? `<img src="${logoDict}" width="75" height="75" />` : ''
  const bpImgHtml = logoBp ? `<img src="${logoBp}" width="75" height="75" />` : ''

  let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'><title>Evaluation Report</title></head>
    <body style="font-family: 'Times New Roman', serif;">
      <table width="100%" style="margin-bottom: 20px;">
        <tr>
          <td width="20%" align="left">${dictImgHtml}</td>
          <td width="60%" align="center">
            <p style="font-size: 14pt; margin: 0;">REPUBLIC OF THE PHILIPPINES</p>
            <p style="font-size: 12pt; font-weight: bold; margin: 0;">DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY</p>
            <p style="font-size: 12pt; margin: 10px 0 0 0;">Training Evaluation Individual Report</p>
          </td>
          <td width="20%" align="right">${bpImgHtml}</td>
        </tr>
      </table>
      <h3>Participant Information</h3>
      <p><b>Name:</b> ${evaluation.fullName || 'N/A'}</p>
      <p><b>Training:</b> ${evaluation.trainingTitle || 'N/A'}</p>
      <p><b>Resource Person:</b> ${evaluation.resourcePerson || 'N/A'}</p>
      <p><b>Date:</b> ${formatDate(evaluation.submittedAt)}</p>
      
      <h3>Rating Summary</h3>
      <table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%;">
        <tr style="background-color: #f2f2f2;"><th>Category</th><th>Rating</th></tr>
        <tr><td>Resource Person</td><td>${calculateAverageRating(evaluation.resourcePersonEvaluation).toFixed(1)}</td></tr>
        <tr><td>Course Content</td><td>${calculateAverageRating(evaluation.courseContentEvaluation).toFixed(1)}</td></tr>
        <tr><td>Venue</td><td>${calculateAverageRating(evaluation.venueEvaluation).toFixed(1)}</td></tr>
        <tr><td><b>Overall Rating</b></td><td><b>${calculateOverallRating(evaluation).toFixed(1)}</b></td></tr>
      </table>
    </body></html>`

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `Evaluation_${evaluation.fullName?.replace(/[^a-zA-Z0-9]/g, '_')}.doc`
  link.click()
}

const exportAllToPDF = async () => {
  const doc = new jsPDF({ unit: 'pt', format: 'legal', orientation: 'landscape' })
  const pageWidth = doc.internal.pageSize.getWidth()
  
  try {
    const logo1 = await loadImage('/dictlogo2.png')
    const logo2 = await loadImage('/Bagongpilipinas.png')
    doc.addImage(logo1, 'PNG', 40, 10, 65, 65)
    doc.addImage(logo2, 'PNG', pageWidth - 105, 10, 65, 65)
  } catch(e) { console.error('Error loading logos', e) }

  doc.setFont('Times', 'normal')
  doc.setFontSize(11)
  doc.text('REPUBLIC OF THE PHILIPPINES', pageWidth / 2, 35, { align: 'center' })
  doc.setFont('Times', 'bold')
  doc.setFontSize(13)
  doc.text('DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY', pageWidth / 2, 55, { align: 'center' })
  doc.setFont('Times', 'normal')
  doc.setFontSize(12)
  doc.text('DTC Training Evaluations Report', pageWidth / 2, 75, { align: 'center' })

  const tableColumn = ["Date", "Name", "Training", "RP", "RP Avg", "Content Avg", "Venue Avg", "Overall"]
  const tableRows = filteredEvaluations.value.map(e => [
    formatDate(e.submittedAt),
    e.fullName || 'N/A',
    e.trainingTitle || 'N/A',
    e.resourcePerson || 'N/A',
    calculateAverageRating(e.resourcePersonEvaluation).toFixed(1),
    calculateAverageRating(e.courseContentEvaluation).toFixed(1),
    calculateAverageRating(e.venueEvaluation).toFixed(1),
    calculateOverallRating(e).toFixed(1)
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 110,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] }
  })

  // Add Global Averages Summary Table
  const summaryY = doc.lastAutoTable.finalY + 30
  doc.setFont('Times', 'bold')
  doc.setFontSize(11)
  doc.text('Global Averages Summary', 40, summaryY - 10)
  
  autoTable(doc, {
    head: [['Category', 'Average Rating']],
    body: [
      ['Resource Person Overall Average', statistics.value.averageRP.toFixed(2)],
      ['Course Content Overall Average', statistics.value.averageContent.toFixed(2)],
      ['Venue & Facilities Overall Average', statistics.value.averageVenue.toFixed(2)],
      ['TOTAL OVERALL SYSTEM AVERAGE', statistics.value.averageOverall.toFixed(2)]
    ],
    startY: summaryY,
    margin: { right: 500 }, // Make it smaller/narrower
    styles: { fontSize: 9 },
    headStyles: { fillColor: [75, 85, 99] },
    columnStyles: {
      1: { halign: 'center', fontStyle: 'bold' }
    }
  })

  doc.save(`All_DTC_Evaluations_${new Date().toISOString().split('T')[0]}.pdf`)
}

const exportAllToWord = async () => {
  const logoDict = await getBase64Image('/dictlogo2.png')
  const logoBp = await getBase64Image('/Bagongpilipinas.png')
  const dictImgHtml = logoDict ? `<img src="${logoDict}" width="75" height="75" />` : ''
  const bpImgHtml = logoBp ? `<img src="${logoBp}" width="75" height="75" />` : ''

  let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <style>
        @page WordSection1 { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 1.0in; }
        div.WordSection1 { page: WordSection1; }
        table { border-collapse: collapse; width: 100%; font-size: 10pt; }
        th, td { border: 1px solid black; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        <table width="100%" style="border: none; margin-bottom: 20px;">
          <tr style="border: none;">
            <td width="20%" style="border: none;">${dictImgHtml}</td>
            <td width="60%" align="center" style="border: none;">
              <p style="font-size: 14pt; margin: 0;">REPUBLIC OF THE PHILIPPINES</p>
              <p style="font-size: 12pt; font-weight: bold; margin: 0;">DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY</p>
              <p style="font-size: 12pt; margin: 10px 0 0 0;">DTC Training Evaluations Report</p>
            </td>
            <td width="20%" style="border: none;">${bpImgHtml}</td>
          </tr>
        </table>
        <table>
          <thead>
            <tr>
              <th>Date</th><th>Name</th><th>Training</th><th>RP</th><th>RP Avg</th><th>Content</th><th>Venue</th><th>Overall</th>
            </tr>
          </thead>
          <tbody>`

  filteredEvaluations.value.forEach(e => {
    html += `<tr>
      <td>${formatDate(e.submittedAt)}</td>
      <td>${e.fullName || 'N/A'}</td>
      <td>${e.trainingTitle || 'N/A'}</td>
      <td>${e.resourcePerson || 'N/A'}</td>
      <td>${calculateAverageRating(e.resourcePersonEvaluation).toFixed(1)}</td>
      <td>${calculateAverageRating(e.courseContentEvaluation).toFixed(1)}</td>
      <td>${calculateAverageRating(e.venueEvaluation).toFixed(1)}</td>
      <td>${calculateOverallRating(e).toFixed(1)}</td>
    </tr>`
  })

  html += `</tbody></table>
  
  <h3 style="margin-top: 30px;">Global Averages Summary</h3>
  <table style="width: 50%; margin-top: 10px; border-collapse: collapse;">
    <tr style="background-color: #4b5563; color: white;">
      <th style="border: 1px solid black; padding: 5px;">Category</th>
      <th style="border: 1px solid black; padding: 5px; text-align: center;">Average Rating</th>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px;">Resource Person Overall Average</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${statistics.value.averageRP.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px;">Course Content Overall Average</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${statistics.value.averageContent.toFixed(2)}</td>
    </tr>
    <tr>
      <td style="border: 1px solid black; padding: 5px;">Venue & Facilities Overall Average</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${statistics.value.averageVenue.toFixed(2)}</td>
    </tr>
    <tr style="font-weight: bold; background-color: #f9fafb;">
      <td style="border: 1px solid black; padding: 5px;">TOTAL OVERALL SYSTEM AVERAGE</td>
      <td style="border: 1px solid black; padding: 5px; text-align: center;">${statistics.value.averageOverall.toFixed(2)}</td>
    </tr>
  </table>
  
  </div></body></html>`

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `All_DTC_Evaluations_${new Date().toISOString().split('T')[0]}.doc`
  link.click()
}

onMounted(() => {
  loadEvaluations()
})
</script>

<style scoped>
/* Custom styles for the table */
table {
  border-collapse: collapse;
}

/* Modal backdrop scroll lock helper or redundant styles (Tailwind handles fixed inset-0) */

/* Scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
