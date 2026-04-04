import { AdminLayout } from "@/components/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApp } from "@/context/AppContext";
import { FEE_CHART_DATA } from "@/data/sampleData";
import { formatCurrency, formatDate } from "@/utils/helpers";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  CalendarCheck,
  CreditCard,
  DollarSign,
  Megaphone,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function KpiCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  delta,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  delta?: string;
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
          >
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            {delta && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-2.5 w-2.5 inline mr-0.5" />
                {delta}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { students, employees, feePayments, exams, session } = useApp();

  const totalFeesCollected = feePayments.reduce((sum, p) => sum + p.amount, 0);
  const recentStudents = students.slice(-5).reverse();
  const upcomingExams = exams.slice(0, 4);
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <AdminLayout>
      <div className="p-6 animate-fade-in">
        {/* Page heading */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Welcome, {session?.name ?? "Admin"}!
            </p>
            <h1 className="text-2xl font-bold text-foreground">
              Vidya ERP Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{today}</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <KpiCard
              title="Total Students"
              value={students.length.toString()}
              icon={Users}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <KpiCard
              title="Total Employees"
              value={employees.length.toString()}
              icon={UserCog}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              delta="+2 this month"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <KpiCard
              title="Fees Collected"
              value={formatCurrency(totalFeesCollected)}
              icon={CreditCard}
              iconBg="bg-green-50"
              iconColor="text-green-600"
              delta="+12% vs last month"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <KpiCard
              title="Pending Dues"
              value={formatCurrency(18500)}
              icon={AlertTriangle}
              iconBg="bg-red-50"
              iconColor="text-red-600"
            />
          </motion.div>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6 shadow-card">
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-foreground mb-4">
              Quick Actions
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/students/new">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  data-ocid="dashboard.add_student.button"
                >
                  <UserPlus className="h-3.5 w-3.5 mr-2" /> Add Student
                </Button>
              </Link>
              <Link to="/fees">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  data-ocid="dashboard.record_payment.button"
                >
                  <DollarSign className="h-3.5 w-3.5 mr-2" /> Record Payment
                </Button>
              </Link>
              <Link to="/attendance">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  data-ocid="dashboard.attendance.button"
                >
                  <CalendarCheck className="h-3.5 w-3.5 mr-2" /> Mark Attendance
                </Button>
              </Link>
              <Link to="/exams">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  data-ocid="dashboard.add_exam.button"
                >
                  <BookOpen className="h-3.5 w-3.5 mr-2" /> Add Exam
                </Button>
              </Link>
              <Link to="/notices/manage">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  data-ocid="dashboard.add_notice.button"
                >
                  <Megaphone className="h-3.5 w-3.5 mr-2" /> Add Notice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Lower grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Students */}
          <Card className="lg:col-span-1 shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Recent Student Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="table-wrapper">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                        Name
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                        Class
                      </th>
                      <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-4 py-6 text-center text-muted-foreground text-xs"
                          data-ocid="dashboard.students.empty_state"
                        >
                          No student activity
                        </td>
                      </tr>
                    ) : (
                      recentStudents.map((s, i) => (
                        <tr
                          key={s.admissionNumber}
                          className="border-t border-border"
                          data-ocid={`dashboard.student.item.${i + 1}`}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-xs text-foreground truncate max-w-[120px]">
                              {s.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {s.admissionNumber}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {s.className} {s.section}
                          </td>
                          <td className="px-4 py-3">
                            <Badge className="bg-green-50 text-green-700 border-green-200 text-xs">
                              Active
                            </Badge>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Exams */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Upcoming Exams
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingExams.length === 0 ? (
                <div
                  className="text-center py-6"
                  data-ocid="dashboard.exams.empty_state"
                >
                  <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">
                    No upcoming exams
                  </p>
                </div>
              ) : (
                upcomingExams.map((exam, i) => (
                  <div
                    key={exam.examId}
                    className="flex items-center gap-3"
                    data-ocid={`dashboard.exam.item.${i + 1}`}
                  >
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {exam.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {exam.className} {exam.section} &middot;{" "}
                        {formatDate(exam.date)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Fee chart */}
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                Fee Collection
              </CardTitle>
              <p className="text-xs text-muted-foreground">Last 7 Days</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart
                  data={FEE_CHART_DATA}
                  margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="feeGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#16A34A" stopOpacity={0.3} />
                      <stop
                        offset="95%"
                        stopColor="#16A34A"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "1px solid #E5E7EB",
                    }}
                    formatter={(v: number) => [formatCurrency(v), "Amount"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#16A34A"
                    strokeWidth={2}
                    fill="url(#feeGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
