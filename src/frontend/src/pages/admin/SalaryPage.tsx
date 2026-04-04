import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
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
import type { Employee, SalaryRecord } from "@/types";
import { formatCurrency, formatDate, generateId } from "@/utils/helpers";
import { Banknote, FileText, Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS = [2024, 2025, 2026];

const STATUS_COLORS: Record<string, string> = {
  paid: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  advance: "bg-blue-50 text-blue-700 border-blue-200",
};

interface SlipData {
  record: SalaryRecord;
  employee: Employee;
}

function SalarySlip({ data }: { data: SlipData }) {
  const { record, employee } = data;
  const monthName = MONTHS[record.month - 1];
  const totalEarnings = record.basicPay + record.hra + record.otherAllowances;
  const totalDeductions =
    record.providentFund + record.tax + record.otherDeductions + record.advance;

  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "salary-slip-print-styles";
    el.textContent =
      "@media print { body > * { display: none !important; } #salary-slip-print { display: block !important; } #salary-slip-print * { display: revert !important; } }";
    document.head.appendChild(el);
    return () => {
      document.getElementById("salary-slip-print-styles")?.remove();
    };
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={handlePrint} size="sm">
          <Printer className="h-3.5 w-3.5 mr-2" /> Print / Download
        </Button>
      </div>
      <div
        id="salary-slip-print"
        className="border border-border rounded-lg p-6 text-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/vidya-school-logo-transparent.dim_120x120.png"
              alt="VPS"
              className="h-12 w-12"
            />
            <div>
              <div className="font-bold text-base text-foreground">
                Vidya Public School
              </div>
              <div className="text-xs text-muted-foreground">
                473X+PGM, Govindpur, Uttarakhand 263160
              </div>
              <div className="text-xs text-muted-foreground">
                info@vidyaschool.edu.in
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground">SALARY SLIP</div>
            <div className="text-xs text-muted-foreground">
              Slip No: {record.recordId}
            </div>
            <div className="text-xs text-muted-foreground">
              {monthName} {record.year}
            </div>
          </div>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
          <div>
            <span className="text-xs text-muted-foreground">Employee Name</span>
            <div className="font-medium text-foreground">{employee.name}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Employee ID</span>
            <div className="font-medium text-foreground">{employee.empId}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Designation</span>
            <div className="font-medium text-foreground">
              {employee.designation}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Department</span>
            <div className="font-medium text-foreground">
              {employee.department}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Pay Period</span>
            <div className="font-medium text-foreground">
              {monthName} {record.year}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Pay Date</span>
            <div className="font-medium text-foreground">
              {record.paidDate ? formatDate(record.paidDate) : "TBD"}
            </div>
          </div>
        </div>

        {/* Earnings & Deductions */}
        <div className="grid grid-cols-2 gap-6 mb-4 pb-4 border-b border-border">
          <div>
            <div className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">
              Earnings
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Basic Pay</span>
                <span className="font-medium">
                  {formatCurrency(record.basicPay)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">HRA</span>
                <span className="font-medium">
                  {formatCurrency(record.hra)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Other Allowances</span>
                <span className="font-medium">
                  {formatCurrency(record.otherAllowances)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-1 mt-1">
                <span>Total Earnings</span>
                <span>{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-foreground mb-2 text-xs uppercase tracking-wider">
              Deductions
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Provident Fund</span>
                <span className="font-medium">
                  {formatCurrency(record.providentFund)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">TDS / Tax</span>
                <span className="font-medium">
                  {formatCurrency(record.tax)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Advance Deducted</span>
                <span className="font-medium">
                  {formatCurrency(record.advance)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Other Deductions</span>
                <span className="font-medium">
                  {formatCurrency(record.otherDeductions)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-1 mt-1">
                <span>Total Deductions</span>
                <span>{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Net Pay */}
        <div className="bg-primary/5 rounded-lg p-3 mb-6 flex justify-between items-center">
          <div className="font-bold text-foreground">NET PAY</div>
          <div className="font-bold text-xl text-primary">
            {formatCurrency(record.netPay)}
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="text-center">
            <div className="border-t border-border pt-2 text-xs text-muted-foreground">
              Authorized Signatory
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-border pt-2 text-xs text-muted-foreground">
              Employee Signature
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground">
          <div>
            473X+PGM, Govindpur, Uttarakhand 263160 &bull;
            info@vidyaschool.edu.in
          </div>
          <div className="mt-1">
            &copy; Vidya Public School &bull; Design &amp; Technology by ∑
            Summasion
          </div>
        </div>
      </div>
    </>
  );
}

interface RecordFormState {
  basicPay: string;
  hra: string;
  otherAllowances: string;
  providentFund: string;
  tax: string;
  otherDeductions: string;
  advance: string;
  status: "paid" | "pending" | "advance";
  paidDate: string;
}

export default function SalaryPage() {
  const { employees, salaryRecords, addSalaryRecord, session } = useApp();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [recordEmp, setRecordEmp] = useState<Employee | null>(null);
  const [slipData, setSlipData] = useState<SlipData | null>(null);
  const [form, setForm] = useState<RecordFormState>({
    basicPay: "",
    hra: "",
    otherAllowances: "",
    providentFund: "",
    tax: "",
    otherDeductions: "0",
    advance: "0",
    status: "paid",
    paidDate: new Date().toISOString().split("T")[0],
  });

  const isAdmin = session?.role === "superAdmin" || session?.role === "admin";

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="p-6 text-center">
          <Banknote className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            Access restricted to administrators only.
          </p>
        </div>
      </AdminLayout>
    );
  }

  const openRecordDialog = (emp: Employee) => {
    const existing = salaryRecords.find(
      (r) =>
        r.empId === emp.empId &&
        r.month === selectedMonth &&
        r.year === selectedYear,
    );
    if (existing) {
      setForm({
        basicPay: String(existing.basicPay),
        hra: String(existing.hra),
        otherAllowances: String(existing.otherAllowances),
        providentFund: String(existing.providentFund),
        tax: String(existing.tax),
        otherDeductions: String(existing.otherDeductions),
        advance: String(existing.advance),
        status: existing.status,
        paidDate: existing.paidDate ?? new Date().toISOString().split("T")[0],
      });
    } else {
      const bp = emp.salary;
      setForm({
        basicPay: String(bp),
        hra: String(Math.round(bp * 0.2)),
        otherAllowances: String(Math.round(bp * 0.1)),
        providentFund: String(Math.round(bp * 0.12)),
        tax: String(Math.round(bp * 0.05)),
        otherDeductions: "0",
        advance: "0",
        status: "pending",
        paidDate: "",
      });
    }
    setRecordEmp(emp);
  };

  const computeNetPay = () => {
    const bp = Number(form.basicPay) || 0;
    const hra = Number(form.hra) || 0;
    const oa = Number(form.otherAllowances) || 0;
    const pf = Number(form.providentFund) || 0;
    const tax = Number(form.tax) || 0;
    const od = Number(form.otherDeductions) || 0;
    const adv = Number(form.advance) || 0;
    return bp + hra + oa - pf - tax - od - adv;
  };

  const handleSave = () => {
    if (!recordEmp) return;
    const mm = String(selectedMonth).padStart(2, "0");
    const record: SalaryRecord = {
      recordId: `SAL${selectedYear}${mm}${recordEmp.empId}`,
      empId: recordEmp.empId,
      month: selectedMonth,
      year: selectedYear,
      basicPay: Number(form.basicPay) || 0,
      hra: Number(form.hra) || 0,
      otherAllowances: Number(form.otherAllowances) || 0,
      providentFund: Number(form.providentFund) || 0,
      tax: Number(form.tax) || 0,
      otherDeductions: Number(form.otherDeductions) || 0,
      advance: Number(form.advance) || 0,
      netPay: computeNetPay(),
      status: form.status,
      paidDate: form.status === "paid" ? form.paidDate : undefined,
    };
    addSalaryRecord(record);
    setRecordEmp(null);
    toast.success("Salary record saved");
  };

  const handleViewSlip = (emp: Employee) => {
    const record = salaryRecords.find(
      (r) =>
        r.empId === emp.empId &&
        r.month === selectedMonth &&
        r.year === selectedYear,
    );
    if (!record) {
      toast.error(
        "No salary record found for this period. Please record salary first.",
      );
      return;
    }
    setSlipData({ record, employee: emp });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Salary Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage employee salaries, dues, and generate salary slips
            </p>
          </div>
        </div>

        {/* Month/Year Picker */}
        <Card className="mb-4 shadow-xs">
          <CardContent className="p-4 flex flex-wrap gap-3 items-center">
            <div className="text-sm font-medium text-muted-foreground">
              Select Period:
            </div>
            <Select
              value={String(selectedMonth)}
              onValueChange={(v) => setSelectedMonth(Number(v))}
            >
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m, i) => (
                  <SelectItem key={m} value={String(i + 1)}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(selectedYear)}
              onValueChange={(v) => setSelectedYear(Number(v))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground ml-auto">
              Showing:{" "}
              <strong>
                {MONTHS[selectedMonth - 1]} {selectedYear}
              </strong>
            </div>
          </CardContent>
        </Card>

        {/* Employees Salary Table */}
        <Card className="shadow-card">
          <div className="table-wrapper">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs font-medium">Emp ID</TableHead>
                  <TableHead className="text-xs font-medium">Name</TableHead>
                  <TableHead className="text-xs font-medium">
                    Designation
                  </TableHead>
                  <TableHead className="text-xs font-medium">
                    Department
                  </TableHead>
                  <TableHead className="text-xs font-medium">
                    Basic Pay
                  </TableHead>
                  <TableHead className="text-xs font-medium">Net Pay</TableHead>
                  <TableHead className="text-xs font-medium">Status</TableHead>
                  <TableHead className="text-xs font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees
                  .filter((e) => e.active)
                  .map((emp, i) => {
                    const record = salaryRecords.find(
                      (r) =>
                        r.empId === emp.empId &&
                        r.month === selectedMonth &&
                        r.year === selectedYear,
                    );
                    return (
                      <TableRow
                        key={emp.empId}
                        data-ocid={`salary.row.${i + 1}`}
                      >
                        <TableCell className="text-xs font-mono">
                          {emp.empId}
                        </TableCell>
                        <TableCell className="font-medium text-sm">
                          {emp.name}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {emp.designation}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {emp.department}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatCurrency(record?.basicPay ?? emp.salary)}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {record ? formatCurrency(record.netPay) : "--"}
                        </TableCell>
                        <TableCell>
                          {record ? (
                            <Badge
                              className={`text-xs ${STATUS_COLORS[record.status]}`}
                            >
                              {record.status.charAt(0).toUpperCase() +
                                record.status.slice(1)}
                            </Badge>
                          ) : (
                            <Badge className="text-xs bg-gray-50 text-gray-500 border-gray-200">
                              Not Recorded
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => openRecordDialog(emp)}
                            >
                              <Banknote className="h-3 w-3 mr-1" />
                              {record ? "Edit" : "Record"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => handleViewSlip(emp)}
                            >
                              <FileText className="h-3 w-3 mr-1" /> Slip
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Record Salary Dialog */}
        <Dialog
          open={!!recordEmp}
          onOpenChange={(o) => !o && setRecordEmp(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Record Salary — {recordEmp?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground">
                {MONTHS[selectedMonth - 1]} {selectedYear}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Basic Pay (₹)</Label>
                  <Input
                    type="number"
                    value={form.basicPay}
                    onChange={(e) => {
                      const bp = Number(e.target.value);
                      setForm({
                        ...form,
                        basicPay: e.target.value,
                        hra: String(Math.round(bp * 0.2)),
                        otherAllowances: String(Math.round(bp * 0.1)),
                        providentFund: String(Math.round(bp * 0.12)),
                        tax: String(Math.round(bp * 0.05)),
                      });
                    }}
                  />
                </div>
                <div>
                  <Label className="text-xs">HRA (₹)</Label>
                  <Input
                    type="number"
                    value={form.hra}
                    onChange={(e) => setForm({ ...form, hra: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Other Allowances (₹)</Label>
                  <Input
                    type="number"
                    value={form.otherAllowances}
                    onChange={(e) =>
                      setForm({ ...form, otherAllowances: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Provident Fund (₹)</Label>
                  <Input
                    type="number"
                    value={form.providentFund}
                    onChange={(e) =>
                      setForm({ ...form, providentFund: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">TDS / Tax (₹)</Label>
                  <Input
                    type="number"
                    value={form.tax}
                    onChange={(e) => setForm({ ...form, tax: e.target.value })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Other Deductions (₹)</Label>
                  <Input
                    type="number"
                    value={form.otherDeductions}
                    onChange={(e) =>
                      setForm({ ...form, otherDeductions: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Advance Deducted (₹)</Label>
                  <Input
                    type="number"
                    value={form.advance}
                    onChange={(e) =>
                      setForm({ ...form, advance: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Net Pay (₹) — auto</Label>
                  <Input
                    readOnly
                    value={formatCurrency(computeNetPay())}
                    className="bg-muted font-semibold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        status: v as "paid" | "pending" | "advance",
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="advance">Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.status === "paid" && (
                  <div>
                    <Label className="text-xs">Paid Date</Label>
                    <Input
                      type="date"
                      value={form.paidDate}
                      onChange={(e) =>
                        setForm({ ...form, paidDate: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button variant="outline" onClick={() => setRecordEmp(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Salary Slip Dialog */}
        <Dialog open={!!slipData} onOpenChange={(o) => !o && setSlipData(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Salary Slip</DialogTitle>
            </DialogHeader>
            {slipData && <SalarySlip data={slipData} />}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
