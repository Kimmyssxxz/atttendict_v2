import StaffDashboardView from '../views/staff/StaffDashboardView.vue';
import StaffAttendance from '../views/staff/StaffAttendance.vue';
import StaffAttendanceLogs from '../views/staff/StaffAttendanceLogs.vue';
import StaffCalendar from '../views/staff/StaffCalendar.vue';
import StaffSettings from '../views/staff/StaffSettings.vue';


const staffRoutes = [
  {
    path: '/staff/dashboard',
    name: 'StaffDashboard',
    component: StaffDashboardView
  },
  {
    path: '/staff/attendance',
    name: 'StaffAttendance',
    component: StaffAttendance
  },
  {
    path: '/staff/attendance-logs',
    name: 'StaffAttendanceLogs',
    component: StaffAttendanceLogs
  },
  {
    path: '/staff/monthly-summary',
    name: 'StaffMonthlySummary',
    component: StaffCalendar
  },
  {
    path: '/staff/settings',
    name: 'StaffSettings',
    component: StaffSettings
  },
  // {
  //   path: '/staff/fingerprint',
  //   name: 'StaffFingerprint',
  //   component: () => import('../views/staff/StaffFingerprint.vue')
  // }
];

export default staffRoutes;