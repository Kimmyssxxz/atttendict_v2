<template>
  <div class="admin-layout">
    <header class="admin-header">
      <h1>Student Intern Management</h1>
    </header>

    <main class="admin-main">
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Student Interns</h2>
          <p class="section-subtitle">
            List of all student interns registered in the system (from Firestore `users` collection).
          </p>
        </div>

        <div class="toolbar">
          <input
            v-model="search"
            type="text"
            class="search-input"
            placeholder="Search by name, username, or email"
          />
          <select v-model="roleFilter" class="filter-select">
            <option value="all">All</option>
            <option value="student-intern">Student Interns Only</option>
          </select>
          <button type="button" class="primary-button" @click="openAddModal">
            Add Intern
          </button>
        </div>

        <div v-if="loading" class="status-text">Loading interns...</div>
        <div v-else-if="error" class="status-text error">{{ error }}</div>
        <div v-else>
          <table class="interns-table" v-if="filteredInterns.length">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Position</th>
                <th>Assigned Office</th>
                <th>School / University</th>
                <th>OJT Required Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(intern, index) in filteredInterns" :key="intern.id">
                <td>{{ index + 1 }}</td>
                <td>{{ formatName(intern) }}</td>
                <td>{{ intern.username || '-' }}</td>
                <td>{{ intern.email || '-' }}</td>
                <td>{{ intern.role || '-' }}</td>
                <td>{{ intern.position || '-' }}</td>
                <td>{{ intern.assignedOffice || '-' }}</td>
                <td>{{ intern.schoolOrUniversity || '-' }}</td>
                <td>{{ intern.ojtRequiredHours ?? '-' }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      type="button"
                      class="action-button"
                      @click="openViewEditModal(intern, 'view')"
                      title="View"
                    >
                      👁
                    </button>
                    <button
                      type="button"
                      class="action-button"
                      @click="openViewEditModal(intern, 'edit')"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      class="action-button danger"
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

          <div v-else class="status-text">No student interns found.</div>
        </div>

        <!-- Add Intern Modal -->
        <div v-if="showAddModal" class="modal-backdrop">
          <div class="modal">
            <h3 class="modal-title">Add Student Intern</h3>

            <form @submit.prevent="handleAddIntern" class="modal-form">
              <div class="modal-grid">
                <div class="form-group">
                  <label>Username</label>
                  <input v-model="newIntern.username" type="text" required />
                </div>

                <div class="form-group">
                  <label>First Name</label>
                  <input v-model="newIntern.firstName" type="text" required />
                </div>

                <div class="form-group">
                  <label>Middle Name</label>
                  <input v-model="newIntern.middleName" type="text" />
                </div>

                <div class="form-group">
                  <label>Last Name</label>
                  <input v-model="newIntern.lastName" type="text" required />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input v-model="newIntern.email" type="email" required />
                </div>

                <div class="form-group">
                  <label>Assigned Office</label>
                  <input v-model="newIntern.assignedOffice" type="text" />
                </div>

                <div class="form-group">
                  <label>School / University</label>
                  <input v-model="newIntern.schoolOrUniversity" type="text" />
                </div>

                <div class="form-group">
                  <label>OJT Required Hours</label>
                  <input v-model.number="newIntern.ojtRequiredHours" type="number" min="0" />
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="secondary-button" @click="closeAddModal" :disabled="savingIntern">
                  Cancel
                </button>
                <button type="submit" class="primary-button" :disabled="savingIntern">
                  {{ savingIntern ? 'Saving...' : 'Save Intern' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- View/Edit Intern Modal -->
        <div v-if="showViewEditModal" class="modal-backdrop">
          <div class="modal">
            <h3 class="modal-title">
              {{ viewEditMode === 'view' ? 'View Student Intern' : 'Edit Student Intern' }}
            </h3>

            <form @submit.prevent="handleUpdateIntern" class="modal-form">
              <div class="modal-grid">
                <div class="form-group">
                  <label>Username</label>
                  <input v-model="selectedIntern.username" type="text" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>First Name</label>
                  <input v-model="selectedIntern.firstName" type="text" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>Middle Name</label>
                  <input v-model="selectedIntern.middleName" type="text" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>Last Name</label>
                  <input v-model="selectedIntern.lastName" type="text" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input v-model="selectedIntern.email" type="email" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>Assigned Office</label>
                  <input v-model="selectedIntern.assignedOffice" type="text" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>School / University</label>
                  <input v-model="selectedIntern.schoolOrUniversity" type="text" :disabled="viewEditMode === 'view'" />
                </div>

                <div class="form-group">
                  <label>OJT Required Hours</label>
                  <input v-model.number="selectedIntern.ojtRequiredHours" type="number" min="0" :disabled="viewEditMode === 'view'" />
                </div>
              </div>

              <div class="modal-actions">
                <button type="button" class="secondary-button" @click="closeViewEditModal" :disabled="savingIntern">
                  Close
                </button>
                <button
                  v-if="viewEditMode === 'edit'"
                  type="submit"
                  class="primary-button"
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
</template>

<script>
import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default {
  name: 'AdminStudentInternsView',
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
        }

        await updateDoc(internRef, payload)

        this.showViewEditModal = false
        this.selectedIntern = null
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

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.admin-header {
  padding: 1.5rem 2rem;
  background-color: #1976d2;
  color: #ffffff;
}

.admin-main {
  flex: 1;
  padding: 1.5rem 2rem;
}

.section {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-header {
  margin-bottom: 1rem;
}

.section-title {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.section-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
  color: #666;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.search-input {
  flex: 1 1 240px;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.filter-select {
  flex: 0 0 200px;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.interns-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.interns-table th,
.interns-table td {
  border: 1px solid #e0e0e0;
  padding: 0.5rem 0.75rem;
  text-align: left;
}

.interns-table thead {
  background-color: #f0f0f0;
}

.status-text {
  font-size: 0.95rem;
  color: #555;
}

.status-text.error {
  color: #c62828;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  width: 100%;
  max-width: 640px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 1rem;
  font-size: 1.1rem;
  color: #333;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem 1rem;
}

.modal .form-group label {
  display: block;
  margin-bottom: 0.35rem;
  font-size: 0.85rem;
  color: #555;
}

.modal .form-group input {
  width: 100%;
  padding: 0.45rem 0.6rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.primary-button,
.secondary-button {
  padding: 0.5rem 0.9rem;
  border-radius: 4px;
  border: none;
  font-size: 0.9rem;
  cursor: pointer;
}

.primary-button {
  background-color: #1976d2;
  color: #ffffff;
}

.primary-button:disabled {
  opacity: 0.7;
  cursor: default;
}

.secondary-button {
  background-color: #e0e0e0;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 0.25rem;
}

.action-button {
  padding: 0.25rem 0.4rem;
  font-size: 0.8rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  cursor: pointer;
  white-space: nowrap;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.action-button.danger {
  border-color: #c62828;
  color: #c62828;
  background-color: #ffebee;
}

.action-button.danger:hover {
  background-color: #ffcdd2;
}
</style>
