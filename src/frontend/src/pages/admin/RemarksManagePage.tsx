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
import type { TeacherRemark } from "@/types";
import { Edit, MessageSquare, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const TERMS = ["Term 1", "Term 2", "Annual"];

const EMPTY_FORM: Omit<TeacherRemark, "remarkId"> = {
  studentAdmissionNumber: "",
  term: "",
  remarkText: "",
  postedBy: "",
  date: "",
};

export default function RemarksManagePage() {
  const { remarks, students, session, addRemark, updateRemark, deleteRemark } =
    useApp();

  const canEdit =
    session?.role === "superAdmin" ||
    session?.role === "admin" ||
    session?.role === "teacher";
  const canDelete = session?.role === "superAdmin" || session?.role === "admin";

  const [filterStudent, setFilterStudent] = useState("");
  const [filterTerm, setFilterTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<TeacherRemark, "remarkId">>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = remarks.filter((r) => {
    if (filterStudent && r.studentAdmissionNumber !== filterStudent)
      return false;
    if (filterTerm && r.term !== filterTerm) return false;
    return true;
  });

  const getStudentName = (admNo: string) =>
    students.find((s) => s.admissionNumber === admNo)?.name ?? admNo;

  const openNew = () => {
    setEditId(null);
    setForm({
      ...EMPTY_FORM,
      postedBy: session?.name ?? "",
      date: new Date().toISOString().slice(0, 10),
    });
    setDialogOpen(true);
  };

  const openEdit = (r: TeacherRemark) => {
    setEditId(r.remarkId);
    const { remarkId: _, ...rest } = r;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (
      !form.studentAdmissionNumber ||
      !form.term ||
      !form.remarkText ||
      !form.postedBy ||
      !form.date
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (editId) {
      updateRemark(editId, form);
      toast.success("Remark updated.");
    } else {
      const id = `RMK${Date.now()}`;
      addRemark({ remarkId: id, ...form });
      toast.success("Remark added.");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteRemark(id);
    setDeleteConfirm(null);
    toast.success("Remark deleted.");
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Remarks</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Add and manage teacher remarks for students
            </p>
          </div>
          {canEdit && (
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> Add Remark
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-4 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[180px]">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Student
              </Label>
              <Select
                value={filterStudent}
                onValueChange={(v) => setFilterStudent(v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {students.map((s) => (
                    <SelectItem
                      key={s.admissionNumber}
                      value={s.admissionNumber}
                    >
                      {s.name} ({s.admissionNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Term
              </Label>
              <Select
                value={filterTerm}
                onValueChange={(v) => setFilterTerm(v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {TERMS.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              {filtered.length} Remark{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Remark</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Date</TableHead>
                    {canEdit && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-10"
                      >
                        No remarks found.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((r) => (
                    <TableRow key={r.remarkId}>
                      <TableCell>
                        <div className="font-medium">
                          {getStudentName(r.studentAdmissionNumber)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {r.studentAdmissionNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{r.term}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm line-clamp-2">{r.remarkText}</p>
                      </TableCell>
                      <TableCell>{r.postedBy}</TableCell>
                      <TableCell>{r.date}</TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(r)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {canDelete && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteConfirm(r.remarkId)}
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
            <DialogTitle>{editId ? "Edit Remark" : "Add Remark"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Student *</Label>
              <Select
                value={form.studentAdmissionNumber}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, studentAdmissionNumber: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((s) => (
                    <SelectItem
                      key={s.admissionNumber}
                      value={s.admissionNumber}
                    >
                      {s.name} ({s.admissionNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Term *</Label>
                <Select
                  value={form.term}
                  onValueChange={(v) => setForm((f) => ({ ...f, term: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    {TERMS.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Remark *</Label>
              <Textarea
                value={form.remarkText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, remarkText: e.target.value }))
                }
                rows={4}
                placeholder="Enter teacher remark for this student..."
              />
            </div>
            <div className="space-y-1.5">
              <Label>Posted By *</Label>
              <Input
                value={form.postedBy}
                onChange={(e) =>
                  setForm((f) => ({ ...f, postedBy: e.target.value }))
                }
                placeholder="Teacher / Authority name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Save"}</Button>
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
            <DialogTitle>Delete Remark?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove the remark.
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
    </AdminLayout>
  );
}
