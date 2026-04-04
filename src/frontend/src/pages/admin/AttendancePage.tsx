import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { today } from "@/utils/helpers";
import { CalendarCheck, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AttendancePage() {
  const { students, classes, attendance, markAttendance } = useApp();
  const [selectedDate, setSelectedDate] = useState(today());
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const classOptions = [...new Set(classes.map((c) => c.className))];
  const sectionOptions = [
    ...new Set(
      classes
        .filter((c) => !selectedClass || c.className === selectedClass)
        .map((c) => c.section),
    ),
  ];

  const classStudents =
    selectedClass && selectedSection
      ? students.filter(
          (s) => s.className === selectedClass && s.section === selectedSection,
        )
      : [];

  const getStatus = (admNo: string) => {
    return attendance.find(
      (a) => a.studentAdmissionNumber === admNo && a.date === selectedDate,
    )?.present;
  };

  const toggleAttendance = (admNo: string, present: boolean) => {
    markAttendance({
      studentAdmissionNumber: admNo,
      className: selectedClass,
      section: selectedSection,
      date: selectedDate,
      present,
    });
  };

  const markAll = (present: boolean) => {
    for (const s of classStudents) {
      toggleAttendance(s.admissionNumber, present);
    }
    toast.success(`Marked all as ${present ? "Present" : "Absent"}`);
  };

  const presentCount = classStudents.filter(
    (s) => getStatus(s.admissionNumber) === true,
  ).length;
  const absentCount = classStudents.filter(
    (s) => getStatus(s.admissionNumber) === false,
  ).length;
  const unmarkedCount = classStudents.length - presentCount - absentCount;

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground">
            Mark daily attendance by class and section.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-4 shadow-xs">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div>
                <label
                  htmlFor="att-date"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Date
                </label>
                <input
                  id="att-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-input rounded-lg px-3 py-2 text-sm bg-background text-foreground"
                  data-ocid="attendance.date.input"
                />
              </div>
              <div>
                <label
                  htmlFor="att-class"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Class
                </label>
                <Select
                  value={selectedClass}
                  onValueChange={(v) => {
                    setSelectedClass(v);
                    setSelectedSection("");
                  }}
                >
                  <SelectTrigger
                    className="w-40"
                    data-ocid="attendance.class.select"
                  >
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
              </div>
              <div>
                <label
                  htmlFor="att-section"
                  className="text-sm font-medium text-foreground mb-1 block"
                >
                  Section
                </label>
                <Select
                  value={selectedSection}
                  onValueChange={setSelectedSection}
                >
                  <SelectTrigger
                    className="w-36"
                    data-ocid="attendance.section.select"
                  >
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
              </div>
              {classStudents.length > 0 && (
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => markAll(true)}
                    data-ocid="attendance.mark_all_present.button"
                  >
                    <CheckCircle className="h-3.5 w-3.5 mr-2" /> All Present
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => markAll(false)}
                    data-ocid="attendance.mark_all_absent.button"
                  >
                    <XCircle className="h-3.5 w-3.5 mr-2" /> All Absent
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        {classStudents.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {presentCount}
                </div>
                <div className="text-xs text-muted-foreground">Present</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {absentCount}
                </div>
                <div className="text-xs text-muted-foreground">Absent</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  {unmarkedCount}
                </div>
                <div className="text-xs text-muted-foreground">Unmarked</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Attendance grid */}
        {classStudents.length > 0 ? (
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                {selectedClass} {selectedSection} – {selectedDate}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {classStudents.map((s, i) => {
                  const status = getStatus(s.admissionNumber);
                  return (
                    <div
                      key={s.admissionNumber}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                        status === true && "bg-green-50 border-green-200",
                        status === false && "bg-red-50 border-red-200",
                        status === undefined && "bg-muted/30 border-border",
                      )}
                      data-ocid={`attendance.student.item.${i + 1}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-foreground truncate">
                          {s.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {s.admissionNumber}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            toggleAttendance(s.admissionNumber, true)
                          }
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors text-xs font-medium",
                            status === true
                              ? "bg-green-600 text-white"
                              : "bg-white text-green-600 border border-green-200 hover:bg-green-50",
                          )}
                          data-ocid={`attendance.present.toggle.${i + 1}`}
                        >
                          P
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            toggleAttendance(s.admissionNumber, false)
                          }
                          className={cn(
                            "h-8 w-8 rounded-lg flex items-center justify-center transition-colors text-xs font-medium",
                            status === false
                              ? "bg-red-600 text-white"
                              : "bg-white text-red-600 border border-red-200 hover:bg-red-50",
                          )}
                          data-ocid={`attendance.absent.toggle.${i + 1}`}
                        >
                          A
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-16" data-ocid="attendance.empty_state">
            <CalendarCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {selectedClass && selectedSection
                ? "No students in this class."
                : "Select class and section to mark attendance."}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
