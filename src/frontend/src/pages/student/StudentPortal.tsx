import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import type { FeePayment, HomeworkSubmission, StudentDocument } from "@/types";
import {
  formatCurrency,
  formatDate,
  generateReceiptNumber,
} from "@/utils/helpers";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  Megaphone,
  MessageSquare,
  Printer,
  Receipt,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Section =
  | "overview"
  | "profile"
  | "results"
  | "attendance"
  | "fees"
  | "receipts"
  | "notices"
  | "homework"
  | "remarks"
  | "documents";

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "profile", label: "My Profile", icon: User },
  { id: "results", label: "Results", icon: GraduationCap },
  { id: "attendance", label: "Attendance", icon: CalendarCheck },
  { id: "fees", label: "Fees & Pay", icon: CreditCard },
  { id: "receipts", label: "Receipts", icon: Receipt },
  { id: "notices", label: "Notices", icon: Megaphone },
  { id: "homework", label: "Homework", icon: BookOpen },
  { id: "remarks", label: "Remarks", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FileText },
];

function gradeColor(grade: string) {
  if (grade.startsWith("A"))
    return "bg-green-50 text-green-700 border-green-200";
  if (grade.startsWith("B")) return "bg-blue-50 text-blue-700 border-blue-200";
  if (grade.startsWith("C"))
    return "bg-yellow-50 text-yellow-700 border-yellow-200";
  return "bg-red-50 text-red-700 border-red-200";
}

