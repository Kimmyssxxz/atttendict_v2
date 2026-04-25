<template>
  <aside class="w-full md:w-[300px] p-4 md:px-5 md:py-6 bg-white shadow-xs  shrink-0 md:h-screen md:sticky md:top-0 flex flex-col">
    <div class="flex items-center gap-3 mb-12">
      <img src="/3.png" alt="Admin" class="w-[38px] h-[38px] rounded-full object-cover shrink-0" />
      <div>
        <h1 class="m-0 text-xl text-black font-bold">Admin Panel</h1>
        <p class=" mb-0 text-[0.8rem] text-black">Manage users and dashboard</p>
      </div>
    </div>

    <div class="flex-1 flex flex-col min-h-0 overflow-hidden">
      <nav class="flex flex-row md:flex-col gap-1 w-full md:h-full">
        <div class="flex flex-row md:flex-col gap-1 md:overflow-y-auto flex-1 custom-scrollbar pr-1">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-gray-700 no-underline text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          active-class="bg-blue-100 text-blue-700 is-active"
        >
          <span class="nav-icon icon-dashboard"></span>
          <span class="hidden md:inline">Dashboard</span>
        </router-link>
        <button
          type="button"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 w-full border-none bg-transparent justify-between cursor-pointer rounded-xl text-gray-700 font-sans text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          :class="{ 'bg-blue-100 text-blue-700 is-active': clientMgmtOpen }"
          @click="toggleMenu('client')"
        >
          <div class="flex items-center gap-2.5">
            <span class="nav-icon icon-client"></span>
            <span class="hidden md:inline text-left">Clients</span>
          </div>
          <span class="nav-icon icon-chevron hidden md:inline transition-transform duration-200" :class="{ 'rotate-180': clientMgmtOpen }"></span>
        </button>

        <div v-if="clientMgmtOpen" class="flex mt-0.5 hidden md:flex">
          <div class="w-px my-1 ml-3 mr-2 bg-gray-300"></div>
          <div class="flex-1 flex flex-col">
            <router-link
              to="/admin/client-logbook"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-client-logbook"></span>
              <span>Client Logbook</span>
            </router-link>
            <router-link
              to="/admin/client-logbook-settings"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-logbook-settings"></span>
              <span>Logbook Settings</span>
            </router-link>
            <router-link
              to="/admin/dtc-evaluation-form"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-dtc-form"></span>
              <span>DTC Evaluation Form</span>
            </router-link>
            <router-link
              to="/admin/dtc-evaluations"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-dtc-eval"></span>
              <span>DTC Evaluations</span>
            </router-link>
          </div>
        </div>
        <button
          type="button"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 w-full border-none bg-transparent justify-between cursor-pointer rounded-xl text-gray-700 font-sans text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          :class="{ 'bg-blue-100 text-blue-700 is-active': userMgmtOpen }"
          @click="toggleMenu('user')"
        >
          <div class="flex items-center gap-2.5">
            <span class="nav-icon icon-student"></span>
            <span class="hidden md:inline text-left">Student Interns</span>
          </div>
          <span class="nav-icon icon-chevron hidden md:inline transition-transform duration-200" :class="{ 'rotate-180': userMgmtOpen }"></span>
        </button>

        <div v-if="userMgmtOpen" class="flex mt-0.5 hidden md:flex">
          <div class="w-px my-1 ml-3 mr-2 bg-gray-300"></div>
          <div class="flex-1 flex flex-col">
            <router-link
              to="/admin/manage-interns"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-manage-interns"></span>
              <span>Manage Student Interns</span>
            </router-link>
            <router-link
              to="/admin/student-attendance-validation"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-student-validation"></span>
              <span>Student Attendance Validation</span>
            </router-link>
            <router-link
              to="/admin/student-tagging"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-student-tagging"></span>
              <span>Student Attendance Tagging</span>
            </router-link>
            <router-link
              to="/admin/student-certification"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-student-cert"></span>
              <span>Student Certification</span>
            </router-link>
          </div>
        </div>

        <button
          type="button"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 w-full border-none bg-transparent justify-between cursor-pointer rounded-xl text-gray-700 font-sans text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          :class="{ 'bg-blue-100 text-blue-700 is-active': staffMgmtOpen }"
          @click="toggleMenu('staff')"
        >
          <div class="flex items-center gap-2.5">
            <span class="nav-icon icon-staff"></span>
            <span class="hidden md:inline text-left">Staff</span>
          </div>
          <span class="nav-icon icon-chevron hidden md:inline transition-transform duration-200" :class="{ 'rotate-180': staffMgmtOpen }"></span>
        </button>

        <div v-if="staffMgmtOpen" class="flex mt-0.5 hidden md:flex">
          <div class="w-px my-1 ml-3 mr-2 bg-gray-300"></div>
          <div class="flex-1 flex flex-col">
            <router-link
              to="/admin/manage-staff"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-manage-staff"></span>
              <span>Manage Staff</span>
            </router-link>
            <router-link
              to="/admin/staff-attendance-validation"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-staff-validation"></span>
              <span>Staff Attendance Validation</span>
            </router-link>
            <router-link
              to="/admin/staff-leave"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-staff-leave"></span>
              <span>Staff Leave Requests</span>
            </router-link>
            <router-link
              to="/admin/staff-rfid"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 is-active"
            >
              <span class="nav-icon icon-staff-rfid"></span>
              <span>Staff RFID Registration</span>
            </router-link>
          </div>
        </div>

        <router-link
          to="/admin/settings"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-gray-700 no-underline text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          active-class="bg-blue-100 text-blue-700 is-active"
        >
          <span class="nav-icon icon-settings"></span>
          <span class="hidden md:inline">Settings</span>
        </router-link>
        <router-link
          to="/admin/archive"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-gray-700 no-underline text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          active-class="bg-blue-100 text-blue-700 is-active"
        >
          <span class="nav-icon icon-archive"></span>
          <span class="hidden md:inline">Archive</span>
        </router-link>
        </div>
        
        <button
          type="button"
          @click="logout"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 w-full border-none bg-transparent justify-start cursor-pointer rounded-xl text-red-600 font-sans text-sm transition-all hover:bg-red-50 hover:text-red-700 md:mt-auto mt-4"
        >
          <span class="nav-icon icon-logout"></span>
          <span class="hidden md:inline">Logout</span>
        </button>
      </nav>
    </div>
  </aside>

  <!-- Logout Confirmation Modal -->
  <Transition name="modal">
    <div v-if="showLogoutModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] ">
      <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">
        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Sign Out</h3>
        <p class="text-gray-600 mb-8">
          Are you sure you want to log out of the Admin Panel?
        </p>
        <div class="flex gap-3">
          <button 
            @click="showLogoutModal = false"
            class="flex-1 py-3 bg-gray-50 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button 
            @click="confirmLogout"
            class="flex-1 py-3 bg-[#b92e2b] text-white rounded-xl font-semibold hover:bg-red-700 transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  name: 'AdminSidebar',
  data() {
    return {
      userMgmtOpen: false,
      staffMgmtOpen: false,
      clientMgmtOpen: false,
      showLogoutModal: false,
    };
  },
  mounted() {
    this.checkActiveMenu();
  },
  watch: {
    $route() {
      this.checkActiveMenu();
    }
  },
  methods: {
    toggleMenu(menu) {
      if (menu === 'client') {
        this.clientMgmtOpen = !this.clientMgmtOpen;
        if (this.clientMgmtOpen) {
          this.userMgmtOpen = false;
          this.staffMgmtOpen = false;
        }
      } else if (menu === 'user') {
        this.userMgmtOpen = !this.userMgmtOpen;
        if (this.userMgmtOpen) {
          this.clientMgmtOpen = false;
          this.staffMgmtOpen = false;
        }
      } else if (menu === 'staff') {
        this.staffMgmtOpen = !this.staffMgmtOpen;
        if (this.staffMgmtOpen) {
          this.clientMgmtOpen = false;
          this.userMgmtOpen = false;
        }
      }
    },
    checkActiveMenu() {
      const path = this.$route.path;
      if (path.includes('/admin/client-logbook') || path.includes('/admin/client-logbook-settings') || path.includes('/admin/dtc-evaluation-form') || path.includes('/admin/dtc-evaluations')) {
        this.clientMgmtOpen = true;
        this.userMgmtOpen = false;
        this.staffMgmtOpen = false;
      } else if (path.includes('/admin/manage-staff') || path.includes('/admin/staff-attendance-validation') || path.includes('/admin/staff-leave') || path.includes('/admin/staff-rfid')) {
        this.staffMgmtOpen = true;
        this.userMgmtOpen = false;
        this.clientMgmtOpen = false;
      } else if (
        path.includes('/admin/manage-interns') || 
        path.includes('/admin/student-attendance-validation') ||
        path.includes('/admin/student-tagging') ||
        path.includes('/admin/student-certification')
      ) {
        this.userMgmtOpen = true;
        this.staffMgmtOpen = false;
        this.clientMgmtOpen = false;
      } else {
        this.clientMgmtOpen = false;
        this.userMgmtOpen = false;
        this.staffMgmtOpen = false;
      }
    },
    logout() {
      this.showLogoutModal = true;
    },
    confirmLogout() {
      localStorage.removeItem('user');
      localStorage.removeItem('adminUser');
      this.$router.push({ name: 'AdminLogin' });
    }
  }
};
</script>

