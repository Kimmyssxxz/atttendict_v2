<template>
  <div class="auth-container">
    <div class="auth-box">
      <h2>Register</h2>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            class="form-control"
            placeholder="Enter username"
          />
        </div>

        <div class="form-group">
          <label for="firstName">First Name</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            required
            class="form-control"
            placeholder="Enter first name"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="form-control"
            placeholder="Enter email"
          />
        </div>

        <div class="form-group">
          <label for="middleName">Middle Name</label>
          <input
            id="middleName"
            v-model="form.middleName"
            type="text"
            class="form-control"
            placeholder="Enter middle name (optional)"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            required
            class="form-control"
            placeholder="Enter last name"
          />
        </div>

        <div class="form-group">
          <label for="role">Role</label>
          <select
            id="role"
            v-model="form.role"
            required
            class="form-control"
          >
            <option disabled value="">Select role</option>
            <option value="student">Student / Intern</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <div class="form-group">
          <label for="position">Position</label>
          <input
            id="position"
            v-model="form.position"
            type="text"
            required
            class="form-control"
            placeholder="Enter position"
          />
        </div>

        <div class="form-group">
          <label for="assignedOffice">Assigned Office / Company</label>
          <input
            id="assignedOffice"
            v-model="form.assignedOffice"
            type="text"
            required
            class="form-control"
            placeholder="Enter assigned office or company"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="form-control"
            placeholder="Enter password"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="form-control"
            placeholder="Confirm password"
          />
        </div>

        <button type="submit" class="auth-button">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default {
  name: 'RegisterView',
  data() {
    return {
      form: {
        username: '',
        firstName: '',
        email: '',
        middleName: '',
        lastName: '',
        role: '',
        position: '',
        assignedOffice: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    async handleRegister() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      try {
        const docRef = await addDoc(collection(db, 'users'), {
          username: this.form.username,
          firstName: this.form.firstName,
          email: this.form.email,
          middleName: this.form.middleName,
          lastName: this.form.lastName,
          role: this.form.role,
          position: this.form.position,
          assignedOffice: this.form.assignedOffice,
          password: this.form.password
        });

        console.log('Registration saved with ID:', docRef.id);
        alert('Registration successful!');
        // e.g. this.$router.push('/auth/intern/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please check your inputs.');
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
}

.auth-box {
  background: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 480px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 1rem;
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1976d2;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #1565c0;
}
</style>
