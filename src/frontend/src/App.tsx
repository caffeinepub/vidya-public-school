import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";

import AboutPage from "@/pages/public/AboutPage";
import AcademicsPage from "@/pages/public/AcademicsPage";
import AdmissionsPage from "@/pages/public/AdmissionsPage";
import ContactPage from "@/pages/public/ContactPage";
import FacultyPage from "@/pages/public/FacultyPage";
import HomePage from "@/pages/public/HomePage";
import NoticesPublicPage from "@/pages/public/NoticesPublicPage";
import PrivacyPolicyPage from "@/pages/public/PrivacyPolicyPage";
import SitemapPage from "@/pages/public/SitemapPage";
import TermsPage from "@/pages/public/TermsPage";

import LoginPage from "@/pages/LoginPage";

import AttendancePage from "@/pages/admin/AttendancePage";
import ClassesPage from "@/pages/admin/ClassesPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import EmployeeFormPage from "@/pages/admin/EmployeeFormPage";
import EmployeeProfilePage from "@/pages/admin/EmployeeProfilePage";
import EmployeesPage from "@/pages/admin/EmployeesPage";
import ExamsPage from "@/pages/admin/ExamsPage";
import FeesPage from "@/pages/admin/FeesPage";
import MarksPage from "@/pages/admin/MarksPage";
import MySalaryPage from "@/pages/admin/MySalaryPage";
import NoticesManagePage from "@/pages/admin/NoticesManagePage";
import ReportsPage from "@/pages/admin/ReportsPage";
import SalaryPage from "@/pages/admin/SalaryPage";
import StudentFormPage from "@/pages/admin/StudentFormPage";
import StudentProfilePage from "@/pages/admin/StudentProfilePage";
import StudentsPage from "@/pages/admin/StudentsPage";
import { sessionStore } from "@/utils/sessionStore";

// Auth guard -- uses the module-level sessionStore so it works
// even in sandboxed environments where localStorage is blocked.
function requireAuth() {
  if (!sessionStore.get()) throw redirect({ to: "/login" });
}

// Root route
const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <Outlet />
      <Toaster position="top-right" richColors closeButton />
    </AppProvider>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});
const admissionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admissions",
  component: AdmissionsPage,
});
const academicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/academics",
  component: AcademicsPage,
});
const facultyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faculty",
  component: FacultyPage,
});
const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});
const noticesPublicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notices",
  component: NoticesPublicPage,
});
const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/sitemap",
  component: SitemapPage,
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/privacy-policy",
  component: PrivacyPolicyPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/terms",
  component: TermsPage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

// Private routes (auth-gated)
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: requireAuth,
  component: DashboardPage,
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students",
  beforeLoad: requireAuth,
  component: StudentsPage,
});

const studentsNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/new",
  beforeLoad: requireAuth,
  component: () => <StudentFormPage mode="new" />,
});

const studentProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$admNo",
  beforeLoad: requireAuth,
  component: StudentProfilePage,
});

const studentEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/students/$admNo/edit",
  beforeLoad: requireAuth,
  component: () => <StudentFormPage mode="edit" />,
});

const employeesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees",
  beforeLoad: requireAuth,
  component: EmployeesPage,
});

const employeesNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees/new",
  beforeLoad: requireAuth,
  component: () => <EmployeeFormPage mode="new" />,
});

const employeeProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees/$empId",
  beforeLoad: requireAuth,
  component: EmployeeProfilePage,
});

const employeeEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/employees/$empId/edit",
  beforeLoad: requireAuth,
  component: () => <EmployeeFormPage mode="edit" />,
});

const classesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/classes",
  beforeLoad: requireAuth,
  component: ClassesPage,
});

const feesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fees",
  beforeLoad: requireAuth,
  component: FeesPage,
});

const feesStudentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fees/$admNo",
  beforeLoad: requireAuth,
  component: FeesPage,
});

const examsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/exams",
  beforeLoad: requireAuth,
  component: ExamsPage,
});

const marksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marks",
  beforeLoad: requireAuth,
  component: MarksPage,
});

const marksStudentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/marks/$admNo",
  beforeLoad: requireAuth,
  component: MarksPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/attendance",
  beforeLoad: requireAuth,
  component: AttendancePage,
});

const noticesManageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notices/manage",
  beforeLoad: requireAuth,
  component: NoticesManagePage,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/reports",
  beforeLoad: requireAuth,
  component: ReportsPage,
});

const salaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/salary",
  beforeLoad: requireAuth,
  component: SalaryPage,
});

const mySalaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-salary",
  beforeLoad: requireAuth,
  component: MySalaryPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  admissionsRoute,
  academicsRoute,
  facultyRoute,
  contactRoute,
  noticesPublicRoute,
  sitemapRoute,
  privacyRoute,
  termsRoute,
  loginRoute,
  dashboardRoute,
  studentsRoute,
  studentsNewRoute,
  studentProfileRoute,
  studentEditRoute,
  employeesRoute,
  employeesNewRoute,
  employeeProfileRoute,
  employeeEditRoute,
  classesRoute,
  feesRoute,
  feesStudentRoute,
  examsRoute,
  marksRoute,
  marksStudentRoute,
  attendanceRoute,
  noticesManageRoute,
  reportsRoute,
  salaryRoute,
  mySalaryRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
