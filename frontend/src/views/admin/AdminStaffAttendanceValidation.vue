<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar />


    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white z-10">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-semibold bg-white">Attendance Validation</h1>
            <p class="text-gray-500 ">Review and validate staff attendance logs for compliance.</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#133e75] animate-pulse"></span>
              <span class="text-xs font-semibold text-[#133e75] ">Live Monitoring</span>
            </div>
          </div>
        </div>
      </header>


      <main class="flex-1 overflow-auto px-6 py-6">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else class="space-y-6">
         
          <!-- Staff Avatar Filter -->
          <div class="bg-white p-6 rounded-xl border border-gray-100">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">Quick Staff Filter</h3>
              <button v-if="selectedStaffId" @click="selectedStaffId = null" class="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">Clear Filter</button>
            </div>
            <div class="flex items-center gap-4 overflow-x-auto pb-2 custom-scrollbar">
              <!-- All Staff Option -->
              <button
                @click="selectedStaffId = null"
                class="flex flex-col items-center gap-2 shrink-0 group transition-all"
              >
                <div class="w-14 h-14 rounded-full flex items-center justify-center transition-all border-2"
                     :class="!selectedStaffId ? 'bg-[#133e75] text-white' : 'border-[#133e75] text-[#133e75] group-hover:border-[#133e75]'">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <span class="text-xs font-semibold" :class="!selectedStaffId ? 'text-blue-900' : 'text-[#133e75] group-hover:text-[#133e75]'">ALL</span>
              </button>


              <!-- Individual Staff Avatars -->
              <button
                v-for="user in staffUsers"
                :key="user.id"
                @click="selectedStaffId = user.id"
                class="flex flex-col items-center gap-2 shrink-0 group transition-all"
                :title="user.firstName + ' ' + user.lastName"
              >
                <div class="w-14 h-14 rounded-full overflow-hidden transition-all border-2"
                     :class="selectedStaffId === user.id ? 'border-[#133e75]' : 'border-[#133e75]/80'">
                  <img v-if="user.photoUrl" :src="user.photoUrl" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full bg-blue-50 flex items-center justify-center text-[#133e75] font-bold text-xs">
                    {{ (user.firstName?.[0] || '') + (user.lastName?.[0] || '') }}
                  </div>
                </div>
                <span class="text-xs font-medium truncate max-w-[56px]" :class="selectedStaffId === user.id ? 'text-[#133e75]' : 'text-gray-400 group-hover:text-gray-600'">
                  {{ user.firstName }}
                </span>
              </button>
            </div>
          </div>


          <!-- Table Section -->
          <section class="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <!-- Table Header / Search -->
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <div class="relative flex-1 max-w-md">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01" fill="currentColor" opacity="0"/>
                  <path fill="currentColor" d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"/>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search staff, date, or address..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none  transition-all"
                />
              </div>
              <div class="flex items-center gap-3">
                <select
                  v-model="statusFilter"
                  class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="At Office">At Office</option>
                  <option value="On Field">On Field</option>
                  <option value="Travel">Travel</option>
                  <option value="Leave">Leave</option>
                </select>
                <select
                  v-model="validationFilter"
                  class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 "
                >
                  <option value="All">All Validation</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>


            <!-- Table Container -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-xs text-gray-500">
                    <th class="px-6 py-4">Staff Member</th>
                    <th class="px-6 py-4">Date</th>
                    <th class="px-6 py-4">Time In</th>
                    <th class="px-6 py-4">Time Out</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4">Location/Address</th>
                    <th class="px-6 py-4">Photo</th>
                    <th class="px-6 py-4 text-center">Validation</th>
                    <th class="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="filteredAttendances.length === 0">
                    <td colspan="9" class="px-6 py-20 text-center text-gray-400 font-medium">No attendance records found matched your criteria.</td>
                  </tr>
                  <tr
                    v-for="att in filteredAttendances"
                    :key="att.id"
                    class="hover:bg-blue-50/30 transition-colors group"
                  >
                    <!-- Staff Member -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-white ring-1 ring-blue-50">
                          <img v-if="getStaffPhoto(att.staffId)" :src="getStaffPhoto(att.staffId)" class="w-full h-full object-cover" />
                          <span v-else>{{ getStaffInitials(att.staffId) }}</span>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900 leading-tight">{{ getStaffName(att.staffId) }}</p>
                          <p class="text-xs text-gray-400 font-medium">{{ getStaffPosition(att.staffId) }}</p>
                        </div>
                      </div>
                    </td>


                    <!-- Date -->
                    <td class="px-6 py-5 whitespace-nowrap text-xs font-medium text-gray-700 tabular-nums">
                      {{ formatDate(att.date) }}
                    </td>


                    <!-- Time In -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-xs font-medium text-gray-800">{{ att.timeInAM || '-' }} <span class="text-[10px] text-emerald-400 font-medium">AM</span></span>
                        <span class="text-xs font-medium text-gray-800">{{ att.timeInPM || '-' }} <span class="text-[10px] text-red-400 font-medium">PM</span></span>
                      </div>
                    </td>


                    <!-- Time Out -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="text-xs font-medium text-gray-800">{{ att.timeOutAM || '-' }} <span class="text-[10px] text-gray-400 font-medium">AM</span></span>
                        <span class="text-xs font-medium text-gray-800">{{ att.timeOutPM || '-' }} <span class="text-[10px] text-gray-400 font-medium">PM</span></span>
                      </div>
                    </td>


                    <!-- Status -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <span :class="getStatusClass(att.staffStatus)" class="px-2.5 py-1 rounded-full text-xs font-medium border">
                        {{ att.staffStatus || 'Pending' }}
                      </span>
                    </td>


                    <!-- Address -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="max-w-[200px] overflow-hidden text-ellipsis italic text-xs text-gray-500 leading-relaxed bg-gray-50/50 px-2 py-1 rounded-lg border border-gray-100">
                        {{ att.LocAM?.address || att.LocPM?.address || att.address || 'Location data unavailable' }}
                      </div>
                    </td>


                    <!-- Photo -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <button
                        v-if="att.photoUrl"
                        @click="previewPhoto(att.photoUrl)"
                        class="w-10 h-10 rounded-lg overflow-hidden "
                      >
                        <img :src="att.photoUrl" class="w-full h-full object-cover" />
                      </button>
                      <span v-else class="text-[10px] text-gray-300 italic font-medium">No photo</span>
                    </td>


                    <!-- Validation Status -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex flex-col gap-1">
                        <span :class="getValidationClass(att)" class="px-2.5 py-1 rounded-full text-xs font-medium border text-center">
                          {{ getValidationDisplayText(att) }}
                        </span>
                        <span v-if="att.validatedAt" class="text-[8px] text-gray-400 text-center italic">Validated {{ formatLastUpdate(att.validatedAt) }}</span>
                      </div>
                    </td>






                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          @click="approveAttendance(att)"
                          :disabled="att.validationStatus === 'Approved'"
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 disabled:opacity-30 tooltip text-center"
                          title="Approve"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M13.349 2.378a.75.75 0 0 1 .808-.361l.127.027a3.875 3.875 0 0 1 2.879 4.97L16.527 9h1.137c2.645 0 4.513 2.591 3.676 5.1l-1.559 4.678A3.25 3.25 0 0 1 16.698 21h-5.289a4.5 4.5 0 0 1-2.828-.999A1.75 1.75 0 0 1 7 21H4.75A1.75 1.75 0 0 1 3 19.25v-8.5C3 9.784 3.784 9 4.75 9h4.67a.25.25 0 0 0 .217-.126zM8.75 18.16l.683.598a3 3 0 0 0 1.976.742h5.289a1.75 1.75 0 0 0 1.66-1.197l1.559-4.677a2.375 2.375 0 0 0-2.253-3.126H15.5a.75.75 0 0 1-.714-.979l.948-2.964a2.375 2.375 0 0 0-1.373-2.927l-3.422 5.988a1.75 1.75 0 0 1-1.519.882h-.67zm-1.5-7.66h-2.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25H7a.25.25 0 0 0 .25-.25z"/>
                          </svg>
                        </button>
                        <button
                          @click="rejectAttendance(att)"
                          :disabled="att.validationStatus === 'Rejected'"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-30"
                          title="Reject"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M10.651 21.622a.75.75 0 0 1-.808.361l-.127-.027a3.875 3.875 0 0 1-2.879-4.97L7.473 15H6.336c-2.645 0-4.513-2.591-3.676-5.1l1.559-4.678A3.25 3.25 0 0 1 7.302 3h5.289c1.031 0 2.029.354 2.828.999A1.75 1.75 0 0 1 17 3h2.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 19.25 15h-4.67a.25.25 0 0 0-.217.126zM15.25 5.84l-.684-.598a3 3 0 0 0-1.975-.742H7.302a1.75 1.75 0 0 0-1.66 1.197l-1.559 4.677A2.375 2.375 0 0 0 6.336 13.5H8.5a.75.75 0 0 1 .714.979l-.948 2.964a2.375 2.375 0 0 0 1.373 2.927l3.422-5.988a1.75 1.75 0 0 1-1.519-.882h.67zm1.5 7.66h2.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H17a.25.25 0 0 0-.25.25z"/>
                          </svg>
                        </button>
                        <button
                          @click="viewDetails(att)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Details/Edit"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                              <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"/>
                              <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"/>
                            </g>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>


      <!-- Photo Preview Modal -->
      <div v-if="showingPhoto" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 " @click.self="showingPhoto = null">
        <div class="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
          <button @click="showingPhoto = null" class="absolute top-4 right-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center text-xl backdrop-blur-sm transition-all border border-white/10">✕</button>
          <img :src="showingPhoto" class="w-full h-auto max-h-[85vh] object-contain" />
        </div>
      </div>


      <!-- Detail/Remark Modal -->
      <div v-if="activeAttendance" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in" @click.self="activeAttendance = null">
        <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
          <div class="px-8 py-6">
            <h3 class="text-2xl font-semibold text-gray-900">Attendance Validation</h3>
            <p class="text-sm text-gray-500">Submit your manual validation and remarks.</p>
          </div>
         
          <div class="p-8 space-y-6">
            <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl -mt-8 ">
               <div class="w-12 h-12 rounded-full ext-white flex items-center justify-center font-bold text-lg overflow-hidden">
                <img v-if="getStaffPhoto(activeAttendance.staffId)" :src="getStaffPhoto(activeAttendance.staffId)" class="w-full h-full object-cover" />
                <span v-else>{{ getStaffInitials(activeAttendance.staffId) }}</span>
              </div>
              <div>
                <p class="font-bold text-gray-900">{{ getStaffName(activeAttendance.staffId) }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(activeAttendance.date) }} • {{ activeAttendance.staffStatus }}</p>
              </div>
            </div>


            <div class="space-y-4">
              <div class="flex flex-col gap-1.5">
                <label class="text-sm text-gray-500">Validation Action</label>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    @click="validationForm.status = 'Approved'"
                    :class="['py-3 rounded-xl border-2 text-xs font-bold transition-all', validationForm.status === 'Approved' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200']"
                  >
                    APPROVE
                  </button>
                  <button
                    @click="validationForm.status = 'Rejected'"
                    :class="['py-3 rounded-xl border-2 text-xs font-bold transition-all', validationForm.status === 'Rejected' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200']"
                  >
                    REJECT
                  </button>
                </div>
              </div>


              <div class="flex flex-col gap-1.5">
                <label class="text-sm text-gray-500">Remarks / Notes</label>
                <textarea
                  v-model="validationForm.remarks"
                  placeholder="Enter reason for rejection or special notes..."
                  rows="3"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none  focus:ring-gray-500/10 focus:border-gray-500 transition-all resize-none"
                ></textarea>
              </div>
            </div>
          </div>


          <div class="px-8 py-6  flex justify-end gap-3">
            <button @click="activeAttendance = null" class="px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
            <button
              @click="submitValidation"
              :disabled="!validationForm.status || validating"
              class="px-8 py-3 bg-[#133e75] hover:bg-[#133e75]/90 text-white text-sm font-semibold rounded-xl transition-all  disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              <svg v-if="validating" class="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>Submit Action</span>
            </button>
          </div>
        </div>
      </div>


    <!-- Approve Confirmation Modal -->
    <div v-if="showApproveModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/52 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative p-8 text-center border border-gray-100">
        <div class="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#22c55e" d="M13.349 2.378a.75.75 0 0 1 .808-.361l.127.027a3.875 3.875 0 0 1 2.879 4.97L16.527 9h1.137c2.645 0 4.513 2.591 3.676 5.1l-1.559 4.678A3.25 3.25 0 0 1 16.698 21h-5.289a4.5 4.5 0 0 1-2.828-.999A1.75 1.75 0 0 1 7 21H4.75A1.75 1.75 0 0 1 3 19.25v-8.5C3 9.784 3.784 9 4.75 9h4.67a.25.25 0 0 0 .217-.126zM8.75 18.16l.683.598a3 3 0 0 0 1.976.742h5.289a1.75 1.75 0 0 0 1.66-1.197l1.559-4.677a2.375 2.375 0 0 0-2.253-3.126H15.5a.75.75 0 0 1-.714-.979l.948-2.964a2.375 2.375 0 0 0-1.373-2.927l-3.422 5.988a1.75 1.75 0 0 1-1.519.882h-.67zm-1.5-7.66h-2.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25H7a.25.25 0 0 0 .25-.25z"/>
          </svg>
        </div>
        
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">Approve Attendance</h3>
        <p class="text-gray-500 mb-8">
          Confirm approval for <span class="font-semibold text-gray-900">{{ getStaffName(attendanceToProcess?.staffId) }}</span> on <span class="font-semibold text-gray-900">{{ formatDate(attendanceToProcess?.date) }}</span>?
        </p>


        <div class="flex gap-3">
          <button 
            @click="closeApproveModal"
            class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
            :disabled="validating"
          >
            Cancel
          </button>
          <button 
            @click="executeConfirmApproval"
            class="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all  shadow-green-100 active:scale-95 flex items-center justify-center gap-2"
            :disabled="validating"
          >
            <span v-if="validating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ validating ? 'Approving...' : 'Confirm Approve' }}</span>
          </button>
        </div>
      </div>
    </div>


    <!-- Reject Confirmation Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/52 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative p-8 border border-gray-100">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ef4444" d="M10.651 21.622a.75.75 0 0 1-.808.361l-.127-.027a3.875 3.875 0 0 1-2.879-4.97L7.473 15H6.336c-2.645 0-4.513-2.591-3.676-5.1l1.559-4.678A3.25 3.25 0 0 1 7.302 3h5.289c1.031 0 2.029.354 2.828.999A1.75 1.75 0 0 1 17 3h2.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 19.25 15h-4.67a.25.25 0 0 0-.217.126zM15.25 5.84l-.684-.598a3 3 0 0 0-1.975-.742H7.302a1.75 1.75 0 0 0-1.66 1.197l-1.559 4.677A2.375 2.375 0 0 0 6.336 13.5H8.5a.75.75 0 0 1 .714.979l-.948 2.964a2.375 2.375 0 0 0 1.373 2.927l3.422-5.988a1.75 1.75 0 0 1 1.519-.882h.67zm1.5 7.66h2.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H17a.25.25 0 0 0-.25.25z"/>
          </svg>
        </div>
        
        <h3 class="text-2xl font-semibold text-gray-900 mb-4 text-center">Reject Attendance</h3>
        <p class="text-gray-500 mb-6 text-center">
          Provide a reason for rejecting <span class="font-semibold text-gray-900">{{ getStaffName(attendanceToProcess?.staffId) }}</span>'s attendance on <span class="font-semibold text-gray-900">{{ formatDate(attendanceToProcess?.date) }}</span>:
        </p>


        <div class="mb-8">
          <label class="text-sm font-medium text-gray-400 pl-1 mb-1.5 block">Rejection Remark</label>
          <textarea 
            v-model="rejectRemark"
            placeholder="E.g., Incorrect location, missing photo..."
            rows="3"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none  focus:ring-red-500/10 focus:border-red-500 transition-all resize-none"
          ></textarea>
        </div>


        <div class="flex gap-3">
          <button 
            @click="closeRejectModal"
            class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
            :disabled="validating"
          >
            Cancel
          </button>
          <button 
            @click="executeConfirmRejection"
            class="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-red-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            :disabled="validating || !rejectRemark.trim()"
          >
            <span v-if="validating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ validating ? 'Rejecting...' : 'Confirm Reject' }}</span>
          </button>
        </div>
      </div>
    </div>


    </div>
  </div>
