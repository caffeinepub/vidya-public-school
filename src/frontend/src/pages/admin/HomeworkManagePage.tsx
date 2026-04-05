import { AdminLayout } from "@/components/AdminLayout";
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
import type { Homework, HomeworkSubmission } from "@/types";
import { BookOpen, CheckCircle, Edit, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const EMPTY_FORM: Omit<Homework, "homeworkId"> = {
  className: "",
  section: "",
  subject: "",
  title: "",
  description: "",
  dueDate: "",
  postedBy: "",
};

export default function HomeworkManagePage() {
  const {
    homework,
    classes,
    session,
    students,
    homeworkSubmissions,
    addHomework,
    updateHomework,
    deleteHomework,
    addHomeworkSubmission,
    updateHomeworkSubmission,
  } = useApp();

  const canEdit =
    session?.role === "superAdmin" ||
    session?.role === "admin" ||
    session?.role === "teacher";
  const canDelete = session?.role === "superAdmin" || session?.role === "admin";

  const [filterClass, setFilterClass] = useState("");
  const [filterSection, setFilterSection] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Homework, "homeworkId">>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Submissions tracking
  const [submissionsHw, setSubmissionsHw] = useState<string | null>(null);
  const [editSub, setEditSub] = useState<{
    admNo: string;
    submissionId: string | null;
    status: HomeworkSubmission["status"];
    grade: string;
    comment: string;
  } | null>(null);

  const uniqueClasses = Array.from(
    new Set(classes.map((c) => c.className)),
  ).sort();
  const sectionsForClass = filterClass
    ? Array.from(
        new Set(
          classes
            .filter((c) => c.className === filterClass)
            .map((c) => c.section),
        ),
      )
    : [];
  const subjectsForClass = form.className
    ? Array.from(
        new Set(
          classes
            .filter((c) => c.className === form.className)
            .flatMap((c) => c.subjects),
        ),
      )
    : [];

  const filtered = homework.filter((hw) => {
    if (filterClass && hw.className !== filterClass) return false;
    if (filterSection && hw.section !== filterSection) return false;
    return true;
  });

  const isDueSoon = (dueDate: string) => {
    const diff = new Date(dueDate).getTime() - Date.now();
    return diff >= 0 && diff <= 3 * 24 * 60 * 60 * 1000;
  };
  const isOverdue = (dueDate: string) =>
    new Date(dueDate).getTime() < Date.now();

  const openNew = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, postedBy: session?.name ?? "" });
    setDialogOpen(true);
  };

  const openEdit = (hw: Homework) => {
    setEditId(hw.homeworkId);
    const { homeworkId: _, ...rest } = hw;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (
      !form.className ||
      !form.section ||
      !form.subject ||
      !form.title ||
      !form.dueDate ||
      !form.postedBy
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (editId) {
      updateHomework(editId, form);
      toast.success("Homework updated.");
    } else {
      const id = `HW${Date.now()}`;
      addHomework({ homeworkId: id, ...form });
      toast.success("Homework assigned.");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteHomework(id);
    setDeleteConfirm(null);
    toast.success("Homework deleted.");
  };

  // Submissions dialog helpers
  const selectedHw = homework.find((h) => h.homeworkId === submissionsHw);
  const classStudents = selectedHw
    ? students.filter(
        (s) =>
          s.className === selectedHw.className &&
          s.section === selectedHw.section,
      )
    : [];
  const submissionsForHw = homeworkSubmissions.filter(
    (s) => s.homeworkId === submissionsHw,
  );

  const openEditSub = (admNo: string) => {
    const existing = submissionsForHw.find(
      (s) => s.studentAdmissionNumber === admNo,
    );
    setEditSub({
      admNo,
      submissionId: existing?.submissionId ?? null,
      status: existing?.status ?? "pending",
      grade: existing?.grade ?? "",
      comment: existing?.teacherComment ?? "",
    });
  };

  const handleSaveSub = () => {
    if (!editSub || !submissionsHw) return;
    const today = new Date().toISOString().split("T")[0];
    if (editSub.submissionId) {
      updateHomeworkSubmission(editSub.submissionId, {
        status: editSub.status,
        grade: editSub.grade || undefined,
        teacherComment: editSub.comment || undefined,
      });
    } else {
      addHomeworkSubmission({
        submissionId: `SUB${Date.now()}`,
        homeworkId: submissionsHw,
        studentAdmissionNumber: editSub.admNo,
        status: editSub.status,
        submittedDate: editSub.status !== "pending" ? today : undefined,
        grade: editSub.grade || undefined,
        teacherComment: editSub.comment || undefined,
      });
    }
    toast.success("Submission updated.");
    setEditSub(null);
  };

  const statusBadge = (status: HomeworkSubmission["status"] | undefined) => {
    if (status === "graded")
      return (
        <Badge className="text-xs bg-green-50 text-green-700 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" /> Graded
        </Badge>
      );
    if (status === "submitted")
      return (
        <Badge className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Submitted
        </Badge>
      );
    return (
      <Badge className="text-xs bg-gray-50 text-gray-600 border-gray-200">
        Pending
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Homework</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Assign and manage class homework
            </p>
          </div>
          {canEdit && (
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> Assign Homework
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[160px]">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Class
              </Label>
              <Select
                value={filterClass}
                onValueChange={(v) => {
                  setFilterClass(v === "all" ? "" : v);
                  setFilterSection("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {uniqueClasses.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {filterClass && (
              <div className="flex-1 min-w-[140px]">
                <Label className="text-xs text-muted-foreground mb-1 block">
                  Section
                </Label>
                <Select
                  value={filterSection}
                  onValueChange={(v) => setFilterSection(v === "all" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sectionsForClass.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {filtered.length} Assignment{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Status</TableHead>
                    {canEdit && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground py-10"
                      >
                        No homework found.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((hw) => (
                    <TableRow key={hw.homeworkId}>
                      <TableCell>
                        <div className="font-medium">{hw.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {hw.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        {hw.className} – {hw.section}
                      </TableCell>
                      <TableCell>{hw.subject}</TableCell>
                      <TableCell>{hw.dueDate}</TableCell>
                      <TableCell>{hw.postedBy}</TableCell>
                      <TableCell>
                        {isOverdue(hw.dueDate) ? (
                          <Badge variant="destructive">Overdue</Badge>
                        ) : isDueSoon(hw.dueDate) ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600">
                            Due Soon
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Upcoming</Badge>
                        )}
                      </TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSubmissionsHw(hw.homeworkId)}
                              title="View Submissions"
                              data-ocid="homework.open_modal_button"
                            >
                              <Users className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(hw)}
                              data-ocid="homework.edit_button"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {canDelete && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteConfirm(hw.homeworkId)}
                                data-ocid="homework.delete_button"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Homework" : "Assign New Homework"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Class *</Label>
                <Select
                  value={form.className}
                  onValueChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      className: v,
                      section: "",
                      subject: "",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueClasses.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Section *</Label>
                <Select
                  value={form.section}
                  onValueChange={(v) => setForm((f) => ({ ...f, section: v }))}
                  disabled={!form.className}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes
                      .filter((c) => c.className === form.className)
                      .map((c) => (
                        <SelectItem key={c.section} value={c.section}>
                          {c.section}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Subject *</Label>
              <Select
                value={form.subject}
                onValueChange={(v) => setForm((f) => ({ ...f, subject: v }))}
                disabled={!form.className}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjectsForClass.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Chapter 5 Exercises"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                placeholder="Detailed instructions..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Due Date *</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, dueDate: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label>Posted By *</Label>
                <Input
                  value={form.postedBy}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, postedBy: e.target.value }))
                  }
                  placeholder="Teacher name"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Assign"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={() => setDeleteConfirm(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Homework?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove the assignment.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submissions Tracker Dialog */}
      <Dialog
        open={!!submissionsHw}
        onOpenChange={(o) => {
          if (!o) {
            setSubmissionsHw(null);
            setEditSub(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Submission Tracker — {selectedHw?.title ?? ""}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground -mt-1">
            {selectedHw?.className} – {selectedHw?.section} &bull;{" "}
            {selectedHw?.subject} &bull; Due: {selectedHw?.dueDate}
          </p>

          {classStudents.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground text-sm">
              No students found for this class/section.
            </div>
          ) : (
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Student</TableHead>
                    <TableHead>Adm. No</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classStudents.map((st) => {
                    const sub = submissionsForHw.find(
                      (s) => s.studentAdmissionNumber === st.admissionNumber,
                    );
                    return (
                      <TableRow key={st.admissionNumber}>
                        <TableCell className="font-medium">{st.name}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">
                          {st.admissionNumber}
                        </TableCell>
                        <TableCell>{statusBadge(sub?.status)}</TableCell>
                        <TableCell className="text-sm">
                          {sub?.grade ?? "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => openEditSub(st.admissionNumber)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSubmissionsHw(null);
                setEditSub(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Submission Sub-Dialog */}
      <Dialog open={!!editSub} onOpenChange={(o) => !o && setEditSub(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Update Submission</DialogTitle>
          </DialogHeader>
          {editSub && (
            <div className="space-y-3 py-2">
              <div className="text-xs text-muted-foreground">
                Student:{" "}
                <span className="font-medium text-foreground">
                  {
                    students.find((s) => s.admissionNumber === editSub.admNo)
                      ?.name
                  }
                </span>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select
                  value={editSub.status}
                  onValueChange={(v) =>
                    setEditSub((p) =>
                      p
                        ? { ...p, status: v as HomeworkSubmission["status"] }
                        : null,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="graded">Graded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {editSub.status === "graded" && (
                <div className="space-y-1.5">
                  <Label>Grade</Label>
                  <Input
                    value={editSub.grade}
                    onChange={(e) =>
                      setEditSub((p) =>
                        p ? { ...p, grade: e.target.value } : null,
                      )
                    }
                    placeholder="e.g. A, B+, 85/100"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Teacher Comment (optional)</Label>
                <Textarea
                  value={editSub.comment}
                  onChange={(e) =>
                    setEditSub((p) =>
                      p ? { ...p, comment: e.target.value } : null,
                    )
                  }
                  rows={3}
                  placeholder="Feedback for the student..."
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSub(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSub}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
