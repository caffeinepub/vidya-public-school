import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/types";
import { sessionStore } from "@/utils/sessionStore";
import { useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  LogIn,
  Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const STAFF_ACCOUNTS: {
  label: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
}[] = [
  {
    label: "Super Admin",
    email: "admin@vidyaschool.edu",
    password: "admin123",
    role: "superAdmin",
    name: "Dr. Sanjana Maurya",
  },
  {
    label: "Admin",
    email: "office@vidyaschool.edu",
    password: "office123",
    role: "admin",
    name: "Admin User",
  },
  {
    label: "Accountant",
    email: "accounts@vidyaschool.edu",
    password: "acc123",
    role: "accountant",
    name: "Ravi Tiwari",
  },
  {
    label: "Teacher",
    email: "teacher@vidyaschool.edu",
    password: "teach123",
    role: "teacher",
    name: "Prof. Suresh Mathur",
  },
];

const STUDENT_DEMO_ACCOUNTS = [
  {
    name: "Arjun Sharma",
    admissionNumber: "VPS2024001",
    className: "Class 10 A",
  },
  {
    name: "Priya Patel",
    admissionNumber: "VPS2024002",
    className: "Class 10 A",
  },
  {
    name: "Rohit Verma",
    admissionNumber: "VPS2024003",
    className: "Class 9 A",
  },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { setSession, students } = useApp();
  const [activeTab, setActiveTab] = useState<"staff" | "student">("staff");

  // Staff login state
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [showStaffPass, setShowStaffPass] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [staffError, setStaffError] = useState("");

  // Student login state
  const [admissionNo, setAdmissionNo] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [showStudentPass, setShowStudentPass] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentError, setStudentError] = useState("");

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError("");
    setStaffLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const account = STAFF_ACCOUNTS.find(
      (a) => a.email === staffEmail && a.password === staffPassword,
    );
    if (!account) {
      setStaffError("Invalid email or password. Use a demo account below.");
      setStaffLoading(false);
      return;
    }
    const newSession = { name: account.name, role: account.role };
    sessionStore.set(newSession);
    setSession(newSession);
    toast.success(`Welcome, ${account.name}!`);
    navigate({ to: "/dashboard" });
    setStaffLoading(false);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStudentError("");
    setStudentLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const student = students.find(
      (s) =>
        s.admissionNumber.toLowerCase() === admissionNo.trim().toLowerCase(),
    );
    if (!student || studentPassword !== "student123") {
      setStudentError("Invalid admission number or password.");
      setStudentLoading(false);
      return;
    }
    const newSession = {
      name: student.name,
      role: "student" as UserRole,
      admissionNumber: student.admissionNumber,
    };
    sessionStore.set(newSession);
    setSession(newSession);
    toast.success(`Welcome, ${student.name}!`);
    navigate({ to: "/student-portal" });
    setStudentLoading(false);
  };

  const quickStaffLogin = (account: (typeof STAFF_ACCOUNTS)[0]) => {
    setStaffEmail(account.email);
    setStaffPassword(account.password);
  };

  const quickStudentLogin = (acc: (typeof STUDENT_DEMO_ACCOUNTS)[0]) => {
    setAdmissionNo(acc.admissionNumber);
    setStudentPassword("student123");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* School branding */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img
            src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
            alt="VPS"
            className="h-12 w-12"
          />
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">
              Vidya Public School
            </h1>
            <p className="text-sm text-muted-foreground">
              ERP & Student Portal
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("staff")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "staff"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="h-4 w-4" />
              Staff Login
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("student")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "student"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Student / Parent Login
            </button>
          </div>
        </div>

        {/* Staff Login Panel */}
        {activeTab === "staff" && (
          <motion.div
            key="staff"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Demo accounts */}
            <div className="hidden lg:block">
              <p className="text-sm text-muted-foreground mb-4">
                Securely access the school management system. Only authorised
                staff members can log in.
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Demo Staff Accounts
              </p>
              {STAFF_ACCOUNTS.map((acc) => (
                <button
                  type="button"
                  key={acc.role}
                  onClick={() => quickStaffLogin(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left mb-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {acc.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {acc.email}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {acc.role}
                  </Badge>
                </button>
              ))}
            </div>

            {/* Staff form */}
            <Card className="shadow-card">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-foreground mb-1">
                  Staff Login
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your credentials to access the dashboard.
                </p>

                <form onSubmit={handleStaffLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="staff-email">Email Address</Label>
                    <Input
                      id="staff-email"
                      type="email"
                      value={staffEmail}
                      onChange={(e) => setStaffEmail(e.target.value)}
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="staff-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="staff-password"
                        type={showStaffPass ? "text" : "password"}
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStaffPass(!showStaffPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showStaffPass ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {staffError && (
                    <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                      {staffError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={staffLoading}
                  >
                    {staffLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" /> Sign In
                      </span>
                    )}
                  </Button>
                </form>

                {/* Mobile demo accounts */}
                <div className="mt-6 lg:hidden">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Quick Login
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {STAFF_ACCOUNTS.map((acc) => (
                      <button
                        type="button"
                        key={acc.role}
                        onClick={() => quickStaffLogin(acc)}
                        className="text-xs text-left p-2 rounded-md border border-border hover:bg-muted"
                      >
                        <span className="font-medium block">{acc.label}</span>
                        <span className="text-muted-foreground">
                          {acc.email}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Student / Parent Login Panel */}
        {activeTab === "student" && (
          <motion.div
            key="student"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
          >
            {/* Demo student accounts */}
            <div className="hidden lg:block">
              <p className="text-sm text-muted-foreground mb-4">
                Students and parents can log in to view academic records, fees,
                homework, and more.
              </p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Demo Student Accounts
              </p>
              {STUDENT_DEMO_ACCOUNTS.map((acc) => (
                <button
                  type="button"
                  key={acc.admissionNumber}
                  onClick={() => quickStudentLogin(acc)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left mb-2"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {acc.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {acc.admissionNumber} &middot; {acc.className}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    student123
                  </Badge>
                </button>
              ))}
              <p className="text-xs text-muted-foreground mt-3">
                Password for all demo students:{" "}
                <span className="font-mono font-medium">student123</span>
              </p>
            </div>

            {/* Student form */}
            <Card className="shadow-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Student / Parent Login
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your admission number and password to access your
                  portal.
                </p>

                <form onSubmit={handleStudentLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="admission-no">Admission Number</Label>
                    <Input
                      id="admission-no"
                      type="text"
                      value={admissionNo}
                      onChange={(e) => setAdmissionNo(e.target.value)}
                      placeholder="e.g. VPS2024001"
                      autoComplete="username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="student-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="student-password"
                        type={showStudentPass ? "text" : "password"}
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Enter password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStudentPass(!showStudentPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showStudentPass ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {studentError && (
                    <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                      {studentError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={studentLoading}
                  >
                    {studentLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" /> Sign In to Portal
                      </span>
                    )}
                  </Button>
                </form>

                {/* Mobile demo */}
                <div className="mt-6 lg:hidden">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                    Demo Students
                  </p>
                  <div className="space-y-2">
                    {STUDENT_DEMO_ACCOUNTS.map((acc) => (
                      <button
                        type="button"
                        key={acc.admissionNumber}
                        onClick={() => quickStudentLogin(acc)}
                        className="w-full text-xs text-left p-2 rounded-md border border-border hover:bg-muted"
                      >
                        <span className="font-medium block">{acc.name}</span>
                        <span className="text-muted-foreground">
                          {acc.admissionNumber} &middot; {acc.className}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Password: <span className="font-mono">student123</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
