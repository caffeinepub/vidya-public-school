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
import type { Employee } from "@/types";
import { generateId } from "@/utils/helpers";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EmployeeFormPage({ mode }: { mode: "new" | "edit" }) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { empId?: string };
  const { employees, addEmployee, updateEmployee } = useApp();

  const existing =
    mode === "edit"
      ? employees.find((e) => e.empId === params.empId)
      : undefined;

  const [form, setForm] = useState<Partial<Employee>>({
    empId: existing?.empId ?? generateId("EMP"),
    name: existing?.name ?? "",
    role: existing?.role ?? "teacher",
    department: existing?.department ?? "",
    designation: existing?.designation ?? "",
    salary: existing?.salary ?? 0,
    active: existing?.active ?? true,
    contact: existing?.contact ?? "",
    email: existing?.email ?? "",
    joiningDate:
      existing?.joiningDate ?? new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.department?.trim()) e.department = "Department is required";
    if (!form.designation?.trim()) e.designation = "Designation is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (mode === "new") {
      addEmployee(form as Employee);
      toast.success("Employee added");
    } else {
      updateEmployee(params.empId!, form);
      toast.success("Employee updated");
    }
    navigate({ to: "/employees" });
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/employees" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">
            {mode === "new" ? "Add Employee" : "Edit Employee"}
          </h1>
        </div>
        <form onSubmit={handleSubmit}>
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-sm">Employee Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-0">
              <div>
                <Label>Employee ID</Label>
                <Input
                  value={form.empId}
                  onChange={(e) => setForm({ ...form, empId: e.target.value })}
                  readOnly={mode === "edit"}
                  data-ocid="emp-form.empId.input"
                />
              </div>
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  data-ocid="emp-form.name.input"
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) =>
                    setForm({ ...form, role: v as Employee["role"] })
                  }
                >
                  <SelectTrigger data-ocid="emp-form.role.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="supportStaff">Support Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Department *</Label>
                <Input
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  placeholder="e.g. Mathematics"
                  data-ocid="emp-form.dept.input"
                />
                {errors.department && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.department}
                  </p>
                )}
              </div>
              <div>
                <Label>Designation *</Label>
                <Input
                  value={form.designation}
                  onChange={(e) =>
                    setForm({ ...form, designation: e.target.value })
                  }
                  placeholder="e.g. Senior Teacher"
                  data-ocid="emp-form.designation.input"
                />
                {errors.designation && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.designation}
                  </p>
                )}
              </div>
              <div>
                <Label>Salary (₹)</Label>
                <Input
                  type="number"
                  value={form.salary}
                  onChange={(e) =>
                    setForm({ ...form, salary: Number(e.target.value) })
                  }
                  data-ocid="emp-form.salary.input"
                />
              </div>
              <div>
                <Label>Contact</Label>
                <Input
                  value={form.contact}
                  onChange={(e) =>
                    setForm({ ...form, contact: e.target.value })
                  }
                  placeholder="Phone number"
                  data-ocid="emp-form.contact.input"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="email@school.edu"
                  data-ocid="emp-form.email.input"
                />
              </div>
              <div>
                <Label>Joining Date</Label>
                <Input
                  type="date"
                  value={form.joiningDate}
                  onChange={(e) =>
                    setForm({ ...form, joiningDate: e.target.value })
                  }
                  data-ocid="emp-form.joiningDate.input"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Label>Active</Label>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  className="h-4 w-4"
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex gap-3">
            <Button type="submit" data-ocid="emp-form.submit.button">
              <Save className="h-4 w-4 mr-2" />
              {mode === "new" ? "Add Employee" : "Update Employee"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/employees" })}
              data-ocid="emp-form.cancel.button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
