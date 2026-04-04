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
import { useApp } from "@/context/AppContext";
import type { StudentDocument } from "@/types";
import { Edit, FileText, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const DOC_TYPES: StudentDocument["type"][] = [
  "ID Card",
  "Character Certificate",
  "Report Card",
  "Fee Receipt",
  "TC",
];

const DOC_TYPE_LABEL: Record<StudentDocument["type"], string> = {
  "ID Card": "ID Card",
  "Character Certificate": "Character Certificate",
  "Report Card": "Report Card",
  "Fee Receipt": "Fee Receipt",
  TC: "Transfer Certificate",
};

const EMPTY_FORM: Omit<StudentDocument, "docId"> = {
  studentAdmissionNumber: "",
  title: "",
  type: "ID Card",
  dateIssued: "",
};

export default function DocumentsManagePage() {
  const {
    documents,
    students,
    session,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useApp();

  const canEdit = session?.role === "superAdmin" || session?.role === "admin";
  const canDelete = session?.role === "superAdmin" || session?.role === "admin";

  const [filterStudent, setFilterStudent] = useState("");
  const [filterType, setFilterType] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<StudentDocument, "docId">>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const filtered = documents.filter((d) => {
    if (filterStudent && d.studentAdmissionNumber !== filterStudent)
      return false;
    if (filterType && d.type !== filterType) return false;
    return true;
  });

  const getStudentName = (admNo: string) =>
    students.find((s) => s.admissionNumber === admNo)?.name ?? admNo;

  const openNew = () => {
    setEditId(null);
    setForm({
      ...EMPTY_FORM,
      dateIssued: new Date().toISOString().slice(0, 10),
    });
    setDialogOpen(true);
  };

  const openEdit = (d: StudentDocument) => {
    setEditId(d.docId);
    const { docId: _, ...rest } = d;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (
      !form.studentAdmissionNumber ||
      !form.title ||
      !form.type ||
      !form.dateIssued
    ) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (editId) {
      updateDocument(editId, form);
      toast.success("Document updated.");
    } else {
      const id = `DOC${Date.now()}`;
      addDocument({ docId: id, ...form });
      toast.success("Document record added.");
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteDocument(id);
    setDeleteConfirm(null);
    toast.success("Document removed.");
  };

  const typeColors: Record<string, string> = {
    "ID Card": "bg-blue-100 text-blue-700",
    "Character Certificate": "bg-green-100 text-green-700",
    "Report Card": "bg-purple-100 text-purple-700",
    "Fee Receipt": "bg-orange-100 text-orange-700",
    TC: "bg-red-100 text-red-700",
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Documents</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Issue and manage student documents
            </p>
          </div>
          {canEdit && (
            <Button onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" /> Issue Document
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
            <div className="flex-1 min-w-[160px]">
              <Label className="text-xs text-muted-foreground mb-1 block">
                Document Type
              </Label>
              <Select
                value={filterType}
                onValueChange={(v) => setFilterType(v === "all" ? "" : v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {DOC_TYPE_LABEL[t]}
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
              <FileText className="h-4 w-4" />
              {filtered.length} Document{filtered.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date Issued</TableHead>
                    {canEdit && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground py-10"
                      >
                        No documents found.
                      </TableCell>
                    </TableRow>
                  )}
                  {filtered.map((d) => (
                    <TableRow key={d.docId}>
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell>
                        <div>{getStudentName(d.studentAdmissionNumber)}</div>
                        <div className="text-xs text-muted-foreground">
                          {d.studentAdmissionNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[d.type] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {DOC_TYPE_LABEL[d.type]}
                        </span>
                      </TableCell>
                      <TableCell>{d.dateIssued}</TableCell>
                      {canEdit && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(d)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {canDelete && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => setDeleteConfirm(d.docId)}
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
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editId ? "Edit Document" : "Issue Document"}
            </DialogTitle>
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
            <div className="space-y-1.5">
              <Label>Document Type *</Label>
              <Select
                value={form.type}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, type: v as StudentDocument["type"] }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {DOC_TYPE_LABEL[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Document Title *</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. Student ID Card (2024-25)"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Date Issued *</Label>
              <Input
                type="date"
                value={form.dateIssued}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateIssued: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editId ? "Update" : "Issue"}</Button>
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
            <DialogTitle>Remove Document?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will permanently remove this document record.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
