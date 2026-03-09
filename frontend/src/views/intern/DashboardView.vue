<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">Student Intern Dashboard</h1>
      <div class="flex items-center gap-4">
        <nav class="flex flex-wrap gap-3">
          <router-link to="/intern/dashboard" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Dashboard</router-link>
          <router-link to="/intern/time" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Time In / Out</router-link>
          <router-link to="/intern/attendance" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">My Attendance</router-link>
          <router-link to="/intern/staff-status" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Staff Status</router-link>
          <router-link to="/intern/notifications" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Notifications</router-link>
          <router-link to="/intern/profile" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Profile</router-link>
          <router-link to="/intern/settings" class="text-gray-200 no-underline px-3.5 py-1.5 rounded-full text-sm border border-transparent transition-colors hover:bg-slate-900 [&.router-link-active]:bg-orange-500 [&.router-link-active]:text-slate-900 [&.router-link-active]:border-orange-500">Settings</router-link>
        </nav>

        <div class="relative cursor-pointer" @click="toggleNotifications">
          <div class="relative w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center transition-colors hover:bg-slate-700">
            <span class="text-base">🔔</span>
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-[10px] px-1.5 py-0 min-w-[18px] text-center shadow-sm">{{ unreadCount }}</span>
          </div>
          <div v-if="showNotifications" class="absolute right-0 mt-2 bg-white text-slate-900 min-w-[220px] rounded-xl shadow-[0_10px_25px_rgba(15,23,42,0.25)] p-3 z-20" @click.stop>
            <h3 class="m-0 mb-2 text-sm font-semibold">Notifications</h3>
            <ul v-if="notifications.length" class="list-none p-0 m-0 text-[0.85rem]">
              <li v-for="(n, idx) in notifications" :key="idx" class="mt-1 first:mt-0">{{ n }}</li>
            </ul>
            <p v-else class="m-0 text-[0.8rem] text-gray-500">No notifications</p>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-[1100px] mx-auto my-8 px-4 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6">
      <section class="flex flex-col gap-4">
        <div class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 flex flex-col gap-5">
          <div class="flex items-center gap-4">
            <div class="text-3xl">👋</div>
            <div>
              <h2 class="m-0 text-[1.25rem] text-slate-900">Welcome back, {{ studentName }}!</h2>
              <p class="m-0 mt-1 text-[0.85rem] text-slate-500">Here's a quick overview of your OJT progress.</p>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span class="block text-[0.8rem] text-slate-500 mb-1">Student Name</span>
              <span class="text-[1.1rem] font-semibold text-slate-900">{{ studentName }}</span>
            </div>
            <div>
              <span class="block text-[0.8rem] text-slate-500 mb-1">Course / School</span>
              <span class="text-[1.1rem] font-semibold text-slate-900">{{ courseAndSchool }}</span>
            </div>
            <div>
              <span class="block text-[0.8rem] text-slate-500 mb-1">Assigned Office / Supervisor</span>
              <span class="text-[1.1rem] font-semibold text-slate-900">{{ assignedOffice }}</span>
            </div>
            <div>
              <span class="block text-[0.8rem] text-slate-500 mb-1">OJT Required Hours</span>
              <span class="text-[1.1rem] font-semibold text-slate-900">{{ requiredHours }} hrs</span>
            </div>
            <div>
              <span class="block text-[0.8rem] text-slate-500 mb-1">OJT Remaining Hours</span>
              <span class="text-[1.1rem] font-semibold text-slate-900">{{ remainingHoursDisplay }}</span>
            </div>
          </div>

          <div class="mt-2">
            <div class="flex justify-between items-center gap-3">
              <span class="text-[0.8rem] text-slate-500">Completed Hours vs Required Hours</span>
              <span class="text-[0.8rem] text-slate-600">
                Remaining: {{ remainingHoursDisplay }} ({{ progressPercent }}%)
              </span>
            </div>
            <div class="w-full mt-2 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-[width] duration-300 ease-in-out" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 flex flex-col gap-4">
          <div class="flex justify-between items-center">
            <h3 class="m-0 text-slate-900">Weekly Rendered Hours</h3>
            <span class="text-[0.75rem] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">This week</span>
          </div>
          <apexchart
            type="area"
            height="300"
            :options="chartOptions"
            :series="chartSeries"
          ></apexchart>
        </div>

        <div class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
          <h3 class="mt-0 mb-3 text-[1rem] text-slate-900">Attendance Analytics</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Average Time In</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ averageTimeIn }}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Average Working Hours / Day</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ averageWorkingHoursPerDay }} hrs</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Attendance Rate</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ attendanceRate }}%</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Most Active Day</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ mostActiveDay }}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Longest Working Streak</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ longestWorkingStreak }} days</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Most Common Time In</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ mostCommonTimeIn }}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Days with Low Hours</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ lowHourDaysCount }}</span>
            </div>
            <div class="p-3 bg-slate-50 rounded-xl">
              <span class="block text-[0.8rem] text-slate-500 mb-1">Consistency Score</span>
              <span class="block mt-1 text-[1.1rem] font-semibold text-slate-900">{{ consistencyScore }}%</span>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-4">
        <div class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="m-0 text-slate-900">Monthly Attendance</h3>
            <span class="text-[0.75rem] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{{ monthlyAttendance.monthLabel }}</span>
          </div>
          <apexchart
            type="bar"
            height="300"
            :options="monthlyChartOptions"
            :series="monthlyChartSeries"
          ></apexchart>
        </div>

        <div class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6 flex flex-col gap-3">
          <div class="flex justify-between items-center">
            <h3 class="m-0 text-slate-900">Calendar View</h3>
            <div class="flex items-center gap-2">
              <button class="bg-slate-100 border border-slate-300 text-slate-700 px-2 py-1 rounded cursor-pointer font-bold text-sm transition-colors hover:bg-slate-200" @click="prevMonth">&lt;</button>
              <span class="text-[0.75rem] px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">{{ calendarMonthLabel }}</span>
              <button class="bg-slate-100 border border-slate-300 text-slate-700 px-2 py-1 rounded cursor-pointer font-bold text-sm transition-colors hover:bg-slate-200" @click="nextMonth">&gt;</button>
            </div>
          </div>
          <div class="flex flex-wrap gap-3 text-[0.75rem] text-slate-500">
            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>Present</span>
            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>Holiday</span>
            <span class="inline-flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>Weekend (Sunday)</span>
          </div>
          <div class="grid grid-cols-7 gap-1 mt-1">
            <div class="text-center text-[0.7rem] font-semibold text-slate-500" v-for="d in ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']" :key="d">
              {{ d }}
            </div>
            <button
              v-for="(day, idx) in calendarWeeksFlat"
              :key="day.dateKey + '_' + idx"
              type="button"
              :class="[
                'border-none rounded-lg p-1.5 text-[0.75rem] text-center cursor-pointer bg-slate-100 text-slate-900',
                !day.isCurrentMonth ? 'opacity-40' : '',
                day.status === 'present' ? '!bg-green-100 !text-green-800' : '',
                day.status === 'holiday' ? '!bg-blue-100 !text-blue-800' : '',
                day.isWeekend && day.status === 'none' ? '!bg-yellow-100 !text-yellow-800 border !border-yellow-400' : '',
                day.isToday ? 'outline outline-2 outline-slate-600 outline-offset-1' : ''
              ]"
              @click="handleCalendarDayClick(day)"
            >
              <span class="font-semibold">{{ day.dayOfMonth }}</span>
            </button>
          </div>

          <div v-if="calendarSelectedDetails" class="mt-3 pt-3 border-t border-slate-200 text-[0.8rem] text-slate-700">
            <h4 class="m-0 mb-1 text-[0.9rem]">{{ calendarSelectedDetails.displayDate }}</h4>
            <p class="m-0 mb-1">Status: {{ calendarSelectedDetails.statusLabel }}</p>
            <p v-if="calendarSelectedDetails.hasRecord" class="m-0 leading-relaxed">
              Time In AM: {{ calendarSelectedDetails.timeInAM || '—' }}<br />
              Time Out AM: {{ calendarSelectedDetails.timeOutAM || '—' }}<br />
              Time In PM: {{ calendarSelectedDetails.timeInPM || '—' }}<br />
              Time Out PM: {{ calendarSelectedDetails.timeOutPM || '—' }}<br />
              Total Hours: {{ calendarSelectedDetails.totalHours }}
            </p>
            <p v-else class="m-0">
              No attendance record for this day.
            </p>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'InternDashboardView',
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      studentName: '',
      courseAndSchool: '',
      assignedOffice: '',
      requiredHours: 0,
      completedHours: 0,
      remainingHours: null,
      chartOptions: {
        chart: {
          type: 'area',
          height: 300,
          stacked: true,
          toolbar: { show: false }
        },
        colors: ['#008FFB', '#00E396', '#CED4DC'],
        dataLabels: { enabled: false },
        stroke: { curve: 'monotoneCubic' },
        fill: {
          type: 'gradient',
          gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.8,
          }
        },
        legend: { position: 'top', horizontalAlign: 'left' },
        xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      },
      chartSeries: [
        { name: 'Normal Hours', data: [0, 0, 0, 0, 0] },
        { name: 'Overtime', data: [0, 0, 0, 0, 0] },
      ],
      monthlyAttendance: {
        monthLabel: '',
      },
      monthlyChartOptions: {
        chart: {
          type: 'bar',
          height: 300,
          toolbar: { show: false }
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            columnWidth: '40%',
          }
        },
        colors: ['#0284c7'],
        dataLabels: { enabled: false },
        xaxis: { categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4'] },
        yaxis: {
          title: { text: 'Days Present' },
          min: 0,
          max: 7,
          tickAmount: 7,
          labels: { formatter: (val) => Math.round(val) }
        },
        tooltip: {
          y: { formatter: (val) => val + ' days' }
        }
      },
      monthlyChartSeries: [
        { name: 'Days Present', data: [0, 0, 0, 0] }
      ],
      averageTimeIn: '--:--',
      averageWorkingHoursPerDay: 0,
      attendanceRate: 0,
      mostActiveDay: 'N/A',
      longestWorkingStreak: 0,
      mostCommonTimeIn: '--:--',
      lowHourDaysCount: 0,
      consistencyScore: 0,
      notifications: [],
      unreadCount: 0,
      internId: null,
      showNotifications: false,
      calendarWeeks: [],
      calendarMonthLabel: '',
      calendarSelectedDate: null,
      calendarSelectedDetails: null,
      attendanceByDate: {},
      currentCalendarDate: new Date(),
    }
  },
  created() {
    try {
      const stored = localStorage.getItem('internUser');
      if (!stored) return;
      const basicUser = JSON.parse(stored);
      const internId = basicUser && basicUser.id;
      if (!internId) return;
      this.internId = internId;

      const key = `internNotifications_${internId}`;
      const unreadKey = `internNotificationsUnread_${internId}`;
      const raw = localStorage.getItem(key);
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          this.notifications = list;
        }
      }
      const unreadRaw = localStorage.getItem(unreadKey);
      if (unreadRaw != null) {
        const num = parseInt(unreadRaw, 10);
        if (!Number.isNaN(num) && num >= 0) {
          this.unreadCount = num;
        }
      } else {
        this.unreadCount = this.notifications.length;
      }

      this.loadDashboardData(basicUser);
    } catch (e) {}
  },
  computed: {
    progressPercent() {
      if (!this.requiredHours || this.requiredHours <= 0) return 0;
      const raw = (this.completedHours / this.requiredHours) * 100;
      const clamped = Math.max(0, Math.min(raw, 100));
      return Math.round(clamped);
    },
    remainingHoursDisplay() {
      const v = this.remainingHours;
      if (v == null || !Number.isFinite(v)) return '-';
      const totalMinutes = Math.round(v * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      return `${h}h ${m}m`;
    },
    calendarWeeksFlat() {
      return this.calendarWeeks.reduce((all, week) => all.concat(week.days), []);
    },
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    async loadDashboardData(basicUser) {
      try {
        const internId = this.internId;
        if (!internId) return;

        let user = basicUser || {};
        try {
          const userRes = await fetch(`http://localhost:3001/users/${encodeURIComponent(internId)}`);
          if (userRes.ok) {
            const userJson = await userRes.json().catch(() => null);
            if (userJson && userJson.user) {
              user = userJson.user;
            }
          }
        } catch (e) {}

        this.studentName = this.buildStudentName(user, basicUser);
        this.courseAndSchool = this.buildCourseAndSchool(user, basicUser);
        this.assignedOffice = (user.assignedOffice || basicUser.assignedOffice || 'Not assigned yet');

        const rawRequired = user.requiredHours || user.ojtRequiredHours || basicUser.requiredHours || basicUser.ojtRequiredHours;
        const parsedRequired = Number(rawRequired);
        this.requiredHours = Number.isFinite(parsedRequired) && parsedRequired > 0 ? parsedRequired : 486;

        const rawRemaining = user.ojtRemainingHours;
        const parsedRemaining = Number(rawRemaining);
        this.remainingHours = Number.isFinite(parsedRemaining) && parsedRemaining >= 0 ? parsedRemaining : null;

        try {
          const attRes = await fetch(`http://localhost:3001/attendance/intern/history?internId=${encodeURIComponent(internId)}`);
          if (attRes.ok) {
            const json = await attRes.json().catch(() => null);
            const records = Array.isArray(json && json.data) ? json.data : [];
            this.updateAttendanceAnalytics(records);
          }
        } catch (e) {}
      } catch (e) {}
    },
    buildStudentName(user, fallback) {
      const src = user || fallback || {};
      const first = src.firstName || src.firstname || '';
      const last = src.lastName || src.lastname || '';
      const middle = src.middleName || src.middlename || src.middleInitial || '';

      if (last || first || middle) {
        const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
        const withMiddle = middle ? `${main} ${middle}`.trim() : main;
        return withMiddle;
      }
      return src.fullName || src.name || 'Student Intern';
    },
    buildCourseAndSchool(user, fallback) {
      const src = user || fallback || {};
      const course = src.course || src.position || 'OJT Intern';
      const school = src.schoolOrUniversity || src.school || '';
      if (school) {
        return `${course} - ${school}`;
      }
      return course;
    },
    updateAttendanceAnalytics(records) {
      if (!Array.isArray(records) || !records.length) {
        this.completedHours = 0;
        this.chartSeries = [
          { name: 'Normal Hours', data: [0, 0, 0, 0, 0] },
          { name: 'Overtime', data: [0, 0, 0, 0, 0] },
        ];
        this.monthlyAttendance = {
          monthLabel: '',
        };
        this.monthlyChartSeries = [
          { name: 'Days Present', data: [0, 0, 0, 0] }
        ];
        this.averageTimeIn = '--:--';
        this.averageWorkingHoursPerDay = 0;
        this.attendanceRate = 0;
        this.mostActiveDay = 'N/A';
        this.longestWorkingStreak = 0;
        this.mostCommonTimeIn = '--:--';
        this.lowHourDaysCount = 0;
        this.consistencyScore = 0;
        this.attendanceByDate = {};
        this.calendarWeeks = [];
        this.calendarMonthLabel = '';
        this.calendarSelectedDate = null;
        this.calendarSelectedDetails = null;
        return;
      }

      let totalMinutesAll = 0;
      const byDate = {};
      const allTimeInsMinutes = [];

      records.forEach((r) => {
        const dateStr = r.date;
        if (!dateStr) return;

        const totalMinutesAM = typeof r.totalMinutesAM === 'number' ? r.totalMinutesAM : null;
        const totalMinutesPM = typeof r.totalMinutesPM === 'number' ? r.totalMinutesPM : null;
        const totalMinutesFallback = typeof r.totalMinutes === 'number' ? r.totalMinutes : null;

        const tag = (r.tagAM || r.tagPM || r.tagging || 'Normal Hours').trim();
        const eightHoursMinutes = 8 * 60;

        let rawTotal = 0;
        if (totalMinutesAM != null || totalMinutesPM != null) {
          rawTotal = (totalMinutesAM || 0) + (totalMinutesPM || 0);
        } else if (totalMinutesFallback != null) {
          rawTotal = totalMinutesFallback;
        } else if (typeof r.totalHours === 'number' || typeof r.totalHours === 'string') {
          const h = parseFloat(r.totalHours);
          if (Number.isFinite(h) && h > 0) {
            rawTotal = Math.round(h * 60);
          }
        }

        let dayMinutes = 0;
        if (tag === 'Overtime') {
          if (typeof r.overtimeMinutes === 'number') {
            dayMinutes = Math.max(0, r.overtimeMinutes);
          } else {
            dayMinutes = Math.max(0, rawTotal - eightHoursMinutes);
          }
        } else {
          if (typeof r.normalCountMinutes === 'number') {
            dayMinutes = Math.max(0, r.normalCountMinutes);
          } else {
            dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
          }
        }

        if (r.validationStatus === 'Approved') {
          totalMinutesAll += dayMinutes;
        }

        if (!byDate[dateStr]) {
          byDate[dateStr] = {
            minutes: 0,
            normalMinutes: 0,
            overtimeMinutes: 0,
            hasRecord: false,
          };
        }
        byDate[dateStr].minutes += dayMinutes;
        if (tag === 'Overtime') {
          byDate[dateStr].overtimeMinutes += dayMinutes;
        } else {
          byDate[dateStr].normalMinutes += dayMinutes;
        }
        byDate[dateStr].hasRecord = true;

        const timeIn = r.timeInAM || r.timeInPM;
        const timeInMinutes = this.parseTimeToMinutes(timeIn);
        if (timeInMinutes != null) {
          allTimeInsMinutes.push(timeInMinutes);
        }
      });

      const completedHoursRaw = totalMinutesAll / 60;
      this.completedHours = Math.round(completedHoursRaw * 10) / 10;

      this.updateWeeklyRenderedHours(byDate);
      this.updateMonthlyAttendance(byDate);
      this.updateAverageTimeIn(allTimeInsMinutes);
      this.updateAverageWorkingHours(byDate);
      this.updateAttendanceRate(byDate);
      this.updateExtraAnalytics(byDate, allTimeInsMinutes);

      const rawMap = {};
      records.forEach((r) => {
        if (r && r.date) {
          rawMap[r.date] = r;
        }
      });
      this.attendanceByDate = rawMap;
      this.buildCalendar(byDate, rawMap);
    },
    parseTimeToMinutes(timeStr) {
      if (!timeStr || typeof timeStr !== 'string') return null;
      const parts = timeStr.split(':');
      if (parts.length < 2) return null;
      const h = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) || 0;
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    },
    minutesTo12hString(totalMinutes) {
      if (totalMinutes == null || !Number.isFinite(totalMinutes)) return '--:--';
      const minutes = Math.round(totalMinutes);
      let h = Math.floor(minutes / 60);
      const m = minutes % 60;
      const suffix = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      if (h === 0) h = 12;
      const mm = m.toString().padStart(2, '0');
      return `${h}:${mm} ${suffix}`;
    },
    updateWeeklyRenderedHours(byDate) {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const normalData = [];
      const overtimeData = [];

      labels.forEach((label, index) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + index);
        const y = d.getFullYear();
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');
        const key = `${y}-${m}-${day}`;
        const info = byDate[key] || { normalMinutes: 0, overtimeMinutes: 0 };
        
        normalData.push(Math.round((info.normalMinutes / 60) * 10) / 10);
        overtimeData.push(Math.round((info.overtimeMinutes / 60) * 10) / 10);
      });

      this.chartSeries = [
        { name: 'Normal Hours', data: normalData },
        { name: 'Overtime', data: overtimeData }
      ];
    },
    updateMonthlyAttendance(byDate) {
      const today = new Date();
      const year = today.getFullYear();
      const monthIndex = today.getMonth();
      const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      const weeks = [
        { label: 'W1', daysPresent: 0 },
        { label: 'W2', daysPresent: 0 },
        { label: 'W3', daysPresent: 0 },
        { label: 'W4', daysPresent: 0 },
      ];

      Object.keys(byDate).forEach((dateStr) => {
        const parts = dateStr.split('-');
        if (parts.length !== 3) return;
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const d = parseInt(parts[2], 10);
        if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return;
        if (y !== year || m !== monthIndex) return;

        const date = new Date(y, m, d);
        const dayOfMonth = date.getDate();
        let weekIndex = 0;
        if (dayOfMonth <= 7) weekIndex = 0;
        else if (dayOfMonth <= 14) weekIndex = 1;
        else if (dayOfMonth <= 21) weekIndex = 2;
        else weekIndex = 3;

        if (byDate[dateStr].minutes > 0) {
          weeks[weekIndex].daysPresent += 1;
        }
      });

      const maxDays = weeks.reduce((max, w) => Math.max(max, w.daysPresent), 0);
      
      this.monthlyChartSeries = [
        { name: 'Days Present', data: weeks.map(w => w.daysPresent) }
      ];

      this.monthlyAttendance = {
        monthLabel,
      };
    },
    prevMonth() {
      const d = new Date(this.currentCalendarDate);
      d.setMonth(d.getMonth() - 1);
      this.currentCalendarDate = d;
      this.buildCalendar(this.attendanceByDate, this.attendanceByDate);
    },
    nextMonth() {
      const d = new Date(this.currentCalendarDate);
      d.setMonth(d.getMonth() + 1);
      this.currentCalendarDate = d;
      this.buildCalendar(this.attendanceByDate, this.attendanceByDate);
    },
    buildCalendar(byDate, rawMap) {
      const today = new Date();
      const calendarTarget = this.currentCalendarDate || today;
      const year = calendarTarget.getFullYear();
      const monthIndex = calendarTarget.getMonth();
      const firstOfMonth = new Date(year, monthIndex, 1);
      const startDayOfWeek = firstOfMonth.getDay();
      const calendarStart = new Date(year, monthIndex, 1 - startDayOfWeek);

      const weeks = [];
      const nowDateKey = today.toISOString().slice(0, 10);

      for (let week = 0; week < 6; week += 1) {
        const days = [];
        for (let i = 0; i < 7; i += 1) {
          const d = new Date(calendarStart);
          d.setDate(calendarStart.getDate() + week * 7 + i);
          const y = d.getFullYear();
          const m = (d.getMonth() + 1).toString().padStart(2, '0');
          const dayNum = d.getDate().toString().padStart(2, '0');
          const key = `${y}-${m}-${dayNum}`;
          const info = byDate[key] || { minutes: 0 };
          const rec = rawMap[key];

          let status = 'none';
          const isFuture = d.getTime() > today.getTime();
          const isSunday = d.getDay() === 0;
          if (rec) {
            const tag = (rec.tagAM || rec.tagPM || '').toLowerCase();
            if (tag && tag.includes('holiday')) {
              status = 'holiday';
            } else if (info.minutes > 0) {
              status = 'present';
            }
          } else if (!isFuture) {
            if (info.minutes > 0) {
              status = 'present';
            }
          }

          days.push({
            dateKey: key,
            dayOfMonth: parseInt(dayNum, 10),
            isCurrentMonth: d.getMonth() === monthIndex,
            isToday: key === nowDateKey,
            isWeekend: isSunday,
            status,
          });
        }
        weeks.push({ days });
      }

      this.calendarWeeks = weeks;
      this.calendarMonthLabel = calendarTarget.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      // Only attempt to auto-select today if today is actually in the rendered month grid
      const todayEntry = weeks.flatMap((w) => w.days).find((day) => day.dateKey === nowDateKey);
      if (todayEntry && calendarTarget.getMonth() === today.getMonth() && calendarTarget.getFullYear() === today.getFullYear()) {
        this.handleCalendarDayClick(todayEntry);
      } else {
        this.calendarSelectedDate = null;
        this.calendarSelectedDetails = null;
      }
    },
    handleCalendarDayClick(day) {
      if (!day) return;
      this.calendarSelectedDate = day.dateKey;
      const rec = this.attendanceByDate[day.dateKey] || null;

      let statusLabel = 'No record';
      if (day.status === 'present') statusLabel = 'Present';
      else if (day.status === 'holiday') statusLabel = 'Holiday';

      let totalHours = 0;
      if (rec) {
        const tag = (rec.tagAM || rec.tagPM || rec.tagging || 'Normal Hours').trim();
        const eightHoursMinutes = 8 * 60;

        const totalMinutesAM = typeof rec.totalMinutesAM === 'number' ? rec.totalMinutesAM : null;
        const totalMinutesPM = typeof rec.totalMinutesPM === 'number' ? rec.totalMinutesPM : null;
        const totalMinutesFallback = typeof rec.totalMinutes === 'number' ? rec.totalMinutes : null;

        let rawTotal = 0;
        if (totalMinutesAM != null || totalMinutesPM != null) {
          rawTotal = (totalMinutesAM || 0) + (totalMinutesPM || 0);
        } else if (totalMinutesFallback != null) {
          rawTotal = totalMinutesFallback;
        } else if (typeof rec.totalHours === 'number' || typeof rec.totalHours === 'string') {
          const h = parseFloat(rec.totalHours);
          if (Number.isFinite(h) && h > 0) {
            rawTotal = Math.round(h * 60);
          }
        }

        let dayMinutes = 0;
        if (tag === 'Overtime') {
          if (typeof rec.overtimeMinutes === 'number') {
            dayMinutes = Math.max(0, rec.overtimeMinutes);
          } else {
            dayMinutes = Math.max(0, rawTotal - eightHoursMinutes);
          }
        } else {
          if (typeof rec.normalCountMinutes === 'number') {
            dayMinutes = Math.max(0, rec.normalCountMinutes);
          } else {
            dayMinutes = Math.min(Math.max(0, rawTotal), eightHoursMinutes);
          }
        }

        totalHours = Math.round((dayMinutes / 60) * 10) / 10;
      }

      this.calendarSelectedDetails = {
        displayDate: this.formatCalendarDisplayDate(day.dateKey),
        statusLabel,
        hasRecord: !!rec,
        timeInAM: rec && rec.timeInAM,
        timeOutAM: rec && rec.timeOutAM,
        timeInPM: rec && rec.timeInPM,
        timeOutPM: rec && rec.timeOutPM,
        totalHours,
      };
    },
    formatCalendarDisplayDate(dateKey) {
      if (!dateKey) return '';
      const parts = dateKey.split('-');
      if (parts.length !== 3) return dateKey;
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return dateKey;
      const dt = new Date(y, m, d);
      if (Number.isNaN(dt.getTime())) return dateKey;
      return dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    },
    updateAverageTimeIn(allTimeInsMinutes) {
      if (!Array.isArray(allTimeInsMinutes) || !allTimeInsMinutes.length) {
        this.averageTimeIn = '--:--';
        return;
      }
      const total = allTimeInsMinutes.reduce((sum, v) => sum + v, 0);
      const avg = total / allTimeInsMinutes.length;
      this.averageTimeIn = this.minutesTo12hString(avg);
    },
    updateAverageWorkingHours(byDate) {
      const entries = Object.values(byDate).filter((v) => v && v.minutes > 0);
      if (!entries.length) {
        this.averageWorkingHoursPerDay = 0;
        return;
      }
      const totalMinutes = entries.reduce((sum, v) => sum + Math.max(0, v.minutes), 0);
      const avgMinutes = totalMinutes / entries.length;
      const avgHours = avgMinutes / 60;
      this.averageWorkingHoursPerDay = Math.round(avgHours * 10) / 10;
    },
    updateAttendanceRate(byDate) {
      const dates = Object.keys(byDate);
      if (!dates.length) {
        this.attendanceRate = 0;
        return;
      }

      const sortedDates = dates.slice().sort();
      const first = sortedDates[0];
      const last = sortedDates[sortedDates.length - 1];
      const firstDate = new Date(first);
      const lastDate = new Date(last);
      if (Number.isNaN(firstDate.getTime()) || Number.isNaN(lastDate.getTime())) {
        this.attendanceRate = 0;
        return;
      }

      const diffMs = lastDate.getTime() - firstDate.getTime();
      const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1);
      const windowDays = Math.max(diffDays, 1);

      const daysPresent = dates.filter((d) => byDate[d] && byDate[d].minutes > 0).length;
      const rate = (daysPresent / windowDays) * 100;
      const clamped = Math.max(0, Math.min(rate, 100));
      this.attendanceRate = Math.round(clamped);
    },
    updateExtraAnalytics(byDate, allTimeInsMinutes) {
      const weekdayTotals = [0, 0, 0, 0, 0, 0, 0];
      const dateKeys = Object.keys(byDate);
      const attendedDates = [];

      dateKeys.forEach((dateStr) => {
        const info = byDate[dateStr];
        if (!info || info.minutes <= 0) return;
        const date = new Date(dateStr);
        if (Number.isNaN(date.getTime())) return;
        const weekday = date.getDay();
        weekdayTotals[weekday] += info.minutes;
        attendedDates.push(dateStr);
      });

      if (attendedDates.length === 0) {
        this.mostActiveDay = 'N/A';
        this.longestWorkingStreak = 0;
        this.mostCommonTimeIn = '--:--';
        this.lowHourDaysCount = 0;
        this.consistencyScore = 0;
        return;
      }

      const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      let maxIdx = 0;
      let maxVal = weekdayTotals[0];
      for (let i = 1; i < weekdayTotals.length; i += 1) {
        if (weekdayTotals[i] > maxVal) {
          maxVal = weekdayTotals[i];
          maxIdx = i;
        }
      }
      this.mostActiveDay = maxVal > 0 ? weekdayNames[maxIdx] : 'N/A';

      const sortedDateObjs = attendedDates
        .map((d) => new Date(d))
        .filter((d) => !Number.isNaN(d.getTime()))
        .sort((a, b) => a - b);

      let longest = 1;
      let current = 1;
      for (let i = 1; i < sortedDateObjs.length; i += 1) {
        const prev = sortedDateObjs[i - 1];
        const cur = sortedDateObjs[i];
        const diffMs = cur.getTime() - prev.getTime();
        const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          current += 1;
          if (current > longest) longest = current;
        } else {
          current = 1;
        }
      }
      this.longestWorkingStreak = longest;

      if (!Array.isArray(allTimeInsMinutes) || !allTimeInsMinutes.length) {
        this.mostCommonTimeIn = '--:--';
      } else {
        const bucketCounts = {};
        allTimeInsMinutes.forEach((mins) => {
          if (!Number.isFinite(mins)) return;
          const bucket = Math.round(mins / 5) * 5;
          bucketCounts[bucket] = (bucketCounts[bucket] || 0) + 1;
        });
        let bestBucket = null;
        let bestCount = 0;
        Object.keys(bucketCounts).forEach((key) => {
          const count = bucketCounts[key];
          const bucket = Number(key);
          if (count > bestCount || (count === bestCount && bucket < bestBucket)) {
            bestCount = count;
            bestBucket = bucket;
          }
        });
        this.mostCommonTimeIn = bestBucket != null ? this.minutesTo12hString(bestBucket) : '--:--';
      }

      const LOW_HOURS_THRESHOLD_MINUTES = 4 * 60;
      let lowDays = 0;
      let daysWithHours = 0;
      dateKeys.forEach((dateStr) => {
        const info = byDate[dateStr];
        if (!info || info.minutes <= 0) return;
        daysWithHours += 1;
        if (info.minutes < LOW_HOURS_THRESHOLD_MINUTES) {
          lowDays += 1;
        }
      });
      this.lowHourDaysCount = lowDays;

      if (daysWithHours === 0) {
        this.consistencyScore = 0;
      } else {
        const consistentDays = daysWithHours - lowDays;
        const score = (consistentDays / daysWithHours) * 100;
        this.consistencyScore = Math.round(Math.max(0, Math.min(score, 100)));
      }
    },
  }
}
</script>


