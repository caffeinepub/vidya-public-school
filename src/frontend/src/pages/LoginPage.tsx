import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/context/AppContext";
import type { UserRole } from "@/types";
import { sessionStore } from "@/utils/sessionStore";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LogIn, Shield } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const DEMO_ACCOUNTS: {
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

export default function LoginPage() {
  const navigate = useNavigate();
  const { setSession } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const account = DEMO_ACCOUNTS.find(
      (a) => a.email === email && a.password === password,
    );
    if (!account) {
      setError("Invalid email or password. Use a demo account below.");
      setLoading(false);
      return;
    }
    const newSession = { name: account.name, role: account.role };
    // Write to module-level store FIRST so requireAuth sees it synchronously
    sessionStore.set(newSession);
    setSession(newSession);
    toast.success(`Welcome, ${account.name}!`);
    navigate({ to: "/dashboard" });
    setLoading(false);
  };

  const quickLogin = (account: (typeof DEMO_ACCOUNTS)[0]) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block"
        >
          <div className="flex items-center gap-3 mb-6">
            <img
              src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
              alt="VPS"
              className="h-14 w-14"
            />
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Vidya Public School
              </h1>
              <p className="text-sm text-muted-foreground">
                ERP Management System
              </p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Securely access the school's management system. Only authorised
            staff members can log in.
          </p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
              Demo Accounts
            </p>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                type="button"
                key={acc.role}
                onClick={() => quickLogin(acc)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-left"
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
        </motion.div>

        {/* Right: Login form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-card">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6 lg:hidden">
                <img
                  src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                  alt="VPS"
                  className="h-10 w-10"
                />
                <div>
                  <h1 className="text-base font-bold text-foreground">
                    Vidya Public School
                  </h1>
                  <p className="text-xs text-muted-foreground">ERP System</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-1">
                Staff Login
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                Enter your credentials to access the dashboard.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    autoComplete="email"
                    data-ocid="login.email.input"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      data-ocid="login.password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md"
                    data-ocid="login.error_state"
                  >
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                  data-ocid="login.submit.button"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      Sign In
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
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      type="button"
                      key={acc.role}
                      onClick={() => quickLogin(acc)}
                      className="text-xs text-left p-2 rounded-md border border-border hover:bg-muted"
                    >
                      <span className="font-medium block">{acc.label}</span>
                      <span className="text-muted-foreground">{acc.email}</span>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
