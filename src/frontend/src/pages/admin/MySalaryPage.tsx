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
import { formatCurrency, formatDate } from "@/utils/helpers";
import { FileText, Printer, Receipt } from "lucide-react";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "my-salary-slip-print-styles";
    el.textContent =
      "@media print { body > * { display: none !important; } #my-salary-slip-print { display: block !important; } #my-salary-slip-print * { display: revert !important; } }";
    document.head.appendChild(el);
    return () => {
      document.getElementById("my-salary-slip-print-styles")?.remove();
    };
  }, []);

  return (
    <>
      <div className="flex justify-end mb-4 no-print">
        <Button onClick={() => window.print()} size="sm">
          <Printer className="h-3.5 w-3.5 mr-2" /> Print / Download
        </Button>
      </div>
      <div
        id="my-salary-slip-print"
        className="border border-border rounded-lg p-6 text-sm"
      >
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

        <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border">
          <div>
            <span className="text-xs text-muted-foreground">Employee Name</span>
            <div className="font-medium">{employee.name}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Employee ID</span>
            <div className="font-medium">{employee.empId}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Designation</span>
            <div className="font-medium">{employee.designation}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Department</span>
            <div className="font-medium">{employee.department}</div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Pay Period</span>
            <div className="font-medium">
              {monthName} {record.year}
            </div>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Pay Date</span>
            <div className="font-medium">
              {record.paidDate ? formatDate(record.paidDate) : "TBD"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-4 pb-4 border-b border-border">
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider mb-2">
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
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-1">
                <span>Total Earnings</span>
                <span>{formatCurrency(totalEarnings)}</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-semibold text-xs uppercase tracking-wider mb-2">
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
              <div className="flex justify-between text-sm font-semibold border-t border-border pt-1">
                <span>Total Deductions</span>
                <span>{formatCurrency(totalDeductions)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/5 rounded-lg p-3 mb-6 flex justify-between items-center">
          <div className="font-bold text-foreground">NET PAY</div>
          <div className="font-bold text-xl text-primary">
            {formatCurrency(record.netPay)}
          </div>
        </div>

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

export default function MySalaryPage() {
  const { employees, salaryRecords, session } = useApp();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [slipData, setSlipData] = useState<SlipData | null>(null);

  // Find employee matching logged-in user
  const myEmployee = employees.find(
    (e) =>
      (session?.empId && e.empId === session.empId) || e.name === session?.name,
  );

  const myRecords = salaryRecords
    .filter((r) => r.empId === myEmployee?.empId && r.year === selectedYear)
    .sort((a, b) => b.month - a.month);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">My Salary</h1>
            <p className="text-sm text-muted-foreground">
              {myEmployee
                ? `${myEmployee.name} — ${myEmployee.designation}`
                : "Salary slips for your account"}
            </p>
          </div>
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
        </div>

        {!myEmployee ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No employee record linked to your account.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact your administrator.
              </p>
            </CardContent>
          </Card>
        ) : myRecords.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No salary records found for {selectedYear}.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card">
            <div className="table-wrapper">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs font-medium">Month</TableHead>
                    <TableHead className="text-xs font-medium">
                      Basic Pay
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      Allowances
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      Deductions
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      Net Pay
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      Pay Date
                    </TableHead>
                    <TableHead className="text-xs font-medium">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {myRecords.map((record) => (
                    <TableRow key={record.recordId}>
                      <TableCell className="font-medium text-sm">
                        {MONTHS[record.month - 1]} {record.year}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(record.basicPay)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(record.hra + record.otherAllowances)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatCurrency(
                          record.providentFund +
                            record.tax +
                            record.otherDeductions +
                            record.advance,
                        )}
                      </TableCell>
                      <TableCell className="text-sm font-semibold">
                        {formatCurrency(record.netPay)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-xs ${STATUS_COLORS[record.status]}`}
                        >
                          {record.status.charAt(0).toUpperCase() +
                            record.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.paidDate ? formatDate(record.paidDate) : "--"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() =>
                            myEmployee &&
                            setSlipData({ record, employee: myEmployee })
                          }
                        >
                          <FileText className="h-3 w-3 mr-1" /> View Slip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {/* Slip Dialog */}
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
