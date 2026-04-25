import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import OtpVerificationView from '../views/OtpVerificationView.vue';
import ForgotPasswordView from '../views/ForgotPasswordView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue';
import AdminLoginView from '../views/admin/AdminLoginView.vue';
import AdminStudentInternsView from '../views/admin/AdminStudentInternsView.vue';
import AdminStudentTaggingView from '../views/admin/AdminStudentTaggingView.vue';
import AdminStudentCertificationView from '../views/admin/AdminStudentCertificationView.vue';
import AdminStudentAttendanceValidationView from '../views/admin/AdminStudentAttendanceValidationView.vue';
import AdminSettingsView from '../views/admin/AdminSettingsView.vue';
import AdminDashboardView from '../views/admin/AdminDashboardView.vue';
import AdminStaffAttendanceView from '../views/admin/AdminStaffAttendanceView.vue';
import AdminStaffAttendanceValidation from '../views/admin/AdminStaffAttendanceValidation.vue';
import AdminStaffLeave from '../views/admin/AdminStaffLeave.vue';
import AdminStaffRFIDView from '../views/admin/StaffRfidView.vue';
import AdminArchive from '../views/admin/AdminArchive.vue';
import AdminArchivedAttendanceView from '../views/admin/AdminArchivedAttendanceView.vue';
import AdminArchivedStudentLogsView from '../views/admin/AdminArchivedStudentLogsView.vue';
import AdminArchivedStaffView from '../views/admin/AdminArchivedStaffView.vue';
import DashboardView from '../views/intern/DashboardView.vue';
import TimeView from '../views/intern/TimeView.vue';
import AttendanceView from '../views/intern/AttendanceView.vue';
import ProfileView from '../views/intern/ProfileView.vue';
import StaffDashboardView from '../views/staff/StaffDashboardView.vue';
import NotificationsView from '../views/intern/NotificationsView.vue';
import StaffStatusView from '../views/intern/StaffStatusView.vue';
import ClientLogBook from '../views/client/ClientLogBook.vue';
import staffRoutes from './staff.routes.js';
import DtcTrainingEvaluation from '../views/client/DtcTrainingEvaluation.vue';
import AdminClientLogBookView from '../views/admin/AdminClientLogBookView.vue';
import AdminDtcEvaluationFormView from '../views/admin/AdminDtcEvaluationFormView.vue';
import AdminDtcEvaluationView from '../views/admin/AdminDtcEvaluationView.vue';
import AdminClientLogBookSettingsView from '../views/admin/AdminClientLogBookSettingsView.vue';

const routes = [
  {
    path: '/auth/login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/intern/dashboard',
    name: 'InternDashboard',
    component: DashboardView
  },
  {
    path: '/intern/time',
    name: 'InternTime',
    component: TimeView
  },
  {
    path: '/intern/attendance',
    name: 'InternAttendance',
    component: AttendanceView
  },
  {
    path: '/intern/staff-status',
    name: 'InternStaffStatus',
    component: StaffStatusView
  },
  {
    path: '/intern/notifications',
    name: 'InternNotifications',
    component: NotificationsView
  },
  {
    path: '/intern/profile',
    name: 'InternProfile',
    component: ProfileView
  },
  {
    path: '/intern/settings',
    redirect: '/intern/profile'
  },
  ...staffRoutes,
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
  },
  {
    path: '/admin/manage-interns',
    name: 'AdminStudentInterns',
    component: AdminStudentInternsView,
  },
  {
    path: '/admin/student-tagging',
    name: 'AdminStudentTagging',
    component: AdminStudentTaggingView,
  },
  {
    path: '/admin/student-certification',
    name: 'AdminStudentCertification',
    component: AdminStudentCertificationView,
  },
  {
    path: '/admin/student-attendance-validation',
    name: 'AdminStudentAttendanceValidation',
    component: AdminStudentAttendanceValidationView,
  },
  {
    path: '/admin/manage-staff',
    name: 'AdminStaffAttendance',
    component: AdminStaffAttendanceView,
  },
  {
    path: '/admin/staff-attendance-validation',
    name: 'AdminStaffAttendanceValidation',
    component: AdminStaffAttendanceValidation,
  },
  {
    path: '/admin/staff-leave',
    name: 'AdminStaffLeave',
    component: AdminStaffLeave,
  },
  {
    path: '/admin/staff-rfid',
    name: 'AdminStaffRFID',
    component: AdminStaffRFIDView,
  },
  {
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettingsView,
  },
  {
    path: '/admin/archive',
    name: 'AdminArchive',
    component: AdminArchive,
  },
  {
    path: '/admin/archive/attendance-logs',
    name: 'AdminArchivedAttendance',
    component: AdminArchivedAttendanceView,
  },
  {
    path: '/admin/archive/student-logs',
    name: 'AdminArchivedStudentLogs',
    component: AdminArchivedStudentLogsView,
  },
  {
    path: '/admin/archive/staff',
    name: 'AdminArchivedStaff',
    component: AdminArchivedStaffView,
  },
  {
    path: '/admin/client-logbook',
    name: 'AdminClientLogBook',
    component: AdminClientLogBookView,
  },
  {
    path: '/admin/dtc-evaluation-form',
    name: 'AdminDtcEvaluationForm',
    component: AdminDtcEvaluationFormView,
  },
  {
    path: '/admin/client-logbook-settings',
    name: 'AdminClientLogBookSettings',
    component: AdminClientLogBookSettingsView,
  },
  {
    path: '/admin/dtc-evaluations',
    name: 'AdminDtcEvaluations',
    component: AdminDtcEvaluationView,
  },
  {
    path: '/auth/admin/login',
    name: 'AdminLogin',
    component: AdminLoginView
  },
  {
    path: '/auth/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/auth/verify-otp',
    name: 'OtpVerification',
    component: OtpVerificationView
  },
  {
    path: '/auth/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordView
  },
  {
    path: '/auth/reset-password',
    name: 'ResetPassword',
    component: ResetPasswordView
  },
  {
    path: '/client/logbook',
    name: 'ClientLogBook',
    component: ClientLogBook
  },
  {
    path: '/client/dtc-training-evaluation',
    name: 'DtcTrainingEvaluation',
    component: DtcTrainingEvaluation
  },
  {
    path: '/',
    redirect: '/auth/login'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to) => {
  // Prefer unified storage key `user`, fall back to legacy keys where necessary
  let unified = null
  try {
    unified = JSON.parse(localStorage.getItem('user') || 'null')
  } catch {
    unified = null
  }

  const resolved = unified?.user ? unified.user : unified
  const role = resolved?.role || null

  if (to.path.startsWith('/staff')) {
    if (role !== 'staff') {
      console.warn('Unauthorized access to staff route. Redirecting to login.');
      return { name: 'Login' };
    }
  }

  if (to.path.startsWith('/intern')) {
    const isIntern = role === 'student' || role === 'intern';
    if (!isIntern) {
      console.warn('Unauthorized access to intern route. Redirecting to login.');
      return { name: 'Login' };
    }
  }

  if (to.name === 'Login') {
    if (role === 'staff') {
      return { name: 'StaffDashboard' };
    }

    if (role === 'student' || role === 'intern') {
      return { name: 'InternDashboard' };
    }

    const staffUser = localStorage.getItem('staffUser');
    if (staffUser) return { name: 'StaffDashboard' };

    const internUser = localStorage.getItem('internUser');
    if (internUser) return { name: 'InternDashboard' };
  }

  return true;
})

export default router;
