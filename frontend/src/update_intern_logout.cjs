const fs = require('fs');
const path = require('path');
const dir = path.join('d:', 'attendict', 'frontend', 'src', 'views', 'intern');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.vue'));

const logoutIcon = "\n        logout: \"url(\\\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='none' stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5l-5-5m5 5H9'/%3E%3C/svg%3E\\\")\",";

const confirmLogoutMethod = `
    confirmLogout() {
      if (window.confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('user');
        localStorage.removeItem('internUser');
        const internId = this.internId || (this.intern && this.intern.id);
        if (internId) {
          localStorage.removeItem('internNotifications_' + internId);
          localStorage.removeItem('internNotificationsUnread_' + internId);
        }
        this.$router.push('/auth/login');
      }
    },`;

const logoutNavHTML = `
          <button type="button" @click="confirmLogout" class="text-white no-underline px-4 py-3 rounded-lg text-lg font-medium transition-colors hover:bg-red-500/20 hover:text-red-100 border border-transparent flex items-center gap-3 cursor-pointer w-full text-left bg-transparent mt-auto mt-4">
            <span class="w-[24px] h-[24px] shrink-0 bg-current inline-block" :style="{ WebkitMaskImage: icons.logout, WebkitMaskSize: 'cover', maskImage: icons.logout, maskSize: 'cover' }"></span> Logout
          </button>
        </nav>`;

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Insert Icon
  if (!content.includes('logout: "url')) {
    content = content.replace(/icons: \{/, "icons: {" + logoutIcon);
  }

  // Insert Method
  if (!content.includes('confirmLogout() {')) {
    if (content.includes('methods: {')) {
       content = content.replace(/methods: \{/, "methods: {" + confirmLogoutMethod);
    }
  }

  // Insert Nav
  if (!content.includes('@click="confirmLogout"')) {
    let target = '</nav>';
    let index = content.indexOf(target);
    if (index !== -1) {
      let before = content.substring(0, index);
      let after = content.substring(index + target.length);
      content = before + logoutNavHTML + after;
    }
  }

  // ProfileView specifics
  if (f === 'ProfileView.vue') {
    let p1 = '<button @click="handleSaveInfo" :disabled="infoSaving" class="w-full py-3.5 rounded-2xl bg-[#eebb3b] text-white font-semibold shadow-lg shadow-[#eebb3b]/20 text-sm ">';
    if (content.includes(p1) && !content.includes('Logout\\n              </button>')) {
      let mobileLogout = '<button type="button" @click="confirmLogout" class="w-full py-3.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-md mb-2">\n                Logout\n              </button>\n              ';
      content = content.replace(p1, mobileLogout + p1);
    }
    
    let p2 = '<button type="button" @click="handleSaveInfo" :disabled="infoSaving" class="px-10 py-3 rounded-xl bg-[#eebb3b] text-white font-bold hover:bg-[#eebb3b]/90 transition-all shadow-md">';
    if (content.includes(p2) && !content.includes('hover:bg-red-600 transition-all shadow-md">\n                Logout')) {
      let desktopLogout = '<button type="button" @click="confirmLogout" class="px-10 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-all shadow-md">\n                Logout\n              </button>\n              ';
      content = content.replace(p2, desktopLogout + p2);
    }
  }

  fs.writeFileSync(filePath, content, 'utf-8');
});
console.log('Update script finished.');
