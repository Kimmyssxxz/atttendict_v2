<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-100">
    <AdminSidebar />

    <div class="flex-1 flex flex-col">
      <header class="px-8 py-6 bg-blue-600 text-white">
        <h1 class="m-0 text-2xl font-bold">Student Intern Management</h1>
      </header>

      <main class="flex-1 px-8 py-6">
        <section class="bg-white rounded-lg p-6 shadow-sm">
        <div class="mb-4">
          <h2 class="m-0 text-xl text-gray-800">Student Interns</h2>
          <p class="mt-1 mb-0 text-sm text-gray-600">
            List of all student interns registered in the system (from Firestore `users` collection).
          </p>
        </div>

        <div class="flex flex-wrap gap-3 mb-4">
          <input
            v-model="search"
            type="text"
            class="flex-1 basis-[240px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            placeholder="Search by name, username, or email"
          />
          <select v-model="roleFilter" class="flex-none basis-[200px] px-3 py-2 rounded-md border border-gray-300 text-[0.95rem] focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
            <option value="all">All</option>
            <option value="student-intern">Student Interns Only</option>
          </select>
          <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default" @click="openAddModal">
            Add Intern
          </button>
        </div>

        <div v-if="loading" class="text-[0.95rem] text-gray-600">Loading interns...</div>
        <div v-else-if="error" class="text-[0.95rem] text-red-700">{{ error }}</div>
        <div v-else>
          <table class="w-full border-collapse text-sm" v-if="filteredInterns.length">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-gray-300 px-3 py-2 text-left">#</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Full Name</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Username</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Email</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Role</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Position</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Assigned Office</th>
                <th class="border border-gray-300 px-3 py-2 text-left">School / University</th>
                <th class="border border-gray-300 px-3 py-2 text-left">OJT Required Hours</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Address</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Gender</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Date of Birth</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Course / Program</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Year Level</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Start Date</th>
                <th class="border border-gray-300 px-3 py-2 text-left">End Date</th>
                <th class="border border-gray-300 px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(intern, index) in filteredInterns" :key="intern.id">
                <td class="border border-gray-300 px-3 py-2">{{ index + 1 }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ formatName(intern) }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.username || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.email || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.role || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.position || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.assignedOffice || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.schoolOrUniversity || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.ojtRequiredHours ?? '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.address || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.gender || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.dateOfBirth || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.course || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.yearLevel || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.startDate || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">{{ intern.endDate || '-' }}</td>
                <td class="border border-gray-300 px-3 py-2">
                  <div class="flex gap-1">
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                      @click="openViewEditModal(intern, 'view')"
                      title="View"
                    >
                      👁
                    </button>
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs rounded border border-gray-300 bg-gray-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-gray-200"
                      @click="openViewEditModal(intern, 'edit')"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      class="px-2.5 py-1 text-xs rounded border border-red-400 text-red-700 bg-red-50 cursor-pointer whitespace-nowrap transition-colors hover:bg-red-100"
                      @click="confirmDeleteIntern(intern)"
                      title="Delete"
                    >
                      🗑
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-else class="text-[0.95rem] text-gray-600">No student interns found.</div>
        </div>

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
        <div v-if="showViewEditModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000]">
          <div class="bg-white rounded-lg p-6 w-full max-w-[640px] shadow-[0_10px_25px_rgba(0,0,0,0.2)]">
            <h3 class="m-0 mb-4 text-[1.1rem] text-gray-800 font-bold">
              {{ viewEditMode === 'view' ? 'View Student Intern' : 'Edit Student Intern' }}
            </h3>

            <form @submit.prevent="handleUpdateIntern" class="flex flex-col gap-4">
              <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-4 gap-y-3 max-h-[60vh] overflow-y-auto px-1">
                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Username</label>
                  <input v-model="selectedIntern.username" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">First Name</label>
                  <input v-model="selectedIntern.firstName" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Middle Name</label>
                  <input v-model="selectedIntern.middleName" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Last Name</label>
                  <input v-model="selectedIntern.lastName" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Email</label>
                  <input v-model="selectedIntern.email" type="email" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Assigned Office</label>
                  <input v-model="selectedIntern.assignedOffice" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">School / University</label>
                  <input v-model="selectedIntern.schoolOrUniversity" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">OJT Required Hours</label>
                  <input v-model.number="selectedIntern.ojtRequiredHours" type="number" min="0" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Address</label>
                  <input v-model="selectedIntern.address" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Gender</label>
                  <select v-model="selectedIntern.gender" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="" disabled>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Date of Birth</label>
                  <input v-model="selectedIntern.dateOfBirth" type="date" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Course / Program</label>
                  <input v-model="selectedIntern.course" type="text" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">Year Level</label>
                  <select v-model="selectedIntern.yearLevel" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
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
                  <input v-model="selectedIntern.startDate" type="date" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>

                <div class="flex flex-col gap-1.5 text-sm text-gray-700">
                  <label class="font-medium text-[0.85rem] text-gray-600 mb-0.5">End Date</label>
                  <input v-model="selectedIntern.endDate" type="date" :disabled="viewEditMode === 'view'" class="w-full px-2.5 py-1.5 rounded border border-gray-300 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                </div>
                
              </div>

              <div class="flex justify-end gap-2 mt-2">
                <button type="button" class="px-3.5 py-2 rounded text-sm cursor-pointer bg-gray-300 text-gray-800 border-none transition-colors hover:bg-gray-400" @click="closeViewEditModal" :disabled="savingIntern">
                  Close
                </button>
                <button
                  v-if="viewEditMode === 'edit'"
                  type="submit"
                  class="px-3.5 py-2 rounded text-sm cursor-pointer bg-blue-600 text-white border-none transition-colors hover:bg-blue-700 disabled:opacity-70 disabled:cursor-default"
                  :disabled="savingIntern"
                >
                  {{ savingIntern ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>
            </form>
          </div>
        </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script>
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase'
import AdminSidebar from './AdminSidebar.vue'

export default {
  name: 'AdminStudentInternsView',
  components: {
    AdminSidebar,
  },
  data() {
    return {
      interns: [],
      loading: false,
      error: '',
      search: '',
      roleFilter: 'student-intern',
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
      },
      showViewEditModal: false,
      viewEditMode: 'view',
      selectedIntern: null,
    }
  },
  computed: {
    filteredInterns() {
      const term = this.search.trim().toLowerCase()

      let list = this.interns

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
  },
  methods: {
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
        const payload = {
          username: this.newIntern.username,
          firstName: this.newIntern.firstName,
          middleName: this.newIntern.middleName || '',
          lastName: this.newIntern.lastName,
          email: this.newIntern.email,
          assignedOffice: this.newIntern.assignedOffice || '',
          schoolOrUniversity: this.newIntern.schoolOrUniversity || '',
          ojtRequiredHours: this.newIntern.ojtRequiredHours ?? null,
          address: this.newIntern.address || '',
          gender: this.newIntern.gender || '',
          dateOfBirth: this.newIntern.dateOfBirth || '',
          course: this.newIntern.course || '',
          yearLevel: this.newIntern.yearLevel || '',
          startDate: this.newIntern.startDate || '',
          endDate: this.newIntern.endDate || '',
          role: 'student',
          position: 'intern',
        }

        await addDoc(collection(db, 'users'), payload)

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
        }

        this.showAddModal = false
        await this.fetchInterns()
      } catch (err) {
        console.error('Error adding intern:', err)
        alert('Failed to add intern.')
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
    async confirmDeleteIntern(intern) {
      const ok = window.confirm(`Delete intern ${this.formatName(intern)}? This cannot be undone.`)
      if (!ok) return

      try {
        const ref = doc(db, 'users', intern.id)
        await deleteDoc(ref)
        await this.fetchInterns()
      } catch (err) {
        console.error('Error deleting intern:', err)
        alert('Failed to delete intern.')
      }
    },
  },
  created() {
    this.fetchInterns()
  },
}
</script>

