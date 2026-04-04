import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Building, ExternalLink, Home, Shield } from "lucide-react";

const PUBLIC_SECTIONS = [
  {
    title: "Public Pages",
    icon: Home,
    links: [
      { label: "Home", href: "/", desc: "School overview and highlights" },
      {
        label: "About Us",
        href: "/about",
        desc: "Our history, mission and vision",
      },
      {
        label: "Admissions",
        href: "/admissions",
        desc: "Admission process and requirements",
      },
      {
        label: "Academics",
        href: "/academics",
        desc: "Curriculum, classes and syllabus",
      },
      {
        label: "Faculty",
        href: "/faculty",
        desc: "Our dedicated teaching staff",
      },
      {
        label: "Contact",
        href: "/contact",
        desc: "Reach us by phone, email or visit",
      },
      {
        label: "Notice Board",
        href: "/notices",
        desc: "Latest announcements and notices",
      },
    ],
  },
  {
    title: "Staff Portal",
    icon: Building,
    links: [
      {
        label: "Staff Login",
        href: "/login",
        desc: "Secure login for school staff and administrators",
      },
    ],
  },
  {
    title: "Legal",
    icon: Shield,
    links: [
      {
        label: "Privacy Policy",
        href: "/privacy-policy",
        desc: "How we collect, use and protect your data",
      },
      {
        label: "Terms of Use",
        href: "/terms",
        desc: "Rules and terms governing use of this portal",
      },
      {
        label: "Sitemap",
        href: "/sitemap",
        desc: "This page — overview of all site sections",
      },
    ],
  },
];

export default function SitemapPage() {
  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Sitemap
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Site Map</h1>
          <p className="text-white/70">
            A complete overview of all pages available on this website.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {PUBLIC_SECTIONS.map((section) => {
              const SectionIcon = section.icon;
              return (
                <div key={section.title}>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <SectionIcon className="h-4 w-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.links.map((link) => (
                      <Link key={link.href} to={link.href as any}>
                        <Card className="hover:border-primary/40 transition-colors cursor-pointer">
                          <CardContent className="p-4 flex items-center gap-3">
                            <ExternalLink className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                            <div>
                              <div className="font-medium text-sm text-foreground">
                                {link.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {link.desc}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Vidya Public School. All rights
              reserved.
            </p>
            <p className="mt-1">
              Design &amp; Technology by{" "}
              <a
                href="https://www.summasion.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                ∑ Summasion
              </a>
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