<style scoped>
.nav-icon {
  width: 18px;
  height: 18px;
  background-color: currentColor;
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-position: center;
  mask-position: center;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  display: inline-block;
}

/* Dashboard */
.icon-dashboard {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M8.557 2.75H4.682A1.93 1.93 0 0 0 2.75 4.682v3.875a1.94 1.94 0 0 0 1.932 1.942h3.875a1.94 1.94 0 0 0 1.942-1.942V4.682A1.94 1.94 0 0 0 8.557 2.75m10.761 0h-3.875a1.94 1.94 0 0 0-1.942 1.932v3.875a1.943 1.943 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942V4.682a1.93 1.93 0 0 0-1.932-1.932m0 10.75h-3.875a1.94 1.94 0 0 0-1.942 1.933v3.875a1.94 1.94 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942v-3.875a1.93 1.93 0 0 0-1.932-1.932M8.557 13.5H4.682a1.943 1.943 0 0 0-1.932 1.943v3.875a1.93 1.93 0 0 0 1.932 1.932h3.875a1.94 1.94 0 0 0 1.942-1.932v-3.875a1.94 1.94 0 0 0-1.942-1.942'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M8.557 2.75H4.682A1.93 1.93 0 0 0 2.75 4.682v3.875a1.94 1.94 0 0 0 1.932 1.942h3.875a1.94 1.94 0 0 0 1.942-1.942V4.682A1.94 1.94 0 0 0 8.557 2.75m10.761 0h-3.875a1.94 1.94 0 0 0-1.942 1.932v3.875a1.943 1.943 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942V4.682a1.93 1.93 0 0 0-1.932-1.932m0 10.75h-3.875a1.94 1.94 0 0 0-1.942 1.933v3.875a1.94 1.94 0 0 0 1.942 1.942h3.875a1.94 1.94 0 0 0 1.932-1.942v-3.875a1.93 1.93 0 0 0-1.932-1.932M8.557 13.5H4.682a1.943 1.943 0 0 0-1.932 1.943v3.875a1.93 1.93 0 0 0 1.932 1.932h3.875a1.94 1.94 0 0 0 1.942-1.932v-3.875a1.94 1.94 0 0 0-1.942-1.942'/%3E%3C/svg%3E");
}
.is-active .icon-dashboard {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M10.995 4.68v3.88A2.44 2.44 0 0 1 8.545 11h-3.86a2.38 2.38 0 0 1-1.72-.72a2.4 2.4 0 0 1-.71-1.72V4.69a2.44 2.44 0 0 1 2.43-2.44h3.87a2.42 2.42 0 0 1 1.72.72a2.4 2.4 0 0 1 .72 1.71m10.75.01v3.87a2.46 2.46 0 0 1-2.43 2.44h-3.88a2.5 2.5 0 0 1-1.73-.71a2.44 2.44 0 0 1-.71-1.73V4.69a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.87a2.46 2.46 0 0 1 2.44 2.44m0 10.75v3.87a2.46 2.46 0 0 1-2.43 2.44h-3.88a2.5 2.5 0 0 1-1.75-.69a2.42 2.42 0 0 1-.71-1.73v-3.87a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.87a2.46 2.46 0 0 1 2.44 2.44zm-10.75.01v3.87a2.46 2.46 0 0 1-2.45 2.43h-3.86a2.42 2.42 0 0 1-2.43-2.43v-3.87A2.46 2.46 0 0 1 4.685 13h3.87a2.5 2.5 0 0 1 1.73.72a2.45 2.45 0 0 1 .71 1.73'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M10.995 4.68v3.88A2.44 2.44 0 0 1 8.545 11h-3.86a2.38 2.38 0 0 1-1.72-.72a2.4 2.4 0 0 1-.71-1.72V4.69a2.44 2.44 0 0 1 2.43-2.44h3.87a2.42 2.42 0 0 1 1.72.72a2.4 2.4 0 0 1 .72 1.71m10.75.01v3.87a2.46 2.46 0 0 1-2.43 2.44h-3.88a2.5 2.5 0 0 1-1.73-.71a2.44 2.44 0 0 1-.71-1.73V4.69a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.87a2.46 2.46 0 0 1 2.44 2.44m0 10.75v3.87a2.46 2.46 0 0 1-2.43 2.44h-3.88a2.5 2.5 0 0 1-1.75-.69a2.42 2.42 0 0 1-.71-1.73v-3.87a2.4 2.4 0 0 1 .72-1.72a2.42 2.42 0 0 1 1.72-.72h3.87a2.46 2.46 0 0 1 2.44 2.44zm-10.75.01v3.87a2.46 2.46 0 0 1-2.45 2.43h-3.86a2.42 2.42 0 0 1-2.43-2.43v-3.87A2.46 2.46 0 0 1 4.685 13h3.87a2.5 2.5 0 0 1 1.73.72a2.45 2.45 0 0 1 .71 1.73'/%3E%3C/svg%3E");
}

