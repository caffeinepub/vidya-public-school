import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Heart, Star, Target } from "lucide-react";

const TIMELINE = [
  {
    year: "1985",
    event: "Founded by visionary educationists with 120 students",
  },
  { year: "1992", event: "Affiliated with CBSE Board of Education" },
  { year: "1998", event: "New campus inaugurated with modern facilities" },
  { year: "2005", event: "Introduced Science stream in Senior Secondary" },
  { year: "2012", event: "Launched Digital Literacy program for all students" },
  { year: "2018", event: "Smart classrooms and STEM lab established" },
  {
    year: "2024",
    event: "Launched Vidya ERP for streamlined school management",
  },
];

const VALUES = [
  {
    icon: Target,
    title: "Mission",
    desc: "To provide quality education that develops the intellectual, social, emotional, and physical potential of every student in a safe and nurturing environment.",
  },
  {
    icon: Eye,
    title: "Vision",
    desc: "To be a leading educational institution that produces well-rounded, ethical, and globally competent citizens who contribute positively to society.",
  },
  {
    icon: Heart,
    title: "Values",
    desc: "Excellence, Integrity, Respect, Compassion, and Perseverance — the core values that guide every aspect of our school community.",
  },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            About Us
          </Badge>
          <h1 className="text-3xl font-bold mb-3">
            A Legacy of Educational Excellence
          </h1>
          <p className="text-primary-foreground/70 max-w-2xl">
            Since 1985, Vidya Public School has been shaping bright futures
            through quality education, strong values, and dedicated teaching.
          </p>
        </div>
      </div>

      {/* Mission / Vision */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="border">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
            Our Journey
          </h2>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-8">
              {TIMELINE.map((item) => (
                <div key={item.year} className="flex gap-6 items-start">
                  <div className="w-14 text-right">
                    <span className="text-sm font-bold text-primary">
                      {item.year}
                    </span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-primary border-4 border-white shadow-sm mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground pt-0.5">
                    {item.event}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-8">
            Achievements & Recognition
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Board Toppers",
                value: "120+",
                note: "Over the last decade",
              },
              {
                label: "Scholarship Winners",
                value: "300+",
                note: "State & national level",
              },
              {
                label: "Sports Champions",
                value: "50+",
                note: "District & state medals",
              },
              {
                label: "Alumni in IITs/IIMs",
                value: "80+",
                note: "Prestigious institutions",
              },
            ].map((item) => (
              <Card key={item.label} className="text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {item.value}
                  </div>
                  <div className="text-sm font-medium text-foreground mt-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.note}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
