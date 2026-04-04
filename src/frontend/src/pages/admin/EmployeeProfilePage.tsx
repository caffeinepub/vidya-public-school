import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Pencil } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  teacher: "Teacher",
  supportStaff: "Support Staff",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-blue-50 text-blue-700 border-blue-200",
  teacher: "bg-green-50 text-green-700 border-green-200",
  supportStaff: "bg-orange-50 text-orange-700 border-orange-200",
};

export default function EmployeeProfilePage() {
  const navigate = useNavigate();
  const { empId } = useParams({ strict: false }) as { empId: string };
  const { employees } = useApp();

  const emp = employees.find((e) => e.empId === empId);
  if (!emp) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Employee not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: "/employees" })}
          >
            Back
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const initials = emp.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            Employee Profile
          </h1>
          <div className="ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate({ to: `/employees/${empId}/edit` })}
              data-ocid="emp-profile.edit.button"
            >
              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
            </Button>
          </div>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-bold text-foreground text-lg">
                  {emp.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {emp.designation} &bull; {emp.department}
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge className={ROLE_COLORS[emp.role] ?? ""}>
                    {ROLE_LABELS[emp.role] ?? emp.role}
                  </Badge>
                  <Badge
                    className={
                      emp.active
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {emp.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Employee ID", value: emp.empId },
                { label: "Department", value: emp.department },
                { label: "Designation", value: emp.designation },
                { label: "Role", value: ROLE_LABELS[emp.role] ?? emp.role },
                { label: "Salary", value: formatCurrency(emp.salary) },
                {
                  label: "Joining Date",
                  value: emp.joiningDate ? formatDate(emp.joiningDate) : "--",
                },
                { label: "Contact", value: emp.contact ?? "--" },
                { label: "Email", value: emp.email ?? "--" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs text-muted-foreground mb-1">
                    {item.label}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
