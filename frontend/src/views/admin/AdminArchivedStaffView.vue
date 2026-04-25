<template>
  <div class="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
    <AdminSidebar activeNav="archive" />


    <div class="flex-1 flex flex-col min-w-0">
      <header class="px-8 py-6 bg-white ">
        <div class="flex items-center gap-4">
          <router-link to="/admin/archive" class="p-2 text-gray-600 hover:text-gray-400">
            <svg width="32" height="32" viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" fill-rule="evenodd" d="m3.343 12l7.071 7.071L9 20.485l-7.778-7.778a1 1 0 0 1 0-1.414L9 3.515l1.414 1.414z"/>
            </svg>
          </router-link>
          <div>
            <h1 class="text-3xl font-semibold text-gray-900">Archived Staff Records</h1>
            <p class="text-gray-500 ">View staff profiles that have been archived.</p>
          </div>
        </div>
      </header>


      <main class="flex-1 overflow-auto px-6 py-6">
        <TableSkeleton v-if="loading" :rows="8" />
        <div v-else>
         
          <!-- Table Section -->
          <section class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Table Header / Search -->
            <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
              <div class="relative flex-1 max-w-md">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0s.41-1.08 0-1.49zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14"/>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search staff name, username, or email..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none  focus:ring-blue-500/10  transition-all "
                />
              </div>
            </div>


            <!-- Table Container -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-xs text-gray-500">
                    <th class="px-6 py-4">Staff Member</th>
                    <th class="px-6 py-4">Username</th>
                    <th class="px-6 py-4">Email</th>
                    <th class="px-6 py-4">Position</th>
                    <th class="px-6 py-4">Assigned Office</th>
                    <th class="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="archivedStaff.length === 0">
                    <td colspan="6" class="px-6 py-20 text-center text-gray-400 font-medium">No archived staff records found.</td>
                  </tr>
                  <tr
                    v-for="s in archivedStaff"
                    :key="s.id"
                    class="hover:bg-blue-50/30 transition-colors group"
                  >
                    <!-- Staff Member -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-white ring-1 ring-blue-50">
                          <img v-if="s.photoUrl" :src="s.photoUrl" class="w-full h-full object-cover" />
                          <span v-else>{{ getStaffInitials(s) }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 leading-tight">{{ getStaffName(s) }}</p>
                          <p class="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">{{ s.role || 'Staff' }}</p>
                        </div>
                      </div>
                    </td>


                    <!-- Username -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ s.username || '-' }}
                    </td>


                    <!-- Email -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ s.email || '-' }}
                    </td>


                    <!-- Position -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ s.position || '-' }}
                    </td>


                    <!-- Office -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ s.assignedOffice || '-' }}
                    </td>


                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap text-right">
                      <div class="flex items-center justify-end gap-2 pr-2">
                        <button
                          @click="restoreStaff(s)"
                          class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                          title="Restore Account"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                        </button>
                        <button
                          @click="deleteStaffPermanently(s)"
                          class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                          title="Delete Permanently"
                        >
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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


    </div>
 
     <!-- Restore Confirmation Modal -->
     <Transition name="modal">
       <div v-if="showRestoreModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
           <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <polyline points="9 14 4 9 9 4"></polyline>
               <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
             </svg>
           </div>
           <h3 class="text-2xl font-bold text-gray-900 mb-2">Restore Staff</h3>
           <p class="text-gray-600 mb-8">
             Restore archived staff member <span class="font-bold text-gray-900">{{ getStaffName(staffToRestore) }}</span>? Their attendance logs will also be restored.
           </p>
           <div class="flex gap-3">
             <button 
               @click="showRestoreModal = false"
               class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer"
               :disabled="restoring"
             >
               Cancel
             </button>
             <button 
               @click="confirmRestore"
               class="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all cursor-pointer disabled:opacity-70"
               :disabled="restoring"
             >
               {{ restoring ? 'Restoring...' : 'Confirm Restore' }}
             </button>
           </div>
         </div>
       </div>
     </Transition>
 
     <!-- Delete Confirmation Modal -->
     <Transition name="modal">
       <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
           <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path d="M3 6h18"></path>
               <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
             </svg>
           </div>
           <h3 class="text-2xl font-bold text-red-600 mb-2">Delete Permanently</h3>
           <p class="text-gray-600 mb-8">
             Are you sure you want to PERMANENTLY delete <span class="font-bold text-gray-900">{{ getStaffName(staffToDelete) }}</span>? This action cannot be undone.
           </p>
           <div class="flex gap-3">
             <button 
               @click="showDeleteModal = false"
               class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer"
               :disabled="deleting"
             >
               Cancel
             </button>
             <button 
               @click="confirmDelete"
               class="flex-1 py-3 bg-[#b92e2b] text-white rounded-xl font-bold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-70"
               :disabled="deleting"
             >
               {{ deleting ? 'Deleting...' : 'Confirm Delete' }}
             </button>
           </div>
         </div>
       </div>
     </Transition>
    </div>
