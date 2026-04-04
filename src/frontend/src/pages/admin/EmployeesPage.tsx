import { AdminLayout } from "@/components/AdminLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/context/AppContext";
import { exportToCSV, formatCurrency } from "@/utils/helpers";
import { useNavigate } from "@tanstack/react-router";
import {
  Download,
  Eye,
  Pencil,
  Search,
  Trash2,
  UserCog,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export default function EmployeesPage() {
  const { employees, deleteEmployee } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = employees.filter((e) => {
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.empId.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || e.role === filterRole;
    return matchSearch && matchRole;
  });

  const handleDelete = () => {
    if (!deleteId) return;
    deleteEmployee(deleteId);
    setDeleteId(null);
    toast.success("Employee deleted");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Employee Management
            </h1>
            <p className="text-sm text-muted-foreground">
              {employees.length} staff members
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportToCSV(
                  filtered.map((e) => ({
                    ID: e.empId,
                    Name: e.name,
                    Role: e.role,
                    Dept: e.department,
                    Designation: e.designation,
                  })),
                  "employees",
                )
              }
              data-ocid="employees.export.button"
            >
              <Download className="h-3.5 w-3.5 mr-2" /> Export
            </Button>
            <Button
              size="sm"
              onClick={() => navigate({ to: "/employees/new" })}
              data-ocid="employees.add.button"
            >
              <UserPlus className="h-3.5 w-3.5 mr-2" /> Add Employee
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-xs">
          <CardContent className="p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-ocid="employees.search.input"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-40" data-ocid="employees.role.select">
                <SelectValue placeholder="All Roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
                <SelectItem value="supportStaff">Support Staff</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <div className="table-wrapper">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">Emp ID</TableHead>
                  <TableHead className="text-xs font-medium">Name</TableHead>
                  <TableHead className="text-xs font-medium">Role</TableHead>
                  <TableHead className="text-xs font-medium">
                    Department
                  </TableHead>
                  <TableHead className="text-xs font-medium">
                    Designation
                  </TableHead>
                  <TableHead className="text-xs font-medium">Salary</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-12"
                      data-ocid="employees.empty_state"
                    >
                      <UserCog className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No employees found
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((emp, i) => (
                    <TableRow
                      key={emp.empId}
                      data-ocid={`employees.item.${i + 1}`}
                    >
                      <TableCell className="text-xs font-mono">
                        {emp.empId}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {emp.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${ROLE_COLORS[emp.role] ?? ""}`}
                        >
                          {ROLE_LABELS[emp.role] ?? emp.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {emp.department}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {emp.designation}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(emp.salary)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            emp.active
                              ? "bg-green-50 text-green-700 border-green-200 text-xs"
                              : "bg-red-50 text-red-700 border-red-200 text-xs"
                          }
                        >
                          {emp.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              navigate({ to: `/employees/${emp.empId}` })
                            }
                            data-ocid={`employees.view.button.${i + 1}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              navigate({ to: `/employees/${emp.empId}/edit` })
                            }
                            data-ocid={`employees.edit.button.${i + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setDeleteId(emp.empId)}
                                data-ocid={`employees.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="employees.delete.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Employee
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{emp.name}</strong>?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="employees.delete.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground"
                                  data-ocid="employees.delete.confirm_button"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
