<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50/50">
    <AdminSidebar />


    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Premium Header -->
      <header class="px-8 py-8 bg-white z-10">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h1 class="m-0 text-3xl font-semibold ">Staff Management</h1>
            <p class="text-sm text-gray-500">Manage staff profiles, roles, and administrative access.</p>
          </div>
         
          <div class="flex items-center gap-3">
          </div>
        </div>
      </header>


      <main class="flex-1 overflow-auto px-6 py-6 font-sans">
        <TableSkeleton v-if="loading" :rows="10" />

        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Table Controls -->
          <div class="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white">
            <div class="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <div class="relative flex-1 sm:flex-none">
                <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  v-model="search"
                  type="text"
                  placeholder="Search by name, username, or email..."
                  class="w-full sm:w-[320px] pl-11 pr-4 py-2.5  border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 transition-all"
                />
              </div>
              
              <button
                @click="openAddModal"
                class="w-full sm:w-auto bg-[#133e75] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#133e75]/90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Add Staff Member</span>
              </button>
            </div>


            <div class="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <div class="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap mr-2">
                <span>Show:</span>
                <select
                  v-model="positionFilter"
                  class="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-gray-200 transition-all font-medium cursor-pointer"
                >
                  <option value="all">All Positions</option>
                  <option v-for="pos in uniquePositions" :key="pos" :value="pos">{{ pos }}</option>
                </select>
              </div>


              <div class="flex items-center gap-2 ml-auto lg:ml-0">
                <button
                  @click="exportToPDF"
                  class="flex items-center justify-center gap-2 px-3 py-3 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all "
                  title="Export to PDF"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                    <path fill="#909090" d="m24.1 2.072l5.564 5.8v22.056H8.879V30h20.856V7.945z"/>
                    <path fill="#f4f4f4" d="M24.031 2H8.808v27.928h20.856V7.873z"/>
                    <path fill="#7a7b7c" d="M8.655 3.5h-6.39v6.827h20.1V3.5z"/>
                    <path fill="#dd2025" d="M22.472 10.211H2.395V3.379h20.077z"/>
                    <path fill="#464648" d="M9.052 4.534H7.745v4.8h1.028V7.715L9 7.728a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .335-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.409-.104a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.193a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.671-2.306c-.111 0-.219.008-.295.011L12 4.538h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.392h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.08-3.915H15v4.8h1.028V7.434h1.3v-.892h-1.3V5.43h1.4v-.892"/>
                    <path fill="#dd2025" d="M21.781 20.255s3.188-.578 3.188.511s-1.975.646-3.188-.511m-2.357.083a7.5 7.5 0 0 0-1.473.489l.4-.9c.4-.9.815-2.127.815-2.127a14 14 0 0 0 1.658 2.252a13 13 0 0 0-1.4.288Zm-1.262-6.5c0-.949.307-1.208.546-1.208s.508.115.517.939a10.8 10.8 0 0 1-.517 2.434a4.4 4.4 0 0 1-.547-2.162Zm-4.649 10.516c-.978-.585 2.051-2.386 2.6-2.444c-.003.001-1.576 3.056-2.6 2.444M25.9 20.895c-.01-.1-.1-1.207-2.07-1.16a14 14 0 0 0-2.453.173a12.5 12.5 0 0 1-2.012-2.655a11.8 11.8 0 0 0 .623-3.1c-.029-1.2-.316-1.888-1.236-1.878s-1.054.815-.933 2.013a9.3 9.3 0 0 0 .665 2.338s-.425 1.323-.987 2.639s-.946 2.006-.946 2.006a9.6 9.6 0 0 0-2.725 1.4c-.824.767-1.159 1.356-.725 1.945c.374.508 1.683.623 2.853-.91a23 23 0 0 0 1.7-2.492s1.784-.489 2.339-.623s1.226-.24 1.226-.24s1.629 1.639 3.2 1.581s1.495-.939 1.485-1.035"/>
                    <path fill="#909090" d="M23.954 2.077V7.95h5.633z"/>
                    <path fill="#f4f4f4" d="M24.031 2v5.873h5.633z"/>
                    <path fill="#fff" d="M8.975 4.457H7.668v4.8H8.7V7.639l.228.013a2 2 0 0 0 .647-.117a1.4 1.4 0 0 0 .493-.291a1.2 1.2 0 0 0 .332-.454a2.1 2.1 0 0 0 .105-.908a2.2 2.2 0 0 0-.114-.644a1.17 1.17 0 0 0-.687-.65a2 2 0 0 0-.411-.105a2 2 0 0 0-.319-.026m-.189 2.294h-.089v-1.48h.194a.57.57 0 0 1 .459.181a.92.92 0 0 1 .183.558c0 .246 0 .469-.222.626a.94.94 0 0 1-.524.114m3.67-2.306c-.111 0-.219.008-.295.011l-.235.006h-.78v4.8h.918a2.7 2.7 0 0 0 1.028-.175a1.7 1.7 0 0 0 .68-.491a1.9 1.9 0 0 0 .373-.749a3.7 3.7 0 0 0 .114-.949a4.4 4.4 0 0 0-.087-1.127a1.8 1.8 0 0 0-.4-.733a1.6 1.6 0 0 0-.535-.4a2.4 2.4 0 0 0-.549-.178a1.3 1.3 0 0 0-.228-.017m-.182 3.937h-.1V5.315h.013a1.06 1.06 0 0 1 .6.107a1.2 1.2 0 0 1 .324.4a1.3 1.3 0 0 1 .142.526c.009.22 0 .4 0 .549a3 3 0 0 1-.033.513a1.8 1.8 0 0 1-.169.5a1.1 1.1 0 0 1-.363.36a.67.67 0 0 1-.416.106m5.077-3.915h-2.43v4.8h1.028V7.357h1.3v-.892h-1.3V5.353h1.4v-.892"/>
                  </svg>
                  <span>PDF</span>
                </button>
                <button
                  @click="exportToWord"
                  class="flex items-center justify-center gap-2 px-3.5 py-3 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all"
                  title="Export to Word"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32">
                    <defs>
                      <linearGradient id="SVG2m3AVb6p" x1="4.494" x2="13.832" y1="-1712.086" y2="-1695.914" gradientTransform="translate(0 1720)" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#2368c4"/>
                        <stop offset=".5" stop-color="#1a5dbe"/>
                        <stop offset="1" stop-color="#1146ac"/>
                      </linearGradient>
                    </defs>
                    <path fill="#41a5ee" d="M28.806 3H9.705a1.19 1.19 0 0 0-1.193 1.191V9.5l11.069 3.25L30 9.5V4.191A1.19 1.19 0 0 0 28.806 3"/>
                    <path fill="#2b7cd3" d="M30 9.5H8.512V16l11.069 1.95L30 16Z"/>
                    <path fill="#185abd" d="M8.512 16v6.5l10.418 1.3L30 22.5V16Z"/>
                    <path fill="#103f91" d="M9.705 29h19.1A1.19 1.19 0 0 0 30 27.809V22.5H8.512v5.309A1.19 1.19 0 0 0 9.705 29"/>
                    <path d="M16.434 8.2H8.512v16.25h7.922a1.2 1.2 0 0 0 1.194-1.191V9.391A1.2 1.2 0 0 0 16.434 8.2" opacity="0.1"/>
                    <path d="M15.783 8.85H8.512V25.1h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/>
                    <path d="M15.783 8.85H8.512V23.8h7.271a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/>
                    <path d="M15.132 8.85h-6.62V23.8h6.62a1.2 1.2 0 0 0 1.194-1.191V10.041a1.2 1.2 0 0 0-1.194-1.191" opacity="0.2"/>
                    <path fill="url(#SVG2m3AVb6p)" d="M3.194 8.85h11.938a1.193 1.193 0 0 1 1.194 1.191v11.918a1.193 1.193 0 0 1-1.194 1.191H3.194A1.19 1.19 0 0 1 2 21.959V10.041A1.19 1.19 0 0 1 3.194 8.85"/>
                    <path fill="#fff" d="M6.9 17.988q.035.276.046.481h.028q.015-.195.065-.47c.05-.275.062-.338.089-.465l1.255-5.407h1.624l1.3 5.326a8 8 0 0 1 .162 1h.022a8 8 0 0 1 .135-.975l1.039-5.358h1.477l-1.824 7.748h-1.727l-1.237-5.126q-.054-.222-.122-.578t-.084-.52h-.021q-.021.189-.084.561t-.1.552L7.78 19.871H6.024L4.19 12.127h1.5l1.131 5.418a5 5 0 0 1 .079.443"/>
                  </svg>
                  <span>Word</span>
                </button>
              </div>
            </div>
          </div>


          <!-- Table Content -->
          <div>
            <table class="w-full text-left">
              <thead>
                <tr class="bg-gray-50/50 text-gray-500 text-[10px] uppercase tracking-wider">
                  <th class="px-2 py-4 font-bold">Full Name</th>
                  <th class="px-2 py-4 font-bold">User</th>
                  <th class="px-2 py-4 font-bold">Email</th>
                  <th class="px-2 py-4 font-bold">Role</th>
                  <th class="px-2 py-4 font-bold">Office</th>
                  <th class="px-2 py-4 font-bold text-center">G</th>
                  <th class="px-2 py-4 font-bold text-center">Age</th>
                  <th class="px-2 py-4 font-bold">Phone</th>
                  <th class="px-2 py-4 font-bold">Stat</th>
                  <th class="px-2 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="!paginatedStaff.length" class="bg-white">
                  <td colspan="9" class="px-6 py-12 text-center text-gray-500">
                    <div class="flex flex-col items-center gap-2">
                      <span class="text-3xl">🔍</span>
                      <p class="font-medium">No staff members found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
                <tr
                  v-for="s in paginatedStaff"
                  :key="s.id"
                  class="hover:bg-blue-50/30 transition-colors group"
                >
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden shrink-0">
                        <img v-if="s.photoUrl" :src="s.photoUrl" class="w-full h-full object-cover" :alt="formatName(s)" />
                        <span v-else>{{ getInitials(s) }}</span>
                      </div>
                      <div class="min-w-0">
                        <p class="font-semibold text-gray-900 leading-tight text-xs truncate max-w-[140px]">{{ formatName(s) }}</p>
                        <p class="text-[10px] text-gray-500 mt-0.5 truncate max-w-[140px]">{{ formatAddress(s.address) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-gray-600 text-[11px] font-medium">{{ s.username || '-' }}</td>
                  <td class="px-3 py-4 whitespace-nowrap text-gray-600 text-[11px] font-medium truncate max-w-[140px]" :title="s.email">{{ s.email || '-' }}</td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <div class="min-w-0">
                      <span class="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase inline-block mb-0.5">
                        {{ s.role || 'Staff' }}
                      </span>
                      <p class="text-[10px] font-medium text-gray-500 truncate max-w-[100px]">{{ s.position || '-' }}</p>
                    </div>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap">
                    <span class="px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700 text-[10px] font-semibold truncate max-w-[120px] inline-block" :title="s.assignedOffice">
                      {{ s.assignedOffice || '-' }}
                    </span>
                  </td>
                  <td class="px-3 py-4 whitespace-nowrap text-center">
                    <span class="text-[11px] font-medium text-gray-600">
                      {{ s.gender?.[0] || '-' }}
                    </span>
                  </td>
                  <td class="px-2 py-4 whitespace-nowrap text-center text-gray-600 text-[11px] font-semibold">
                    {{ calculateAge(s.dateOfBirth) }}
                  </td>
                  <td class="px-2 py-4 whitespace-nowrap text-gray-600 text-[11px] font-semibold">{{ s.phone || '-' }}</td>
                  <td class="px-2 py-4 whitespace-nowrap">
                    <span :class="s.status === 'Inactive' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'" class="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      {{ s.status === 'Inactive' ? 'Inact' : 'Act' }}
                    </span>
                  </td>
                  <td class="px-2 py-4 whitespace-nowrap text-right">
                    <div class="flex items-center justify-end gap-0">
                      <button
                        @click="openViewEditModal(s, 'view')"
                        class="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button
                        @click="openViewEditModal(s, 'edit')"
                        class="p-2 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                        title="Edit Staff"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button
                        @click="confirmArchiveStaff(s)"
                        class="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Archive Account"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      <button
                        @click="toggleStatus(s)"
                        :class="s.status === 'Inactive' ? 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50' : 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'"
                        class="p-2 rounded-lg transition-all"
                        :title="s.status === 'Inactive' ? 'Activate Account' : 'Deactivate Account'"
                      >
                        <svg v-if="s.status === 'Inactive'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>


          <!-- Enhanced Pagination -->
          <div class="px-6 py-5 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
            <div class="text-xs text-gray-500 font-semibold">
              Showing <span class="text-gray-600">{{ staffStartIndex }}</span> to <span class="text-gray-600">{{ staffEndIndex }}</span> of <span class="text-gray-900">{{ filteredStaff.length }}</span> staff members
            </div>
            
            <div class="flex items-center gap-6">
              <div class="flex items-center gap-3">
                <span class="text-xs font-semibold text-gray-900 ">Rows</span>
                <select
                  v-model.number="itemsPerPage"
                  class="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 focus:outline-none  focus:ring-blue-500/20"
                >
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                </select>
              </div>


              <div class="flex items-center gap-1.5">
                <button
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <div class="px-4 py-1.5 rounded-lg bg-gray-50 text-gray-600 text-xs font-semibold">
                  {{ currentPage }} / {{ totalPages }}
                </div>
                <button
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="p-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 transition-all active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>


    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/52">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full relative p-8 text-center border border-gray-100">

        
        <h3 class="text-2xl font-semibold text-red-600 mb-2">Delete Staff Member</h3>
        <p class="text-gray-500 mb-8">
          Are you sure you want to delete <span class="font-semibold text-gray-900">{{ formatName(staffToDelete) }}</span>? This will archive their account and all associated attendance records.
        </p>


        <div class="flex gap-3">
          <button 
            @click="closeDeleteModal"
            class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all active:scale-95"
            :disabled="saving"
          >
            Cancel
          </button>
          <button 
            @click="executeArchive"
            class="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg  active:scale-95 flex items-center justify-center gap-2"
            :disabled="saving"
          >
            <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span>{{ saving ? 'Deleting...' : 'Confirm Delete' }}</span>
          </button>
        </div>
      </div>
    </div>


    <!-- Modals (Add/Edit) -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/52">
      <div class="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20">
        <div class="bg-white px-8 py-4 text-gray-900 flex items-center justify-between">
          <h3 class="text-2xl font-semibold ">{{ modalTitle }}</h3>
          <button @click="closeModal" class="p-2 bg-gray-100 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>


        <form @submit.prevent="handleSave" class="p-8">
          <!-- Profile Photo Preview (if exists) -->
          <div v-if="form.photoUrl" class="flex justify-center mb-6">
            <div class="w-32 h-32 rounded-full overflow-hidden ">
              <img :src="form.photoUrl" class="w-full h-full object-cover" alt="Staff Profile" />
            </div>
          </div>


          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <!-- Form Fields -->
            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400">Username</label>
              <input v-model="form.username" type="text" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-200 focus:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1" v-if="modalMode === 'add'">
              <label class="text-sm font-medium text-gray-400">Password</label>
              <input v-model="form.password" type="password" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400">First Name</label>
              <input v-model="form.firstName" type="text" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400">Last Name</label>
              <input v-model="form.lastName" type="text" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400">Email</label>
              <input v-model="form.email" type="email" :disabled="isViewOnly" required class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400 ">Phone Number</label>
              <input v-model="form.phone" type="tel" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400">Position</label>
              <input v-model="form.position" type="text" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400 ">Assigned Office</label>
              <input v-model="form.assignedOffice" type="text" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400 ">Gender</label>
              <select v-model="form.gender" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>


            <div class="flex flex-col gap-1">
              <label class="text-sm font-medium text-gray-400">Date of Birth</label>
              <input v-model="form.dateOfBirth" type="date" :disabled="isViewOnly" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500" />
            </div>


            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-sm font-medium text-gray-400">Address</label>
              <textarea v-model="form.address" :disabled="isViewOnly" rows="2" class="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500"></textarea>
            </div>
          </div>


          <div class="mt-8 flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 bg-gray-50 transition-all active:scale-95"
            >
              {{ isViewOnly ? 'Close' : 'Cancel' }}
            </button>
            <button
              v-if="!isViewOnly"
              type="submit"
              class="px-8 py-2.5 bg-[#133e75] text-white rounded-xl text-sm font-semibold  hover:bg-[#133e75]/90 transition-all active:scale-95 disabled:opacity-70"
              :disabled="saving"
            >
              {{ saving ? 'Processing...' : 'Save Member' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import { mapState, mapActions } from 'pinia'
import { useStaffAttendanceStore } from '../../stores/staffAttendanceStore'
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { doc, updateDoc, collection, query, where, getDocs, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase.js'


export default {
  name: 'AdminStaffAttendanceView',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      search: '',
      positionFilter: 'all',
      currentPage: 1,
      itemsPerPage: 10,
      showModal: false,
      modalMode: 'add',
      saving: false,
      form: {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        position: '',
        assignedOffice: '',
        gender: 'Male',
        dateOfBirth: '',
        address: ''
      },
      selectedStaffId: null,
      showDeleteModal: false,
      staffToDelete: null
    }
  },
  computed: {
    ...mapState(useStaffAttendanceStore, ['staffUsers', 'loading']),
   
    filteredStaff() {
      const term = this.search.trim().toLowerCase()
      let list = this.staffUsers.filter(s => !s.isArchived)


      if (this.positionFilter !== 'all') {
        list = list.filter(s => s.position === this.positionFilter)
      }


      if (!term) return list


      return list.filter(s => {
        const full = `${s.firstName} ${s.lastName}`.toLowerCase()
        return full.includes(term) ||
               (s.username || '').toLowerCase().includes(term) ||
               (s.email || '').toLowerCase().includes(term)
      })
    },


    totalPages() {
      return Math.ceil(this.filteredStaff.length / this.itemsPerPage) || 1
    },


    paginatedStaff() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      return this.filteredStaff.slice(start, start + this.itemsPerPage)
    },


    staffStartIndex() {
      return this.filteredStaff.length ? (this.currentPage - 1) * this.itemsPerPage + 1 : 0
    },


    staffEndIndex() {
      return Math.min(this.currentPage * this.itemsPerPage, this.filteredStaff.length)
    },




    uniquePositions() {
      return [...new Set(this.staffUsers.map(s => s.position).filter(Boolean))].sort()
    },


    modalTitle() {
      if (this.modalMode === 'add') return 'Add New Staff Member'
      if (this.modalMode === 'edit') return 'Edit Staff Member'
      return 'Staff Member Details'
    },


    isViewOnly() {
      return this.modalMode === 'view'
    }
  },
  methods: {
    ...mapActions(useStaffAttendanceStore, [
      'fetchStaffUsers',
      'addStaffUser',
      'updateStaffUser',
      'deleteStaffUser'
    ]),


    formatName(s) {
      return `${s.firstName} ${s.lastName}`
    },


    formatAddress(address) {
      if (!address) return 'No address provided'
     
      let addr = address
      if (typeof address === 'string') {
        try {
          addr = JSON.parse(address)
        } catch (e) {
          return address
        }
      }


      if (typeof addr === 'object' && addr !== null) {
        const parts = [
          addr.streetAddress,
          addr.city,
          addr.province,
          addr.country
        ].filter(Boolean)
        return parts.length ? parts.join(', ') : 'No address provided'
      }


      return address
    },


    getInitials(s) {
      return `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase()
    },


    calculateAge(dob) {
      if (!dob) return 'N/A'
      const birthDate = new Date(dob)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const m = today.getMonth() - birthDate.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }
      return age
    },


    openAddModal() {
      this.modalMode = 'add'
      this.form = {
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        position: '',
        assignedOffice: '',
        gender: 'Male',
        dateOfBirth: '',
        address: ''
      }
      this.showModal = true
    },


    openViewEditModal(s, mode) {
      this.modalMode = mode
      this.selectedStaffId = s.id
      this.form = { ...s }
      this.showModal = true
    },


    closeModal() {
      this.showModal = false
      this.selectedStaffId = null
    },


    async handleSave() {
      this.saving = true
      try {
        if (this.modalMode === 'add') {
          await this.addStaffUser(this.form)
        } else {
          await this.updateStaffUser(this.selectedStaffId, this.form)
        }
        this.closeModal()
      } catch (err) {
        alert('Operation failed: ' + err.message)
      } finally {
        this.saving = false
      }
    },

    async toggleStatus(s) {
      if (this.saving) return
      this.saving = true
      try {
        const newStatus = s.status === 'Inactive' ? 'Active' : 'Inactive'
        const userRef = doc(db, 'users', s.id)
        await updateDoc(userRef, { status: newStatus })
        await this.fetchStaffUsers()
      } catch (err) {
        alert('Failed to update status: ' + err.message)
      } finally {
        this.saving = false
      }
    },


    confirmArchiveStaff(s) {
      this.staffToDelete = s
      this.showDeleteModal = true
    },


    closeDeleteModal() {
      this.showDeleteModal = false
      this.staffToDelete = null
    },


    async executeArchive() {
      if (!this.staffToDelete) return
      
      this.saving = true
      try {
        const s = this.staffToDelete
        // 1. Archive the staff profile
        const userRef = doc(db, 'users', s.id)
        await updateDoc(userRef, { isArchived: true })


        // 2. Archive all associated attendance records
        const attendanceQuery = query(collection(db, 'staff_attendance'), where('staffId', '==', s.id))
        const attendanceSnap = await getDocs(attendanceQuery)
        
        if (!attendanceSnap.empty) {
          const batch = writeBatch(db)
          attendanceSnap.docs.forEach((d) => {
            batch.update(d.ref, { isArchived: true })
          })
          await batch.commit()
        }


        await this.fetchStaffUsers()
        this.closeDeleteModal()
      } catch (err) {
        alert('Archive failed: ' + err.message)
      } finally {
        this.saving = false
      }
    },


    exportToPDF() {
      const doc = new jsPDF('l', 'pt', 'a4')
      doc.setFontSize(20)
      doc.text('Staff Management Report', 40, 40)
      doc.setFontSize(10)
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, 60)


      autoTable(doc, {
        head: [['Full Name', 'Username', 'Email', 'Role', 'Position', 'Office', 'Gender', 'Age', 'Phone']],
        body: this.filteredStaff.map(s => [
          this.formatName(s),
          s.username || '-',
          s.email || '-',
          s.role || 'Staff',
          s.position || '-',
          s.assignedOffice || '-',
          s.gender || '-',
          this.calculateAge(s.dateOfBirth),
          s.phone || '-'
        ]),
        startY: 80,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235], fontSize: 9 },
        styles: { fontSize: 8 }
      })
      doc.save('Staff_Report.pdf')
    },


    exportToWord() {
      let content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Staff Report</title></head>
        <body>
          <h1>Staff Management Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table border="1" cellspacing="0" cellpadding="5">
            <thead>
              <tr>
                <th>Full Name</th><th>Username</th><th>Email</th><th>Role</th><th>Position</th><th>Office</th><th>Phone</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredStaff.map(s => `
                <tr>
                  <td>${this.formatName(s)}</td>
                  <td>${s.username || '-'}</td>
                  <td>${s.email || '-'}</td>
                  <td>${s.role || 'Staff'}</td>
                  <td>${s.position || '-'}</td>
                  <td>${s.assignedOffice || '-'}</td>
                  <td>${s.gender || '-'}</td>
                  <td>${this.calculateAge(s.dateOfBirth)}</td>
                  <td>${s.phone || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `
      const blob = new Blob(['\ufeff', content], { type: 'application/msword' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'Staff_Report.doc'
      link.click()
    }
  },
  created() {
    this.fetchStaffUsers()
  },
  watch: {
    search() { this.currentPage = 1 },
    positionFilter() { this.currentPage = 1 },
    itemsPerPage() { this.currentPage = 1 }
  }
}
</script>


<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>



