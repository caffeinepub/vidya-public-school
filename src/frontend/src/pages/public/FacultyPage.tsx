import { PublicLayout } from "@/components/PublicLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";

const STATIC_FACULTY = [
  {
    name: "Dr. Sanjana Maurya",
    role: "Principal",
    dept: "Administration",
    exp: "25 years",
    qual: "Ph.D. Education",
  },
  {
    name: "Prof. Suresh Mathur",
    role: "Senior Teacher",
    dept: "Mathematics",
    exp: "18 years",
    qual: "M.Sc. Mathematics",
  },
  {
    name: "Ms. Anjali Desai",
    role: "Teacher",
    dept: "Science",
    exp: "12 years",
    qual: "M.Sc. Physics",
  },
  {
    name: "Mr. Ravi Tiwari",
    role: "Accountant",
    dept: "Accounts",
    exp: "8 years",
    qual: "B.Com, CA Inter",
  },
  {
    name: "Mrs. Kavitha Rao",
    role: "Teacher",
    dept: "English",
    exp: "15 years",
    qual: "M.A. English",
  },
  {
    name: "Mr. Deepak Sharma",
    role: "Teacher",
    dept: "Social Studies",
    exp: "10 years",
    qual: "M.A. History",
  },
  {
    name: "Ms. Preethi Nair",
    role: "Teacher",
    dept: "Computer Science",
    exp: "9 years",
    qual: "M.Tech. CS",
  },
  {
    name: "Mr. Arun Khanna",
    role: "PT Teacher",
    dept: "Physical Education",
    exp: "14 years",
    qual: "B.P.Ed.",
  },
];

export default function FacultyPage() {
  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Our Team
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Meet Our Faculty</h1>
          <p className="text-primary-foreground/70 max-w-2xl">
            Dedicated educators committed to nurturing every student's
            potential.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STATIC_FACULTY.map((member) => {
              const initials = member.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              return (
                <Card key={member.name} className="text-center">
                  <CardContent className="p-6">
                    <Avatar className="h-16 w-16 mx-auto mb-4">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs mb-2">
                      {member.role}
                    </Badge>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{member.dept}</div>
                      <div>{member.qual}</div>
                      <div>Experience: {member.exp}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
