import { PublicLayout } from "@/components/PublicLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, CreditCard, FileText, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STEPS = [
  {
    icon: FileText,
    step: "1",
    title: "Fill Application",
    desc: "Complete the online application form with student and parent details.",
  },
  {
    icon: CreditCard,
    step: "2",
    title: "Pay Fee",
    desc: "Submit the application fee (₹500) online, by cash, or demand draft.",
  },
  {
    icon: Users,
    step: "3",
    title: "Entrance Assessment",
    desc: "Student appears for a short written test and interaction.",
  },
  {
    icon: CheckCircle,
    step: "4",
    title: "Admission Confirmed",
    desc: "Receive admission letter and complete enrollment formalities.",
  },
];

export default function AdmissionsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    studentName: "",
    dob: "",
    className: "",
    parentName: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.parentName || !form.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    setSubmitted(true);
    toast.success("Application submitted! We will contact you shortly.");
  };

  return (
    <PublicLayout>
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge className="mb-3 bg-white/20 text-white border-white/30">
            Admissions
          </Badge>
          <h1 className="text-3xl font-bold mb-3">Admissions Open 2024-25</h1>
          <p className="text-primary-foreground/70 max-w-2xl">
            Join the Vidya family. Applications are now open for all classes
            from I to XII.
          </p>
        </div>
      </div>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">
            Admission Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <Card key={step.step}>
                  <CardContent className="p-6 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <Badge variant="outline" className="mb-2">
                      Step {step.step}
                    </Badge>
                    <h3 className="font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Apply Online</h2>
            <p className="text-muted-foreground text-sm mt-2">
              Fill in the form and our admissions team will reach out to you.
            </p>
          </div>
          {submitted ? (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  Application Received!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Thank you for applying to Vidya Public School. Our admissions
                  team will contact you within 2-3 working days.
                </p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>Expected response within 2-3 working days</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input
                        id="studentName"
                        value={form.studentName}
                        onChange={(e) =>
                          setForm({ ...form, studentName: e.target.value })
                        }
                        placeholder="Full name"
                        data-ocid="admissions.studentName.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        type="date"
                        id="dob"
                        value={form.dob}
                        onChange={(e) =>
                          setForm({ ...form, dob: e.target.value })
                        }
                        data-ocid="admissions.dob.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="className">Applying for Class</Label>
                    <Input
                      id="className"
                      value={form.className}
                      onChange={(e) =>
                        setForm({ ...form, className: e.target.value })
                      }
                      placeholder="e.g., Class 9"
                      data-ocid="admissions.class.input"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input
                        id="parentName"
                        value={form.parentName}
                        onChange={(e) =>
                          setForm({ ...form, parentName: e.target.value })
                        }
                        placeholder="Full name"
                        data-ocid="admissions.parentName.input"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Mobile number"
                        data-ocid="admissions.phone.input"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      type="email"
                      id="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="email@example.com"
                      data-ocid="admissions.email.input"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={form.address}
                      onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                      }
                      placeholder="Full address"
                      rows={2}
                      data-ocid="admissions.address.textarea"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    data-ocid="admissions.submit.button"
                  >
                    Submit Application
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
