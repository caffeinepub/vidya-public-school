import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useApp } from "@/context/AppContext";
import type { FeePayment } from "@/types";
import {
  formatCurrency,
  formatDate,
  generateReceiptNumber,
} from "@/utils/helpers";
import { useNavigate, useParams } from "@tanstack/react-router";
import { CreditCard, Plus, Printer, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function FeesPage() {
  const navigate = useNavigate();
  const { admNo } = useParams({ strict: false }) as { admNo?: string };
  const { students, feePayments, addFeePayment, classes } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(
    admNo ? students.find((s) => s.admissionNumber === admNo) : null,
  );
  const [showForm, setShowForm] = useState(false);
  const [receiptStudent, setReceiptStudent] = useState<string | null>(null);

  const [form, setForm] = useState<Partial<FeePayment>>({
    amount: 0,
    discount: 0,
    fine: 0,
    paymentMode: "cash",
    paymentDate: new Date().toISOString().split("T")[0],
    remarks: "",
  });

  const searchResults =
    searchQuery.length >= 2
      ? students.filter(
          (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      : [];

  const studentPayments = selectedStudent
    ? feePayments.filter(
        (p) => p.studentAdmissionNumber === selectedStudent.admissionNumber,
      )
    : [];

  const totalPaid = studentPayments.reduce(
    (s, p) => s + p.amount - (p.discount ?? 0),
    0,
  );
  const classInfo = selectedStudent
    ? classes.find(
        (c) =>
          c.className === selectedStudent.className &&
          c.section === selectedStudent.section,
      )
    : null;
  const totalFee = classInfo
    ? classInfo.feeStructure.tuition +
      classInfo.feeStructure.transport +
      classInfo.feeStructure.examFees
    : 0;
  const outstanding = Math.max(0, totalFee - totalPaid);

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !form.amount || form.amount <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const payment: FeePayment = {
      receiptNumber: generateReceiptNumber(),
      studentAdmissionNumber: selectedStudent.admissionNumber,
      paymentDate: form.paymentDate ?? new Date().toISOString().split("T")[0],
      amount: form.amount,
      discount: form.discount,
      fine: form.fine,
      paymentMode: form.paymentMode as FeePayment["paymentMode"],
      balance: Math.max(0, outstanding - form.amount),
      remarks: form.remarks,
    };
    addFeePayment(payment);
    setShowForm(false);
    setForm({
      amount: 0,
      discount: 0,
      fine: 0,
      paymentMode: "cash",
      paymentDate: new Date().toISOString().split("T")[0],
      remarks: "",
    });
    setReceiptStudent(payment.receiptNumber);
    toast.success(`Payment recorded. Receipt: ${payment.receiptNumber}`);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Fee Management</h1>
          <p className="text-sm text-muted-foreground">
            Search for a student to view and manage fee records.
          </p>
        </div>

        {/* Student search */}
        {!selectedStudent && (
          <Card className="max-w-lg shadow-card">
            <CardContent className="p-5">
              <Label className="mb-2 block">Search Student</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or admission number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                  data-ocid="fees.search.input"
                />
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 border border-border rounded-lg overflow-hidden">
                  {searchResults.map((s) => (
                    <button
                      type="button"
                      key={s.admissionNumber}
                      onClick={() => {
                        setSelectedStudent(s);
                        setSearchQuery("");
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left border-b last:border-0 border-border"
                    >
                      <div>
                        <div className="text-sm font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {s.admissionNumber} &middot; {s.className} {s.section}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <p
                  className="mt-2 text-sm text-muted-foreground"
                  data-ocid="fees.search.empty_state"
                >
                  No students found.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Fee ledger */}
        {selectedStudent && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedStudent(null);
                  navigate({ to: "/fees" });
                }}
              >
                &larr; Back to Search
              </Button>
            </div>

            {/* Student info */}
            <Card className="shadow-card">
              <CardContent className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {selectedStudent.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.admissionNumber} &middot;{" "}
                      {selectedStudent.className} {selectedStudent.section}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(totalPaid)}
                      </div>
                      <div className="text-xs text-muted-foreground">Paid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        {formatCurrency(outstanding)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Outstanding
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-foreground">
                        {formatCurrency(totalFee)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total Fee
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowForm(!showForm)}
                    data-ocid="fees.add_payment.button"
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" /> Record Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment form */}
            {showForm && (
              <Card className="shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm">Record New Payment</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddPayment}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div>
                        <Label>Amount (₹) *</Label>
                        <Input
                          type="number"
                          value={form.amount}
                          onChange={(e) =>
                            setForm({ ...form, amount: Number(e.target.value) })
                          }
                          data-ocid="fees.amount.input"
                        />
                      </div>
                      <div>
                        <Label>Discount (₹)</Label>
                        <Input
                          type="number"
                          value={form.discount}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              discount: Number(e.target.value),
                            })
                          }
                          data-ocid="fees.discount.input"
                        />
                      </div>
                      <div>
                        <Label>Fine (₹)</Label>
                        <Input
                          type="number"
                          value={form.fine}
                          onChange={(e) =>
                            setForm({ ...form, fine: Number(e.target.value) })
                          }
                          data-ocid="fees.fine.input"
                        />
                      </div>
                      <div>
                        <Label>Payment Mode</Label>
                        <Select
                          value={form.paymentMode}
                          onValueChange={(v) =>
                            setForm({
                              ...form,
                              paymentMode: v as FeePayment["paymentMode"],
                            })
                          }
                        >
                          <SelectTrigger data-ocid="fees.paymentMode.select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="cheque">Cheque</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Payment Date</Label>
                        <Input
                          type="date"
                          value={form.paymentDate}
                          onChange={(e) =>
                            setForm({ ...form, paymentDate: e.target.value })
                          }
                          data-ocid="fees.paymentDate.input"
                        />
                      </div>
                      <div>
                        <Label>Remarks</Label>
                        <Input
                          value={form.remarks}
                          onChange={(e) =>
                            setForm({ ...form, remarks: e.target.value })
                          }
                          placeholder="Optional remarks"
                          data-ocid="fees.remarks.input"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        data-ocid="fees.payment.submit.button"
                      >
                        Record Payment
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForm(false)}
                        data-ocid="fees.payment.cancel.button"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Receipt preview */}
            {receiptStudent &&
              (() => {
                const lastPayment = feePayments.find(
                  (p) => p.receiptNumber === receiptStudent,
                );
                if (!lastPayment) return null;
                return (
                  <Card className="shadow-card receipt-card" id="fee-receipt">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
                          alt="VPS"
                          className="h-12 w-12"
                        />
                        <div>
                          <h3 className="font-bold text-foreground text-lg">
                            Vidya Public School
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            42 Education Road, Lucknow, UP 226001
                          </p>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-xs text-muted-foreground">
                            Receipt No
                          </div>
                          <div className="font-mono font-semibold text-foreground">
                            {lastPayment.receiptNumber}
                          </div>
                        </div>
                      </div>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                          <span className="text-muted-foreground">
                            Student:{" "}
                          </span>
                          <span className="font-medium">
                            {selectedStudent.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Admission No:{" "}
                          </span>
                          <span className="font-medium">
                            {selectedStudent.admissionNumber}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Class: </span>
                          <span className="font-medium">
                            {selectedStudent.className}{" "}
                            {selectedStudent.section}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date: </span>
                          <span className="font-medium">
                            {formatDate(lastPayment.paymentDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Amount:{" "}
                          </span>
                          <span className="font-semibold text-green-600">
                            {formatCurrency(lastPayment.amount)}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Mode: </span>
                          <span className="capitalize font-medium">
                            {lastPayment.paymentMode}
                          </span>
                        </div>
                        {lastPayment.discount ? (
                          <div>
                            <span className="text-muted-foreground">
                              Discount:{" "}
                            </span>
                            <span>{formatCurrency(lastPayment.discount)}</span>
                          </div>
                        ) : null}
                        {lastPayment.fine ? (
                          <div>
                            <span className="text-muted-foreground">
                              Fine:{" "}
                            </span>
                            <span>{formatCurrency(lastPayment.fine)}</span>
                          </div>
                        ) : null}
                        {lastPayment.remarks ? (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Remarks:{" "}
                            </span>
                            <span>{lastPayment.remarks}</span>
                          </div>
                        ) : null}
                      </div>
                      <Separator className="mb-4" />
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          Authorised Signatory
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.print()}
                          data-ocid="fees.print_receipt.button"
                        >
                          <Printer className="h-3.5 w-3.5 mr-2" /> Print Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })()}

            {/* Payment history */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-sm">Payment History</CardTitle>
              </CardHeader>
              <div className="table-wrapper">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-xs">Receipt No</TableHead>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs">Amount</TableHead>
                      <TableHead className="text-xs">Discount</TableHead>
                      <TableHead className="text-xs">Fine</TableHead>
                      <TableHead className="text-xs">Mode</TableHead>
                      <TableHead className="text-xs">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentPayments.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-8"
                          data-ocid="fees.payments.empty_state"
                        >
                          <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            No payments recorded yet
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      studentPayments.map((p, i) => (
                        <TableRow
                          key={p.receiptNumber}
                          data-ocid={`fees.payment.item.${i + 1}`}
                        >
                          <TableCell className="font-mono text-xs">
                            {p.receiptNumber}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(p.paymentDate)}
                          </TableCell>
                          <TableCell className="text-sm font-semibold text-green-600">
                            {formatCurrency(p.amount)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {p.discount ? formatCurrency(p.discount) : "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {p.fine ? formatCurrency(p.fine) : "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="text-xs capitalize"
                            >
                              {p.paymentMode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {p.balance !== undefined
                              ? formatCurrency(p.balance)
                              : "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
