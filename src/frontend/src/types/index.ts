// Local data types mirroring backend
export interface Student {
  admissionNumber: string;
  name: string;
  className: string;
  section: string;
  parentName: string;
  contact: string;
  admissionDate: string; // ISO date string
  photoUrl?: string;
  active?: boolean;
  gender?: string;
  address?: string;
  dob?: string;
  category?: string;
}

export interface Employee {
  empId: string;
  name: string;
  role: "admin" | "teacher" | "supportStaff";
  department: string;
  designation: string;
  salary: number;
  active: boolean;
  contact?: string;
  email?: string;
  joiningDate?: string;
}

export interface SalaryRecord {
  recordId: string;
  empId: string;
  month: number; // 1-12
  year: number;
  basicPay: number;
  hra: number;
  otherAllowances: number;
  providentFund: number;
  tax: number;
  otherDeductions: number;
  advance: number;
  netPay: number;
  status: "paid" | "pending" | "advance";
  paidDate?: string;
}

export interface ClassInfo {
  className: string;
  section: string;
  subjects: string[];
  feeStructure: {
    tuition: number;
    transport: number;
    examFees: number;
  };
}

export interface Exam {
  examId: string;
  name: string;
  className: string;
  section: string;
  date: string;
}

export interface StudentMark {
  studentAdmissionNumber: string;
  examId: string;
  subject: string;
  marks: number;
  grade: string;
}

export interface Attendance {
  studentAdmissionNumber: string;
  className: string;
  section: string;
  date: string;
  present: boolean;
}

export interface FeePayment {
  receiptNumber: string;
  studentAdmissionNumber: string;
  paymentDate: string;
  amount: number;
  discount?: number;
  fine?: number;
  paymentMode: "cash" | "cheque" | "online" | "upi" | "card";
  balance?: number;
  remarks?: string;
}

export interface Notice {
  noticeId: string;
  title: string;
  content: string;
  postedBy: string;
  postedDate: string;
  targetRole?: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalEmployees: number;
  monthlyFeesCollected: number;
  pendingDues: number;
}

export interface Homework {
  homeworkId: string;
  className: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  postedBy: string;
}

export interface TeacherRemark {
  remarkId: string;
  studentAdmissionNumber: string;
  term: string;
  remarkText: string;
  postedBy: string;
  date: string;
}

export interface StudentDocument {
  docId: string;
  studentAdmissionNumber: string;
  title: string;
  type:
    | "TC"
    | "ID Card"
    | "Character Certificate"
    | "Fee Receipt"
    | "Report Card";
  dateIssued: string;
}

export type UserRole =
  | "superAdmin"
  | "admin"
  | "accountant"
  | "teacher"
  | "staff"
  | "student";

export interface UserSession {
  name: string;
  role: UserRole;
  empId?: string;
  admissionNumber?: string;
}
