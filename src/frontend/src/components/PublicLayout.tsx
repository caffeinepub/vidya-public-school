import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const PUBLIC_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Admissions", href: "/admissions" },
  { label: "Academics", href: "/academics" },
  { label: "Faculty", href: "/faculty" },
  { label: "Contact", href: "/contact" },
  { label: "Notices", href: "/notices" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="bg-[oklch(0.24_0.07_240)] border-b border-white/10 sticky top-0 z-30 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <img
                src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                alt="VPS"
                className="h-9 w-9"
              />
              <span className="font-semibold text-white text-sm hidden sm:block">
                Vidya Public School
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              {PUBLIC_LINKS.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                      "text-sm px-3 py-1.5 rounded-md transition-colors",
                      isActive
                        ? "bg-white/20 text-white font-medium"
                        : "text-white/70 hover:text-white hover:bg-white/10",
                    )}
                    data-ocid={`public-nav.${link.label.toLowerCase()}.link`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1" />

            <Link to="/login">
              <Button
                size="sm"
                className="bg-white text-[oklch(0.24_0.07_240)] hover:bg-white/90 font-semibold"
                data-ocid="public-nav.login.button"
              >
                Staff Login
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/10"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile nav */}
          {open && (
            <nav className="md:hidden py-3 border-t border-white/10 flex flex-col gap-1">
              {PUBLIC_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm px-3 py-2 rounded-md text-white/70 hover:text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[oklch(0.18_0.06_240)] text-white py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <img
                  src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                  alt="VPS"
                  className="h-8 w-8"
                />
                <span className="font-semibold text-white">
                  Vidya Public School
                </span>
              </div>
              <p className="text-sm text-white/70">
                Nurturing excellence since 1985. Empowering students for a
                brighter future.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">
                Quick Links
              </h4>
              <div className="flex flex-col gap-1.5">
                {["About", "Admissions", "Academics", "Faculty", "Contact"].map(
                  (l) => (
                    <Link
                      key={l}
                      to={`/${l.toLowerCase()}` as any}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {l}
                    </Link>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">Contact</h4>
              <div className="text-sm text-white/70 space-y-1">
                <p>473X+PGM, Govindpur</p>
                <p>Uttarakhand 263160</p>
                <p>+91 522 4567890</p>
                <p>info@vidyaschool.edu.in</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-4 text-sm text-white/60">
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms of Use
              </Link>
              <Link to="/sitemap" className="hover:text-white">
                Sitemap
              </Link>
            </div>
            <p className="text-sm text-white/60">
              &copy; {new Date().getFullYear()} Vidya Public School. All rights
              reserved. Design &amp; Technology by{" "}
              <a
                href="https://www.summasion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                ∑ Summasion
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