</template>


<script>
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { mapActions, mapState } from 'pinia'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'


export default {
  name: 'AdminStaffAttendanceValidation',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'All',
      validationFilter: 'All',
      selectedStaffId: null,
      showingPhoto: null,
      activeAttendance: null,
      validating: false,
      showApproveModal: false,
      showRejectModal: false,
      attendanceToProcess: null,
      rejectRemark: '',
      validationForm: {
        status: 'Approved',
        remarks: ''
      },
      // The specific Calapan address for auto-approval
      OFFICE_ADDRESS: 'M. Roxas Drive, Lalom, Santa Isabel, Calapan, Oriental Mindoro, Philippines'
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffAttendances', 'staffUsers', 'loading']),
   
    filteredAttendances() {
      return this.staffAttendances.filter(att => {
        // Staff Selection Filter
        if (this.selectedStaffId && att.staffId !== this.selectedStaffId) return false


        const staffName = this.getStaffName(att.staffId).toLowerCase()
        const date = this.formatDate(att.date).toLowerCase()
        const addr = (att.LocAM?.address || att.LocPM?.address || att.address || '').toLowerCase()
        const query = this.searchQuery.toLowerCase()
       
        const matchesSearch = staffName.includes(query) || date.includes(query) || addr.includes(query)
        const matchesStatus = this.statusFilter === 'All' || att.staffStatus === this.statusFilter
       
        const currentValidation = this.getValidationDisplayText(att)
        const matchesValidation = this.validationFilter === 'All' || currentValidation === this.validationFilter


        return matchesSearch && matchesStatus && matchesValidation
      })
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, ['fetchAllStaffAttendances', 'fetchStaffUsers', 'validateStaffAttendance']),
   
    getStaffName(staffId) {
      const user = this.staffUsers.find(u => u.id === staffId)
      return user ? `${user.firstName} ${user.lastName}` : 'Unknown Staff'
    },
   
    getStaffPhoto(staffId) {
      return this.staffUsers.find(u => u.id === staffId)?.photoUrl || null
    },


    getStaffPosition(staffId) {
      return this.staffUsers.find(u => u.id === staffId)?.position || 'Staff'
    },


    getStaffInitials(staffId) {
      const user = this.staffUsers.find(u => u.id === staffId)
      if (!user) return '?'
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    },


    formatDate(dateStr) {
      if (!dateStr) return '-'
      const [y, m, d] = dateStr.split('-')
      if (!y || !m || !d) return dateStr
      const date = new Date(y, m - 1, d)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },


    formatLastUpdate(timestamp) {
      if (!timestamp) return ''
      if (timestamp.toDate) return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },


    getStatusClass(status) {
      switch (status) {
        case 'At Office': return 'bg-blue-50 text-blue-700 border-blue-200'
        case 'On Field': return 'bg-amber-50 text-amber-700 border-amber-200'
        case 'Travel': return 'bg-purple-50 text-purple-700 border-purple-200'
        case 'Leave': return 'bg-red-50 text-red-700 border-red-200'
        default: return 'bg-gray-50 text-gray-700 border-gray-200'
      }
    },


    getValidationClass(att) {
      const status = this.getValidationDisplayText(att)
      switch (status) {
        case 'Approved': return 'bg-green-50 text-green-700 border-green-200'
        case 'Rejected': return 'bg-red-50 text-red-700 border-red-200'
        default: return 'bg-amber-50 text-amber-700 border-amber-200'
      }
    },


    getValidationDisplayText(att) {
      // If manually set in DB, use that
      if (att.validationStatus) return att.validationStatus
     
      // Auto-approval logic
      const addr = att.LocAM?.address || att.LocPM?.address || att.address || ''
      if (addr.includes('M. Roxas Drive') || addr.includes('Santa Isabel') || addr.includes('Calapan')) {
        return 'Approved'
      }
     
      return 'Pending'
    },


    previewPhoto(url) {
      this.showingPhoto = url
    },


    viewDetails(att) {
      this.activeAttendance = att
      this.validationForm.status = this.getValidationDisplayText(att)
      this.validationForm.remarks = att.remarks || ''
    },


    approveAttendance(att) {
      this.attendanceToProcess = att
      this.showApproveModal = true
    },


    closeApproveModal() {
      this.showApproveModal = false
      this.attendanceToProcess = null
    },


    async executeConfirmApproval() {
      if (!this.attendanceToProcess) return
      this.validating = true
      try {
        await this.validateStaffAttendance(this.attendanceToProcess.id, 'Approved', 'Validated by Admin')
        this.closeApproveModal()
      } catch (err) {
        alert('Approval failed: ' + err.message)
      } finally {
        this.validating = false
      }
    },


    rejectAttendance(att) {
      this.attendanceToProcess = att
      this.rejectRemark = ''
      this.showRejectModal = true
    },


    closeRejectModal() {
      this.showRejectModal = false
      this.attendanceToProcess = null
      this.rejectRemark = ''
    },


    async executeConfirmRejection() {
      if (!this.attendanceToProcess || !this.rejectRemark.trim()) return
      this.validating = true
      try {
        await this.validateStaffAttendance(this.attendanceToProcess.id, 'Rejected', this.rejectRemark)
        this.closeRejectModal()
      } catch (err) {
        alert('Rejection failed: ' + err.message)
      } finally {
        this.validating = false
      }
    },


    async submitValidation() {
      if (!this.activeAttendance) return
      this.validating = true
      const res = await this.validateStaffAttendance(
        this.activeAttendance.id,
        this.validationForm.status,
        this.validationForm.remarks
      )
      this.validating = false
      if (res.success) {
        this.activeAttendance = null
      } else {
        alert('Failed to update validation: ' + (res.error || 'Unknown error'))
      }
    }
  },
  async mounted() {
    this.fetchStaffUsers()
    this.fetchAllStaffAttendances()
  }
}
</script>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f8fafc;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}


@keyframes fade-in {
  from { opacity: 0; transform: scale(0.98); }
  to { opacity: 1; transform: scale(1); }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out forwards;
}



</style>



