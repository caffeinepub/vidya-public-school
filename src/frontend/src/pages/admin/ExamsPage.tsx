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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { Exam } from "@/types";
import { formatDate, generateId } from "@/utils/helpers";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ExamForm({
  initial,
  onSave,
  onCancel,
  classes,
}: {
  initial?: Exam;
  onSave: (e: Exam) => void;
  onCancel: () => void;
  classes: { className: string; section: string }[];
}) {
  const [form, setForm] = useState<Exam>(
    initial ?? {
      examId: generateId("EXAM"),
      name: "",
      className: "",
      section: "",
      date: new Date().toISOString().split("T")[0],
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Exam name required";
    if (!form.className) e.className = "Class required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const classOptions = [...new Set(classes.map((c) => c.className))];
  const sectionOptions = [
    ...new Set(
      classes
        .filter((c) => !form.className || c.className === form.className)
        .map((c) => c.section),
    ),
  ];

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label>Exam Name *</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Unit Test 1"
          data-ocid="exam-form.name.input"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Class *</Label>
          <Select
            value={form.className}
            onValueChange={(v) =>
              setForm({ ...form, className: v, section: "" })
            }
          >
            <SelectTrigger data-ocid="exam-form.class.select">
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
          {errors.className && (
            <p className="text-xs text-destructive mt-1">{errors.className}</p>
          )}
        </div>
        <div>
          <Label>Section</Label>
          <Select
            value={form.section}
            onValueChange={(v) => setForm({ ...form, section: v })}
          >
            <SelectTrigger data-ocid="exam-form.section.select">
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
      </div>
      <div>
        <Label>Date</Label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          data-ocid="exam-form.date.input"
        />
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => {
            if (validate()) onSave(form);
          }}
          data-ocid="exam-form.save.button"
        >
          Save Exam
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="exam-form.cancel.button"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function ExamsPage() {
  const { exams, classes, addExam, updateExam, deleteExam } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Exam Management
            </h1>
            <p className="text-sm text-muted-foreground">
              {exams.length} exams scheduled
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-ocid="exams.add.button">
                <Plus className="h-3.5 w-3.5 mr-2" /> Add Exam
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="exams.add.dialog">
              <DialogHeader>
                <DialogTitle>Add Exam</DialogTitle>
              </DialogHeader>
              <ExamForm
                classes={classes}
                onSave={(e) => {
                  addExam(e);
                  setAddOpen(false);
                  toast.success("Exam added");
                }}
                onCancel={() => setAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <Card className="shadow-card">
          <div className="table-wrapper">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">Exam ID</TableHead>
                  <TableHead className="text-xs">Name</TableHead>
                  <TableHead className="text-xs">Class</TableHead>
                  <TableHead className="text-xs">Section</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exams.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-12"
                      data-ocid="exams.empty_state"
                    >
                      <ClipboardList className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No exams scheduled
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  exams.map((exam, i) => (
                    <TableRow
                      key={exam.examId}
                      data-ocid={`exams.item.${i + 1}`}
                    >
                      <TableCell className="font-mono text-xs">
                        {exam.examId}
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {exam.name}
                      </TableCell>
                      <TableCell className="text-sm">
                        {exam.className}
                      </TableCell>
                      <TableCell className="text-sm">{exam.section}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {formatDate(exam.date)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Dialog
                            open={editId === exam.examId}
                            onOpenChange={(o) => !o && setEditId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => setEditId(exam.examId)}
                                data-ocid={`exams.edit.button.${i + 1}`}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Exam</DialogTitle>
                              </DialogHeader>
                              <ExamForm
                                initial={exam}
                                classes={classes}
                                onSave={(e) => {
                                  updateExam(exam.examId, e);
                                  setEditId(null);
                                  toast.success("Exam updated");
                                }}
                                onCancel={() => setEditId(null)}
                              />
                            </DialogContent>
                          </Dialog>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive"
                                onClick={() => setDeleteId(exam.examId)}
                                data-ocid={`exams.delete_button.${i + 1}`}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Delete exam "{exam.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteExam(deleteId!);
                                    setDeleteId(null);
                                    toast.success("Exam deleted");
                                  }}
                                  className="bg-destructive text-destructive-foreground"
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
