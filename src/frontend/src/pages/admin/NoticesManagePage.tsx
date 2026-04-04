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
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/context/AppContext";
import type { Notice } from "@/types";
import { formatDate, generateId } from "@/utils/helpers";
import { Megaphone, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function NoticeForm({
  initial,
  onSave,
  onCancel,
}: { initial?: Notice; onSave: (n: Notice) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Notice>(
    initial ?? {
      noticeId: generateId("NTC"),
      title: "",
      content: "",
      postedBy: "Admin",
      postedDate: new Date().toISOString().split("T")[0],
      targetRole: "all",
    },
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title required";
    if (!form.content.trim()) e.content = "Content required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-4 pt-2">
      <div>
        <Label>Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Notice title"
          data-ocid="notice-form.title.input"
        />
        {errors.title && (
          <p className="text-xs text-destructive mt-1">{errors.title}</p>
        )}
      </div>
      <div>
        <Label>Content *</Label>
        <Textarea
          rows={5}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Write the notice content here..."
          data-ocid="notice-form.content.textarea"
        />
        {errors.content && (
          <p className="text-xs text-destructive mt-1">{errors.content}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Posted By</Label>
          <Input
            value={form.postedBy}
            onChange={(e) => setForm({ ...form, postedBy: e.target.value })}
            data-ocid="notice-form.postedBy.input"
          />
        </div>
        <div>
          <Label>Date</Label>
          <Input
            type="date"
            value={form.postedDate}
            onChange={(e) => setForm({ ...form, postedDate: e.target.value })}
            data-ocid="notice-form.date.input"
          />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => {
            if (validate()) onSave(form);
          }}
          data-ocid="notice-form.save.button"
        >
          Save Notice
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          data-ocid="notice-form.cancel.button"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function NoticesManagePage() {
  const { notices, addNotice, updateNotice, deleteNotice } = useApp();
  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Notice Management
            </h1>
            <p className="text-sm text-muted-foreground">
              {notices.length} notices published
            </p>
          </div>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm" data-ocid="notices.add.button">
                <Plus className="h-3.5 w-3.5 mr-2" /> Add Notice
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg" data-ocid="notices.add.dialog">
              <DialogHeader>
                <DialogTitle>Add Notice</DialogTitle>
              </DialogHeader>
              <NoticeForm
                onSave={(n) => {
                  addNotice(n);
                  setAddOpen(false);
                  toast.success("Notice published");
                }}
                onCancel={() => setAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {notices.length === 0 ? (
          <div className="text-center py-16" data-ocid="notices.empty_state">
            <Megaphone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No notices yet. Add the first one.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.map((notice, i) => (
              <Card
                key={notice.noticeId}
                className="shadow-card"
                data-ocid={`notices.item.${i + 1}`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground text-sm">
                          {notice.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {notice.targetRole ?? "all"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notice.content}
                      </p>
                      <div className="text-xs text-muted-foreground">
                        By {notice.postedBy} &middot;{" "}
                        {formatDate(notice.postedDate)}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Dialog
                        open={editId === notice.noticeId}
                        onOpenChange={(o) => !o && setEditId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setEditId(notice.noticeId)}
                            data-ocid={`notices.edit.button.${i + 1}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="max-w-lg"
                          data-ocid="notices.edit.dialog"
                        >
                          <DialogHeader>
                            <DialogTitle>Edit Notice</DialogTitle>
                          </DialogHeader>
                          <NoticeForm
                            initial={notice}
                            onSave={(n) => {
                              updateNotice(notice.noticeId, n);
                              setEditId(null);
                              toast.success("Notice updated");
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
                            onClick={() => setDeleteId(notice.noticeId)}
                            data-ocid={`notices.delete_button.${i + 1}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent data-ocid="notices.delete.dialog">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Notice</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete notice "{notice.title}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="notices.delete.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                deleteNotice(deleteId!);
                                setDeleteId(null);
                                toast.success("Notice deleted");
                              }}
                              className="bg-destructive text-destructive-foreground"
                              data-ocid="notices.delete.confirm_button"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
