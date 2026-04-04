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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { exportToCSV, formatDate } from "@/utils/helpers";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Download,
  Eye,
  Pencil,
  Search,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export default function StudentsPage() {
  const { students, deleteStudent, classes } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const classOptions = [...new Set(classes.map((c) => c.className))];
  const sectionOptions = [
    ...new Set(
      classes
        .filter((c) => filterClass === "all" || c.className === filterClass)
        .map((c) => c.section),
    ),
  ];

  const filtered = students.filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase());
    const matchClass = filterClass === "all" || s.className === filterClass;
    const matchSection = filterSection === "all" || s.section === filterSection;
    return matchSearch && matchClass && matchSection;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = () => {
    if (!deleteId) return;
    deleteStudent(deleteId);
    setDeleteId(null);
    toast.success("Student deleted successfully");
  };

  const handleExport = () => {
    exportToCSV(
      filtered.map((s) => ({
        "Admission No": s.admissionNumber,
        Name: s.name,
        Class: s.className,
        Section: s.section,
        Parent: s.parentName,
        Contact: s.contact,
        "Admission Date": s.admissionDate,
      })),
      "students-report",
    );
    toast.success("Exported successfully");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Student Management
            </h1>
            <p className="text-sm text-muted-foreground">
              {students.length} students enrolled
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-ocid="students.export.button"
            >
              <Download className="h-3.5 w-3.5 mr-2" /> Export CSV
            </Button>
            <Link to="/students/new">
              <Button size="sm" data-ocid="students.add.button">
                <UserPlus className="h-3.5 w-3.5 mr-2" /> Add Student
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-xs">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by name, admission no or parent..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9"
                  data-ocid="students.search.input"
                />
              </div>
              <Select
                value={filterClass}
                onValueChange={(v) => {
                  setFilterClass(v);
                  setFilterSection("all");
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className="w-40"
                  data-ocid="students.class.select"
                >
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classOptions.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filterSection}
                onValueChange={(v) => {
                  setFilterSection(v);
                  setPage(1);
                }}
              >
                <SelectTrigger
                  className="w-36"
                  data-ocid="students.section.select"
                >
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sectionOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card className="shadow-card">
          <div className="table-wrapper">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">
                    Admission No
                  </TableHead>
                  <TableHead className="text-xs font-medium">Name</TableHead>
                  <TableHead className="text-xs font-medium">Class</TableHead>
                  <TableHead className="text-xs font-medium">Section</TableHead>
                  <TableHead className="text-xs font-medium">Parent</TableHead>
                  <TableHead className="text-xs font-medium">Contact</TableHead>
                  <TableHead className="text-xs font-medium">
                    Admission Date
                  </TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-12"
                      data-ocid="students.empty_state"
                    >
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">No students found</p>
                      <Link to="/students/new">
                        <Button size="sm" className="mt-3" variant="outline">
                          Add First Student
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((student, i) => (
                    <TableRow
                      key={student.admissionNumber}
                      data-ocid={`students.item.${i + 1}`}
                    >
                      <TableCell className="text-xs font-mono">
                        {student.admissionNumber}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {student.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.className}
                      </TableCell>
                      <TableCell className="text-sm">
                        {student.section}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.parentName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.contact}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(student.admissionDate)}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                          {student.active !== false ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              navigate({
                                to: `/students/${student.admissionNumber}`,
                              })
                            }
                            data-ocid={`students.view.button.${i + 1}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              navigate({
                                to: `/students/${student.admissionNumber}/edit`,
                              })
                            }
                            data-ocid={`students.edit.button.${i + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() =>
                                  setDeleteId(student.admissionNumber)
                                }
                                data-ocid={`students.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent data-ocid="students.delete.dialog">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Student
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{student.name}</strong>? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel data-ocid="students.delete.cancel_button">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDelete}
                                  className="bg-destructive text-destructive-foreground"
                                  data-ocid="students.delete.confirm_button"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  data-ocid="students.pagination_prev"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  data-ocid="students.pagination_next"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
