import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import AdminLoginView from '../views/admin/AdminLoginView.vue';
import AdminStudentInternsView from '../views/admin/AdminStudentInternsView.vue';
import AdminStudentTaggingView from '../views/admin/AdminStudentTaggingView.vue';
import AdminStudentCertificationView from '../views/admin/AdminStudentCertificationView.vue';
import AdminStudentAttendanceValidationView from '../views/admin/AdminStudentAttendanceValidationView.vue';
import AdminSettingsView from '../views/admin/AdminSettingsView.vue';
import DashboardView from '../views/intern/DashboardView.vue';
import TimeView from '../views/intern/TimeView.vue';
import AttendanceView from '../views/intern/AttendanceView.vue';
import ProfileView from '../views/intern/ProfileView.vue';
import StaffDashboardView from '../views/staff/StaffDashboardView.vue';
import NotificationsView from '../views/intern/NotificationsView.vue';
import StaffStatusView from '../views/intern/StaffStatusView.vue';
import ClientLogBook from '../views/client/ClientLogBook.vue';
import ClientEvaluation from '../views/client/ClientEvaluation.vue';

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
  {
    path: '/staff/dashboard',
    name: 'StaffDashboard',
    component: StaffDashboardView,
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
    path: '/admin/settings',
    name: 'AdminSettings',
    component: AdminSettingsView,
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
    path: '/client/logbook',
    name: 'ClientLogBook',
    component: ClientLogBook
  },
  {
    path: '/client/evaluation',
    name: 'ClientEvaluation',
    component: ClientEvaluation
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

export default router;
