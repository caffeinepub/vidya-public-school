import { AdminLayout } from "@/components/AdminLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Pencil,
} from "lucide-react";

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const { admNo } = useParams({ strict: false }) as { admNo: string };
  const { students, feePayments, marks, attendance } = useApp();

  const student = students.find((s) => s.admissionNumber === admNo);
  if (!student) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <p className="text-muted-foreground">Student not found.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate({ to: "/students" })}
          >
            Back to Students
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const studentPayments = feePayments.filter(
    (p) => p.studentAdmissionNumber === admNo,
  );
  const totalPaid = studentPayments.reduce((s, p) => s + p.amount, 0);
  const studentMarks = marks.filter((m) => m.studentAdmissionNumber === admNo);
  const studentAttendance = attendance.filter(
    (a) => a.studentAdmissionNumber === admNo,
  );
  const presentDays = studentAttendance.filter((a) => a.present).length;
  const initials = student.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <AdminLayout>
      <div className="p-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/students" })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">Student Profile</h1>
          <div className="ml-auto">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate({ to: `/students/${admNo}/edit` })}
              data-ocid="student-profile.edit.button"
            >
              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Profile card */}
          <Card className="shadow-card">
            <CardContent className="p-6 text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-bold text-foreground text-lg">
                {student.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {student.className} – {student.section}
              </p>
              <Badge className="bg-green-50 text-green-700 border-green-200">
                {student.active !== false ? "Active" : "Inactive"}
              </Badge>
              <div className="mt-4 text-left space-y-2">
                {[
                  { label: "Admission No", value: student.admissionNumber },
                  { label: "Parent", value: student.parentName },
                  { label: "Contact", value: student.contact },
                  { label: "Gender", value: student.gender || "--" },
                  { label: "Category", value: student.category || "--" },
                  {
                    label: "DOB",
                    value: student.dob ? formatDate(student.dob) : "--",
                  },
                  {
                    label: "Admission Date",
                    value: formatDate(student.admissionDate),
                  },
                  { label: "Address", value: student.address || "--" },
                ].map((item) => (
                  <div key={item.label} className="flex gap-2">
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-xs text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="text-center">
                <CardContent className="p-4">
                  <CreditCard className="h-5 w-5 text-green-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">
                    {formatCurrency(totalPaid)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Paid
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <BookOpen className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">
                    {studentMarks.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Subjects Marked
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-4">
                  <CalendarCheck className="h-5 w-5 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-foreground">
                    {presentDays}/{studentAttendance.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Attendance
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fee history */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Fee Payments
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: `/fees/${admNo}` })}
                    data-ocid="student-profile.fees.button"
                  >
                    View Ledger
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {studentPayments.length === 0 ? (
                  <div
                    className="px-4 pb-4 text-sm text-muted-foreground"
                    data-ocid="student-profile.fees.empty_state"
                  >
                    No payments recorded.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {studentPayments.slice(0, 4).map((p) => (
                      <div
                        key={p.receiptNumber}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-medium">
                            {p.receiptNumber}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(p.paymentDate)} &middot; {p.paymentMode}
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-green-600">
                          {formatCurrency(p.amount)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Marks */}
            <Card className="shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  Recent Marks
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate({ to: `/marks/${admNo}` })}
                    data-ocid="student-profile.marks.button"
                  >
                    Report Card
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {studentMarks.length === 0 ? (
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    No marks recorded.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {studentMarks.slice(0, 4).map((m) => (
                      <div
                        key={`${m.examId}-${m.subject}`}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div>
                          <div className="text-sm font-medium">{m.subject}</div>
                          <div className="text-xs text-muted-foreground">
                            {m.examId}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {m.marks}/100
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {m.grade}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