/* Client */
.icon-client {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cpath fill='%23000' d='M38.446 29.232c4.786 0 8.686-4.263 8.686-9.45c0-5.128-3.88-9.19-8.686-9.19c-4.766 0-8.687 4.122-8.687 9.23c.02 5.167 3.921 9.41 8.687 9.41m-23.164.442c4.142 0 7.54-3.72 7.54-8.284c0-4.464-3.358-8.063-7.54-8.063c-4.142 0-7.56 3.66-7.54 8.103c.02 4.545 3.398 8.244 7.54 8.244m23.164-3.478c-2.936 0-5.45-2.815-5.45-6.374c0-3.5 2.474-6.193 5.45-6.193c2.996 0 5.449 2.654 5.449 6.152c0 3.56-2.473 6.415-5.449 6.415m-23.164.482c-2.453 0-4.544-2.352-4.544-5.248c0-2.835 2.07-5.107 4.544-5.107c2.533 0 4.564 2.232 4.564 5.067c0 2.936-2.091 5.288-4.564 5.288M4.102 48.113h15.785c-.966-.543-1.71-1.75-1.569-2.976H3.6c-.402 0-.603-.16-.603-.543c0-4.986 5.69-9.651 12.266-9.651c2.533 0 4.805.603 6.756 1.749a10.5 10.5 0 0 1 2.272-2.131c-2.594-1.71-5.71-2.594-9.028-2.594C6.837 31.967 0 38.079 0 44.775c0 2.232 1.367 3.338 4.102 3.338m21.716 0h25.256c3.337 0 4.926-1.005 4.926-3.217c0-5.268-6.656-12.89-17.554-12.89c-10.919 0-17.574 7.622-17.574 12.89c0 2.212 1.588 3.217 4.946 3.217m-.965-3.036c-.523 0-.744-.14-.744-.563c0-3.298 5.107-9.47 14.337-9.47c9.21 0 14.316 6.172 14.316 9.47c0 .422-.2.563-.724.563Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cpath fill='%23000' d='M38.446 29.232c4.786 0 8.686-4.263 8.686-9.45c0-5.128-3.88-9.19-8.686-9.19c-4.766 0-8.687 4.122-8.687 9.23c.02 5.167 3.921 9.41 8.687 9.41m-23.164.442c4.142 0 7.54-3.72 7.54-8.284c0-4.464-3.358-8.063-7.54-8.063c-4.142 0-7.56 3.66-7.54 8.103c.02 4.545 3.398 8.244 7.54 8.244m23.164-3.478c-2.936 0-5.45-2.815-5.45-6.374c0-3.5 2.474-6.193 5.45-6.193c2.996 0 5.449 2.654 5.449 6.152c0 3.56-2.473 6.415-5.449 6.415m-23.164.482c-2.453 0-4.544-2.352-4.544-5.248c0-2.835 2.07-5.107 4.544-5.107c2.533 0 4.564 2.232 4.564 5.067c0 2.936-2.091 5.288-4.564 5.288M4.102 48.113h15.785c-.966-.543-1.71-1.75-1.569-2.976H3.6c-.402 0-.603-.16-.603-.543c0-4.986 5.69-9.651 12.266-9.651c2.533 0 4.805.603 6.756 1.749a10.5 10.5 0 0 1 2.272-2.131c-2.594-1.71-5.71-2.594-9.028-2.594C6.837 31.967 0 38.079 0 44.775c0 2.232 1.367 3.338 4.102 3.338m21.716 0h25.256c3.337 0 4.926-1.005 4.926-3.217c0-5.268-6.656-12.89-17.554-12.89c-10.919 0-17.574 7.622-17.574 12.89c0 2.212 1.588 3.217 4.946 3.217m-.965-3.036c-.523 0-.744-.14-.744-.563c0-3.298 5.107-9.47 14.337-9.47c9.21 0 14.316 6.172 14.316 9.47c0 .422-.2.563-.724.563Z'/%3E%3C/svg%3E");
}
.is-active .icon-client {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cpath fill='%23000' d='M38.723 28.549c4.417 0 8.217-3.944 8.217-9.08c0-5.074-3.82-8.833-8.217-8.833c-4.396 0-8.217 3.841-8.217 8.874c0 5.095 3.8 9.039 8.217 9.039m-23.645.473c3.821 0 7.15-3.452 7.15-7.91c0-4.416-3.35-7.683-7.15-7.683c-3.82 0-7.19 3.349-7.169 7.725c0 4.416 3.328 7.868 7.17 7.868M3.616 47.572h15.612c-2.136-3.102.473-9.347 4.89-12.757c-2.28-1.52-5.219-2.65-9.06-2.65C5.793 32.164 0 39.004 0 44.695c0 1.85 1.027 2.877 3.616 2.877m22.186 0h25.822c3.225 0 4.376-.925 4.376-2.733c0-5.3-6.636-12.613-17.297-12.613c-10.641 0-17.277 7.313-17.277 12.614c0 1.807 1.15 2.732 4.376 2.732'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='0 0 56 56'%3E%3Cpath fill='%23000' d='M38.723 28.549c4.417 0 8.217-3.944 8.217-9.08c0-5.074-3.82-8.833-8.217-8.833c-4.396 0-8.217 3.841-8.217 8.874c0 5.095 3.8 9.039 8.217 9.039m-23.645.473c3.821 0 7.15-3.452 7.15-7.91c0-4.416-3.35-7.683-7.15-7.683c-3.82 0-7.19 3.349-7.169 7.725c0 4.416 3.328 7.868 7.17 7.868M3.616 47.572h15.612c-2.136-3.102.473-9.347 4.89-12.757c-2.28-1.52-5.219-2.65-9.06-2.65C5.793 32.164 0 39.004 0 44.695c0 1.85 1.027 2.877 3.616 2.877m22.186 0h25.822c3.225 0 4.376-.925 4.376-2.733c0-5.3-6.636-12.613-17.297-12.613c-10.641 0-17.277 7.313-17.277 12.614c0 1.807 1.15 2.732 4.376 2.732'/%3E%3C/svg%3E");
}

