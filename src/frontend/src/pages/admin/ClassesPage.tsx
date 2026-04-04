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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApp } from "@/context/AppContext";
import type { ClassInfo } from "@/types";
import { formatCurrency } from "@/utils/helpers";
import { Layers, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function ClassForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ClassInfo;
  onSave: (c: ClassInfo) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ClassInfo>(
    initial ?? {
      className: "",
      section: "",
      subjects: [],
      feeStructure: { tuition: 0, transport: 0, examFees: 0 },
    },
  );
  const [subjectsInput, setSubjectsInput] = useState(
    initial?.subjects.join(", ") ?? "",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.className.trim()) e.className = "Class name required";
    if (!form.section.trim()) e.section = "Section required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const subjects = subjectsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSave({ ...form, subjects });
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Class Name *</Label>
          <Input
            value={form.className}
            onChange={(e) => setForm({ ...form, className: e.target.value })}
            placeholder="e.g. Class 9"
            data-ocid="class-form.className.input"
          />
          {errors.className && (
            <p className="text-xs text-destructive mt-1">{errors.className}</p>
          )}
        </div>
        <div>
          <Label>Section *</Label>
          <Input
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            placeholder="e.g. A"
            data-ocid="class-form.section.input"
          />
          {errors.section && (
            <p className="text-xs text-destructive mt-1">{errors.section}</p>
          )}
        </div>
      </div>
      <div>
        <Label>Subjects (comma separated)</Label>
        <Input
          value={subjectsInput}
          onChange={(e) => setSubjectsInput(e.target.value)}
          placeholder="Mathematics, Science, English"
          data-ocid="class-form.subjects.input"
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Tuition Fee (₹)</Label>
          <Input
            type="number"
            value={form.feeStructure.tuition}
            onChange={(e) =>
              setForm({
                ...form,
                feeStructure: {
                  ...form.feeStructure,
                  tuition: Number(e.target.value),
                },
              })
            }
            data-ocid="class-form.tuition.input"
          />
        </div>
        <div>
          <Label>Transport Fee (₹)</Label>
          <Input
            type="number"
            value={form.feeStructure.transport}
            onChange={(e) =>
              setForm({
                ...form,
                feeStructure: {
                  ...form.feeStructure,
                  transport: Number(e.target.value),
                },
              })
            }
            data-ocid="class-form.transport.input"
          />
        </div>
        <div>
          <Label>Exam Fee (₹)</Label>
          <Input
            type="number"
            value={form.feeStructure.examFees}
            onChange={(e) =>
              setForm({
                ...form,
                feeStructure: {
                  ...form.feeStructure,
                  examFees: Number(e.target.value),
                },
              })
            }
            data-ocid="class-form.examFees.input"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} data-ocid="class-form.save.button">
          Save Class
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="class-form.cancel.button"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function ClassesPage() {
  const { classes, addClass, updateClass, deleteClass } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const handleAdd = (c: ClassInfo) => {
    addClass(c);
    setAddOpen(false);
    toast.success("Class added");
  };

  const handleEdit = (key: string, c: ClassInfo) => {
    updateClass(key, c);
    setEditKey(null);
    toast.success("Class updated");
  };

  const handleDelete = () => {
    if (!deleteKey) return;
    const [cn, sec] = deleteKey.split("|");
    deleteClass(cn, sec);
    setDeleteKey(null);
    toast.success("Class deleted");
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Classes & Sections
            </h1>
            <p className="text-sm text-muted-foreground">
              {classes.length} classes configured
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-ocid="classes.add.button">
                <Plus className="h-3.5 w-3.5 mr-2" /> Add Class
              </Button>
            </DialogTrigger>
            <DialogContent data-ocid="classes.add.dialog">
              <DialogHeader>
                <DialogTitle>Add New Class</DialogTitle>
              </DialogHeader>
              <ClassForm
                onSave={handleAdd}
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
                  <TableHead className="text-xs">Class</TableHead>
                  <TableHead className="text-xs">Section</TableHead>
                  <TableHead className="text-xs">Subjects</TableHead>
                  <TableHead className="text-xs">Tuition</TableHead>
                  <TableHead className="text-xs">Transport</TableHead>
                  <TableHead className="text-xs">Exam Fee</TableHead>
                  <TableHead className="text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-12"
                      data-ocid="classes.empty_state"
                    >
                      <Layers className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground">
                        No classes configured
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  classes.map((cls, i) => {
                    const key = `${cls.className}|${cls.section}`;
                    return (
                      <TableRow key={key} data-ocid={`classes.item.${i + 1}`}>
                        <TableCell className="font-medium text-sm">
                          {cls.className}
                        </TableCell>
                        <TableCell className="text-sm">{cls.section}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {cls.subjects.slice(0, 3).map((s) => (
                              <Badge
                                key={s}
                                variant="secondary"
                                className="text-xs"
                              >
                                {s}
                              </Badge>
                            ))}
                            {cls.subjects.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{cls.subjects.length - 3}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(cls.feeStructure.tuition)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(cls.feeStructure.transport)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(cls.feeStructure.examFees)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Dialog
                              open={editKey === key}
                              onOpenChange={(o) => !o && setEditKey(null)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => setEditKey(key)}
                                  data-ocid={`classes.edit.button.${i + 1}`}
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent data-ocid="classes.edit.dialog">
                                <DialogHeader>
                                  <DialogTitle>Edit Class</DialogTitle>
                                </DialogHeader>
                                <ClassForm
                                  initial={cls}
                                  onSave={(c) => handleEdit(key, c)}
                                  onCancel={() => setEditKey(null)}
                                />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-destructive"
                                  onClick={() => setDeleteKey(key)}
                                  data-ocid={`classes.delete_button.${i + 1}`}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Class
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Delete {cls.className} – Section{" "}
                                    {cls.section}?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDelete}
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
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
