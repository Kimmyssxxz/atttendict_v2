<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar />


    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white ">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-semibold bg-white">Leave Document Management</h1>
            <p class="text-gray-500 ">Unified view of all staff leave documents and status updates.</p>
          </div>
          <div class="flex items-center gap-4">
             <div class="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-[#133e75]"></span>
              <span class="text-xs font-semibold text-[#133e75]">{{ leaveRequests.length }} Total Records</span>
            </div>
          </div>
        </div>
      </header>


      <main class="flex-1 overflow-auto px-6 py-6">
        <TableSkeleton v-if="loading" :rows="10" />
        <div v-else>
         
          <section class="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <div class="relative flex-1 max-w-md">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search staff name..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none  focus:ring-blue-500/10  transition-all "
                />
              </div>
              <div class="flex items-center gap-3">
                <select
                  v-model="statusFilter"
                  class="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10  transition-all"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button
                  @click="refreshData"
                  class="p-2.5  text-gray-500 transition-all "
                  title="Refresh Data"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                </button>
              </div>
            </div>


            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-xs text-gray-500 border-b border-gray-100">
                    <th class="px-6 py-4">Name</th>
                    <th class="px-6 py-4">Leave Start Date</th>
                    <th class="px-6 py-4">Leave End Date</th>
                    <th class="px-6 py-4">Leave Documents URL</th>
                    <th class="px-6 py-4 text-center">Status</th>
                    <th class="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="filteredRequests.length === 0">
                    <td colspan="6" class="px-6 py-20 text-center text-gray-400 font-medium italic">No leave documents matching your criteria were found.</td>
                  </tr>
                  <tr
                    v-for="req in filteredRequests"
                    :key="req.id"
                    class="hover:bg-blue-50/20 transition-colors group"
                  >
                    <!-- Name -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden border border-white ring-1 ring-blue-50">
                          <img v-if="getStaffPhoto(req.staffId)" :src="getStaffPhoto(req.staffId)" class="w-full h-full object-cover" />
                          <span v-else>{{ getStaffInitials(req.staffId) }}</span>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900 leading-tight text-base">{{ getStaffName(req.staffId) }}</p>
                          <p class="text-xs text-gray-400 font-semibold">{{ getStaffPosition(req.staffId) }}</p>
                        </div>
                      </div>
                    </td>


                    <!-- Start Date -->
                    <td class="px-6 py-5 whitespace-nowrap">
                       <span class="text-xs font-semibold text-gray-700">{{ formatDate(req.leaveStartDate) }}</span>
                    </td>


                    <!-- End Date -->
                    <td class="px-6 py-5 whitespace-nowrap">
                       <span class="text-xs font-semibold text-gray-700">{{ formatDate(req.leaveEndDate) }}</span>
                    </td>


                    <!-- Leave Documents URL -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div v-if="getDocUrls(req).length > 0" class="flex flex-col gap-1.5 max-w-[250px]">
                        <div v-for="(doc, idx) in getDocUrls(req)" :key="idx" class="flex items-center gap-2">
                           <button
                             @click="viewFile(doc)"
                             class="text-[10px] text-blue-600 font-bold hover:underline truncate bg-blue-50/50 px-2 py-1 rounded border border-blue-100 text-left"
                           >
                             URL {{ idx + 1 }}: {{ getFileName(doc) }}
                           </button>
                        </div>
                      </div>
                      <span v-else class="text-[10px] text-gray-300 italic font-medium">No files uploaded</span>
                    </td>


                    <!-- Status -->
                    <td class="px-6 py-5 whitespace-nowrap text-center">
                      <span :class="getStatusClass(req.validationStatus)" class="px-3 py-1 rounded-full text-xs font-semibold  border transition-all">
                        {{ req.validationStatus || 'Pending' }}
                      </span>
                    </td>


                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap text-center">
                      <div class="flex items-center justify-center gap-2">
                        <button
                          @click="approveLeave(req)"
                          :disabled="req.validationStatus === 'Approved'"
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100 disabled:opacity-30 tooltip text-center"
                          title="Approve"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M13.349 2.378a.75.75 0 0 1 .808-.361l.127.027a3.875 3.875 0 0 1 2.879 4.97L16.527 9h1.137c2.645 0 4.513 2.591 3.676 5.1l-1.559 4.678A3.25 3.25 0 0 1 16.698 21h-5.289a4.5 4.5 0 0 1-2.828-.999A1.75 1.75 0 0 1 7 21H4.75A1.75 1.75 0 0 1 3 19.25v-8.5C3 9.784 3.784 9 4.75 9h4.67a.25.25 0 0 0 .217-.126zM8.75 18.16l.683.598a3 3 0 0 0 1.976.742h5.289a1.75 1.75 0 0 0 1.66-1.197l1.559-4.677a2.375 2.375 0 0 0-2.253-3.126H15.5a.75.75 0 0 1-.714-.979l.948-2.964a2.375 2.375 0 0 0-1.373-2.927l-3.422 5.988a1.75 1.75 0 0 1-1.519.882h-.67zm-1.5-7.66h-2.5a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25H7a.25.25 0 0 0 .25-.25z"/>
                          </svg>
                        </button>
                        <button
                          @click="rejectLeave(req)"
                          :disabled="req.validationStatus === 'Rejected'"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100 disabled:opacity-30"
                          title="Reject"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M10.651 21.622a.75.75 0 0 1-.808.361l-.127-.027a3.875 3.875 0 0 1-2.879-4.97L7.473 15H6.336c-2.645 0-4.513-2.591-3.676-5.1l1.559-4.678A3.25 3.25 0 0 1 7.302 3h5.289c1.031 0 2.029.354 2.828.999A1.75 1.75 0 0 1 17 3h2.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 19.25 15h-4.67a.25.25 0 0 0-.217.126zM15.25 5.84l-.684-.598a3 3 0 0 0-1.975-.742H7.302a1.75 1.75 0 0 0-1.66 1.197l-1.559 4.677A2.375 2.375 0 0 0 6.336 13.5H8.5a.75.75 0 0 1 .714.979l-.948 2.964a2.375 2.375 0 0 0 1.373 2.927l3.422-5.988a1.75 1.75 0 0 1-1.519-.882h.67zm1.5 7.66h2.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H17a.25.25 0 0 0-.25.25z"/>
                          </svg>
                        </button>
                        <button
                          @click="viewDetails(req)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                          title="Details / Remarks"
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


    <!-- Document Viewer Modal -->
    <div v-if="viewerModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/52 backdrop-blur-md animate-fade-in" @click.self="closeViewer">
      <div class="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div class="px-8 py-4 border-b border-gray-100 bg-white flex justify-between items-center">
          <div class="flex-1 min-w-0">
            <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-1">Document Viewer</h3>
            <p class="text-sm font-semibold text-gray-900 truncate">{{ viewerName }}</p>
          </div>
          <div class="flex items-center gap-3">
            <a :href="viewerUrl" target="_blank" class="px-4 py-2 bg-blue-50 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-all">Download</a>
            <button @click="closeViewer" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"></path></svg>
            </button>
          </div>
        </div>
       
        <div class="flex-1 bg-gray-100 overflow-auto relative">
          <!-- Image Viewer -->
          <div v-if="viewerType === 'image'" class="h-full flex items-center justify-center p-8">
            <img :src="viewerUrl" class="max-w-full max-h-full object-contain shadow-lg rounded-lg border border-white" />
          </div>
         
          <!-- PDF Viewer -->
          <div v-else-if="viewerType === 'pdf'" class="h-full overflow-hidden">
             <embed :src="viewerUrl" type="application/pdf" width="100%" height="100%" />
          </div>


          <!-- Office Viewer (Google Docs Viewer) -->
          <div v-else-if="viewerType === 'office'" class="h-full overflow-hidden bg-white">
             <iframe
               :src="'https://docs.google.com/viewer?url=' + encodeURIComponent(viewerUrl) + '&embedded=true'"
               width="100%"
               height="100%"
               frameborder="0"
             ></iframe>
          </div>


          <!-- Fallback Viewer -->
          <div v-else class="h-full flex flex-col items-center justify-center p-12 text-center">
            <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
            </div>
            <h4 class="text-xl font-bold text-gray-800 mb-3">Preview Not Available</h4>
            <p class="text-sm text-gray-500 max-w-xs mb-8">This file type might not be supported for direct preview in the viewer.</p>
            <a :href="viewerUrl" target="_blank" class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md">Open in External Tab</a>
          </div>
        </div>
      </div>
    </div>


    <!-- Details/Remark Modal -->
    <div v-if="activeRequest" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/52 animate-fade-in" @click.self="closeModals">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden transform transition-all">
        <div class="px-8 py-6">
          <h3 class="text-2xl font-semibold text-gray-900">Leave Validation</h3>
          <p class="text-sm text-gray-500">Submit your manual validation and remarks.</p>
        </div>
       
        <div class="p-8 space-y-6">
          <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-xl -mt-8 ">
             <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg overflow-hidden border-2 border-white shadow-sm">
              <img v-if="getStaffPhoto(activeRequest.staffId)" :src="getStaffPhoto(activeRequest.staffId)" class="w-full h-full object-cover" />
              <span v-else>{{ getStaffInitials(activeRequest.staffId) }}</span>
            </div>
            <div>
              <p class="font-bold text-gray-900 leading-tight">{{ getStaffName(activeRequest.staffId) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ formatDate(activeRequest.leaveStartDate) }} - {{ formatDate(activeRequest.leaveEndDate) }}</p>
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
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-gray-500/10 focus:border-gray-500 transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>


        <div class="px-8 py-6 flex justify-end gap-3">
          <button @click="closeModals" class="px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors">Cancel</button>
          <button
            @click="submitValidation"
            :disabled="!validationForm.status || validating"
            class="px-8 py-3 bg-[#133e75] hover:bg-[#133e75]/90 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
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
        
        <h3 class="text-2xl font-semibold text-gray-900 mb-4">Approve Leave</h3>
        <p class="text-gray-500 mb-8 px-4 text-sm leading-relaxed">
          Confirm approval for <span class="font-semibold text-gray-900">{{ getStaffName(requestToProcess?.staffId) }}</span>'s leave from <span class="font-semibold text-gray-900">{{ formatDate(requestToProcess?.leaveStartDate) }}</span> to <span class="font-semibold text-gray-900">{{ formatDate(requestToProcess?.leaveEndDate) }}</span>?
        </p>


        <div class="flex gap-3">
          <button 
            @click="closeModals"
            class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
            :disabled="validating"
          >
            Cancel
          </button>
          <button 
            @click="confirmApproveLeave"
            class="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-100 active:scale-95 flex items-center justify-center gap-2"
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
            <path fill="#ef4444" d="M10.651 21.622a.75.75 0 0 1-.808.361l-.127-.027a3.875 3.875 0 0 1-2.879-4.97L7.473 15H6.336c-2.645 0-4.513-2.591-3.676-5.1l1.559-4.678A3.25 3.25 0 0 1 7.302 3h5.289c1.031 0 2.029.354 2.828.999A1.75 1.75 0 0 1 17 3h2.25c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 19.25 15h-4.67a.25.25 0 0 0-.217.126zM15.25 5.84l-.684-.598a3 3 0 0 0-1.975-.742H7.302a1.75 1.75 0 0 0-1.66 1.197l-1.559 4.677A2.375 2.375 0 0 0 6.336 13.5H8.5a.75.75 0 0 1 .714.979l-.948 2.964a2.375 2.375 0 0 0 1.373 2.927l3.422-5.988a1.75 1.75 0 0 1-1.519-.882h.67zm1.5 7.66h2.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25H17a.25.25 0 0 0-.25.25z"/>
          </svg>
        </div>
        
        <h3 class="text-2xl font-semibold text-gray-900 mb-4 text-center">Reject Documents</h3>
        <p class="text-gray-500 mb-6 text-center text-sm px-4">
          Provide a reason for rejecting <span class="font-semibold text-gray-900">{{ getStaffName(requestToProcess?.staffId) }}</span>'s leave documents:
        </p>


        <div class="mb-8 px-4">
          <label class="text-sm font-medium text-gray-400 pl-1 mb-1.5 block">Rejection Remark</label>
          <textarea 
            v-model="rejectRemark"
            placeholder="E.g., Document is unreadable, invalid date range..."
            rows="3"
            class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500 transition-all resize-none"
          ></textarea>
        </div>


        <div class="flex gap-3 px-4">
          <button 
            @click="closeModals"
            class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
            :disabled="validating"
          >
            Cancel
          </button>
          <button 
            @click="confirmRejectLeave"
            class="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
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
  name: 'AdminStaffLeave',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      searchQuery: '',
      statusFilter: 'All',
      showApproveModal: false,
      showRejectModal: false,
      activeRequest: null,
      requestToProcess: null,
      rejectRemark: '',
      validationForm: {
        status: 'Approved',
        remarks: ''
      },
      viewerModalOpen: false,
      viewerUrl: '',
      viewerName: '',
      viewerType: ''
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffAttendances', 'staffUsers', 'loading']),
   
    leaveRequests() {
      // Filter for ANY record that has 'Leave' status OR leave dates populated
      return this.staffAttendances.filter(att =>
        att.staffStatus === 'Leave' ||
        att.staffStatusAM === 'Leave' ||
        att.staffStatusPM === 'Leave' ||
        (att.leaveStartDate && att.leaveStartDate !== null)
      )
    },


    filteredRequests() {
      return this.leaveRequests.filter(req => {
        const staffName = this.getStaffName(req.staffId).toLowerCase()
        const query = this.searchQuery.toLowerCase()
        const matchesSearch = staffName.includes(query)
       
        const status = req.validationStatus || 'Pending'
        const matchesStatus = this.statusFilter === 'All' || status === this.statusFilter
       
        return matchesSearch && matchesStatus
      }).sort((a, b) => {
          // Sort by updated time or start date desc
          const dateA = new Date(a.leaveStartDate)
          const dateB = new Date(b.leaveStartDate)
          return dateB - dateA
      })
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, [
      'fetchLeaveRequests',
      'fetchStaffUsers',
      'validateStaffAttendance'
    ]),
   
    async refreshData() {
       await this.fetchStaffUsers()
       await this.fetchLeaveRequests()
    },


    getStaffName(staffId) {
      const user = this.staffUsers.find(u => u.id === staffId)
      return user ? `${user.firstName} ${user.lastName}` : 'Unknown Staff'
    },


    getFileName(doc) {
      if (!doc) return 'document'
      if (typeof doc === 'object' && doc.name) return doc.name
      const url = typeof doc === 'object' ? doc.url : doc
      if (!url) return 'document'
      try {
        const decodedUrl = decodeURIComponent(url)
        const parts = decodedUrl.split('/')
        const fileNameWithParams = parts[parts.length - 1]
        return fileNameWithParams.split('?')[0].split('%2F').pop()
      } catch (e) {
        return 'document'
      }
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


    getDocUrls(req) {
      if (Array.isArray(req.leaveDocumentUrls)) return req.leaveDocumentUrls
      if (req.leaveDocumentUrl) return [req.leaveDocumentUrl]
      return []
    },


    formatDate(dateStr) {
      if (!dateStr) return '-'
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return dateStr
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },


    formatTimestamp(ts) {
      if (!ts) return ''
      const date = ts.toDate ? ts.toDate() : new Date(ts)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    },


    calculateDuration(start, end) {
      if (!start || !end) return 0
      const d1 = new Date(start)
      const d2 = new Date(end)
      const diffTime = Math.abs(d2 - d1)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    },


    getStatusClass(status) {
      switch (status) {
        case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
        case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200'
        default: return 'bg-blue-50 text-blue-700 border-blue-200'
      }
    },


    viewDetails(req) {
      this.activeRequest = req
      this.validationForm.status = req.validationStatus || 'Approved'
      this.validationForm.remarks = req.remarks || ''
    },


    async approveLeave(req) {
      this.requestToProcess = req
      this.showApproveModal = true
    },


    async confirmApproveLeave() {
      if (!this.requestToProcess) return
      this.validating = true
      try {
        await this.validateStaffAttendance(this.requestToProcess.id, 'Approved', 'Leave request and documents approved.')
        this.closeModals()
      } catch (err) {
        alert('Failed to approve: ' + err.message)
      } finally {
        this.validating = false
      }
    },


    async rejectLeave(req) {
      this.requestToProcess = req
      this.rejectRemark = ''
      this.showRejectModal = true
    },


    async confirmRejectLeave() {
      if (!this.requestToProcess || !this.rejectRemark.trim()) return
      this.validating = true
      try {
        await this.validateStaffAttendance(this.requestToProcess.id, 'Rejected', this.rejectRemark)
        this.closeModals()
      } catch (err) {
        alert('Failed to reject: ' + err.message)
      } finally {
        this.validating = false
      }
    },


    closeModals() {
      this.activeRequest = null
      this.requestToProcess = null
      this.showApproveModal = false
      this.showRejectModal = false
      this.rejectRemark = ''
    },


    async submitValidation() {
      if (!this.activeRequest) return
      this.validating = true
      const res = await this.validateStaffAttendance(
        this.activeRequest.id,
        this.validationForm.status,
        this.validationForm.remarks
      )
      this.validating = false
      if (res.success) {
        this.closeModals()
      } else {
        alert('Failed to update: ' + (res.error || 'Unknown error'))
      }
    },


    viewFile(doc) {
      const url = typeof doc === 'object' ? doc.url : doc
      if (!url) return
      this.viewerUrl = url
      this.viewerName = this.getFileName(doc)
      const ext = url.split('?')[0].split('.').pop().toLowerCase()
     
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext) || url.includes('image')) {
        this.viewerType = 'image'
      } else if (ext === 'pdf' || url.toLowerCase().includes('pdf')) {
        this.viewerType = 'pdf'
      } else if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
        this.viewerType = 'office'
      } else {
        this.viewerType = 'other'
      }
      this.viewerModalOpen = true
    },


    closeViewer() {
      this.viewerModalOpen = false
      this.viewerUrl = ''
      this.viewerType = ''
    }
  },
  async mounted() {
    await this.refreshData()
  }
}
</script>


<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}



</style>