/* Student Interns */
.icon-student {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z'/%3E%3C/svg%3E");
}
.is-active .icon-student {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120'/%3E%3C/svg%3E");
}

/* Staff */
.icon-staff {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3Cpath d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3Cpath d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/svg%3E");
}
.is-active .icon-staff {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='SVGgA8a3bBK'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23fff' stroke='%23fff' d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2'/%3E%3Cpath stroke='%23fff' d='m30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23000' stroke='%23000'/%3E%3Cpath stroke='%23000' d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23SVGgA8a3bBK)'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='SVGgA8a3bBK'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23fff' stroke='%23fff' d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2'/%3E%3Cpath stroke='%23fff' d='m30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23000' stroke='%23000'/%3E%3Cpath stroke='%23000' d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23SVGgA8a3bBK)'/%3E%3C/svg%3E");
}

/* Settings */
.icon-settings {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z'/%3E%3Cpath fill='%23000' d='M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z'/%3E%3Cpath fill='%23000' d='M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4'/%3E%3C/svg%3E");
}
.is-active .icon-settings {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='48' fill='%23000'/%3E%3Cpath fill='%23000' d='m470.39 300l-.47-.38l-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.6 1.6 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13l-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59l-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56l-5.57 39.67a16 16 0 0 1-8.13 11.82a175 175 0 0 0-10 5.82a15.92 15.92 0 0 1-14.43 1.27l-37.13-15l-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22l-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38l31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.6 1.6 0 0 1 .13.22a26.86 26.86 0 0 0 32.45 11.3l.35-.13l37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59l.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56l5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95l.35.14a26.85 26.85 0 0 0 32.48-11.34a3 3 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11m-134.48-40.24a80 80 0 1 1-83.66-83.67a80.21 80.21 0 0 1 83.66 83.67'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='48' fill='%23000'/%3E%3Cpath fill='%23000' d='m470.39 300l-.47-.38l-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.6 1.6 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13l-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59l-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56l-5.57 39.67a16 16 0 0 1-8.13 11.82a175 175 0 0 0-10 5.82a15.92 15.92 0 0 1-14.43 1.27l-37.13-15l-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22l-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38l31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.6 1.6 0 0 1 .13.22a26.86 26.86 0 0 0 32.45 11.3l.35-.13l37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59l.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56l5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95l.35.14a26.85 26.85 0 0 0 32.48-11.34a3 3 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11m-134.48-40.24a80 80 0 1 1-83.66-83.67a80.21 80.21 0 0 1 83.66 83.67'/%3E%3C/svg%3E");
}

/* Chevron Icon */
.icon-chevron {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M13.06 16.06a1.5 1.5 0 0 1-2.12 0l-5.658-5.656a1.5 1.5 0 1 1 2.122-2.121L12 12.879l4.596-4.596a1.5 1.5 0 0 1 2.122 2.12l-5.657 5.658Z'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M13.06 16.06a1.5 1.5 0 0 1-2.12 0l-5.658-5.656a1.5 1.5 0 1 1 2.122-2.121L12 12.879l4.596-4.596a1.5 1.5 0 0 1 2.122 2.12l-5.657 5.658Z'/%3E%3C/g%3E%3C/svg%3E");
}

/* Archive */
.icon-archive {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M6.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v1a1.5 1.5 0 0 1-1 1.415V11.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5V5.915A1.5 1.5 0 0 1 1 4.5zM2.5 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 6v5.5A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V6z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M6.5 8a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1zM1 3.5A1.5 1.5 0 0 1 2.5 2h11A1.5 1.5 0 0 1 15 3.5v1a1.5 1.5 0 0 1-1 1.415V11.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5V5.915A1.5 1.5 0 0 1 1 4.5zM2.5 3a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM3 6v5.5A1.5 1.5 0 0 0 4.5 13h7a1.5 1.5 0 0 0 1.5-1.5V6z'/%3E%3C/svg%3E");
}
.is-active .icon-archive {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm1 3h12v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm4.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cpath fill='%23000' d='M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1zm1 3h12v5.5a2.5 2.5 0 0 1-2.5 2.5h-7A2.5 2.5 0 0 1 2 11.5zm4.5 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z'/%3E%3C/svg%3E");
}

/* Logout */
.icon-logout {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2'/%3E%3Cpath d='M9 12h12l-3-3m0 6l3-3'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'%3E%3Cpath d='M14 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2v-2'/%3E%3Cpath d='M9 12h12l-3-3m0 6l3-3'/%3E%3C/g%3E%3C/svg%3E");
}

