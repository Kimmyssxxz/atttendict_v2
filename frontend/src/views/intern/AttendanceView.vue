<template>
  <div class="min-h-screen bg-slate-50 font-sans text-gray-800">
    <header class="bg-slate-800 text-white px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      <h1 class="m-0 text-[1.4rem] font-bold">My Attendance Records</h1>
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

    <!-- Download Format Modal -->
    <div v-if="showDownloadModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]" @click="showDownloadModal = false">
      <div class="bg-white p-8 rounded-2xl w-[90%] max-w-[400px] text-center shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]" @click.stop>
        <h3 class="mt-0 text-slate-800 text-xl font-bold mb-2">Select Download Format</h3>
        <p class="text-slate-500 mb-6 text-sm">How would you like to download your Daily Time Record (DTR)?</p>
        <div class="flex flex-col gap-3 mb-6">
          <button class="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold cursor-pointer transition-all hover:bg-red-50 hover:border-red-500 hover:text-red-700" @click="handleDownload('pdf')">
            <span class="text-lg">📄</span> PDF Format
          </button>
          <button class="flex items-center justify-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50 font-semibold cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700" @click="handleDownload('word')">
            <span class="text-lg">📝</span> Word Format
          </button>
        </div>
        <button class="bg-transparent border-none text-slate-400 cursor-pointer text-sm underline hover:text-slate-500" @click="showDownloadModal = false">Cancel</button>
      </div>
    </div>

    <main class="max-w-[1100px] mx-auto my-8 px-4 flex flex-col gap-6">
      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <h2 class="mt-0 mb-4 text-[1.1rem] text-slate-900 border-b border-slate-100 pb-2">Filters</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label for="month" class="block mb-1.5 text-[0.85rem] text-slate-600 font-medium">Month</label>
            <select id="month" v-model="selectedMonth" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white">
              <option value="">All</option>
              <option value="2025-01">January 2025</option>
              <option value="2025-02">February 2025</option>
            </select>
          </div>
          <div>
            <label for="from" class="block mb-1.5 text-[0.85rem] text-slate-600 font-medium">From</label>
            <input id="from" type="date" v-model="fromDate" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white" />
          </div>
          <div>
            <label for="to" class="block mb-1.5 text-[0.85rem] text-slate-600 font-medium">To</label>
            <input id="to" type="date" v-model="toDate" class="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white" />
          </div>
          <div class="flex justify-end md:justify-start">
            <button class="px-5 py-2.5 rounded-full border-none bg-orange-500 text-white text-sm font-semibold cursor-pointer transition-colors hover:bg-orange-600 w-full md:w-auto" @click="showDownloadModal = true">Download DTR</button>
          </div>
        </div>
      </section>

      <section class="bg-white rounded-2xl shadow-[0_10px_25px_rgba(15,23,42,0.08)] p-6">
        <h2 class="mt-0 mb-4 text-[1.1rem] text-slate-900 border-b border-slate-100 pb-2">Attendance</h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50">
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Date</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Time In</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Time Out</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Total Hours</th>
                <th class="font-semibold text-[0.8rem] uppercase tracking-wider text-slate-500 px-4 py-3 text-left border-b border-slate-200">Tag</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in paginatedRecords" :key="record.id + '-' + (record.sessionLabel || 'all')" class="hover:bg-slate-50/50 transition-colors">
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatDate(record.date) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatTime12h(record.timeIn) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-700">{{ formatTime12h(record.timeOut) }}</td>
                <td class="px-4 py-3 border-b border-slate-100 text-slate-900 font-medium">{{ record.totalHoursLabel || '0h 0m' }}</td>
                <td class="px-4 py-3 border-b border-slate-100">
                  <span :class="['inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold', record.status === 'Overtime' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-800 border border-green-200']">
                    {{ record.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-slate-200 gap-4" v-if="tableRecords.length > 0">
          <div class="flex items-center gap-2 text-[0.85rem] text-slate-600">
            <label for="itemsPerPage">Showing</label>
            <select id="itemsPerPage" v-model="itemsPerPage" @change="currentPage = 1" class="w-auto px-2 py-1.5 rounded-md border border-slate-300 text-slate-900 focus:outline-none">
              <option :value="10">10</option>
              <option :value="15">15</option>
              <option :value="20">20</option>
              <option :value="25">25</option>
              <option :value="30">30</option>
            </select>
            <span>records per page</span>
          </div>

          <div class="flex items-center gap-4">
            <button class="px-3.5 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-[0.85rem] cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
            <span class="text-[0.85rem] text-slate-600 font-medium">Page {{ currentPage }} of {{ totalPages }}</span>
            <button class="px-3.5 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 text-[0.85rem] cursor-pointer transition-colors hover:bg-slate-100 hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
          </div>
        </div>

      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'InternAttendanceView',
  data() {
    return {
      selectedMonth: '',
      fromDate: '',
      toDate: '',
      records: [],
      internName: '',
      internTagging: '',
      notifications: [],
      unreadCount: 0,
      internId: null,
      showNotifications: false,
      showDownloadModal: false,
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  created() {
    const stored = localStorage.getItem('internUser');
    if (!stored) {
      alert('No logged-in intern found. Please log in again.');
      this.$router.push({ name: 'Login' }); // adjust route name if needed
      return;
    }

    const intern = JSON.parse(stored);
    this.internId = intern.id || null;

    fetch(`http://localhost:3001/users/${encodeURIComponent(intern.id)}`)
      .then((res) => res.ok ? res.json() : null)
      .then((userJson) => {
        const u = userJson && userJson.user ? userJson.user : intern;
        const first = u.firstName || u.firstname || '';
        const last = u.lastName || u.lastname || '';
        const middle = u.middleName || u.middlename || u.middleInitial || '';

        this.internTagging = u.tagging || '';

        if (last || first || middle) {
          const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
          const withMiddle = middle ? `${main} ${middle}`.trim() : main;
          this.internName = withMiddle;
        } else {
          this.internName = u.fullName || u.name || '';
        }
      })
      .catch(() => {
        const first = intern.firstName || intern.firstname || '';
        const last = intern.lastName || intern.lastname || '';
        const middle = intern.middleName || intern.middlename || intern.middleInitial || '';
        if (last || first || middle) {
          const main = `${last}${last && (first || middle) ? ', ' : ''}${first}`.trim();
          const withMiddle = middle ? `${main} ${middle}`.trim() : main;
          this.internName = withMiddle;
        } else {
          this.internName = intern.fullName || intern.name || '';
        }

        this.internTagging = intern.tagging || '';
      });

    fetch(`http://localhost:3001/attendance/intern/history?internId=${encodeURIComponent(intern.id)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch attendance history');
        }
        return res.json();
      })
      .then((json) => {
        this.records = (json.data || []).map((r) => ({
          id: r.id,
          date: r.date,
          timeIn: r.timeIn ? r.timeIn.slice(0, 5) : '--:--',
          timeOut: r.timeOut ? r.timeOut.slice(0, 5) : '--:--',
          timeInAM: r.timeInAM ? r.timeInAM.slice(0, 5) : '',
          timeOutAM: r.timeOutAM ? r.timeOutAM.slice(0, 5) : '',
          timeInPM: r.timeInPM ? r.timeInPM.slice(0, 5) : '',
          timeOutPM: r.timeOutPM ? r.timeOutPM.slice(0, 5) : '',
          totalMinutesAM: r.totalMinutesAM ?? null,
          totalMinutesPM: r.totalMinutesPM ?? null,
          totalMinutes: r.totalMinutes ?? null,
          normalCountMinutes: r.normalCountMinutes ?? null,
          overtimeMinutes: r.overtimeMinutes ?? null,
          totalHours: r.totalHours || '0.0',
          statusAM: r.statusAM || null,
          statusPM: r.statusPM || null,
          tagging: r.tagging || null,
          tagAM: r.tagAM || null,
          tagPM: r.tagPM || null,
        }));

        // Load notifications for header bell
        if (this.internId) {
          try {
            const key = `internNotifications_${this.internId}`;
            const unreadKey = `internNotificationsUnread_${this.internId}`;
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
          } catch (e) {}
        }
      })
      .catch((err) => {
        console.error('Attendance history fetch error:', err);
        alert('Failed to load attendance records.');
      });
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    formatDate(dateStr) {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    },
    formatTime12h(timeStr) {
      if (!timeStr) return '';
      if (timeStr === '--:--') return '--:--';
      const [hStr, mStr] = timeStr.split(':');
      const hNum = parseInt(hStr, 10);
      if (Number.isNaN(hNum)) return timeStr;
      const period = hNum >= 12 ? 'PM' : 'AM';
      const hour12 = hNum % 12 === 0 ? 12 : hNum % 12;
      return `${hour12}:${mStr} ${period}`;
    },
    formatMinutesToLabel(totalMinutes) {
      const safeMinutes = Number.isFinite(totalMinutes) && totalMinutes > 0 ? totalMinutes : 0;
      const h = Math.floor(safeMinutes / 60);
      const m = safeMinutes % 60;
      return `${h}h ${m}m`;
    },
    handleDownload(format) {
      this.showDownloadModal = false;
      if (format === 'pdf') {
        this.exportPdf();
      } else {
        this.exportWord();
      }
    },
    exportWord() {
      if (!this.filteredRecords.length) {
        alert('No attendance records to export.');
        return;
      }
      
      const parseLocalDate = (ymd) => {
        if (!ymd || typeof ymd !== 'string') return null;
        const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return null;
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const d = parseInt(m[3], 10);
        return new Date(y, mo - 1, d);
      };

      const resolveBaseDate = () => {
        if (this.selectedMonth) {
          const parsed = parseLocalDate(`${this.selectedMonth}-01`);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        if (this.fromDate) {
          const parsed = parseLocalDate(this.fromDate);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        const firstWithDate = this.filteredRecords.find(r => !!r.date);
        if (firstWithDate && firstWithDate.date) {
          const parsed = parseLocalDate(firstWithDate.date);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        return new Date();
      };

      const baseDate = resolveBaseDate();
      const year = baseDate.getFullYear();
      const monthIndex = baseDate.getMonth();
      const monthName = baseDate.toLocaleDateString('en-US', { month: 'long' });
      
      const byDay = {};
      this.filteredRecords.forEach((r) => {
        if (!r.date) return;
        const d = parseLocalDate(r.date) || new Date(r.date);
        if (!d || Number.isNaN(d.getTime())) return;
        if (d.getFullYear() !== year || d.getMonth() !== monthIndex) return;

        const dayNum = d.getDate();
        if (dayNum < 1 || dayNum > 31) return;

        byDay[dayNum] = {
          amArrival: r.timeInAM ? this.formatTime12h(r.timeInAM) : '',
          amDeparture: r.timeOutAM ? this.formatTime12h(r.timeOutAM) : '',
          pmArrival: r.timeInPM ? this.formatTime12h(r.timeInPM) : '',
          pmDeparture: r.timeOutPM ? this.formatTime12h(r.timeOutPM) : ''
        };
      });

      const generateTableHtml = () => {
        let html = `
          <div style="font-family:'Times New Roman', serif;width:3.25in;page-break-inside:avoid;line-height:0.6;mso-line-height-rule:exactly;">
            <div style="text-align:center;font-size:7pt;margin-bottom:0pt;mso-line-height-rule:exactly;line-height:7pt;">Civil Service Form No. 48</div>
            <div style="text-align:center;font-weight:bold;font-size:9.5pt;margin-bottom:0.1pt;mso-line-height-rule:exactly;line-height:10pt;">DAILY TIME RECORD</div>
            <div style="text-align:center;margin:0.1pt 0 0.1pt 0;border-bottom:0.5pt solid #000;padding-bottom:0pt;font-size:9.5pt;font-weight:bold;mso-line-height-rule:exactly;line-height:10pt;">${this.internName || '(Name)'}</div>
            <div style="margin-top:0pt;font-size:8pt;mso-line-height-rule:exactly;line-height:8.5pt;">For the month of <span style="text-decoration:underline;font-weight:bold;">${monthName} ${year}</span></div>
            <div style="margin-top:0pt;display:flex;justify-content:space-between;align-items:flex-start;font-size:6.2pt;line-height:0.6;">
              <div style="width:60%;">Official hours of arrival<br/>and departure</div>
              <div style="text-align:left;width:40%;">Regular days ________<br/>Saturdays ________</div>
            </div>
            
            <table border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-family:Arial, sans-serif;font-size:6.2pt;width:100%;margin:1pt auto;table-layout:fixed;">
              <thead>
                <tr style="height:7.5pt;mso-height-rule:exactly;">
                  <th rowspan="2" style="width:10%;">Day</th>
                  <th colspan="2">A.M.</th>
                  <th colspan="2">P.M.</th>
                  <th colspan="2">Undertime</th>
                </tr>
                <tr style="height:7.5pt;mso-height-rule:exactly;">
                  <th style="width:15%;">Arrival</th>
                  <th style="width:15%;">Departure</th>
                  <th style="width:15%;">Arrival</th>
                </tr>
              </thead>
              <tbody>
`;

        for (let day = 1; day <= 31; day++) {
          const data = byDay[day] || { amArrival: '', amDeparture: '', pmArrival: '', pmDeparture: '' };
          html += `
                <tr style="height:5.8pt;mso-height-rule:exactly;line-height:0.6;">
                  <td style="text-align:center;">${day}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.amArrival}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.amDeparture}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.pmArrival}</td>
                  <td style="text-align:center;font-size:5.5pt;">${data.pmDeparture}</td>
                  <td style="text-align:center;"></td>
                  <td style="text-align:center;"></td>
                </tr>
`;
        }

        html += `
                <tr style="height:7.5pt;mso-height-rule:exactly;">
                  <td style="font-weight:bold;text-align:center;">Total</td>
                  <td></td><td></td><td></td><td></td>
                  <td></td><td></td>
                </tr>
              </tbody>
            </table>

            <div style="font-family:serif;font-size:6.2pt;margin-top:0pt;text-align:justify;line-height:0.6;">
              I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was
              made daily at the time of arrival and departure from office.
            </div>
            <div style="height:1.5pt;mso-line-height-rule:exactly;line-height:1.5pt;"></div>
            <div style="text-align:center;font-family:sans-serif;font-size:8.5pt;margin-top:0.1pt;mso-line-height-rule:exactly;line-height:9pt;">
              <div style="font-weight:bold;">${this.internName || '&nbsp;'}</div>
              <div style="border-top:0.5pt solid #000;margin:0 10pt 0.1pt 10pt;height:0.5pt;"></div>
              <div style="font-size:6pt;">OJT Intern</div>
            </div>
            <div style="height:1.5pt;mso-line-height-rule:exactly;line-height:1.5pt;"></div>
            <div style="text-align:center;font-family:sans-serif;font-size:8.5pt;margin-top:0.1pt;mso-line-height-rule:exactly;line-height:9pt;">
              <div style="font-weight:bold;">ENGR. MARVIN D. BEJASA</div>
              <div style="border-top:0.5pt solid #000;margin:0 10pt 0.1pt 10pt;height:0.5pt;"></div>
              <div style="font-size:6pt;">OIC - Provincial Officer</div>
              <div style="font-size:5.5pt;"><i>In-Charge</i></div>
            </div>
          </div>
`;
        return html;
      };

      const tableHtmlOne = generateTableHtml();
      
      let content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>DTR ${this.internName}</title>
        <!--[if gte mso 9]>
        <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page { 
            size: portrait; 
            margin: 0.25in; 
          }
          body { margin: 0; padding: 0; }
          .main-table { width: 100%; border-collapse: collapse; border: none; table-layout: fixed; }
          .column { width: 50%; vertical-align: top; border: none; padding: 0 3pt; }
        </style>
        </head>
        <body>
          <table class="main-table">
            <tr>
              <td class="column">${tableHtmlOne}</td>
              <td class="column">${tableHtmlOne}</td>
            </tr>
          </table>
        </body></html>
      `;

      const blob = new Blob(['\ufeff', content], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DTR_${this.internName.replace(/\s+/g, '_')}_${monthName}_${year}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    exportPdf() {
      if (!this.filteredRecords.length) {
        alert('No attendance records to export.');
        return;
      }

      const parseLocalDate = (ymd) => {
        if (!ymd || typeof ymd !== 'string') return null;
        const m = ymd.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (!m) return null;
        const y = parseInt(m[1], 10);
        const mo = parseInt(m[2], 10);
        const d = parseInt(m[3], 10);
        if ([y, mo, d].some(n => Number.isNaN(n))) return null;
        return new Date(y, mo - 1, d);
      };

      const resolveBaseDate = () => {
        if (this.selectedMonth) {
          const parsed = parseLocalDate(`${this.selectedMonth}-01`);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        if (this.fromDate) {
          const parsed = parseLocalDate(this.fromDate);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        const firstWithDate = this.filteredRecords.find(r => !!r.date);
        if (firstWithDate && firstWithDate.date) {
          const parsed = parseLocalDate(firstWithDate.date);
          if (parsed && !Number.isNaN(parsed.getTime())) return parsed;
        }
        return new Date();
      };

      const baseDate = resolveBaseDate();
      const year = baseDate.getFullYear();
      const monthIndex = baseDate.getMonth();
      const monthName = baseDate.toLocaleDateString('en-US', { month: 'long' });
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      const byDay = {};

      this.filteredRecords.forEach((r) => {
        if (!r.date) return;
        const d = parseLocalDate(r.date) || new Date(r.date);
        if (!d || Number.isNaN(d.getTime())) return;
        if (d.getFullYear() !== year || d.getMonth() !== monthIndex) return;

        const dayNum = d.getDate();
        if (dayNum < 1 || dayNum > 31) return;

        const amArrival = r.timeInAM ? this.formatTime12h(r.timeInAM) : '';
        const amDeparture = r.timeOutAM ? this.formatTime12h(r.timeOutAM) : '';
        const pmArrival = r.timeInPM ? this.formatTime12h(r.timeInPM) : '';
        const pmDeparture = r.timeOutPM ? this.formatTime12h(r.timeOutPM) : '';

        byDay[dayNum] = {
          amArrival,
          amDeparture,
          pmArrival,
          pmDeparture,
          hours: (() => {
            const num = parseFloat(r.totalHours || '0');
            const safe = Number.isFinite(num) ? num : 0;
            const totalMinutes = Math.round(safe * 60);
            const h = Math.floor(totalMinutes / 60);
            const m = totalMinutes % 60;
            return { h, m };
          })(),
        };
      });

      let tableHtmlOne = '';
      tableHtmlOne += '<div style="font-family:serif;margin:20px 20px 10px 20px;font-size:11px;">';
      tableHtmlOne += '<div style="text-align:center;margin-bottom:4px;">Civil Service Form No. 48</div>';
      tableHtmlOne += '<div style="text-align:center;font-weight:bold;font-size:14px;margin-bottom:10px;">DAILY TIME RECORD</div>';
      tableHtmlOne += `<div style="text-align:center;margin:10px 0 2px 0;border-bottom:1px solid #000;padding-bottom:2px;">${this.internName || '(Name)'}</div>`;
      tableHtmlOne += `<div style="margin-top:6px;">For the month of <span style="text-decoration:underline;">${monthName} ${year}</span></div>`;
      tableHtmlOne += '<div style="margin-top:2px;display:flex;justify-content:space-between;align-items:flex-start;font-size:9px;">';
      tableHtmlOne += '<div>Official hours of arrival<br/>and departure</div>';
      tableHtmlOne += '<div style="text-align:left;">Regular days ________<br/>Saturdays ________</div>';
      tableHtmlOne += '</div>';
      tableHtmlOne += '</div>';

      tableHtmlOne += '<table border="1" cellspacing="0" cellpadding="3" style="border-collapse:collapse;font-family:sans-serif;font-size:9px;width:100%;margin:0 auto;">';
      tableHtmlOne += '<thead>';
      tableHtmlOne += '<tr>';
      tableHtmlOne += '<th rowspan="2" style="width:6%;">Day</th>';
      tableHtmlOne += '<th colspan="2">A.M.</th>';
      tableHtmlOne += '<th colspan="2">P.M.</th>';
      tableHtmlOne += '<th colspan="2">Undertime</th>';
      tableHtmlOne += '</tr>';
      tableHtmlOne += '<tr>';
      tableHtmlOne += '<th style="width:14%;">Arrival</th>';
      tableHtmlOne += '<th style="width:14%;">Departure</th>';
      tableHtmlOne += '<th style="width:14%;">Arrival</th>';
      tableHtmlOne += '<th style="width:14%;">Departure</th>';
      tableHtmlOne += '<th style="width:12%;">Hours</th>';
      tableHtmlOne += '<th style="width:12%;">Minutes</th>';
      tableHtmlOne += '</tr>';
      tableHtmlOne += '</thead>';
      tableHtmlOne += '<tbody>';

      for (let day = 1; day <= 31; day++) {
        const data = byDay[day];
        const amArr = data ? data.amArrival : '';
        const amDep = data ? data.amDeparture : '';
        const pmArr = data ? data.pmArrival : '';
        const pmDep = data ? data.pmDeparture : '';
        const hoursVal = '';
        const minsVal = '';

        tableHtmlOne += '<tr>';
        tableHtmlOne += `<td style="text-align:center;">${day}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${amArr}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${amDep}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${pmArr}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${pmDep}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${hoursVal}</td>`;
        tableHtmlOne += `<td style="text-align:center;">${minsVal}</td>`;
        tableHtmlOne += '</tr>';
      }

      tableHtmlOne += '<tr>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;">Total</td>';
      tableHtmlOne += '<td></td><td></td><td></td><td></td>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;"></td>';
      tableHtmlOne += '<td style="font-weight:bold;text-align:center;"></td>';
      tableHtmlOne += '</tr>';

      tableHtmlOne += '</tbody>';
      tableHtmlOne += '</table>';

      tableHtmlOne += `
        <div style="font-family:serif;font-size:9px;margin-top:10px;text-align:justify;">
          I certify on my honor that the above is a true and correct report of the hours of work performed, record of which was
          made daily at the time of arrival and departure from office.
        </div>
        <div style="height:40px;"></div>
        <div style="text-align:center;font-family:sans-serif;font-size:9px;margin-top:10px;">
          <div>${this.internName || '&nbsp;'}</div>
          <div style="border-top:1px solid #000;margin:0 20px 2px 20px;height:1px;"></div>
          <div>OJT Intern</div>
        </div>
        <div style="height:30px;"></div>
        <div style="text-align:center;font-family:sans-serif;font-size:9px;margin-top:10px;">
          <div style="font-weight:bold;">ENGR. MARVIN D. BEJASA</div>
          <div style="border-top:1px solid #000;margin:0 20px 2px 20px;height:1px;"></div>
          <div>OIC - Provincial Officer</div>
          <div><i>In-Charge</i></div>
        </div>
      `;

      const tableHtml = `
        <div style="display:flex;justify-content:space-between;padding:0 20px;">
          <div style="width:48%;">${tableHtmlOne}</div>
          <div style="width:48%;">${tableHtmlOne}</div>
        </div>
      `;

      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`<!DOCTYPE html><html><head><title>Daily Time Record</title></head><body>${tableHtml}</body></html>`);
      win.document.close();
      win.focus();
      win.print();
    }
  },
  computed: {
    filteredRecords() {
      return this.records.filter(r => {
        if (this.selectedMonth && !r.date.startsWith(this.selectedMonth)) {
          return false;
        }
        if (this.fromDate && r.date < this.fromDate) {
          return false;
        }
        if (this.toDate && r.date > this.toDate) {
          return false;
        }
        return true;
      });
    },
    tableRecords() {
      const rows = [];
      this.filteredRecords.forEach((r) => {
        const hasAM = r.timeInAM || r.timeOutAM;
        const hasPM = r.timeInPM || r.timeOutPM;
        const tagAM = (r.tagAM || r.tagging || 'Normal Hours').trim();
        const tagPM = (r.tagPM || r.tagging || 'Normal Hours').trim();

        const totalMinutesAM = r.totalMinutesAM != null ? r.totalMinutesAM : 0;
        const totalMinutesPM = r.totalMinutesPM != null ? r.totalMinutesPM : 0;
        const totalMinutesDay = r.totalMinutes != null
          ? r.totalMinutes
          : (totalMinutesAM + totalMinutesPM);

        const fourHoursMinutes = 4 * 60;
        const eightHoursMinutes = 8 * 60;
        if (hasAM) {
          let minutesForRow = totalMinutesAM;
          const isOvertimeSession = tagAM === 'Overtime';
          if (isOvertimeSession) {
            // For overtime-tagged session, always show full actual minutes
            minutesForRow = totalMinutesAM;
          } else {
            // Normal Hours session: cap at 4h maximum
            minutesForRow = Math.min(totalMinutesAM, fourHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          const statusTag = r.tagAM || r.tagging || 'Normal Hours';
          rows.push({
            ...r,
            timeIn: r.timeInAM || '--:--',
            timeOut: r.timeOutAM || '--:--',
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            sessionLabel: 'AM',
          });
        }

        if (hasPM) {
          let minutesForRow = totalMinutesPM;
          const isOvertimeSession = tagPM === 'Overtime';
          if (isOvertimeSession) {
            // For overtime-tagged session, always show full actual minutes
            minutesForRow = totalMinutesPM;
          } else {
            // Normal Hours session: cap at 4h maximum
            minutesForRow = Math.min(totalMinutesPM, fourHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          const statusTag = r.tagPM || r.tagging || 'Normal Hours';
          rows.push({
            ...r,
            timeIn: r.timeInPM || '--:--',
            timeOut: r.timeOutPM || '--:--',
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
            sessionLabel: 'PM',
          });
        }

        if (!hasAM && !hasPM) {
          const statusTag = r.tagging || 'Normal Hours';
          let minutesForRow;
          const isOvertimeDay = statusTag.trim() === 'Overtime';
          if (isOvertimeDay) {
            minutesForRow = Math.max(0, totalMinutesDay);
          } else {
            minutesForRow = Math.min(Math.max(0, totalMinutesDay), eightHoursMinutes);
          }
          const hoursForRowLabel = this.formatMinutesToLabel(minutesForRow);
          rows.push({
            ...r,
            totalHoursLabel: hoursForRowLabel,
            status: statusTag,
          });
        }
      });

      return rows;
    },
    totalPages() {
      if (!this.tableRecords || this.tableRecords.length === 0) return 1;
      return Math.ceil(this.tableRecords.length / this.itemsPerPage);
    },
    paginatedRecords() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.tableRecords.slice(start, end);
    }
  },
  watch: {
    selectedMonth() { this.currentPage = 1; },
    fromDate() { this.currentPage = 1; },
    toDate() { this.currentPage = 1; }
  }
}
</script>

