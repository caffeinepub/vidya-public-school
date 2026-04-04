import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { formatDate } from "@/utils/helpers";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  Calendar,
  GraduationCap,
  MapPin,
  Megaphone,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { label: "Students Enrolled", value: "1,200+", icon: Users },
  { label: "Qualified Teachers", value: "80+", icon: GraduationCap },
  { label: "Years of Excellence", value: "38+", icon: Award },
  { label: "Academic Programs", value: "15+", icon: BookOpen },
];

const PROGRAMS = [
  {
    name: "Primary (I–V)",
    desc: "Foundational learning with focus on literacy, numeracy, and creativity.",
    color: "bg-blue-50 border-blue-200",
  },
  {
    name: "Middle (VI–VIII)",
    desc: "Building critical thinking, science, arts, and social skills.",
    color: "bg-green-50 border-green-200",
  },
  {
    name: "Secondary (IX–X)",
    desc: "CBSE curriculum with board exam preparation and mentoring.",
    color: "bg-purple-50 border-purple-200",
  },
  {
    name: "Senior Secondary (XI–XII)",
    desc: "Science and Commerce streams with expert faculty guidance.",
    color: "bg-orange-50 border-orange-200",
  },
];

export default function HomePage() {
  const { notices } = useApp();
  const recentNotices = notices.slice(0, 3);

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden bg-primary"
        style={{ minHeight: 520 }}
      >
        <img
          src="/assets/hero-main-019d5a35-0edc-74df-90f6-ed08f5e6d622.jpeg"
          alt="Vidya Public School campus"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 text-xs">
              Est. 1985 · CBSE Affiliated
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Welcome to Vidya Public School
            </h1>
            <p className="text-white text-lg mb-8">
              Nurturing young minds with quality education, strong values, and a
              commitment to excellence. Shaping tomorrow's leaders today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/admissions">
                <Button
                  className="bg-white text-primary hover:bg-white/90 font-semibold"
                  data-ocid="hero.admissions.button"
                >
                  Apply for Admission <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button
                  variant="outline"
                  className="border-white/40 text-black hover:bg-white/10"
                  data-ocid="hero.about.button"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 py-5 px-6"
                >
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Academic Programs
            </h2>
            <p className="text-muted-foreground">
              Comprehensive education from primary to senior secondary level.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PROGRAMS.map((prog, i) => (
              <motion.div
                key={prog.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`border ${prog.color} h-full`}>
                  <CardContent className="p-5">
                    <div className="font-semibold text-foreground mb-2 text-sm">
                      {prog.name}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {prog.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Why Choose Vidya Public School?
              </h2>
              <p className="text-muted-foreground mb-6">
                For over three decades, we have been committed to providing a
                holistic education that blends academic rigour with character
                development.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: Star,
                    title: "Academic Excellence",
                    desc: "Consistently outstanding board results with personalised mentoring.",
                  },
                  {
                    icon: Users,
                    title: "Experienced Faculty",
                    desc: "80+ qualified teachers dedicated to student growth and learning.",
                  },
                  {
                    icon: BookOpen,
                    title: "Modern Curriculum",
                    desc: "CBSE curriculum enhanced with skill development and digital literacy.",
                  },
                  {
                    icon: MapPin,
                    title: "Excellent Infrastructure",
                    desc: "State-of-the-art labs, library, sports facilities, and smart classrooms.",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {item.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="/assets/hero-main-019d5a35-0edc-74df-90f6-ed08f5e6d622.jpeg"
                alt="School facilities"
                className="w-full h-72 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notices */}
      {recentNotices.length > 0 && (
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Latest Notices
                </h2>
                <p className="text-muted-foreground text-sm">
                  Important announcements from school administration.
                </p>
              </div>
              <Link to="/notices">
                <Button
                  variant="outline"
                  size="sm"
                  data-ocid="home.notices.button"
                >
                  View All
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentNotices.map((notice, i) => (
                <motion.div
                  key={notice.noticeId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Megaphone className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {formatDate(notice.postedDate)}
                        </div>
                      </div>
                      <h3 className="font-semibold text-sm text-foreground mb-2 line-clamp-2">
                        {notice.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {notice.content}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to Join Vidya Public School?
          </h2>
          <p className="text-white mb-6">
            Begin your child's journey toward a bright future. Apply for the
            2024-25 academic session today.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/admissions">
              <Button
                className="bg-white text-primary hover:bg-white/90"
                data-ocid="cta.admissions.button"
              >
                Apply Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                className="border-white/40 text-black hover:bg-white/10"
                data-ocid="cta.contact.button"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