export default function StudentPortal() {
  const navigate = useNavigate();
  const {
    session,
    setSession,
    students,
    marks,
    feePayments,
    attendance,
    notices,
    exams,
    classes,
    homework,
    remarks,
    documents,
    homeworkSubmissions,
    addFeePayment,
    addHomeworkSubmission,
    updateHomeworkSubmission,
  } = useApp();

  const [activeSection, setActiveSection] = useState<Section>("overview");

  // Fee payment dialog
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payMode, setPayMode] = useState<"online" | "upi" | "card">("online");
  const [payLoading, setPayLoading] = useState(false);

  // Receipt preview
  const [receiptPreview, setReceiptPreview] = useState<FeePayment | null>(null);

  // Document preview
  const [docPreview, setDocPreview] = useState<StudentDocument | null>(null);

  // Homework submission dialog
  const [submitHwId, setSubmitHwId] = useState<string | null>(null);
  const [submitNote, setSubmitNote] = useState("");

  // Results filter
  const [selectedExamId, setSelectedExamId] = useState<string>("all");

  const admNo = session?.admissionNumber ?? "";
  const student = students.find((s) => s.admissionNumber === admNo);

  const handleLogout = () => {
    setSession(null);
    navigate({ to: "/login" });
  };

  if (!session || session.role !== "student" || !student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Session expired. Please log in again.
          </p>
          <Button className="mt-4" onClick={() => navigate({ to: "/login" })}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Scoped data
  const myMarks = marks.filter((m) => m.studentAdmissionNumber === admNo);
  const myPayments = feePayments.filter(
    (p) => p.studentAdmissionNumber === admNo,
  );
  const myAttendance = attendance.filter(
    (a) => a.studentAdmissionNumber === admNo,
  );
  const myRemarks = remarks.filter((r) => r.studentAdmissionNumber === admNo);
  const myDocuments = documents.filter(
    (d) => d.studentAdmissionNumber === admNo,
  );
  const myHomework = homework.filter(
    (h) => h.className === student.className && h.section === student.section,
  );
  const myExams = exams.filter(
    (e) => e.className === student.className && e.section === student.section,
  );
  const classInfo = classes.find(
    (c) => c.className === student.className && c.section === student.section,
  );

  const totalFee = classInfo
    ? classInfo.feeStructure.tuition +
      classInfo.feeStructure.transport +
      classInfo.feeStructure.examFees
    : 0;
  const totalPaid = myPayments.reduce(
    (s, p) => s + p.amount - (p.discount ?? 0),
    0,
  );
  const outstanding = Math.max(0, totalFee - totalPaid);
  const attendancePercent =
    myAttendance.length > 0
      ? Math.round(
          (myAttendance.filter((a) => a.present).length / myAttendance.length) *
            100,
        )
      : 0;

  const nextExam = myExams
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const latestNotice = notices[0];

  // Filtered marks for results
  const filteredMarks =
    selectedExamId === "all"
      ? myMarks
      : myMarks.filter((m) => m.examId === selectedExamId);
  const examForFiltered =
    selectedExamId !== "all"
      ? myExams.find((e) => e.examId === selectedExamId)
      : null;
  const totalMarksSum = filteredMarks.reduce((s, m) => s + m.marks, 0);
  const maxMarksSum = filteredMarks.length * 100;
  const percentage =
    maxMarksSum > 0 ? Math.round((totalMarksSum / maxMarksSum) * 100) : 0;

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setPayLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const receipt: FeePayment = {
      receiptNumber: generateReceiptNumber(),
      studentAdmissionNumber: admNo,
      paymentDate: new Date().toISOString().split("T")[0],
      amount: amt,
      paymentMode: payMode,
      balance: Math.max(0, outstanding - amt),
      remarks: "Online payment via student portal",
    };
    addFeePayment(receipt);
    setPayDialogOpen(false);
    setPayAmount("");
    setPayLoading(false);
    toast.success(
      `Payment of ${formatCurrency(amt)} recorded. Receipt: ${receipt.receiptNumber}`,
    );
  };

  const initials = student.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const today = new Date().toISOString().split("T")[0];

  // Render section content
  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Welcome */}
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary-foreground/20 flex items-center justify-center text-xl font-bold">
                  {initials}
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    Welcome back, {student.name.split(" ")[0]}!
                  </h2>
                  <p className="text-primary-foreground/80 text-sm">
                    {student.className} &bull; Section {student.section} &bull;{" "}
                    {student.admissionNumber}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-5">
                  <div className="text-2xl font-bold text-foreground">
                    {attendancePercent}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Attendance
                  </div>
                  <div
                    className={`text-xs mt-1 font-medium ${attendancePercent >= 75 ? "text-green-600" : "text-red-600"}`}
                  >
                    {attendancePercent >= 75 ? "Good" : "Low attendance"}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(outstanding)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Pending Fees
                  </div>
                  {outstanding > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection("fees");
                        setPayDialogOpen(true);
                      }}
                      className="text-xs mt-1 font-medium text-primary underline"
                    >
                      Pay now
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="text-lg font-bold text-foreground truncate">
                    {nextExam ? nextExam.name : "No exams"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Next Exam
                  </div>
                  {nextExam && (
                    <div className="text-xs mt-1 text-muted-foreground">
                      {formatDate(nextExam.date)}
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="text-sm font-semibold text-foreground line-clamp-2">
                    {latestNotice ? latestNotice.title : "No notices"}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Latest Notice
                  </div>
                  {latestNotice && (
                    <div className="text-xs mt-1 text-muted-foreground">
                      {formatDate(latestNotice.postedDate)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                Quick Access
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {NAV_ITEMS.filter((n) => n.id !== "overview").map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg border border-border hover:bg-muted transition-colors text-center"
                  >
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-foreground font-medium">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="max-w-2xl">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {student.name}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      {student.className} &bull; Section {student.section}
                    </p>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {student.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <Separator className="mb-5" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {[
                    {
                      label: "Admission Number",
                      value: student.admissionNumber,
                    },
                    {
                      label: "Date of Birth",
                      value: student.dob ? formatDate(student.dob) : "N/A",
                    },
                    { label: "Gender", value: student.gender ?? "N/A" },
                    { label: "Category", value: student.category ?? "N/A" },
                    { label: "Parent / Guardian", value: student.parentName },
                    { label: "Contact", value: student.contact },
                    { label: "Address", value: student.address ?? "N/A" },
                    {
                      label: "Admission Date",
                      value: formatDate(student.admissionDate),
                    },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <span className="text-muted-foreground block text-xs mb-0.5">
                        {label}
                      </span>
                      <span className="font-medium text-foreground">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
                <Separator className="my-5" />
                <div className="flex justify-end no-print">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5 mr-2" /> Print Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "results": {
        const overallGrade =
          percentage >= 90
            ? "A+"
            : percentage >= 80
              ? "A"
              : percentage >= 70
                ? "B+"
                : percentage >= 60
                  ? "B"
                  : percentage >= 50
                    ? "C"
                    : "D";
        return (
          <div className="space-y-4">
            {/* Filter controls — hidden when printing */}
            <div className="flex flex-wrap items-center gap-3 no-print">
              <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Select Exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {myExams.map((e) => (
                    <SelectItem key={e.examId} value={e.examId}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {examForFiltered && (
                <span className="text-sm text-muted-foreground">
                  {formatDate(examForFiltered.date)}
                </span>
              )}
            </div>

            {filteredMarks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No results available.
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Printable Report Card */}
                <div
                  id="print-report-card"
                  className="border border-border rounded-lg p-6 bg-card"
                >
                  {/* Report Card Header */}
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                      alt="VPS"
                      className="h-10 w-10"
                    />
                    <div>
                      <div className="font-bold text-foreground text-base">
                        Vidya Public School
                      </div>
                      <div className="text-xs text-muted-foreground">
                        473X+PGM, Gadarpur, Govindpur, Uttarakhand 263160
                      </div>
                    </div>
                  </div>
                  <Separator className="mb-3" />
                  <div className="text-center mb-4">
                    <h2 className="text-base font-bold uppercase tracking-wide text-foreground">
                      Report Card
                    </h2>
                    {examForFiltered && (
                      <p className="text-xs text-muted-foreground">
                        {examForFiltered.name} —{" "}
                        {formatDate(examForFiltered.date)}
                      </p>
                    )}
                  </div>
                  {/* Student Info */}
                  <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Student Name
                      </span>
                      <span className="font-semibold text-foreground">
                        {student.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Admission No
                      </span>
                      <span className="font-semibold text-foreground">
                        {student.admissionNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">
                        Class / Section
                      </span>
                      <span className="font-semibold text-foreground">
                        {student.className} – {student.section}
                      </span>
                    </div>
                  </div>
                  <Separator className="mb-4" />

                  {/* Marks Table */}
                  <div className="table-wrapper">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Subject</TableHead>
                          {selectedExamId === "all" && (
                            <TableHead>Exam</TableHead>
                          )}
                          <TableHead className="text-center">Marks</TableHead>
                          <TableHead className="text-center">Max</TableHead>
                          <TableHead className="text-center">%</TableHead>
                          <TableHead className="text-center">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMarks.map((m) => {
                          const exam = myExams.find(
                            (e) => e.examId === m.examId,
                          );
                          return (
                            <TableRow key={`${m.examId}-${m.subject}`}>
                              <TableCell className="font-medium">
                                {m.subject}
                              </TableCell>
                              {selectedExamId === "all" && (
                                <TableCell className="text-muted-foreground text-sm">
                                  {exam?.name ?? m.examId}
                                </TableCell>
                              )}
                              <TableCell className="text-center font-semibold">
                                {m.marks}
                              </TableCell>
                              <TableCell className="text-center text-muted-foreground">
                                100
                              </TableCell>
                              <TableCell className="text-center text-muted-foreground">
                                {m.marks}%
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge
                                  className={`text-xs ${gradeColor(m.grade)}`}
                                >
                                  {m.grade}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="border border-border rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-foreground">
                        {totalMarksSum}/{maxMarksSum}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Total Marks
                      </div>
                    </div>
                    <div className="border border-border rounded-lg p-4 text-center">
                      <div className="text-xl font-bold text-foreground">
                        {percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Percentage
                      </div>
                    </div>
                    <div className="border border-border rounded-lg p-4 text-center">
                      <div
                        className={`text-xl font-bold ${gradeColor(overallGrade).split(" ")[1]}`}
                      >
                        {overallGrade}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Overall Grade
                      </div>
                    </div>
                  </div>

                  {/* Report Card Footer */}
                  <Separator className="mt-6 mb-4" />
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-muted-foreground mb-6">
                        Authorised Signatory
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Principal's Seal
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">
                        Academic Year
                      </div>
                      <div className="text-sm font-medium text-foreground">
                        2024–2025
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-xs text-muted-foreground mt-3">
                    This is a computer-generated document.
                  </div>
                </div>

                <div className="flex justify-end no-print">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-3.5 w-3.5 mr-2" /> Print Report Card
                  </Button>
                </div>
              </>
            )}
          </div>
        );
      }

      case "attendance": {
        const present = myAttendance.filter((a) => a.present).length;
        const absent = myAttendance.length - present;
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {present}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Present
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <div className="text-2xl font-bold text-red-500">
                    {absent}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Absent
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <div
                    className={`text-2xl font-bold ${attendancePercent >= 75 ? "text-green-600" : "text-red-500"}`}
                  >
                    {attendancePercent}%
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Attendance %
                  </div>
                </CardContent>
              </Card>
            </div>
            {attendancePercent < 75 && (
              <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  Your attendance is below 75%. Please ensure regular attendance
                  to avoid debarment from exams.
                </span>
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Attendance Log</CardTitle>
              </CardHeader>
              <div className="table-wrapper">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Date</TableHead>
                      <TableHead>Day</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myAttendance
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .map((a) => (
                        <TableRow key={a.date}>
                          <TableCell>{formatDate(a.date)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {new Date(a.date).toLocaleDateString("en-IN", {
                              weekday: "long",
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`text-xs ${
                                a.present
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              }`}
                            >
                              {a.present ? "Present" : "Absent"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        );
      }

      case "fees":
        return (
          <div className="space-y-4">
            {/* Fee structure */}
            {classInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Fee Structure</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span className="text-muted-foreground">Tuition Fee</span>
                      <span className="font-medium">
                        {formatCurrency(classInfo.feeStructure.tuition)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-border">
                      <span className="text-muted-foreground">
                        Transport Fee
                      </span>
                      <span className="font-medium">
                        {formatCurrency(classInfo.feeStructure.transport)}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-muted-foreground">Exam Fees</span>
                      <span className="font-medium">
                        {formatCurrency(classInfo.feeStructure.examFees)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Balance summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-5 text-center">
                  <div className="text-xl font-bold">
                    {formatCurrency(totalFee)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Total Fee
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <div className="text-xl font-bold text-green-600">
                    {formatCurrency(totalPaid)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Paid</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5 text-center">
                  <div
                    className={`text-xl font-bold ${outstanding > 0 ? "text-red-600" : "text-green-600"}`}
                  >
                    {formatCurrency(outstanding)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Outstanding
                  </div>
                </CardContent>
              </Card>
            </div>

            {outstanding > 0 && (
              <Button
                onClick={() => setPayDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                <CreditCard className="h-4 w-4 mr-2" /> Pay Fees Now
              </Button>
            )}

            {/* Payment history */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Payment History</CardTitle>
              </CardHeader>
              <div className="table-wrapper">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Receipt No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myPayments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No payments recorded.
                        </TableCell>
                      </TableRow>
                    ) : (
                      myPayments.map((p) => (
                        <TableRow key={p.receiptNumber}>
                          <TableCell className="font-mono text-xs">
                            {p.receiptNumber}
                          </TableCell>
                          <TableCell>{formatDate(p.paymentDate)}</TableCell>
                          <TableCell className="font-semibold text-green-600">
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
                          <TableCell className="text-muted-foreground text-sm">
                            {p.remarks ?? "--"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Pay dialog */}
            <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
              <DialogContent className="max-w-sm">
                <DialogHeader>
                  <DialogTitle>Pay School Fees</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePayNow} className="space-y-4">
                  <div>
                    <Label>Amount (₹)</Label>
                    <Input
                      type="number"
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder={String(outstanding)}
                    />
                    {outstanding > 0 && (
                      <button
                        type="button"
                        onClick={() => setPayAmount(String(outstanding))}
                        className="text-xs text-primary mt-1 underline"
                      >
                        Pay full outstanding ({formatCurrency(outstanding)})
                      </button>
                    )}
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <Select
                      value={payMode}
                      onValueChange={(v) => setPayMode(v as typeof payMode)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="online">Online Banking</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                        <SelectItem value="card">
                          Debit / Credit Card
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={payLoading}
                  >
                    {payLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      "Confirm Payment"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "receipts":
        return (
          <div className="space-y-4">
            {myPayments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No receipts found.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {myPayments.map((p) => (
                  <Card key={p.receiptNumber}>
                    <CardContent className="p-4 flex flex-wrap items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm font-semibold">
                          {p.receiptNumber}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(p.paymentDate)} &bull; {p.paymentMode}
                        </div>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(p.amount)}
                      </div>
                      {p.discount ? (
                        <div className="text-xs text-muted-foreground">
                          Disc: {formatCurrency(p.discount)}
                        </div>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReceiptPreview(p)}
                      >
                        <Printer className="h-3.5 w-3.5 mr-1" /> Print
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Receipt print dialog */}
            <Dialog
              open={!!receiptPreview}
              onOpenChange={(o) => !o && setReceiptPreview(null)}
            >
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Fee Receipt</DialogTitle>
                </DialogHeader>
                {receiptPreview && (
                  <div
                    className="border border-border rounded-lg p-5 text-sm"
                    id="portal-receipt"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                        alt="VPS"
                        className="h-10 w-10"
                      />
                      <div>
                        <div className="font-bold text-foreground">
                          Vidya Public School
                        </div>
                        <div className="text-xs text-muted-foreground">
                          473X+PGM, Gadarpur, Govindpur, Uttarakhand 263160
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-xs text-muted-foreground">
                          Receipt No
                        </div>
                        <div className="font-mono font-semibold">
                          {receiptPreview.receiptNumber}
                        </div>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Student
                        </span>
                        <div className="font-medium">{student.name}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Admission No
                        </span>
                        <div className="font-medium">
                          {student.admissionNumber}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Class
                        </span>
                        <div className="font-medium">
                          {student.className} {student.section}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Date
                        </span>
                        <div className="font-medium">
                          {formatDate(receiptPreview.paymentDate)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Amount Paid
                        </span>
                        <div className="font-semibold text-green-600">
                          {formatCurrency(receiptPreview.amount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Payment Mode
                        </span>
                        <div className="capitalize font-medium">
                          {receiptPreview.paymentMode}
                        </div>
                      </div>
                      {receiptPreview.remarks && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground text-xs">
                            Remarks
                          </span>
                          <div>{receiptPreview.remarks}</div>
                        </div>
                      )}
                    </div>
                    <Separator className="mb-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Authorised Signatory
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                      >
                        <Printer className="h-3.5 w-3.5 mr-2" /> Print
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );

      case "notices":
        return (
          <div className="space-y-3">
            {notices.map((n) => (
              <Card key={n.noticeId}>
                <CardContent className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{n.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(n.postedDate)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {n.content}
                  </p>
                  <div className="text-xs text-muted-foreground mt-3">
                    Posted by: {n.postedBy}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "homework":
        return (
          <div className="space-y-3">
            {myHomework.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No homework assigned.
                </CardContent>
              </Card>
            ) : (
              myHomework.map((hw) => {
                const due = hw.dueDate;
                const isOverdue = due < today;
                const isDueSoon =
                  !isOverdue &&
                  due <=
                    new Date(new Date().getTime() + 3 * 86400000)
                      .toISOString()
                      .split("T")[0];

                const mySub: HomeworkSubmission | undefined =
                  homeworkSubmissions.find(
                    (s) =>
                      s.homeworkId === hw.homeworkId &&
                      s.studentAdmissionNumber === admNo,
                  );

                const isSubmitted =
                  mySub?.status === "submitted" || mySub?.status === "graded";

                return (
                  <Card key={hw.homeworkId}>
                    <CardContent className="p-5">
                      <div className="flex flex-wrap items-start gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {hw.subject}
                        </Badge>
                        {isOverdue && (
                          <Badge className="text-xs bg-red-50 text-red-700 border-red-200">
                            Overdue
                          </Badge>
                        )}
                        {isDueSoon && (
                          <Badge className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                            Due Soon
                          </Badge>
                        )}
                        {/* Submission status badge */}
                        {mySub?.status === "graded" ? (
                          <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
                            Graded{mySub.grade ? `: ${mySub.grade}` : ""}
                          </Badge>
                        ) : mySub?.status === "submitted" ? (
                          <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            Submitted
                          </Badge>
                        ) : (
                          <Badge className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                            Not Submitted
                          </Badge>
                        )}
                        <span className="ml-auto text-xs text-muted-foreground">
                          Due: {formatDate(hw.dueDate)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">
                        {hw.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {hw.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        Assigned by: {hw.postedBy}
                      </div>

                      {/* Teacher feedback (if graded) */}
                      {mySub?.status === "graded" && mySub.teacherComment && (
                        <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 text-sm">
                          <div className="font-medium text-green-800 text-xs mb-1">
                            Teacher's Feedback
                          </div>
                          <p className="text-green-700">
                            {mySub.teacherComment}
                          </p>
                          {mySub.grade && (
                            <div className="mt-1 text-xs font-semibold text-green-800">
                              Grade: {mySub.grade}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Submit button */}
                      <div className="mt-3">
                        {isSubmitted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="text-xs text-muted-foreground"
                          >
                            ✓ Submitted
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => setSubmitHwId(hw.homeworkId)}
                            data-ocid="homework.submit_button"
                          >
                            Submit Homework
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}

            {/* Submit Homework Dialog */}
            <Dialog
              open={!!submitHwId}
              onOpenChange={(o) => {
                if (!o) {
                  setSubmitHwId(null);
                  setSubmitNote("");
                }
              }}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Submit Homework</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <p className="text-sm text-muted-foreground">
                    {homework.find((h) => h.homeworkId === submitHwId)?.title}
                  </p>
                  <div className="space-y-1.5">
                    <Label>Note / Remarks (optional)</Label>
                    <Textarea
                      value={submitNote}
                      onChange={(e) => setSubmitNote(e.target.value)}
                      rows={3}
                      placeholder="Any notes for your teacher..."
                      data-ocid="homework.textarea"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitHwId(null);
                      setSubmitNote("");
                    }}
                    data-ocid="homework.cancel_button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (!submitHwId) return;
                      const existing = homeworkSubmissions.find(
                        (s) =>
                          s.homeworkId === submitHwId &&
                          s.studentAdmissionNumber === admNo,
                      );
                      const submittedToday = new Date()
                        .toISOString()
                        .split("T")[0];
                      if (existing) {
                        updateHomeworkSubmission(existing.submissionId, {
                          status: "submitted",
                          submittedDate: submittedToday,
                          note: submitNote,
                        });
                      } else {
                        addHomeworkSubmission({
                          submissionId: `SUB${Date.now()}`,
                          homeworkId: submitHwId,
                          studentAdmissionNumber: admNo,
                          status: "submitted",
                          submittedDate: submittedToday,
                          note: submitNote,
                        });
                      }
                      toast.success("Homework submitted successfully!");
                      setSubmitHwId(null);
                      setSubmitNote("");
                    }}
                    data-ocid="homework.submit_button"
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        );

      case "remarks":
        return (
          <div className="space-y-4">
            {myRemarks.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No remarks available.
                </CardContent>
              </Card>
            ) : (
              myRemarks.map((r) => (
                <Card key={r.remarkId}>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                        {r.term}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(r.date)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {r.remarkText}
                    </p>
                    <div className="text-xs text-muted-foreground mt-3">
                      By: {r.postedBy}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );

      case "documents":
        return (
          <div className="space-y-3">
            {myDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center text-muted-foreground">
                  No documents available.
                </CardContent>
              </Card>
            ) : (
              <Card>
                <div className="table-wrapper">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Document</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Date Issued</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myDocuments.map((d) => (
                        <TableRow key={d.docId}>
                          <TableCell className="font-medium">
                            {d.title}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {d.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(d.dateIssued)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => setDocPreview(d)}
                              data-ocid="documents.open_modal_button"
                            >
                              <Download className="h-3 w-3 mr-1" /> Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}

            {/* Document Preview Dialog */}
            <Dialog
              open={!!docPreview}
              onOpenChange={(o) => !o && setDocPreview(null)}
            >
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Document Preview</DialogTitle>
                </DialogHeader>
                {docPreview && (
                  <div
                    className="border border-border rounded-lg p-5 text-sm"
                    id="doc-preview-print"
                  >
                    {/* School header */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                        alt="VPS"
                        className="h-10 w-10"
                      />
                      <div>
                        <div className="font-bold text-foreground">
                          Vidya Public School
                        </div>
                        <div className="text-xs text-muted-foreground">
                          473X+PGM, Gadarpur, Govindpur, Uttarakhand 263160
                        </div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-xs text-muted-foreground">
                          Document No
                        </div>
                        <div className="font-mono font-semibold">
                          {docPreview.docId}
                        </div>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    {/* Document info grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Student
                        </span>
                        <div className="font-medium">{student.name}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Admission No
                        </span>
                        <div className="font-medium">
                          {student.admissionNumber}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Class
                        </span>
                        <div className="font-medium">
                          {student.className} – {student.section}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground text-xs">
                          Date Issued
                        </span>
                        <div className="font-medium">
                          {formatDate(docPreview.dateIssued)}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-xs">
                          Document Title
                        </span>
                        <div className="font-medium">{docPreview.title}</div>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground text-xs">
                          Document Type
                        </span>
                        <div>
                          <Badge variant="outline" className="text-xs">
                            {docPreview.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Separator className="mb-4" />
                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-muted-foreground mb-6">
                          Authorised Signatory
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Principal's Seal
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.print()}
                        data-ocid="documents.primary_button"
                      >
                        <Printer className="h-3.5 w-3.5 mr-2" /> Print
                      </Button>
                    </div>
                    <div className="text-center text-xs text-muted-foreground mt-3">
                      This is a computer-generated document.
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        );

      default:
        return null;
    }
  };

  const activeNav = NAV_ITEMS.find((n) => n.id === activeSection);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header */}
      <header className="h-14 bg-card border-b border-border flex items-center px-4 gap-4 flex-shrink-0 no-print sticky top-0 z-30">
        <img
          src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
          alt="VPS"
          className="h-8 w-8"
        />
        <div className="hidden sm:block">
          <span className="text-sm font-semibold text-foreground">
            Vidya Public School
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            Student Portal
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-medium text-foreground">
              {student.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {student.className} &bull; {student.section}
            </div>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
            {initials}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Logout</span>
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar desktop */}
        <aside className="hidden lg:flex w-56 flex-col bg-card border-r border-border flex-shrink-0 no-print">
          <div className="p-3 flex-1 overflow-y-auto">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-3 mt-2">
              Student Menu
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 text-sm transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
          {/* Student info strip */}
          <div className="border-t border-border p-4">
            <div className="text-xs text-muted-foreground">
              {student.admissionNumber}
            </div>
            <div className="text-xs text-muted-foreground">
              {student.className} &bull; {student.section}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile horizontal nav */}
          <div className="lg:hidden border-b border-border bg-card overflow-x-auto no-print">
            <div className="flex px-2 py-1 gap-1 min-w-max">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 lg:p-6">
            {/* Page title */}
            <div className="mb-5">
              <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                {activeNav && (
                  <activeNav.icon className="h-5 w-5 text-primary" />
                )}
                {activeNav?.label}
              </h1>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
