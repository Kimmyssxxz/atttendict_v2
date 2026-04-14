<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />
    
    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">DTC Training Evaluations</h1>
      </header>
      
      <main class="flex-1 px-8 py-6">
        <div class="bg-white p-6 rounded-2xl">
          <!-- Header Section -->
          <div class="mb-6">
            <h2 class="text-2xl font-medium text-gray-900">DTC Training Evaluations</h2>
            <p class="text-gray-500 mt-1">Manage and review DTC training evaluation submissions.</p>
          </div>

          <!-- Search and Actions -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div class="flex items-center gap-2 w-full sm:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <input 
                  v-model="filters.search" 
                  class="w-full sm:w-[300px] pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
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
                  class="flex items-center justify-center gap-1 px-3 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span>PDF</span>
                </button>
                <button 
                  @click="loadEvaluations"
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

          <!-- Table -->
          <div v-if="!loading" class="border border-gray-200 rounded-lg overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">Date</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">Name</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">Training</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">RP</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">RP Avg</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">Content Avg</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">Venue Avg</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
                    <div class="flex items-center">Overall</div>
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-gray-500 cursor-pointer whitespace-nowrap">
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
                <tr v-else v-for="evaluation in filteredEvaluations" :key="evaluation.id" 
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
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex gap-2">
                      <button
                        @click="viewDetails(evaluation)"
                        class="px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm"
                      >
                        View
                      </button>
                      <button
                        @click="exportToPDF(evaluation)"
                        class="px-3 py-1 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors text-sm"
                      >
                        PDF
                      </button>
                      <button
                        @click="openDeleteModal(evaluation.id)"
                        class="px-3 py-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-8">
            <div class="flex justify-center items-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="ml-2 text-gray-600">Loading evaluations...</span>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Evaluation Details</h2>
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
          <button
            @click="exportToPDF(selectedEvaluation)"
            class="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
          >
            Export to PDF
          </button>
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
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-sm w-full">
        <div class="p-6">
          <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">Delete Evaluation</h3>
          <p class="text-gray-600 text-center mb-6">Are you sure you want to delete this evaluation? This action cannot be undone.</p>
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'

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
    }).length
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

const exportToPDF = async (evaluation) => {
  pdfTargetEvaluation.value = evaluation
  await nextTick()
  
  // Wait to ensure all CSS rendering is painted
  await new Promise(resolve => setTimeout(resolve, 150))
  
  if (!pdfExportArea.value) {
    console.error("PDF export area not found")
    pdfTargetEvaluation.value = null
    return
  }

  try {
    const canvas = await html2canvas(pdfExportArea.value, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    // Set a constant width (210mm is A4 width)
    const pdfWidth = 210
    // Calculate required height based on canvas ratio
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    // Ensure the PDF is at least a full standard A4 page (297mm) tall
    const finalHeight = Math.max(pdfHeight, 297)
    
    // Create a PDF with a CUSTOM format height so it natively fits the entire evaluation seamlessly on one long page
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [pdfWidth, finalHeight]
    })
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    const fileName = `DTC_Evaluation_${evaluation.fullName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Unknown'}_${formatDate(evaluation.submittedAt).replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    pdf.save(fileName)
  } catch (err) {
    console.error("Failed to generate PDF:", err)
  } finally {
    pdfTargetEvaluation.value = null
  }
}

const exportAllToPDF = async () => {
  isExportingAll.value = true
  await nextTick()
  
  // Wait to ensure styling paints
  await new Promise(resolve => setTimeout(resolve, 150))
  
  if (!pdfExportAllArea.value) {
    console.error("PDF export area not found")
    isExportingAll.value = false
    return
  }

  try {
    const canvas = await html2canvas(pdfExportAllArea.value, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    // Set a constant width (Landscape A4 width is 297mm)
    const pdfWidth = 297
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    // Ensure the PDF is at least a full standard landscape A4 page (210mm) tall
    const finalHeight = Math.max(pdfHeight, 210)
    
    // Create custom formatting landscape page perfectly fitting the table
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [pdfWidth, finalHeight]
    })
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    
    const fileName = `All_DTC_Evaluations_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  } catch (err) {
    console.error("Failed to generate PDF:", err)
  } finally {
    isExportingAll.value = false
  }
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

th, td {
  border: 1px solid #e5e7eb;
}

/* Modal backdrop */
.fixed {
  position: fixed;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

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
