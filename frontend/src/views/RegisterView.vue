<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 py-10 px-5">
    <div class="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
      <div class="flex justify-center items-center mb-6">
        <img src="/DICTlogo1.png" alt="DICT Logo" class="max-w-[200px] w-full h-auto" />
      </div>
      <h2 class="text-center mb-6 text-gray-800 text-2xl font-bold">Register</h2>
      <form @submit.prevent="handleRegister" class="flex flex-col">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
          <div class="mb-4">
            <label for="username" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Username</label>
            <input
              id="username"
              v-model="form.username"
              type="text"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter username"
            />
          </div>

          <div class="mb-4">
            <label for="email" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter email"
            />
          </div>

          <div class="mb-4">
            <label for="firstName" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">First Name</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter first name"
            />
          </div>

          <div class="mb-4">
            <label for="middleName" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Middle Name</label>
            <input
              id="middleName"
              v-model="form.middleName"
              type="text"
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter middle name (optional)"
            />
          </div>

          <div class="mb-4">
            <label for="lastName" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Last Name</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter last name"
            />
          </div>

          <div class="mb-4">
            <label for="role" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Role</label>
            <select
              id="role"
              v-model="form.role"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option disabled value="">Select role</option>
              <option value="student">Student / Intern</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div class="mb-4">
            <label for="position" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Position</label>
            <input
              id="position"
              v-model="form.position"
              type="text"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter position"
            />
          </div>

          <div class="mb-4">
            <label for="assignedOffice" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Assigned Office / Company</label>
            <input
              id="assignedOffice"
              v-model="form.assignedOffice"
              type="text"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter office or company"
            />
          </div>

          <div class="mb-4">
            <label for="schoolOrUniversity" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">School / University</label>
            <input
              id="schoolOrUniversity"
              v-model="form.schoolOrUniversity"
              type="text"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter school or university"
            />
          </div>

          <div class="mb-4">
            <label for="ojtRequiredHours" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">OJT Required Hours</label>
            <input
              id="ojtRequiredHours"
              v-model.number="form.ojtRequiredHours"
              type="number"
              min="0"
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter required OJT hours"
            />
          </div>

          <div class="mb-4">
            <label for="password" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Enter password"
            />
          </div>

          <div class="mb-4">
            <label for="confirmPassword" class="block mb-2 text-gray-600 font-medium text-[0.95rem]">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="w-full p-2.5 rounded border border-gray-300 text-[0.95rem] box-border focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Confirm password"
            />
          </div>
        </div>

        <button type="submit" class="w-full p-3.5 bg-blue-600 text-white border-none rounded text-base font-bold cursor-pointer mt-4 transition-colors duration-300 hover:bg-blue-700">Register</button>
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
        schoolOrUniversity: '',
        ojtRequiredHours: null,
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
          schoolOrUniversity: this.form.schoolOrUniversity || '',
          ojtRequiredHours: this.form.ojtRequiredHours ?? null,
          // Default attendance tagging fields so admin table shows Normal Hours
          tagging: 'Normal Hours',
          todayAmTag: 'Normal Hours',
          todayPmTag: 'Normal Hours',
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

