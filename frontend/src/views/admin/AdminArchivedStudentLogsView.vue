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
            <h1 class="text-3xl font-semibold text-gray-900">Archived Student Records</h1>
            <p class="text-gray-500 ">View student profiles that have been archived.</p>
          </div>
          <div class="ml-auto flex gap-3">
            <button 
              @click="showRestoreAllModal = true"
              class="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-100 hover:bg-green-100 transition-all flex items-center gap-2"
              :disabled="loading || archivedStudents.length === 0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
              Restore All
            </button>
            <button 
              @click="showDeleteAllModal = true"
              class="px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-bold border border-red-100 hover:bg-red-100 transition-all flex items-center gap-2"
              :disabled="loading || archivedStudents.length === 0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              Delete All
            </button>
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
                  placeholder="Search student name, username, or email..."
                  class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none  focus:ring-blue-500/10  transition-all "
                />
              </div>
            </div>


            <!-- Table Container -->
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-gray-50/80 text-xs text-gray-500">
                    <th class="px-6 py-4">Student</th>
                    <th class="px-6 py-4">Username</th>
                    <th class="px-6 py-4">Email</th>
                    <th class="px-6 py-4">Assigned Office</th>
                    <th class="px-6 py-4">OJT Required Hrs</th>
                    <th class="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr v-if="archivedStudents.length === 0">
                    <td colspan="6" class="px-6 py-20 text-center text-gray-400 font-medium">No archived student records found.</td>
                  </tr>
                  <tr
                    v-for="student in archivedStudents"
                    :key="student.id"
                    class="hover:bg-blue-50/30 transition-colors group"
                  >
                    <!-- Student Member -->
                    <td class="px-6 py-5 whitespace-nowrap">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden border border-white ring-1 ring-blue-50">
                          <img v-if="student.photoUrl" :src="student.photoUrl" class="w-full h-full object-cover" />
                          <span v-else>{{ getStudentInitials(student) }}</span>
                        </div>
                        <div>
                          <p class="font-bold text-gray-900 leading-tight">{{ getStudentName(student) }}</p>
                          <p class="text-[10px] text-gray-400 tracking-wider font-semibold uppercase">{{ student.position || 'Student Intern' }}</p>
                        </div>
                      </div>
                    </td>


                    <!-- Username -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ student.username || '-' }}
                    </td>


                    <!-- Email -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ student.email || '-' }}
                    </td>


                    <!-- Assigned Office -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700">
                      {{ student.assignedOffice || '-' }}
                    </td>


                    <!-- Req Hours -->
                    <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-700 font-medium">
                      {{ student.ojtRequiredHours ?? '-' }}
                    </td>


                    <!-- Actions -->
                    <td class="px-6 py-5 whitespace-nowrap flex gap-2">
                      <button
                        @click="restoreStudent(student)"
                        class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                        title="Restore Account"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg>
                      </button>
                      <button
                        @click="deleteStudent(student)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                        title="Delete Permanently"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
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
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Restore Student</h3>
            <p class="text-gray-600 mb-8">
              Restore archived student intern <span class="font-bold text-gray-900">{{ getStudentName(studentToRestore) }}</span>? Their attendance logs will also be restored.
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
              Are you sure you want to PERMANENTLY delete <span class="font-bold text-gray-900">{{ getStudentName(studentToDelete) }}</span>? This will also delete their profile photo. This action cannot be undone.
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

      <!-- Restore All Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showRestoreAllModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <polyline points="9 14 4 9 9 4"></polyline>
                <path d="M20 20v-7a4 4 0 0 0-4-4H4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Restore All Students</h3>
            <p class="text-gray-600 mb-8">
              Are you sure you want to restore <span class="font-bold text-gray-900">{{ archivedStudents.length }}</span> archived student interns and their attendance records?
            </p>
            <div class="flex gap-3">
              <button @click="showRestoreAllModal = false" class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer">Cancel</button>
              <button @click="confirmRestoreAll" class="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all cursor-pointer disabled:opacity-70" :disabled="restoringAll">
                {{ restoringAll ? 'Restoring...' : 'Confirm Restore All' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Delete All Confirmation Modal -->
      <Transition name="modal">
        <div v-if="showDeleteAllModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-red-600 mb-2">Delete All Permanently</h3>
            <p class="text-gray-600 mb-8">
              Are you sure you want to PERMANENTLY delete <span class="font-bold text-gray-900">{{ archivedStudents.length }}</span> student records? This will also delete their profile photos. This action cannot be undone.
            </p>
            <div class="flex gap-3">
              <button @click="showDeleteAllModal = false" class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-all cursor-pointer">Cancel</button>
              <button @click="confirmDeleteAll" class="flex-1 py-3 bg-[#b92e2b] text-white rounded-xl font-bold hover:bg-red-700 transition-all cursor-pointer disabled:opacity-70" :disabled="deletingAll">
                {{ deletingAll ? 'Deleting All...' : 'Confirm Delete All' }}
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
import { ref as sRef, deleteObject } from 'firebase/storage'
import { db, storage } from '../../firebase.js'


export default {
  name: 'AdminArchivedStudentLogsView',
  components: {
    AdminSidebar,
    TableSkeleton
  },
  data() {
    return {
      searchQuery: '',
      students: [],
      loading: false,
      showRestoreModal: false,
      showDeleteModal: false,
      showRestoreAllModal: false,
      showDeleteAllModal: false,
      studentToRestore: null,
      studentToDelete: null,
      restoring: false,
      deleting: false,
      restoringAll: false,
      deletingAll: false,
    }
  },
  computed: {
    archivedStudents() {
      return this.students.filter(student => {
        const studentName = this.getStudentName(student).toLowerCase()
        const username = (student.username || '').toLowerCase()
        const email = (student.email || '').toLowerCase()
        const queryStr = this.searchQuery.toLowerCase()
       
        return studentName.includes(queryStr) || username.includes(queryStr) || email.includes(queryStr)
      })
    }
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const qUsers = query(collection(db, 'users'), where('role', 'in', ['student', 'intern']), where('isArchived', '==', true))
        const snapUsers = await getDocs(qUsers)
        this.students = snapUsers.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      } catch(e) {
        console.error('Error fetching student logs', e)
      } finally {
        this.loading = false
      }
    },
    getStudentName(user) {
      if (!user) return 'Unknown Student'
      return `${user.firstName || ''} ${user.lastName || ''}`.trim()
    },
    getStudentInitials(user) {
      if (!user) return '?'
      return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    },
    restoreStudent(student) {
      this.studentToRestore = student
      this.showRestoreModal = true
    },
    async confirmRestore() {
      if (!this.studentToRestore) return
      this.restoring = true
      try {
        // 1. Restore student profile
        const docRef = doc(db, 'users', this.studentToRestore.id)
        await updateDoc(docRef, {
          isArchived: false,
          updatedAt: serverTimestamp()
        })

        // 2. Restore associated attendance records
        const attendanceQuery = query(
          collection(db, 'intern_attendance'), 
          where('internId', '==', this.studentToRestore.id), 
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

        this.students = this.students.filter(s => s.id !== this.studentToRestore.id)
        this.showRestoreModal = false
        this.studentToRestore = null
      } catch (e) {
        console.error("Error restoring student:", e)
        alert("Failed to restore student.")
      } finally {
        this.restoring = false
      }
    },

    async confirmRestoreAll() {
      if (this.archivedStudents.length === 0) return
      this.restoringAll = true
      try {
        const batch = writeBatch(db)
        const studentsToProcess = [...this.archivedStudents]
        
        for (const s of studentsToProcess) {
          // Restore user
          const userRef = doc(db, 'users', s.id)
          batch.update(userRef, {
            isArchived: false,
            updatedAt: serverTimestamp()
          })

          // Restore their attendance logs
          const attQ = query(
            collection(db, 'intern_attendance'),
            where('internId', '==', s.id),
            where('isArchived', '==', true)
          )
          const attSnap = await getDocs(attQ)
          attSnap.forEach(d => {
            batch.update(d.ref, { isArchived: false })
          })
        }

        await batch.commit()
        this.students = []
        this.showRestoreAllModal = false
        await this.fetchData()
      } catch (e) {
        console.error("Error restoring all students:", e)
        alert("Failed to restore all students.")
      } finally {
        this.restoringAll = false
      }
    },

    deleteStudent(student) {
      this.studentToDelete = student
      this.showDeleteModal = true
    },
    async confirmDelete() {
      if (!this.studentToDelete) return
      this.deleting = true
      try {
        const studentId = this.studentToDelete.id

        // 1. Delete associated attendance records and their photos
        const attQ = query(collection(db, 'intern_attendance'), where('internId', '==', studentId))
        const attSnap = await getDocs(attQ)
        
        if (!attSnap.empty) {
          const batch = writeBatch(db)
          for (const d of attSnap.docs) {
            const data = d.data()
            // Delete time-in photo
            if (data.photoUrl) await this.deleteFileByUrl(data.photoUrl)
            // Delete time-out photo
            if (data.photoOutUrl) await this.deleteFileByUrl(data.photoOutUrl)
            // Delete any leave documents if they exist
            if (Array.isArray(data.leaveDocumentUrls)) {
              for (const docObj of data.leaveDocumentUrls) {
                if (docObj.url) await this.deleteFileByUrl(docObj.url)
              }
            }
            batch.delete(d.ref)
          }
          await batch.commit()
        }

        // 2. Delete profile photo from Storage
        if (this.studentToDelete.photoUrl) {
          await this.deleteFileByUrl(this.studentToDelete.photoUrl)
        }

        // 3. Delete user from Firestore
        await deleteDoc(doc(db, 'users', studentId))
        
        this.students = this.students.filter(s => s.id !== studentId)
        this.showDeleteModal = false
        this.studentToDelete = null
        await this.fetchData()
      } catch (e) {
        console.error('Error deleting student:', e)
        alert('Failed to delete student.')
      } finally {
        this.deleting = false
      }
    },

    async confirmDeleteAll() {
      if (this.archivedStudents.length === 0) return
      this.deletingAll = true
      try {
        const studentsToProcess = [...this.archivedStudents]
        
        for (const s of studentsToProcess) {
          const studentId = s.id

          // Delete attendance records and photos for this student
          const attQ = query(collection(db, 'intern_attendance'), where('internId', '==', studentId))
          const attSnap = await getDocs(attQ)
          
          if (!attSnap.empty) {
            const batch = writeBatch(db)
            for (const d of attSnap.docs) {
              const data = d.data()
              if (data.photoUrl) await this.deleteFileByUrl(data.photoUrl)
              if (data.photoOutUrl) await this.deleteFileByUrl(data.photoOutUrl)
              if (Array.isArray(data.leaveDocumentUrls)) {
                for (const docObj of data.leaveDocumentUrls) {
                  if (docObj.url) await this.deleteFileByUrl(docObj.url)
                }
              }
              batch.delete(d.ref)
            }
            await batch.commit()
          }

          // Delete profile photo
          if (s.photoUrl) {
            await this.deleteFileByUrl(s.photoUrl)
          }

          // Delete user doc
          await deleteDoc(doc(db, 'users', studentId))
        }

        this.students = []
        this.showDeleteAllModal = false
        await this.fetchData()
      } catch (e) {
        console.error("Error deleting all students:", e)
        alert("Failed to delete all students.")
      } finally {
        this.deletingAll = false
      }
    },

    async deleteFileByUrl(url) {
      if (!url || typeof url !== 'string' || !url.includes('firebasestorage.googleapis.com')) return
      try {
        const path = this.extractStoragePath(url)
        if (path) {
          const fileRef = sRef(storage, path)
          await deleteObject(fileRef)
        }
      } catch (err) {
        console.warn(`Could not delete file at ${url}:`, err)
      }
    },

    extractStoragePath(url) {
      try {
        const part = url.split('/o/')[1]
        if (!part) return null
        const encodedPath = part.split('?')[0]
        return decodeURIComponent(encodedPath)
      } catch (e) {
        return null
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