/* Client Logbook */
.icon-client-logbook {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='1.5' d='M12 7.333C12 5.5 10.5 4 8.667 4H2v12h6.708C12 16 12 19.334 12 19.334m0-12C12 5.5 13.5 4 15.333 4H22v12h-6.667C12 16 12 19.334 12 19.334m0-12v12m1.875 1.124A2.58 2.58 0 0 1 16.167 19H21m-10.875 1.458A2.54 2.54 0 0 0 7.833 19H3'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-miterlimit='10' stroke-width='1.5' d='M12 7.333C12 5.5 10.5 4 8.667 4H2v12h6.708C12 16 12 19.334 12 19.334m0-12C12 5.5 13.5 4 15.333 4H22v12h-6.667C12 16 12 19.334 12 19.334m0-12v12m1.875 1.124A2.58 2.58 0 0 1 16.167 19H21m-10.875 1.458A2.54 2.54 0 0 0 7.833 19H3'/%3E%3C/svg%3E");
}
.is-active .icon-client-logbook {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7.833 18c1.4 0 2.62.819 3.195 2.028a1 1 0 0 1-1.806.86A1.54 1.54 0 0 0 7.833 20H3a1 1 0 1 1 0-2zM21 18a1 1 0 1 1 0 2h-4.833c-.567 0-1.135.357-1.389.889a1 1 0 0 1-1.806-.86A3.58 3.58 0 0 1 16.167 18z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M8.889 3.006a4.33 4.33 0 0 1 3.11 1.564A4.33 4.33 0 0 1 15.333 3H22a1 1 0 0 1 1 1v12.001a1 1 0 0 1-1 1L15.333 17c-.658 0-1.085.162-1.372.354a1.93 1.93 0 0 0-.65.76A3.1 3.1 0 0 0 13 19.33v.009l-.005.097a1 1 0 0 1-1.99 0L11 19.334v-.005l-.004-.068a3.1 3.1 0 0 0-.305-1.151a1.9 1.9 0 0 0-.64-.76c-.28-.19-.698-.35-1.343-.35H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6.667zM11 5v12.334h2V5z' clip-rule='evenodd'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M7.833 18c1.4 0 2.62.819 3.195 2.028a1 1 0 0 1-1.806.86A1.54 1.54 0 0 0 7.833 20H3a1 1 0 1 1 0-2zM21 18a1 1 0 1 1 0 2h-4.833c-.567 0-1.135.357-1.389.889a1 1 0 0 1-1.806-.86A3.58 3.58 0 0 1 16.167 18z'/%3E%3Cpath fill='%23000' fill-rule='evenodd' d='M8.889 3.006a4.33 4.33 0 0 1 3.11 1.564A4.33 4.33 0 0 1 15.333 3H22a1 1 0 0 1 1 1v12.001a1 1 0 0 1-1 1L15.333 17c-.658 0-1.085.162-1.372.354a1.93 1.93 0 0 0-.65.76A3.1 3.1 0 0 0 13 19.33v.009l-.005.097a1 1 0 0 1-1.99 0L11 19.334v-.005l-.004-.068a3.1 3.1 0 0 0-.305-1.151a1.9 1.9 0 0 0-.64-.76c-.28-.19-.698-.35-1.343-.35H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6.667zM11 5v12.334h2V5z' clip-rule='evenodd'/%3E%3C/svg%3E");
}

/* Logbook Settings */
.icon-logbook-settings {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z'/%3E%3Cpath fill='%23000' d='M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath fill='%23000' d='M27 16.76v-1.53l1.92-1.68A2 2 0 0 0 29.3 11l-2.36-4a2 2 0 0 0-1.73-1a2 2 0 0 0-.64.1l-2.43.82a11 11 0 0 0-1.31-.75l-.51-2.52a2 2 0 0 0-2-1.61h-4.68a2 2 0 0 0-2 1.61l-.51 2.52a11.5 11.5 0 0 0-1.32.75l-2.38-.86A2 2 0 0 0 6.79 6a2 2 0 0 0-1.73 1L2.7 11a2 2 0 0 0 .41 2.51L5 15.24v1.53l-1.89 1.68A2 2 0 0 0 2.7 21l2.36 4a2 2 0 0 0 1.73 1a2 2 0 0 0 .64-.1l2.43-.82a11 11 0 0 0 1.31.75l.51 2.52a2 2 0 0 0 2 1.61h4.72a2 2 0 0 0 2-1.61l.51-2.52a11.5 11.5 0 0 0 1.32-.75l2.42.82a2 2 0 0 0 .64.1a2 2 0 0 0 1.73-1l2.28-4a2 2 0 0 0-.41-2.51ZM25.21 24l-3.43-1.16a8.9 8.9 0 0 1-2.71 1.57L18.36 28h-4.72l-.71-3.55a9.4 9.4 0 0 1-2.7-1.57L6.79 24l-2.36-4l2.72-2.4a8.9 8.9 0 0 1 0-3.13L4.43 12l2.36-4l3.43 1.16a8.9 8.9 0 0 1 2.71-1.57L13.64 4h4.72l.71 3.55a9.4 9.4 0 0 1 2.7 1.57L25.21 8l2.36 4l-2.72 2.4a8.9 8.9 0 0 1 0 3.13L27.57 20Z'/%3E%3Cpath fill='%23000' d='M16 22a6 6 0 1 1 6-6a5.94 5.94 0 0 1-6 6m0-10a3.91 3.91 0 0 0-4 4a3.91 3.91 0 0 0 4 4a3.91 3.91 0 0 0 4-4a3.91 3.91 0 0 0-4-4'/%3E%3C/svg%3E");
}
.is-active .icon-logbook-settings {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='48' fill='%23000'/%3E%3Cpath fill='%23000' d='m470.39 300l-.47-.38l-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.6 1.6 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13l-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59l-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56l-5.57 39.67a16 16 0 0 1-8.13 11.82a175 175 0 0 0-10 5.82a15.92 15.92 0 0 1-14.43 1.27l-37.13-15l-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22l-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38l31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.6 1.6 0 0 1 .13.22a26.86 26.86 0 0 0 32.45 11.3l.35-.13l37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59l.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56l5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95l.35.14a26.85 26.85 0 0 0 32.48-11.34a3 3 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11m-134.48-40.24a80 80 0 1 1-83.66-83.67a80.21 80.21 0 0 1 83.66 83.67'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Ccircle cx='256' cy='256' r='48' fill='%23000'/%3E%3Cpath fill='%23000' d='m470.39 300l-.47-.38l-31.56-24.75a16.11 16.11 0 0 1-6.1-13.33v-11.56a16 16 0 0 1 6.11-13.22L469.92 212l.47-.38a26.68 26.68 0 0 0 5.9-34.06l-42.71-73.9a1.6 1.6 0 0 1-.13-.22A26.86 26.86 0 0 0 401 92.14l-.35.13l-37.1 14.93a15.94 15.94 0 0 1-14.47-1.29q-4.92-3.1-10-5.86a15.94 15.94 0 0 1-8.19-11.82l-5.59-39.59l-.12-.72A27.22 27.22 0 0 0 298.76 26h-85.52a26.92 26.92 0 0 0-26.45 22.39l-.09.56l-5.57 39.67a16 16 0 0 1-8.13 11.82a175 175 0 0 0-10 5.82a15.92 15.92 0 0 1-14.43 1.27l-37.13-15l-.35-.14a26.87 26.87 0 0 0-32.48 11.34l-.13.22l-42.77 73.95a26.71 26.71 0 0 0 5.9 34.1l.47.38l31.56 24.75a16.11 16.11 0 0 1 6.1 13.33v11.56a16 16 0 0 1-6.11 13.22L42.08 300l-.47.38a26.68 26.68 0 0 0-5.9 34.06l42.71 73.9a1.6 1.6 0 0 1 .13.22a26.86 26.86 0 0 0 32.45 11.3l.35-.13l37.07-14.93a15.94 15.94 0 0 1 14.47 1.29q4.92 3.11 10 5.86a15.94 15.94 0 0 1 8.19 11.82l5.56 39.59l.12.72A27.22 27.22 0 0 0 213.24 486h85.52a26.92 26.92 0 0 0 26.45-22.39l.09-.56l5.57-39.67a16 16 0 0 1 8.18-11.82c3.42-1.84 6.76-3.79 10-5.82a15.92 15.92 0 0 1 14.43-1.27l37.13 14.95l.35.14a26.85 26.85 0 0 0 32.48-11.34a3 3 0 0 1 .13-.22l42.71-73.89a26.7 26.7 0 0 0-5.89-34.11m-134.48-40.24a80 80 0 1 1-83.66-83.67a80.21 80.21 0 0 1 83.66 83.67'/%3E%3C/svg%3E");
}

