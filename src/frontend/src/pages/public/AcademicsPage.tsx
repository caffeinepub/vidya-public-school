import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookOpen,
  Calculator,
  Dumbbell,
  Globe,
  Microscope,
  Music,
} from "lucide-react";

const DEPARTMENTS = [
  {
    icon: Calculator,
    name: "Mathematics",
    desc: "CBSE Mathematics curriculum from fundamentals to advanced calculus, statistics, and applied maths.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Microscope,
    name: "Science",
    desc: "Physics, Chemistry, Biology with fully equipped labs for practical learning.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Globe,
    name: "Social Studies",
    desc: "History, Geography, Civics with project-based learning and current affairs.",
    color: "bg-orange-50 text-orange-600",
  },
  {
    icon: BookOpen,
    name: "Languages",
    desc: "English, Hindi, and Sanskrit taught with focus on communication and literature.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Music,
    name: "Arts & Music",
    desc: "Creative expression through visual arts, music, and performing arts.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: Dumbbell,
    name: "Physical Education",
    desc: "Sports, yoga, and fitness programs for holistic student development.",
    color: "bg-yellow-50 text-yellow-600",
  },
];

const CURRICULUM = [
  {
    class: "Class I – V",
    board: "CBSE",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "EVS",
      "GK",
      "Arts & Craft",
      "Physical Education",
    ],
  },
  {
    class: "Class VI – VIII",
    board: "CBSE",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Studies",
      "Sanskrit",
      "Computer",
    ],
  },
  {
    class: "Class IX – X",
    board: "CBSE",
    subjects: [
      "English",
      "Hindi",
      "Mathematics",
      "Science",
      "Social Studies",
      "Computer Science",
    ],
  },
  {
    class: "Class XI – XII",
    board: "CBSE",
    subjects: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology / Computer",
      "English",
    ],
  },
];

export default function AcademicsPage() {
  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Academics
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Academic Excellence</h1>
          <p className="text-primary-foreground/70 max-w-2xl">
            CBSE affiliated curriculum designed to build knowledge, skills, and
            character.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Departments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map((dept) => {
              const Icon = dept.icon;
              return (
                <Card key={dept.name}>
                  <CardContent className="p-6">
                    <div
                      className={`h-10 w-10 rounded-lg ${dept.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {dept.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{dept.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Curriculum Overview
          </h2>
          <div className="space-y-4">
            {CURRICULUM.map((item) => (
              <Card key={item.class}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-semibold text-foreground">
                      {item.class}
                    </h3>
                    <Badge variant="outline">{item.board}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.subjects.map((sub) => (
                      <Badge key={sub} variant="secondary" className="text-xs">
                        {sub}
                      </Badge>
                    ))}
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
