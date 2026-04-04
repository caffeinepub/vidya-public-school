import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import type { Student } from "@/types";
import { generateId } from "@/utils/helpers";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function StudentFormPage({ mode }: { mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { admNo?: string };
  const { students, addStudent, updateStudent, classes } = useApp();

  const existing =
    mode === "edit"
      ? students.find((s) => s.admissionNumber === params.admNo)
      : undefined;

  const [form, setForm] = useState<Partial<Student>>({
    admissionNumber: existing?.admissionNumber ?? generateId("VPS"),
    name: existing?.name ?? "",
    className: existing?.className ?? "",
    section: existing?.section ?? "",
    parentName: existing?.parentName ?? "",
    contact: existing?.contact ?? "",
    admissionDate:
      existing?.admissionDate ?? new Date().toISOString().split("T")[0],
    gender: existing?.gender ?? "",
    address: existing?.address ?? "",
    dob: existing?.dob ?? "",
    category: existing?.category ?? "General",
    active: existing?.active ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const classOptions = [...new Set(classes.map((c) => c.className))];
  const sectionOptions = [
    ...new Set(
      classes
        .filter((c) => !form.className || c.className === form.className)
        .map((c) => c.section),
    ),
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.className) e.className = "Class is required";
    if (!form.section) e.section = "Section is required";
    if (!form.parentName?.trim()) e.parentName = "Parent name is required";
    if (!form.contact?.trim()) e.contact = "Contact is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === "new") {
      addStudent(form as Student);
      toast.success("Student added successfully");
    } else {
      updateStudent(params.admNo!, form);
      toast.success("Student updated successfully");
    }
    navigate({ to: "/students" });
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/students" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {mode === "new" ? "Add New Student" : "Edit Student"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "new"
                ? "Fill in the details to enrol a new student"
                : "Update student information"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="mb-4 shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
              <div>
                <Label htmlFor="admNo">Admission Number</Label>
                <Input
                  id="admNo"
                  value={form.admissionNumber}
                  onChange={(e) =>
                    setForm({ ...form, admissionNumber: e.target.value })
                  }
                  readOnly={mode === "edit"}
                  data-ocid="student-form.admNo.input"
                />
              </div>
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Student's full name"
                  data-ocid="student-form.name.input"
                />
                {errors.name && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="student-form.name.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <Label>Class *</Label>
                <Select
                  value={form.className}
                  onValueChange={(v) =>
                    setForm({ ...form, className: v, section: "" })
                  }
                >
                  <SelectTrigger data-ocid="student-form.class.select">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.className && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="student-form.class.error_state"
                  >
                    {errors.className}
                  </p>
                )}
              </div>
              <div>
                <Label>Section *</Label>
                <Select
                  value={form.section}
                  onValueChange={(v) => setForm({ ...form, section: v })}
                >
                  <SelectTrigger data-ocid="student-form.section.select">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.section && (
                  <p
                    className="text-xs text-destructive mt-1"
                    data-ocid="student-form.section.error_state"
                  >
                    {errors.section}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  type="date"
                  id="dob"
                  value={form.dob}
                  onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  data-ocid="student-form.dob.input"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <Select
                  value={form.gender}
                  onValueChange={(v) => setForm({ ...form, gender: v })}
                >
                  <SelectTrigger data-ocid="student-form.gender.select">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["General", "OBC", "SC", "ST", "EWS"].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="admDate">Admission Date</Label>
                <Input
                  type="date"
                  id="admDate"
                  value={form.admissionDate}
                  onChange={(e) =>
                    setForm({ ...form, admissionDate: e.target.value })
                  }
                  data-ocid="student-form.admDate.input"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4 shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">
                Parent & Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
              <div>
                <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                <Input
                  id="parentName"
                  value={form.parentName}
                  onChange={(e) =>
                    setForm({ ...form, parentName: e.target.value })
                  }
                  placeholder="Full name"
                  data-ocid="student-form.parentName.input"
                />
                {errors.parentName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.parentName}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="contact">Contact Number *</Label>
                <Input
                  id="contact"
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  placeholder="Mobile number"
                  data-ocid="student-form.contact.input"
                />
                {errors.contact && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.contact}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  placeholder="Full address"
                  data-ocid="student-form.address.input"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" data-ocid="student-form.submit.button">
              <Save className="h-4 w-4 mr-2" />
              {mode === "new" ? "Add Student" : "Update Student"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/students" })}
              data-ocid="student-form.cancel.button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
