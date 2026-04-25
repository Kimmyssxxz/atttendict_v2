<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />


    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-white text-gray-900">
        <h1 class="m-0 text-3xl font-semibold">Student Intern Management</h1>
      </header>


      <main class="flex-1 px-6 py-6 font-sans">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else>
          <section class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div class="mb-4">
          <h2 class="text-2xl font-medium text-gray-900">Student Interns</h2>
          <p class="text-gray-500">List of all student interns registered in the system.</p>
        </div>


        <div class="flex flex-wrap gap-1 mb-4">
          <input
            v-model="search"
            type="text"
            class="flex-1 basis-[240px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
            placeholder="Search by name, username, or email"
          />
          <select v-model="roleFilter" class="flex-none basis-[200px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400">
            <option value="all">All</option>
            <option value="student-intern">Student Interns Only</option>
          </select>
          <button type="button" class="px-3.5 py-2 rounded-full text-sm cursor-pointer bg-[#b92e2b] text-white border-none transition-colors hover:bg-[#b92e2b]/80 disabled:opacity-70 disabled:cursor-default" @click="exportToPDF">
            Export PDF
          </button>
          <button type="button" class="px-3.5 py-2 rounded-full text-sm cursor-pointer bg-[#133e75] text-white border-none transition-colors hover:bg-[#133e75]/80 disabled:opacity-70 disabled:cursor-default" @click="exportToWord">
            Export Word
          </button>
          <button type="button" class="px-3.5 py-2 rounded-full text-sm cursor-pointer bg-[#eebb3b] text-white border-none transition-colors hover:bg-[#eebb3b]/80 disabled:opacity-70 disabled:cursor-default" @click="openAddModal">
            Add Intern
          </button>
        </div>


          <div v-if="error" class="text-[0.95rem] text-red-700 my-4">{{ error }}</div>
          
          <div class="border border-gray-100 rounded-xl overflow-x-auto shadow-sm">
            <table class="min-w-full divide-y divide-gray-100" v-if="filteredInterns.length">
              <thead class="bg-gray-50/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400 ">No.</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Full Name</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">School</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Hrs</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Address</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Course</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Year</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Start</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">End</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(intern, index) in paginatedInterns" :key="intern.id" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
                  <td class="px-4 py-3 text-xs font-semibold text-gray-900 whitespace-nowrap">{{ formatName(intern) }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ intern.email || '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ intern.schoolOrUniversity || '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap font-bold">{{ intern.ojtRequiredHours ?? '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-500 whitespace-nowrap truncate max-w-[150px]" :title="intern.address">{{ intern.address || '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ intern.course || '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ intern.yearLevel || '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ intern.startDate || '-' }}</td>
                  <td class="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{{ intern.endDate || '-' }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex items-center gap-1.5">
                      <button
                        @click="openViewEditModal(intern, 'view')"
                        class="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        title="View details"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                      <button
                        @click="openViewEditModal(intern, 'edit')"
                        class="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                        title="Edit intern"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </button>
                      <button
                        @click="openDeleteModal(intern)"
                        class="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        title="Archive intern"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div class="mt-4 flex items-center justify-between" v-if="filteredInterns.length">
            <div class="text-sm text-gray-600">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredInterns.length) }} of {{ filteredInterns.length }} entries
            </div>
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <span>Rows per page:</span>
                <select v-model.number="itemsPerPage" class="px-2 py-1 rounded border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                </select>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm disabled:opacity-50 cursor-pointer transition-colors hover:bg-gray-50"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >Previous</button>
                <span class="text-sm font-medium text-gray-700 px-2">Page {{ currentPage }} of {{ totalPages }}</span>
                <button
                  class="px-3 py-1.5 rounded border border-gray-300 bg-white text-sm disabled:opacity-50 cursor-pointer transition-colors hover:bg-gray-50"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >Next</button>
              </div>
            </div>
          </div>


          <div v-if="!filteredInterns.length && !error" class="text-[0.95rem] text-gray-600 py-10 text-center">No student interns found.</div>
        


        <!-- Add Intern Modal -->
        <div v-if="showAddModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div class="bg-white rounded-lg p-6 w-full max-w-[640px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 class="m-0 mb-4 text-[1.1rem] text-gray-800 font-bold">Add Student Intern</h3>


            <form @submit.prevent="handleAddIntern" class="flex flex-col gap-4">
              <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-3 max-h-[60vh] overflow-y-auto px-1">
                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Username</label>
                  <input v-model="newIntern.username" type="text" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">First Name</label>
                  <input v-model="newIntern.firstName" type="text" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Middle Name</label>
                  <input v-model="newIntern.middleName" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Last Name</label>
                  <input v-model="newIntern.lastName" type="text" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Email</label>
                  <input v-model="newIntern.email" type="email" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Assigned Office</label>
                  <input v-model="newIntern.assignedOffice" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">School / University</label>
                  <input v-model="newIntern.schoolOrUniversity" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">OJT Required Hours</label>
                  <input v-model.number="newIntern.ojtRequiredHours" type="number" min="0" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Address</label>
                  <input v-model="newIntern.address" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Gender</label>
                  <select v-model="newIntern.gender" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Date of Birth</label>
                  <input v-model="newIntern.dateOfBirth" type="date" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Course / Program</label>
                  <input v-model="newIntern.course" type="text" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Year Level</label>
                  <select v-model="newIntern.yearLevel" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm bg-white focus:outline-none focus:border-blue-500">
                    <option value="" disabled>Select Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Start Date</label>
                  <input v-model="newIntern.startDate" type="date" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">End Date</label>
                  <input v-model="newIntern.endDate" type="date" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Password</label>
                  <input v-model="newIntern.password" type="password" required class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500" />
                </div>


              </div>


              <div class="flex justify-end gap-2 mt-2">
                <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-gray-300 text-gray-800 border-none transition-colors hover:bg-gray-400" @click="closeAddModal" :disabled="savingIntern">
                  Cancel
                </button>
                <button type="submit" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default" :disabled="savingIntern">
                  {{ savingIntern ? 'Saving...' : 'Save Intern' }}
                </button>
              </div>
            </form>
          </div>
        </div>


        <!-- View/Edit Intern Modal -->
        <div v-if="showViewEditModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative p-8">
            <!-- Close Button -->
            <button 
              @click="closeViewEditModal"
              class="absolute top-6 right-6 text-gray-400 font-semibold hover:text-gray-600 transition-colors p-2 bg-gray-100 rounded-full"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="text-3xl font-semibold text-gray-900 mb-8">
              {{ viewEditMode === 'view' ? 'Student Intern Details' : 'Edit Student Intern' }}
            </h3>

            <!-- View Mode -->
            <div v-if="viewEditMode === 'view'" class="space-y-8">
              <!-- Personal Information -->
              <section>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="md:col-span-2">
                    <label class="text-sm font-medium text-gray-400 block mb-1">Full Name</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900 font-medium">{{ formatName(selectedIntern) }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Username</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.username || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Email</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.email || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Gender</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.gender || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Date of Birth</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.dateOfBirth || '-' }}</div>
                  </div>
                  <div class="md:col-span-3">
                    <label class="text-sm font-medium text-gray-400 block mb-1">Home Address</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.address || '-' }}</div>
                  </div>
                </div>
              </section>

              <!-- Academic & Assignment -->
              <section>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="text-sm font-medium text-gray-400 block mb-1">School / University</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.schoolOrUniversity || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Course / Program</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.course || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Year Level</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.yearLevel || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Assigned Office</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.assignedOffice || '-' }}</div>
                  </div>
                  <div>
                    <label class="text-sm font-medium text-gray-400 block mb-1">Role / Position</label>
                    <div class="bg-gray-50 p-3 rounded-xl text-gray-900">{{ selectedIntern.role }} / {{ selectedIntern.position }}</div>
                  </div>
                </div>
              </section>

              <!-- Internship Timeline -->
              <section>
                <h4 class="text-xl font-semibold text-gray-900 block mb-1">Internship Timeline</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div class="bg-blue-50 p-4 rounded-2xl text-center">
                    <label class="text-sm font-semibold text-blue-600 block ">Required Hours</label>
                    <div class="text-2xl font-bold text-blue-700">{{ selectedIntern.ojtRequiredHours ?? '0' }}</div>
                  </div>
                  <div class="bg-green-50 p-4 rounded-2xl text-center">
                    <label class="text-sm font-semibold text-green-600 block">Start Date</label>
                    <div class="text-2xl font-bold text-green-700">{{ selectedIntern.startDate || '-' }}</div>
                  </div>
                  <div class="bg-orange-50 p-4 rounded-2xl text-center">
                    <label class="text-sm font-semibold text-orange-600 block">End Date</label>
                    <div class="text-2xl font-bold text-orange-700">{{ selectedIntern.endDate || '-' }}</div>
                  </div>
                </div>
              </section>


            </div>

            <!-- Edit Mode -->
            <form v-else @submit.prevent="handleUpdateIntern" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-[50vh] overflow-y-auto px-2">
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Username</label>
                  <input v-model="selectedIntern.username" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">First Name</label>
                  <input v-model="selectedIntern.firstName" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Middle Name</label>
                  <input v-model="selectedIntern.middleName" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Last Name</label>
                  <input v-model="selectedIntern.lastName" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Email</label>
                  <input v-model="selectedIntern.email" type="email" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Assigned Office</label>
                  <input v-model="selectedIntern.assignedOffice" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="md:col-span-2 flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">School / University</label>
                  <input v-model="selectedIntern.schoolOrUniversity" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">OJT Required Hours</label>
                  <input v-model.number="selectedIntern.ojtRequiredHours" type="number" min="0" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="md:col-span-3 flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Address</label>
                  <input v-model="selectedIntern.address" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Gender</label>
                  <select v-model="selectedIntern.gender" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Date of Birth</label>
                  <input v-model="selectedIntern.dateOfBirth" type="date" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Course / Program</label>
                  <input v-model="selectedIntern.course" type="text" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Year Level</label>
                  <select v-model="selectedIntern.yearLevel" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
                    <option value="" disabled>Select Year Level</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="5th Year">5th Year</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">Start Date</label>
                  <input v-model="selectedIntern.startDate" type="date" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm text-gray-400 ml-1">End Date</label>
                  <input v-model="selectedIntern.endDate" type="date" class="w-full px-4 py-1.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>
              </div>

              <div class="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  @click="closeViewEditModal"
                  class="px-6 py-2 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  :disabled="savingIntern"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  class="px-5 py-2 bg-[#133e75] text-white rounded-xl font-semibold hover:bg-[#133e75]/80 transition-all disabled:opacity-70"
                  :disabled="savingIntern"
                >
                  {{ savingIntern ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 transition-all duration-300">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative p-8 text-center">

            <h3 class="text-2xl font-semibold text-red-600 mb-2">Delete Intern</h3>
            <p class="text-gray-600 mb-8 px-4">
              Are you sure you want to delete <span class="font-semibold text-gray-900">{{ formatName(internToDelete) }}</span>? This will archive their profile and all associated attendance logs.
            </p>

            <div class="flex gap-3">
              <button 
                @click="closeDeleteModal"
                class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all"
                :disabled="deletingIntern"
              >
                Cancel
              </button>
              <button 
                @click="handleDeleteIntern"
                class="flex-1 py-3 bg-[#b92e2b] text-white rounded-xl font-semibold hover:bg-red-700 transition-all disabled:opacity-70 "
                :disabled="deletingIntern"
              >
                {{ deletingIntern ? 'Deleting...' : 'Confirm Delete' }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  </main>
</div>
</div>
</template>


<script>
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { collection, query, where, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


export default {
  name: 'AdminStudentInternsView',
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
      currentPage: 1,
      itemsPerPage: 10,
      showAddModal: false,
      savingIntern: false,
      newIntern: {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        assignedOffice: '',
        schoolOrUniversity: '',
        ojtRequiredHours: null,
        address: '',
        gender: '',
        dateOfBirth: '',
        course: '',
        yearLevel: '',
        startDate: '',
        endDate: '',
        password: '',
      },
      showViewEditModal: false,
      viewEditMode: 'view',
      selectedIntern: null,
      showDeleteModal: false,
      internToDelete: null,
      deletingIntern: false,
    }
  },
  computed: {
    filteredInterns() {
      const term = this.search.trim().toLowerCase()


      let list = this.interns.filter(i => !i.isArchived)


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
    totalPages() {
      return Math.ceil(this.filteredInterns.length / this.itemsPerPage) || 1
    },
    paginatedInterns() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredInterns.slice(start, end)
    }
  },
  watch: {
    search() {
      this.currentPage = 1
    },
    roleFilter() {
      this.currentPage = 1
    },
    itemsPerPage() {
      this.currentPage = 1
    }
  },
  methods: {
    loadImage(url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = (e) => reject(e)
        img.src = url
      })
    },
    async exportToPDF() {
      const doc = new jsPDF({ unit: 'pt', format: 'legal', orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
     
      try {
        const logo1 = await this.loadImage('/dictlogo2.png');
        const logo2 = await this.loadImage('/Bagongpilipinas.png');
        doc.addImage(logo1, 'PNG', 40, 15, 75, 75);
        doc.addImage(logo2, 'PNG', pageWidth - 115, 15, 75, 75);
      } catch(e) { console.error('Error loading logos', e); }


      doc.setFont('Times', 'normal');
      doc.setFontSize(12);
      const text1 = 'REPUBLIC OF THE PHILIPPINES';
      doc.text(text1, (pageWidth - doc.getTextWidth(text1)) / 2, 50);


      doc.setFont('Times', 'bold');
      doc.setFontSize(14);
      const text2 = 'DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY';
      doc.text(text2, (pageWidth - doc.getTextWidth(text2)) / 2, 65);


      doc.setFont('Times', 'normal');
      doc.setFontSize(12);
      const text3 = 'Student Interns Report';
      doc.text(text3, (pageWidth - doc.getTextWidth(text3)) / 2, 85);


      const tableColumn = [
        "Name", "Email", "Assigned Office", "School",
        "Req. Hrs", "Address", "Gender", "DOB",
        "Course", "Yr Lvl", "Started", "Ended"
      ];
      const tableRows = [];


      this.filteredInterns.forEach((intern) => {
        const rowData = [
          this.formatName(intern),
          intern.email || '-',
          intern.assignedOffice || '-',
          intern.schoolOrUniversity || '-',
          intern.ojtRequiredHours ?? '-',
          intern.address || '-',
          intern.gender || '-',
          intern.dateOfBirth || '-',
          intern.course || "-",
          intern.yearLevel || "-",
          intern.startDate || "-",
          intern.endDate || "-"
        ];
        tableRows.push(rowData);
      });


      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 110,
        styles: { fontSize: 7, cellPadding: 3 },
        headStyles: { fillColor: [24, 98, 240] }
      });


      doc.save('Student_Interns.pdf');
    },
    async exportToWord() {
      const getBase64Image = async (url) => {
        try {
          const img = await this.loadImage(url);
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          return canvas.toDataURL('image/png');
        } catch(e) {
          return '';
        }
      };


      const logoDict = await getBase64Image('/dictlogo2.png');
      const logoBp = await getBase64Image('/Bagongpilipinas.png');


      const dictImgHtml = logoDict ? `<img src="${logoDict}" width="75" height="75" />` : '';
      const bpImgHtml = logoBp ? `<img src="${logoBp}" width="75" height="75" />` : '';


      let html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Student Interns</title>
        <style>
          @page WordSection1 {
            size: 841.9pt 595.3pt; /* A4 Landscape */
            mso-page-orientation: landscape;
            margin: 1.0in 1.0in 1.0in 1.0in;
          }
          div.WordSection1 { page: WordSection1; }
        </style>
      </head>
      <body>
      <div class="WordSection1">`;
     
      html += `<table width="100%" style="margin-bottom: 20px;">
        <tr>
          <td width="20%" align="left">${dictImgHtml}</td>
          <td width="60%" align="center">
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 14pt; margin: 0;">REPUBLIC OF THE PHILIPPINES</p>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; font-weight: bold; margin: 0;">DEPARTMENT OF INFORMATION AND COMMUNICATIONS TECHNOLOGY</p>
            <p style="font-family: 'Times New Roman', Times, serif; font-size: 12pt; margin: 0; margin-top: 10px;">Student Interns Report</p>
          </td>
          <td width="20%" align="right">${bpImgHtml}</td>
        </tr>
      </table>`;


      html += `<table border="1" cellspacing="0" cellpadding="5" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 10pt;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th>Name</th>
            <th>Email</th>
            <th>Assigned Office</th>
            <th>School/University</th>
            <th>Required Hrs</th>
            <th>Address</th>
            <th>Gender</th>
            <th>DOB</th>
            <th>Course</th>
            <th>Yr Lvl</th>
            <th>Start Date</th>
            <th>End Date</th>
          </tr>
        </thead>
        <tbody>`;


      this.filteredInterns.forEach((intern) => {
        html += `<tr>
          <td>${this.formatName(intern)}</td>
          <td>${intern.email || '-'}</td>
          <td>${intern.assignedOffice || '-'}</td>
          <td>${intern.schoolOrUniversity || '-'}</td>
          <td>${intern.ojtRequiredHours ?? '-'}</td>
          <td>${intern.address || '-'}</td>
          <td>${intern.gender || '-'}</td>
          <td>${intern.dateOfBirth || '-'}</td>
          <td>${intern.course || '-'}</td>
          <td>${intern.yearLevel || '-'}</td>
          <td>${intern.startDate || '-'}</td>
          <td>${intern.endDate || '-'}</td>
        </tr>`;
      });


      html += `</tbody></table></div></body></html>`;


      const blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Student_Interns.doc';
      link.click();
      URL.revokeObjectURL(url);
    },
    async fetchInterns() {
      this.loading = true
      this.error = ''


      try {
        const usersRef = collection(db, 'users')
        const q = query(
          usersRef,
          where('role', '==', 'student')
        )


        const snap = await getDocs(q)
        this.interns = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      } catch (err) {
        console.error('Error fetching interns:', err)
        this.error = 'Failed to load student interns from Firestore.'
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
    openAddModal() {
      this.showAddModal = true
    },
    closeAddModal() {
      if (this.savingIntern) return
      this.showAddModal = false
    },
    async handleAddIntern() {
      this.savingIntern = true


      try {
        const response = await fetch('http://localhost:3001/auth/intern/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.newIntern.username,
            firstName: this.newIntern.firstName,
            middleName: this.newIntern.middleName || '',
            lastName: this.newIntern.lastName,
            email: this.newIntern.email,
            password: this.newIntern.password,
            assignedOffice: this.newIntern.assignedOffice || '',
            schoolOrUniversity: this.newIntern.schoolOrUniversity || '',
            ojtRequiredHours: this.newIntern.ojtRequiredHours ?? null,
            position: 'intern', // Default for this view
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to add intern');
        }


        // Reset form
        this.newIntern = {
          username: '',
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          assignedOffice: '',
          schoolOrUniversity: '',
          ojtRequiredHours: null,
          address: '',
          gender: '',
          dateOfBirth: '',
          course: '',
          yearLevel: '',
          startDate: '',
          endDate: '',
          password: '',
        }


        this.showAddModal = false
        await this.fetchInterns()
      } catch (err) {
        console.error('Error adding intern:', err)
        alert(err.message || 'Failed to add intern.')
      } finally {
        this.savingIntern = false
      }
    },
    openViewEditModal(intern, mode) {
      this.viewEditMode = mode
      this.selectedIntern = { ...intern }
      this.showViewEditModal = true
    },
    closeViewEditModal() {
      if (this.savingIntern) return
      this.showViewEditModal = false
      this.selectedIntern = null
    },
    async handleUpdateIntern() {
      if (this.viewEditMode !== 'edit' || !this.selectedIntern?.id) {
        this.closeViewEditModal()
        return
      }


      this.savingIntern = true


      try {
        const internId = this.selectedIntern.id
        const internRef = doc(db, 'users', internId)


        const payload = {
          username: this.selectedIntern.username || '',
          firstName: this.selectedIntern.firstName || '',
          middleName: this.selectedIntern.middleName || '',
          lastName: this.selectedIntern.lastName || '',
          email: this.selectedIntern.email || '',
          assignedOffice: this.selectedIntern.assignedOffice || '',
          schoolOrUniversity: this.selectedIntern.schoolOrUniversity || '',
          ojtRequiredHours: this.selectedIntern.ojtRequiredHours ?? null,
          address: this.selectedIntern.address || '',
          gender: this.selectedIntern.gender || '',
          dateOfBirth: this.selectedIntern.dateOfBirth || '',
          course: this.selectedIntern.course || '',
          yearLevel: this.selectedIntern.yearLevel || '',
          startDate: this.selectedIntern.startDate || '',
          endDate: this.selectedIntern.endDate || '',
        }


        await updateDoc(internRef, payload)


        this.showViewEditModal = false
        this.selectedIntern = null


        // Refresh list so AM Tag / PM Tag columns show latest values from Firestore
        await this.fetchInterns()
      } catch (err) {
        console.error('Error updating intern:', err)
        alert('Failed to update intern.')
      } finally {
        this.savingIntern = false
      }
    },
    openDeleteModal(intern) {
      this.internToDelete = intern
      this.showDeleteModal = true
    },
    closeDeleteModal() {
      if (this.deletingIntern) return
      this.showDeleteModal = false
      this.internToDelete = null
    },
    async handleDeleteIntern() {
      if (!this.internToDelete?.id) return
      
      this.deletingIntern = true
      try {
        const intern = this.internToDelete
        // 1. Archive student profile
        const ref = doc(db, 'users', intern.id)
        await updateDoc(ref, { isArchived: true })

        // 2. Archive associated attendance records
        const attendanceQuery = query(collection(db, 'intern_attendance'), where('internId', '==', intern.id))
        const attendanceSnap = await getDocs(attendanceQuery)

        if (!attendanceSnap.empty) {
          const batch = writeBatch(db)
          attendanceSnap.docs.forEach((d) => {
            batch.update(d.ref, { isArchived: true })
          })
          await batch.commit()
        }

        await this.fetchInterns()
        this.closeDeleteModal()
      } catch (err) {
        console.error('Error archiving intern:', err)
        alert('Failed to delete intern.')
      } finally {
        this.deletingIntern = false
      }
    },
  },
  created() {
    this.fetchInterns()
  },
}
</script>





