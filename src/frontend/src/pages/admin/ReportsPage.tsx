import { AdminLayout } from "@/components/AdminLayout";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "@/context/AppContext";
import { exportToCSV, formatCurrency, formatDate } from "@/utils/helpers";
import {
  BookOpen,
  CreditCard,
  Download,
  FileText,
  Printer,
  UserCog,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const REPORT_TYPES = [
  {
    id: "students",
    label: "Student List",
    icon: Users,
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "fees",
    label: "Fee Collection",
    icon: CreditCard,
    color: "bg-green-50 text-green-600",
  },
  {
    id: "dues",
    label: "Pending Dues",
    icon: CreditCard,
    color: "bg-red-50 text-red-600",
  },
  {
    id: "marks",
    label: "Marks Report",
    icon: BookOpen,
    color: "bg-purple-50 text-purple-600",
  },
  {
    id: "employees",
    label: "Employee Report",
    icon: UserCog,
    color: "bg-orange-50 text-orange-600",
  },
  {
    id: "attendance",
    label: "Attendance Report",
    icon: FileText,
    color: "bg-teal-50 text-teal-600",
  },
];

export default function ReportsPage() {
  const { students, employees, feePayments, marks, attendance, classes } =
    useApp();
  const [activeReport, setActiveReport] = useState("students");
  const [filterClass, setFilterClass] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const classOptions = [...new Set(classes.map((c) => c.className))];

  const filteredStudents = students.filter(
    (s) => filterClass === "all" || s.className === filterClass,
  );

  const filteredPayments = feePayments.filter((p) => {
    if (dateFrom && p.paymentDate < dateFrom) return false;
    if (dateTo && p.paymentDate > dateTo) return false;
    return true;
  });

  const totalCollected = filteredPayments.reduce((s, p) => s + p.amount, 0);

  const handleExport = () => {
    let data: Record<string, unknown>[] = [];
    let filename = activeReport;

    if (activeReport === "students") {
      data = filteredStudents.map((s) => ({
        "Admission No": s.admissionNumber,
        Name: s.name,
        Class: s.className,
        Section: s.section,
        Parent: s.parentName,
        Contact: s.contact,
        "Admission Date": s.admissionDate,
      }));
    } else if (activeReport === "fees") {
      data = filteredPayments.map((p) => ({
        "Receipt No": p.receiptNumber,
        "Admission No": p.studentAdmissionNumber,
        Date: p.paymentDate,
        Amount: p.amount,
        Mode: p.paymentMode,
      }));
    } else if (activeReport === "employees") {
      data = employees.map((e) => ({
        ID: e.empId,
        Name: e.name,
        Role: e.role,
        Dept: e.department,
        Designation: e.designation,
        Salary: e.salary,
        Status: e.active ? "Active" : "Inactive",
      }));
    }

    if (data.length === 0) {
      toast.error("No data to export");
      return;
    }
    exportToCSV(data, `${filename}-report`);
    toast.success("Report exported");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Reports</h1>
            <p className="text-sm text-muted-foreground">
              Generate and export school reports.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              data-ocid="reports.export.button"
            >
              <Download className="h-3.5 w-3.5 mr-2" /> Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              data-ocid="reports.print.button"
            >
              <Printer className="h-3.5 w-3.5 mr-2" /> Print
            </Button>
          </div>
        </div>

        {/* Report selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {REPORT_TYPES.map((rt) => {
            const Icon = rt.icon;
            return (
              <button
                type="button"
                key={rt.id}
                onClick={() => setActiveReport(rt.id)}
                className={`p-3 rounded-xl border text-center transition-all ${
                  activeReport === rt.id
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted"
                }`}
                data-ocid={`reports.${rt.id}.tab`}
              >
                <div
                  className={`h-8 w-8 rounded-lg ${rt.color} flex items-center justify-center mx-auto mb-2`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="text-xs font-medium text-foreground">
                  {rt.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-xs">
          <CardContent className="p-4 flex flex-wrap gap-4">
            {activeReport === "students" && (
              <Select value={filterClass} onValueChange={setFilterClass}>
                <SelectTrigger
                  className="w-44"
                  data-ocid="reports.class.select"
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
            )}
            {(activeReport === "fees" || activeReport === "dues") && (
              <>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="rep-from"
                    className="text-sm text-muted-foreground"
                  >
                    From:
                  </label>
                  <input
                    id="rep-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="border border-input rounded-lg px-2 py-1.5 text-sm bg-background"
                    data-ocid="reports.dateFrom.input"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="rep-to"
                    className="text-sm text-muted-foreground"
                  >
                    To:
                  </label>
                  <input
                    id="rep-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="border border-input rounded-lg px-2 py-1.5 text-sm bg-background"
                    data-ocid="reports.dateTo.input"
                  />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Report content */}
        {activeReport === "students" && (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Student List Report ({filteredStudents.length} students)
              </CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Admission No</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Class</TableHead>
                    <TableHead className="text-xs">Section</TableHead>
                    <TableHead className="text-xs">Parent</TableHead>
                    <TableHead className="text-xs">Contact</TableHead>
                    <TableHead className="text-xs">Admission Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((s, i) => (
                    <TableRow
                      key={s.admissionNumber}
                      data-ocid={`reports.students.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {s.admissionNumber}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-sm">{s.className}</TableCell>
                      <TableCell className="text-sm">{s.section}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.parentName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.contact}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(s.admissionDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeReport === "fees" && (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Fee Collection Report
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  Total: {formatCurrency(totalCollected)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Receipt No</TableHead>
                    <TableHead className="text-xs">Student</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs">Mode</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((p, i) => {
                    const student = students.find(
                      (s) => s.admissionNumber === p.studentAdmissionNumber,
                    );
                    return (
                      <TableRow
                        key={p.receiptNumber}
                        data-ocid={`reports.fees.item.${i + 1}`}
                      >
                        <TableCell className="font-mono text-xs">
                          {p.receiptNumber}
                        </TableCell>
                        <TableCell className="text-sm">
                          {student?.name ?? p.studentAdmissionNumber}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(p.paymentDate)}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-green-600">
                          {formatCurrency(p.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {p.paymentMode}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeReport === "employees" && (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Employee Report ({employees.length} staff)
              </CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Emp ID</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Role</TableHead>
                    <TableHead className="text-xs">Department</TableHead>
                    <TableHead className="text-xs">Designation</TableHead>
                    <TableHead className="text-xs">Salary</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((e, i) => (
                    <TableRow
                      key={e.empId}
                      data-ocid={`reports.employees.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {e.empId}
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {e.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {e.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.department}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.designation}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(e.salary)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            e.active
                              ? "bg-green-50 text-green-700 text-xs"
                              : "bg-red-50 text-red-700 text-xs"
                          }
                        >
                          {e.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeReport === "marks" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">Marks Report</CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Student</TableHead>
                    <TableHead className="text-xs">Exam</TableHead>
                    <TableHead className="text-xs">Subject</TableHead>
                    <TableHead className="text-xs">Marks</TableHead>
                    <TableHead className="text-xs">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {marks.map((m, i) => {
                    const student = students.find(
                      (s) => s.admissionNumber === m.studentAdmissionNumber,
                    );
                    return (
                      <TableRow
                        key={`${m.studentAdmissionNumber}-${m.examId}-${m.subject}`}
                        data-ocid={`reports.marks.item.${i + 1}`}
                      >
                        <TableCell className="text-sm">
                          {student?.name ?? m.studentAdmissionNumber}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {m.examId}
                        </TableCell>
                        <TableCell className="text-sm">{m.subject}</TableCell>
                        <TableCell className="text-sm font-medium">
                          {m.marks}/100
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {m.grade}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeReport === "attendance" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">Attendance Report</CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Student</TableHead>
                    <TableHead className="text-xs">Class</TableHead>
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((a, i) => {
                    const student = students.find(
                      (s) => s.admissionNumber === a.studentAdmissionNumber,
                    );
                    return (
                      <TableRow
                        key={`${a.studentAdmissionNumber}-${a.date}`}
                        data-ocid={`reports.attendance.item.${i + 1}`}
                      >
                        <TableCell className="text-sm">
                          {student?.name ?? a.studentAdmissionNumber}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {a.className} {a.section}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(a.date)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              a.present
                                ? "bg-green-50 text-green-700 text-xs"
                                : "bg-red-50 text-red-700 text-xs"
                            }
                          >
                            {a.present ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {activeReport === "dues" && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm">Pending Dues Report</CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Student</TableHead>
                    <TableHead className="text-xs">Class</TableHead>
                    <TableHead className="text-xs">Total Fee</TableHead>
                    <TableHead className="text-xs">Paid</TableHead>
                    <TableHead className="text-xs">Outstanding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((s, i) => {
                    const classInfo = classes.find(
                      (c) =>
                        c.className === s.className && c.section === s.section,
                    );
                    const totalFee = classInfo
                      ? classInfo.feeStructure.tuition +
                        classInfo.feeStructure.transport +
                        classInfo.feeStructure.examFees
                      : 0;
                    const paid = feePayments
                      .filter(
                        (p) => p.studentAdmissionNumber === s.admissionNumber,
                      )
                      .reduce((sum, p) => sum + p.amount, 0);
                    const outstanding = Math.max(0, totalFee - paid);
                    if (outstanding <= 0) return null;
                    return (
                      <TableRow
                        key={s.admissionNumber}
                        data-ocid={`reports.dues.item.${i + 1}`}
                      >
                        <TableCell className="text-sm font-medium">
                          {s.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {s.className} {s.section}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(totalFee)}
                        </TableCell>
                        <TableCell className="text-sm text-green-600">
                          {formatCurrency(paid)}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-red-600">
                          {formatCurrency(outstanding)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
