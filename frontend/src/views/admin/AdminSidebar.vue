<template>
  <aside class="w-full md:w-[250px] p-4 md:px-5 md:py-6 bg-white border-r-0 md:border-r-[3px] border-gray-200 shrink-0">
    <div class="flex items-center gap-3 mb-5">
      <div class="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-blue-700 to-blue-400 flex items-center justify-center text-gray-50 font-bold text-[0.95rem] shrink-0">AD</div>
      <div>
        <h2 class="m-0 text-[1.05rem] text-gray-900 font-bold">Admin Panel</h2>
        <p class="mt-[0.1rem] mb-0 text-[0.8rem] text-gray-500">Manage users and dashboard</p>
      </div>
    </div>

    <div class="flex md:block items-center gap-2">
      <p class="mt-0 mb-0 md:mb-1.5 text-[0.75rem] uppercase tracking-wider text-gray-400 font-semibold">Menus</p>
      <nav class="flex flex-row md:flex-col gap-1 w-full">
        <router-link
          to="/admin/dashboard"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-gray-700 no-underline text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          active-class="bg-blue-100 text-blue-700 [&>span:first-child]:bg-black/5"
        >
          <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">🏠</span>
          <span class="hidden md:inline">Dashboard</span>
        </router-link>
        <button
          type="button"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 w-full border-none bg-transparent justify-between cursor-pointer rounded-xl text-gray-700 font-sans text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          @click="userMgmtOpen = !userMgmtOpen"
        >
          <div class="flex items-center gap-2.5">
            <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">👥</span>
            <span class="hidden md:inline text-left">Student Interns</span>
          </div>
          <span class="hidden md:inline text-[0.7rem] text-gray-500 transition-transform duration-150" :class="{ 'rotate-180': userMgmtOpen }">
            ▾
          </span>
        </button>

        <div v-if="userMgmtOpen" class="flex mt-0.5 hidden md:flex">
          <div class="w-px my-1 ml-3 mr-2 bg-gray-300"></div>
          <div class="flex-1 flex flex-col">
            <router-link
              to="/admin/manage-interns"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 [&>span:first-child]:bg-black/5"
            >
              <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">📋</span>
              <span>Manage Student Interns</span>
            </router-link>
            <router-link
              to="/admin/student-attendance-validation"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 [&>span:first-child]:bg-black/5"
            >
              <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">✅</span>
              <span>Student Attendance Validation</span>
            </router-link>
            <router-link
              to="/admin/student-tagging"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 [&>span:first-child]:bg-black/5"
            >
              <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">🏷️</span>
              <span>Student Attendance Tagging</span>
            </router-link>
            <router-link
              to="/admin/student-certification"
              class="flex items-center gap-2.5 pl-[1.9rem] pr-3 py-1.5 rounded-xl text-gray-700 no-underline text-[0.85rem] transition-all hover:bg-blue-50 hover:text-blue-700"
              active-class="bg-blue-100 text-blue-700 [&>span:first-child]:bg-black/5"
            >
              <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">📄</span>
              <span>Student Certification</span>
            </router-link>
          </div>
        </div>
        <router-link
          to="/admin/settings"
          class="flex items-center gap-2.5 px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-gray-700 no-underline text-sm transition-all hover:bg-blue-50 hover:text-blue-700"
          active-class="bg-blue-100 text-blue-700 [&>span:first-child]:bg-black/5"
        >
          <span class="w-[26px] h-[26px] rounded-full bg-blue-50 flex items-center justify-center text-sm transition-colors">⚙️</span>
          <span class="hidden md:inline">Set Office Hours</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'AdminSidebar',
  data() {
    return {
      userMgmtOpen: true,
    };
  },
};
</script>