/* DTC Evaluation Form */
.icon-dtc-form {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M5 19V5h14v14z'/%3E%3Cpath fill='%23000' d='M8.5 10.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3m2.5.5h6v2h-6zM7 7h10v2H7zm0 8h10v2H7z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M5 19V5h14v14z'/%3E%3Cpath fill='%23000' d='M8.5 10.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3m2.5.5h6v2h-6zM7 7h10v2H7zm0 8h10v2H7z'/%3E%3C/svg%3E");
}
.is-active .icon-dtc-form {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-2 14H7v-2h10zM7 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S7 12.83 7 12m10 1h-6v-2h6zm0-4H7V7h10z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-2 14H7v-2h10zM7 12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S7 12.83 7 12m10 1h-6v-2h6zm0-4H7V7h10z'/%3E%3C/svg%3E");
}

/* DTC Evaluation */
.icon-dtc-eval {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2zm2 2H5V5h14v14.1M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2'/%3E%3C/svg%3E");
}
.is-active .icon-dtc-eval {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z'/%3E%3C/svg%3E");
}

/* Manage Interns */
.icon-manage-interns {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120m-48-32.43L57.3 64L128 40.43L198.7 64Z'/%3E%3C/svg%3E");
}
.is-active .icon-manage-interns {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256' viewBox='0 0 256 256'%3E%3Cpath fill='%23000' d='m226.53 56.41l-96-32a8 8 0 0 0-5.06 0l-96 32A8 8 0 0 0 24 64v80a8 8 0 0 0 16 0V75.1l33.59 11.19a64 64 0 0 0 20.65 88.05c-18 7.06-33.56 19.83-44.94 37.29a8 8 0 1 0 13.4 8.74C77.77 197.25 101.57 184 128 184s50.23 13.25 65.3 36.37a8 8 0 0 0 13.4-8.74c-11.38-17.46-27-30.23-44.94-37.29a64 64 0 0 0 20.65-88l44.12-14.7a8 8 0 0 0 0-15.18ZM176 120a48 48 0 1 1-86.65-28.45l36.12 12a8 8 0 0 0 5.06 0l36.12-12A47.9 47.9 0 0 1 176 120'/%3E%3C/svg%3E");
}

/* Student Validation */
.icon-student-validation {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M10 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2M4 18c.22-.72 3.31-2 6-2c0-.7.13-1.37.35-1.99C7.62 13.91 2 15.27 2 18v2h9.54c-.52-.58-.93-1.25-1.19-2zm15.43.02c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59c-1.5-1.5-.79-.8-2.57-2.57M16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M10 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2M4 18c.22-.72 3.31-2 6-2c0-.7.13-1.37.35-1.99C7.62 13.91 2 15.27 2 18v2h9.54c-.52-.58-.93-1.25-1.19-2zm15.43.02c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59c-1.5-1.5-.79-.8-2.57-2.57M16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
}
.is-active .icon-student-validation {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='10' cy='8' r='4' fill='%23000'/%3E%3Cpath fill='%23000' d='M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='10' cy='8' r='4' fill='%23000'/%3E%3Cpath fill='%23000' d='M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
}

/* Student Tagging */
.icon-student-tagging {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-9-9V4h7l9 9M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m21.41 11.58l-9-9A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 .59 1.42l9 9A2 2 0 0 0 13 22a2 2 0 0 0 1.41-.59l7-7A2 2 0 0 0 22 13a2 2 0 0 0-.59-1.42M13 20l-9-9V4h7l9 9M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5'/%3E%3C/svg%3E");
}
.is-active .icon-student-tagging {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59s1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5.5 7A1.5 1.5 0 0 1 4 5.5A1.5 1.5 0 0 1 5.5 4A1.5 1.5 0 0 1 7 5.5A1.5 1.5 0 0 1 5.5 7m15.91 4.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.11 0-2 .89-2 2v7c0 .55.22 1.05.59 1.41l8.99 9c.37.36.87.59 1.42.59s1.05-.23 1.41-.59l7-7c.37-.36.59-.86.59-1.41c0-.56-.23-1.06-.59-1.42'/%3E%3C/svg%3E");
}

