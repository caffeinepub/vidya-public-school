import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Banknote,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  Layers,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  Receipt,
  Search,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["superAdmin", "admin", "accountant", "teacher", "staff"],
  },
  {
    label: "Students",
    href: "/students",
    icon: Users,
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    label: "Employees",
    href: "/employees",
    icon: UserCog,
    roles: ["superAdmin", "admin"],
  },
  {
    label: "Classes",
    href: "/classes",
    icon: Layers,
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    label: "Fees",
    href: "/fees",
    icon: CreditCard,
    roles: ["superAdmin", "admin", "accountant"],
  },
  {
    label: "Salary",
    href: "/salary",
    icon: Banknote,
    roles: ["superAdmin", "admin"],
  },
  {
    label: "My Salary",
    href: "/my-salary",
    icon: Receipt,
    roles: ["teacher", "staff", "accountant"],
  },
  {
    label: "Exams",
    href: "/exams",
    icon: ClipboardList,
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    label: "Marks",
    href: "/marks",
    icon: BookOpen,
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    label: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
    roles: ["superAdmin", "admin", "teacher"],
  },
  {
    label: "Notices",
    href: "/notices/manage",
    icon: Megaphone,
    roles: ["superAdmin", "admin"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    roles: ["superAdmin", "admin", "accountant"],
  },
];

function SidebarNav({ onClose }: { onClose?: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, setSession } = useApp();
  const [search, setSearch] = useState("");

  const filteredNav = NAV_ITEMS.filter((item) => {
    const matchesSearch = item.label
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesRole = session ? item.roles.includes(session.role) : false;
    return matchesSearch && matchesRole;
  });

  const handleLogout = () => {
    setSession(null);
    navigate({ to: "/login" });
    onClose?.();
  };

  const initials = session?.name
    ? session.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AD";

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img
          src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
          alt="VPS Logo"
          className="w-9 h-9 rounded"
        />
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white leading-tight">
            Vidya Public School
          </div>
          <div className="text-xs text-sidebar-foreground/60">ERP System</div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sidebar-foreground/40" />
          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-sidebar-accent/50 text-sidebar-foreground placeholder:text-sidebar-foreground/40 text-sm rounded-lg pl-8 pr-3 py-2 border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 overflow-y-auto pb-2">
        <div className="text-xs font-medium text-sidebar-foreground/40 px-2 mb-2 uppercase tracking-wider">
          Navigation
        </div>
        {filteredNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.href ||
            location.pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={cn(
                "sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all",
                isActive && "active",
              )}
              data-ocid={`nav.${item.label.toLowerCase().replace(" ", "-")}.link`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <Badge className="bg-sidebar-primary text-sidebar-primary-foreground text-xs px-1.5 py-0.5 h-auto">
                  Active
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User strip */}
      <div className="border-t border-sidebar-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">
              {session?.name ?? "Admin"}
            </div>
            <div className="text-xs text-sidebar-foreground/50 capitalize">
              {session?.role ?? "admin"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-sidebar-foreground/50 hover:text-white hover:bg-sidebar-accent"
            onClick={handleLogout}
            data-ocid="nav.logout.button"
          >
            <LogOut className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { notices } = useApp();

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-col flex-shrink-0 shadow-sidebar z-20">
        <SidebarNav />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
            role="button"
            tabIndex={-1}
            aria-label="Close menu"
          />
          <aside className="relative flex flex-col w-64 shadow-sidebar z-50">
            <SidebarNav onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 flex-shrink-0 no-print">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Public nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {["Home", "About", "Admissions", "Academics", "Calendar"].map(
              (link) => (
                <Link
                  key={link}
                  to={(link === "Home" ? "/" : `/${link.toLowerCase()}`) as any}
                  className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
                  data-ocid={`header.${link.toLowerCase()}.link`}
                >
                  {link}
                </Link>
              ),
            )}
          </nav>

          <div className="flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Bell className="h-4 w-4" />
              </Button>
              {notices.length > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
              )}
            </div>
            {/* Apps icon */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
