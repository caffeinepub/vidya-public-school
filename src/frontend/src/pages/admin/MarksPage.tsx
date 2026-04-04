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
import { useApp } from "@/context/AppContext";
import { calculateGrade, formatDate } from "@/utils/helpers";
import { useParams } from "@tanstack/react-router";
import { BookOpen, Printer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function MarksPage() {
  const { admNo } = useParams({ strict: false }) as { admNo?: string };
  const { students, exams, marks, classes, addMark } = useApp();

  const [selectedExam, setSelectedExam] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");

  const classOptions = [...new Set(classes.map((c) => c.className))];
  const sectionOptions = [
    ...new Set(
      classes
        .filter((c) => !selectedClass || c.className === selectedClass)
        .map((c) => c.section),
    ),
  ];
  const subjectOptions =
    classes.find(
      (c) => c.className === selectedClass && c.section === selectedSection,
    )?.subjects ?? [];
  const examOptions = exams.filter(
    (e) => !selectedClass || e.className === selectedClass,
  );

  const classStudents =
    selectedClass && selectedSection
      ? students.filter(
          (s) => s.className === selectedClass && s.section === selectedSection,
        )
      : [];

  const getMarks = (admNo: string) => {
    if (!selectedExam || !selectedSubject) return "";
    return (
      marks.find(
        (m) =>
          m.studentAdmissionNumber === admNo &&
          m.examId === selectedExam &&
          m.subject === selectedSubject,
      )?.marks ?? ""
    );
  };

  const setMarkValue = (admNo: string, value: string) => {
    const numVal = Number(value);
    if (value !== "" && (numVal < 0 || numVal > 100)) return;
    addMark({
      studentAdmissionNumber: admNo,
      examId: selectedExam,
      subject: selectedSubject,
      marks: numVal,
      grade: calculateGrade((numVal / 100) * 100),
    });
  };

  // Report card mode
  if (admNo) {
    const student = students.find((s) => s.admissionNumber === admNo);
    const studentMarks = marks.filter(
      (m) => m.studentAdmissionNumber === admNo,
    );
    const examIds = [...new Set(studentMarks.map((m) => m.examId))];

    if (!student)
      return (
        <AdminLayout>
          <div className="p-6 text-center text-muted-foreground">
            Student not found.
          </div>
        </AdminLayout>
      );

    const totalMarks = studentMarks.reduce((s, m) => s + m.marks, 0);
    const maxMarks = studentMarks.length * 100;
    const percentage =
      maxMarks > 0 ? Math.round((totalMarks / maxMarks) * 100) : 0;
    const overallGrade = calculateGrade(percentage);

    return (
      <AdminLayout>
        <div className="p-6 max-w-4xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-foreground">Report Card</h1>
              <p className="text-sm text-muted-foreground">
                {student.name} &middot; {student.className} {student.section}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              data-ocid="report-card.print.button"
            >
              <Printer className="h-3.5 w-3.5 mr-2" /> Print
            </Button>
          </div>

          {examIds.length === 0 ? (
            <div
              className="text-center py-12"
              data-ocid="report-card.empty_state"
            >
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No marks recorded for this student.
              </p>
            </div>
          ) : (
            examIds.map((examId) => {
              const exam = exams.find((e) => e.examId === examId);
              const examMarks = studentMarks.filter((m) => m.examId === examId);
              const examTotal = examMarks.reduce((s, m) => s + m.marks, 0);
              const examMax = examMarks.length * 100;
              const examPct =
                examMax > 0 ? Math.round((examTotal / examMax) * 100) : 0;
              return (
                <Card key={examId} className="mb-4 shadow-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {exam?.name ?? examId}
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-xs">
                          {formatDate(exam?.date ?? "")}
                        </span>
                        <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                          {examPct}%
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {calculateGrade(examPct)}
                        </Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <div className="table-wrapper">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="text-xs">Subject</TableHead>
                          <TableHead className="text-xs">Marks</TableHead>
                          <TableHead className="text-xs">Max</TableHead>
                          <TableHead className="text-xs">%</TableHead>
                          <TableHead className="text-xs">Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {examMarks.map((m) => (
                          <TableRow key={m.subject}>
                            <TableCell className="text-sm font-medium">
                              {m.subject}
                            </TableCell>
                            <TableCell className="text-sm">{m.marks}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              100
                            </TableCell>
                            <TableCell className="text-sm">
                              {m.marks}%
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {m.grade}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/30 font-semibold">
                          <TableCell className="text-sm">Total</TableCell>
                          <TableCell className="text-sm">{examTotal}</TableCell>
                          <TableCell className="text-sm">{examMax}</TableCell>
                          <TableCell className="text-sm">{examPct}%</TableCell>
                          <TableCell>
                            <Badge className="bg-green-50 text-green-700 text-xs">
                              {calculateGrade(examPct)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              );
            })
          )}

          {examIds.length > 0 && (
            <Card className="shadow-card">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">
                    Overall Performance
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Across all exams
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">
                      {percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Percentage
                    </div>
                  </div>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-lg px-3 py-1">
                    {overallGrade}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Marks Entry</h1>
          <p className="text-sm text-muted-foreground">
            Select class, section, exam, and subject to enter marks.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-xs">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Select
                  value={selectedClass}
                  onValueChange={(v) => {
                    setSelectedClass(v);
                    setSelectedSection("");
                    setSelectedSubject("");
                  }}
                >
                  <SelectTrigger data-ocid="marks.class.select">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classOptions.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedSection}
                  onValueChange={(v) => {
                    setSelectedSection(v);
                    setSelectedSubject("");
                  }}
                >
                  <SelectTrigger data-ocid="marks.section.select">
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select value={selectedExam} onValueChange={setSelectedExam}>
                  <SelectTrigger data-ocid="marks.exam.select">
                    <SelectValue placeholder="Select Exam" />
                  </SelectTrigger>
                  <SelectContent>
                    {examOptions.map((e) => (
                      <SelectItem key={e.examId} value={e.examId}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  value={selectedSubject}
                  onValueChange={setSelectedSubject}
                >
                  <SelectTrigger data-ocid="marks.subject.select">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Marks table */}
        {classStudents.length > 0 && selectedExam && selectedSubject ? (
          <Card className="shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">
                Enter Marks: {selectedSubject} ({selectedClass}{" "}
                {selectedSection})
              </CardTitle>
            </CardHeader>
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Admission No</TableHead>
                    <TableHead className="text-xs">Name</TableHead>
                    <TableHead className="text-xs">Marks (0-100)</TableHead>
                    <TableHead className="text-xs">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((s, i) => {
                    const currentMarks = getMarks(s.admissionNumber);
                    const grade =
                      currentMarks !== ""
                        ? calculateGrade(Number(currentMarks))
                        : "";
                    return (
                      <TableRow
                        key={s.admissionNumber}
                        data-ocid={`marks.student.item.${i + 1}`}
                      >
                        <TableCell className="font-mono text-xs">
                          {s.admissionNumber}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {s.name}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={currentMarks}
                            onChange={(e) =>
                              setMarkValue(s.admissionNumber, e.target.value)
                            }
                            onBlur={() => {
                              if (currentMarks !== "")
                                toast.success(`Saved marks for ${s.name}`, {
                                  duration: 1000,
                                });
                            }}
                            className="w-24"
                            data-ocid={`marks.input.${i + 1}`}
                          />
                        </TableCell>
                        <TableCell>
                          {grade && (
                            <Badge variant="outline" className="text-xs">
                              {grade}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        ) : (
          <div className="text-center py-12" data-ocid="marks.empty_state">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Select class, section, exam, and subject to enter marks.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