/* Student Cert */
.icon-student-cert {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath fill='%23000' d='M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h15l.57-.7l.93-1.14l-.09-.16H4V8h28v8.56a8.4 8.4 0 0 1 2 1.81V8a2 2 0 0 0-2-2' class='clr-i-outline clr-i-outline-path-1'/%3E%3Cpath fill='%23000' d='M7 12h17v1.6H7z' class='clr-i-outline clr-i-outline-path-2'/%3E%3Cpath fill='%23000' d='M7 16h11v1.6H7z' class='clr-i-outline clr-i-outline-path-3'/%3E%3Cpath fill='%23000' d='M7 23h10v1.6H7z' class='clr-i-outline clr-i-outline-path-4'/%3E%3Cpath fill='%23000' d='M27.46 17.23a6.36 6.36 0 0 0-4.4 11l-1.94 2.37l.9 3.61l3.66-4.46a6.26 6.26 0 0 0 3.55 0l3.66 4.46l.9-3.61l-1.94-2.37a6.36 6.36 0 0 0-4.4-11Zm0 10.68a4.31 4.31 0 1 1 4.37-4.31a4.35 4.35 0 0 1-4.37 4.31' class='clr-i-outline clr-i-outline-path-5'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath fill='%23000' d='M32 6H4a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h15l.57-.7l.93-1.14l-.09-.16H4V8h28v8.56a8.4 8.4 0 0 1 2 1.81V8a2 2 0 0 0-2-2' class='clr-i-outline clr-i-outline-path-1'/%3E%3Cpath fill='%23000' d='M7 12h17v1.6H7z' class='clr-i-outline clr-i-outline-path-2'/%3E%3Cpath fill='%23000' d='M7 16h11v1.6H7z' class='clr-i-outline clr-i-outline-path-3'/%3E%3Cpath fill='%23000' d='M7 23h10v1.6H7z' class='clr-i-outline clr-i-outline-path-4'/%3E%3Cpath fill='%23000' d='M27.46 17.23a6.36 6.36 0 0 0-4.4 11l-1.94 2.37l.9 3.61l3.66-4.46a6.26 6.26 0 0 0 3.55 0l3.66 4.46l.9-3.61l-1.94-2.37a6.36 6.36 0 0 0-4.4-11Zm0 10.68a4.31 4.31 0 1 1 4.37-4.31a4.35 4.35 0 0 1-4.37 4.31' class='clr-i-outline clr-i-outline-path-5'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
}
.is-active .icon-student-cert {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath fill='%23000' d='M19 30H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v10.37a8.34 8.34 0 0 0-13.49 9.79l-.93 1.14ZM7 12v1.6h17V12Zm0 5.6h11V16H7Zm0 7h10V23H7Z' class='clr-i-solid clr-i-solid-path-1'/%3E%3Cpath fill='%23000' d='M33.83 23.59a6.37 6.37 0 1 0-10.77 4.59l-1.94 2.37l.9 3.61l3.66-4.46a6.26 6.26 0 0 0 3.55 0l3.66 4.46l.9-3.61l-1.94-2.37a6.34 6.34 0 0 0 1.98-4.59m-10.74 0a4.37 4.37 0 1 1 4.37 4.31a4.35 4.35 0 0 1-4.36-4.31Z' class='clr-i-solid clr-i-solid-path-2'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath fill='%23000' d='M19 30H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v10.37a8.34 8.34 0 0 0-13.49 9.79l-.93 1.14ZM7 12v1.6h17V12Zm0 5.6h11V16H7Zm0 7h10V23H7Z' class='clr-i-solid clr-i-solid-path-1'/%3E%3Cpath fill='%23000' d='M33.83 23.59a6.37 6.37 0 1 0-10.77 4.59l-1.94 2.37l.9 3.61l3.66-4.46a6.26 6.26 0 0 0 3.55 0l3.66 4.46l.9-3.61l-1.94-2.37a6.34 6.34 0 0 0 1.98-4.59m-10.74 0a4.37 4.37 0 1 1 4.37 4.31a4.35 4.35 0 0 1-4.36-4.31Z' class='clr-i-solid clr-i-solid-path-2'/%3E%3Cpath fill='none' d='M0 0h36v36H0z'/%3E%3C/svg%3E");
}

/* Manage Staff */
.icon-manage-staff {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3Cpath d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cg fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2M30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4'/%3E%3Cpath d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/svg%3E");
}
.is-active .icon-manage-staff {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='SVGgA8a3bBK'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23fff' stroke='%23fff' d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2'/%3E%3Cpath stroke='%23fff' d='m30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23000' stroke='%23000'/%3E%3Cpath stroke='%23000' d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23SVGgA8a3bBK)'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Cdefs%3E%3Cmask id='SVGgA8a3bBK'%3E%3Cg fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='4'%3E%3Cpath fill='%23fff' stroke='%23fff' d='M10 44h28a2 2 0 0 0 2-2V14H30V4H10a2 2 0 0 0-2 2v36a2 2 0 0 0 2 2'/%3E%3Cpath stroke='%23fff' d='m30 4l10 10'/%3E%3Ccircle cx='24' cy='24' r='4' fill='%23000' stroke='%23000'/%3E%3Cpath stroke='%23000' d='M32 36a8 8 0 1 0-16 0'/%3E%3C/g%3E%3C/mask%3E%3C/defs%3E%3Cpath fill='%23000' d='M0 0h48v48H0z' mask='url(%23SVGgA8a3bBK)'/%3E%3C/svg%3E");
}

/* Staff Validation */
.icon-staff-validation {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M10 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2M4 18c.22-.72 3.31-2 6-2c0-.7.13-1.37.35-1.99C7.62 13.91 2 15.27 2 18v2h9.54c-.52-.58-.93-1.25-1.19-2zm15.43.02c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59c-1.5-1.5-.79-.8-2.57-2.57M16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M10 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m0-6c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2M4 18c.22-.72 3.31-2 6-2c0-.7.13-1.37.35-1.99C7.62 13.91 2 15.27 2 18v2h9.54c-.52-.58-.93-1.25-1.19-2zm15.43.02c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59c-1.5-1.5-.79-.8-2.57-2.57M16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
}
.is-active .icon-staff-validation {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='10' cy='8' r='4' fill='%23000'/%3E%3Cpath fill='%23000' d='M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Ccircle cx='10' cy='8' r='4' fill='%23000'/%3E%3Cpath fill='%23000' d='M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02c0-2.21-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22L22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2s2 .9 2 2s-.9 2-2 2'/%3E%3C/svg%3E");
}