</template>


<script>
import AdminSidebar from './AdminSidebar.vue'
import TableSkeleton from '../../components/skeletons/TableSkeleton.vue'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, writeBatch } from 'firebase/firestore'
import { db } from '../../firebase.js'


export default {
  name: 'AdminArchivedStaffView',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      searchQuery: '',
      staffList: [],
      loading: false,
      showRestoreModal: false,
      showDeleteModal: false,
      staffToRestore: null,
      staffToDelete: null,
      restoring: false,
      deleting: false,
    }
  },
  computed: {
    archivedStaff() {
      return this.staffList.filter(s => {
        const name = this.getStaffName(s).toLowerCase()
        const username = (s.username || '').toLowerCase()
        const email = (s.email || '').toLowerCase()
        const queryStr = this.searchQuery.toLowerCase()
       
        return name.includes(queryStr) || username.includes(queryStr) || email.includes(queryStr)
      })
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        // Query users with role staff/admin and isArchived == true
        const q = query(
          collection(db, 'users'),
          where('role', 'in', ['staff', 'admin']),
          where('isArchived', '==', true)
        )
        const snap = await getDocs(q)
        this.staffList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch(e) {
        console.error('Error fetching archived staff', e)
      } finally {
        this.loading = false
      }
    },
    getStaffName(s) {
      if (!s) return 'Unknown Staff'
      return `${s.firstName || ''} ${s.lastName || ''}`.trim()
    },
    getStaffInitials(s) {
      if (!s) return '?'
      return `${s.firstName?.[0] || ''}${s.lastName?.[0] || ''}`.toUpperCase()
    },
    restoreStaff(s) {
      this.staffToRestore = s
      this.showRestoreModal = true
    },
    async confirmRestore() {
      if (!this.staffToRestore) return
      this.restoring = true
      try {
        const docRef = doc(db, 'users', this.staffToRestore.id)
        await updateDoc(docRef, {
          isArchived: false,
          updatedAt: serverTimestamp()
        })

        const attendanceQuery = query(
          collection(db, 'staff_attendance'), 
          where('staffId', '==', this.staffToRestore.id), 
          where('isArchived', '==', true)
        )
        const attendanceSnap = await getDocs(attendanceQuery)

        if (!attendanceSnap.empty) {
          const batch = writeBatch(db)
          attendanceSnap.docs.forEach((d) => {
            batch.update(d.ref, { isArchived: false })
          })
          await batch.commit()
        }

        this.staffList = this.staffList.filter(item => item.id !== this.staffToRestore.id)
        this.showRestoreModal = false
        this.staffToRestore = null
      } catch (e) {
        console.error("Error restoring staff:", e)
        alert("Failed to restore staff member.")
      } finally {
        this.restoring = false
      }
    },
    deleteStaffPermanently(s) {
      this.staffToDelete = s
      this.showDeleteModal = true
    },
    async confirmDelete() {
      if (!this.staffToDelete) return
      this.deleting = true
      try {
        await deleteDoc(doc(db, 'users', this.staffToDelete.id))
        this.staffList = this.staffList.filter(item => item.id !== this.staffToDelete.id)
        this.showDeleteModal = false
        this.staffToDelete = null
      } catch (e) {
        console.error('Error deleting staff:', e)
        alert('Failed to delete staff member.')
      } finally {
        this.deleting = false
      }
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>


<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .bg-white {
  transform: scale(0.9) translateY(20px);
}
</style>