/* Staff Leave */
.icon-staff-leave {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M16.616 9.5h4q.213 0 .356.143q.144.143.144.357t-.144.357t-.357.143h-4q-.213 0-.356-.143T16.116 10t.143-.357t.356-.143m-9.738 1.008Q6 9.63 6 8.385t.877-2.123T9 5.385t2.123.877T12 8.385t-.877 2.123T9 11.385t-2.123-.877M2 17.577v-.608q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v.608q0 .44-.299.74q-.299.298-.74.298H3.04q-.441 0-.74-.299t-.3-.739m1 .039h12v-.647q0-.332-.215-.625q-.214-.292-.593-.494q-1.234-.598-2.542-.916T9 14.616t-2.65.318t-2.542.916q-.38.202-.593.494Q3 16.637 3 16.97zm7.413-7.819Q11 9.21 11 8.385t-.587-1.413T9 6.385t-1.412.587T7 8.385t.588 1.412T9 10.385t1.413-.588M9 17.616'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M16.616 9.5h4q.213 0 .356.143q.144.143.144.357t-.144.357t-.357.143h-4q-.213 0-.356-.143T16.116 10t.143-.357t.356-.143m-9.738 1.008Q6 9.63 6 8.385t.877-2.123T9 5.385t2.123.877T12 8.385t-.877 2.123T9 11.385t-2.123-.877M2 17.577v-.608q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v.608q0 .44-.299.74q-.299.298-.74.298H3.04q-.441 0-.74-.299t-.3-.739m1 .039h12v-.647q0-.332-.215-.625q-.214-.292-.593-.494q-1.234-.598-2.542-.916T9 14.616t-2.65.318t-2.542.916q-.38.202-.593.494Q3 16.637 3 16.97zm7.413-7.819Q11 9.21 11 8.385t-.587-1.413T9 6.385t-1.412.587T7 8.385t.588 1.412T9 10.385t1.413-.588M9 17.616'/%3E%3C/svg%3E");
}
.is-active .icon-staff-leave {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M16.616 9.5h4q.213 0 .356.143q.144.143.144.357t-.144.357t-.357.143h-4q-.213 0-.356-.143T16.116 10t.143-.357t.356-.143m-9.738 1.008Q6 9.63 6 8.385t.877-2.123T9 5.385t2.123.877T12 8.385t-.877 2.123T9 11.385t-2.123-.877M2 17.577v-.608q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v.608q0 .44-.299.74q-.299.298-.74.298H3.04q-.441 0-.74-.299t-.3-.739'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M16.616 9.5h4q.213 0 .356.143q.144.143.144.357t-.144.357t-.357.143h-4q-.213 0-.356-.143T16.116 10t.143-.357t.356-.143m-9.738 1.008Q6 9.63 6 8.385t.877-2.123T9 5.385t2.123.877T12 8.385t-.877 2.123T9 11.385t-2.123-.877M2 17.577v-.608q0-.619.36-1.158q.361-.54.97-.838q1.416-.679 2.834-1.018q1.417-.34 2.836-.34t2.837.34t2.832 1.018q.61.298.97.838q.361.539.361 1.158v.608q0 .44-.299.74q-.299.298-.74.298H3.04q-.441 0-.74-.299t-.3-.739'/%3E%3C/svg%3E");
}

/* Staff RFID */
.icon-staff-rfid {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 4a2 2 0 0 0-2 2v1.043a5 5 0 0 0-2.879 1.421l-2.828 2.829a1 1 0 1 0 1.414 1.414L6.536 9.88A3 3 0 0 1 8 9.073v3.646l-.625.5a1 1 0 0 0 1.25 1.562l2.903-2.323a2 2 0 0 1 2.664.148l.286.286L7.933 17.8a1 1 0 0 1-.6.2H3a1 1 0 1 0 0 2h4.333a3 3 0 0 0 1.8-.6L15 15h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 7.12l.279-.223a4 4 0 0 1 5.327.295l.286.286c.421.421.612.978.583 1.522H20V9H10zM20 7V6H10v1z'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 4a2 2 0 0 0-2 2v1.043a5 5 0 0 0-2.879 1.421l-2.828 2.829a1 1 0 1 0 1.414 1.414L6.536 9.88A3 3 0 0 1 8 9.073v3.646l-.625.5a1 1 0 0 0 1.25 1.562l2.903-2.323a2 2 0 0 1 2.664.148l.286.286L7.933 17.8a1 1 0 0 1-.6.2H3a1 1 0 1 0 0 2h4.333a3 3 0 0 0 1.8-.6L15 15h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 7.12l.279-.223a4 4 0 0 1 5.327.295l.286.286c.421.421.612.978.583 1.522H20V9H10zM20 7V6H10v1z'/%3E%3C/g%3E%3C/svg%3E");
}
.is-active .icon-staff-rfid {
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 4a2 2 0 0 0-2 2v1.043a5 5 0 0 0-2.879 1.421l-2.828 2.829a1 1 0 1 0 1.414 1.414L6.536 9.88A3 3 0 0 1 8 9.073v3.646l-.625.5a1 1 0 0 0 1.25 1.562l2.903-2.323a2 2 0 0 1 2.664.148l.286.286L7.933 17.8a1 1 0 0 1-.6.2H3a1 1 0 1 0 0 2h4.333a3 3 0 0 0 1.8-.6L15 15h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 7.12l.279-.223a4 4 0 0 1 5.327.295l.286.286c.421.421.612.978.583 1.522H20V9H10zM20 7V6H10v1z'/%3E%3C/g%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23000' d='M10 4a2 2 0 0 0-2 2v1.043a5 5 0 0 0-2.879 1.421l-2.828 2.829a1 1 0 1 0 1.414 1.414L6.536 9.88A3 3 0 0 1 8 9.073v3.646l-.625.5a1 1 0 0 0 1.25 1.562l2.903-2.323a2 2 0 0 1 2.664.148l.286.286L7.933 17.8a1 1 0 0 1-.6.2H3a1 1 0 1 0 0 2h4.333a3 3 0 0 0 1.8-.6L15 15h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 7.12l.279-.223a4 4 0 0 1 5.327.295l.286.286c.421.421.612.978.583 1.522H20V9H10zM20 7V6H10v1z'/%3E%3C/g%3E%3C/svg%3E");
}

/* Custom Scrollbar for Navigation */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
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
