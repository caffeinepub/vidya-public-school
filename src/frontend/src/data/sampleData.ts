import type {
  Attendance,
  ClassInfo,
  Employee,
  Exam,
  FeePayment,
  Notice,
  SalaryRecord,
  Student,
  StudentMark,
} from "../types";

export const SAMPLE_CLASSES: ClassInfo[] = [
  {
    className: "Class 9",
    section: "A",
    subjects: [
      "Mathematics",
      "Science",
      "English",
      "Hindi",
      "Social Studies",
      "Computer Science",
    ],
    feeStructure: { tuition: 2500, transport: 800, examFees: 500 },
  },
  {
    className: "Class 10",
    section: "A",
    subjects: [
      "Mathematics",
      "Science",
      "English",
      "Hindi",
      "Social Studies",
      "Computer Science",
    ],
    feeStructure: { tuition: 3000, transport: 800, examFees: 600 },
  },
  {
    className: "Class 11",
    section: "Science",
    subjects: [
      "Physics",
      "Chemistry",
      "Mathematics",
      "Biology",
      "English",
      "Computer Science",
    ],
    feeStructure: { tuition: 3500, transport: 900, examFees: 700 },
  },
  {
    className: "Class 8",
    section: "A",
    subjects: ["Mathematics", "Science", "English", "Hindi", "Social Studies"],
    feeStructure: { tuition: 2200, transport: 800, examFees: 400 },
  },
];

export const SAMPLE_STUDENTS: Student[] = [
  {
    admissionNumber: "VPS2024001",
    name: "Arjun Sharma",
    className: "Class 10",
    section: "A",
    parentName: "Rajesh Sharma",
    contact: "9876543210",
    admissionDate: "2024-04-01",
    active: true,
    gender: "Male",
    address: "42, Shanti Nagar, Lucknow",
    dob: "2009-08-15",
    category: "General",
  },
  {
    admissionNumber: "VPS2024002",
    name: "Priya Patel",
    className: "Class 10",
    section: "A",
    parentName: "Sunil Patel",
    contact: "9876543211",
    admissionDate: "2024-04-01",
    active: true,
    gender: "Female",
    address: "15, Gomti Nagar, Lucknow",
    dob: "2009-11-22",
    category: "OBC",
  },
  {
    admissionNumber: "VPS2024003",
    name: "Rohit Verma",
    className: "Class 9",
    section: "A",
    parentName: "Mahesh Verma",
    contact: "9876543212",
    admissionDate: "2024-04-02",
    active: true,
    gender: "Male",
    address: "8, Aliganj, Lucknow",
    dob: "2010-03-10",
    category: "SC",
  },
  {
    admissionNumber: "VPS2024004",
    name: "Sneha Gupta",
    className: "Class 11",
    section: "Science",
    parentName: "Anil Gupta",
    contact: "9876543213",
    admissionDate: "2024-04-03",
    active: true,
    gender: "Female",
    address: "22, Hazratganj, Lucknow",
    dob: "2008-06-30",
    category: "General",
  },
  {
    admissionNumber: "VPS2024005",
    name: "Kavya Singh",
    className: "Class 9",
    section: "A",
    parentName: "Ramesh Singh",
    contact: "9876543214",
    admissionDate: "2024-04-05",
    active: true,
    gender: "Female",
    address: "3, Indira Nagar, Lucknow",
    dob: "2010-01-18",
    category: "General",
  },
  {
    admissionNumber: "VPS2024006",
    name: "Amit Kumar",
    className: "Class 8",
    section: "A",
    parentName: "Vijay Kumar",
    contact: "9876543215",
    admissionDate: "2024-04-06",
    active: true,
    gender: "Male",
    address: "11, Rajajipuram, Lucknow",
    dob: "2011-09-05",
    category: "OBC",
  },
];

export const SAMPLE_EMPLOYEES: Employee[] = [
  {
    empId: "EMP001",
    name: "Dr. Sanjana Maurya",
    role: "admin",
    department: "Administration",
    designation: "Principal",
    salary: 75000,
    active: true,
    contact: "9988776655",
    email: "meera.krishnan@vidyaschool.edu",
    joiningDate: "2015-06-01",
  },
  {
    empId: "EMP002",
    name: "Prof. Suresh Mathur",
    role: "teacher",
    department: "Mathematics",
    designation: "Senior Teacher",
    salary: 45000,
    active: true,
    contact: "9988776656",
    email: "suresh.mathur@vidyaschool.edu",
    joiningDate: "2017-07-01",
  },
  {
    empId: "EMP003",
    name: "Ms. Anjali Desai",
    role: "teacher",
    department: "Science",
    designation: "Teacher",
    salary: 38000,
    active: true,
    contact: "9988776657",
    email: "anjali.desai@vidyaschool.edu",
    joiningDate: "2019-06-01",
  },
  {
    empId: "EMP004",
    name: "Mr. Ravi Tiwari",
    role: "supportStaff",
    department: "Accounts",
    designation: "Accountant",
    salary: 28000,
    active: true,
    contact: "9988776658",
    email: "ravi.tiwari@vidyaschool.edu",
    joiningDate: "2020-01-15",
  },
];

const empSalaries: Record<string, number> = {
  EMP001: 75000,
  EMP002: 45000,
  EMP003: 38000,
  EMP004: 28000,
};

function makeSalaryRecord(
  empId: string,
  month: number,
  year: number,
  basicPay: number,
): SalaryRecord {
  const hra = Math.round(basicPay * 0.2);
  const otherAllowances = Math.round(basicPay * 0.1);
  const providentFund = Math.round(basicPay * 0.12);
  const tax = Math.round(basicPay * 0.05);
  const otherDeductions = 0;
  const advance = 0;
  const netPay =
    basicPay +
    hra +
    otherAllowances -
    providentFund -
    tax -
    otherDeductions -
    advance;
  const mm = String(month).padStart(2, "0");
  return {
    recordId: `SAL${year}${mm}${empId}`,
    empId,
    month,
    year,
    basicPay,
    hra,
    otherAllowances,
    providentFund,
    tax,
    otherDeductions,
    advance,
    netPay,
    status: "paid",
    paidDate: `${year}-${mm}-28`,
  };
}

export const SAMPLE_SALARY_RECORDS: SalaryRecord[] = [
  ...["EMP001", "EMP002", "EMP003", "EMP004"].flatMap((empId) =>
    [1, 2, 3].map((month) =>
      makeSalaryRecord(empId, month, 2026, empSalaries[empId]),
    ),
  ),
];

export const SAMPLE_EXAMS: Exam[] = [
  {
    examId: "EXAM001",
    name: "Unit Test 1",
    className: "Class 10",
    section: "A",
    date: "2024-05-15",
  },
  {
    examId: "EXAM002",
    name: "Half Yearly",
    className: "Class 9",
    section: "A",
    date: "2024-09-20",
  },
  {
    examId: "EXAM003",
    name: "Unit Test 2",
    className: "Class 11",
    section: "Science",
    date: "2024-06-10",
  },
  {
    examId: "EXAM004",
    name: "Annual Exam",
    className: "Class 10",
    section: "A",
    date: "2024-11-25",
  },
];

export const SAMPLE_MARKS: StudentMark[] = [
  {
    studentAdmissionNumber: "VPS2024001",
    examId: "EXAM001",
    subject: "Mathematics",
    marks: 85,
    grade: "A",
  },
  {
    studentAdmissionNumber: "VPS2024001",
    examId: "EXAM001",
    subject: "Science",
    marks: 78,
    grade: "B+",
  },
  {
    studentAdmissionNumber: "VPS2024001",
    examId: "EXAM001",
    subject: "English",
    marks: 90,
    grade: "A+",
  },
  {
    studentAdmissionNumber: "VPS2024001",
    examId: "EXAM001",
    subject: "Hindi",
    marks: 82,
    grade: "A",
  },
  {
    studentAdmissionNumber: "VPS2024002",
    examId: "EXAM001",
    subject: "Mathematics",
    marks: 92,
    grade: "A+",
  },
  {
    studentAdmissionNumber: "VPS2024002",
    examId: "EXAM001",
    subject: "Science",
    marks: 88,
    grade: "A",
  },
  {
    studentAdmissionNumber: "VPS2024002",
    examId: "EXAM001",
    subject: "English",
    marks: 95,
    grade: "A+",
  },
];

export const SAMPLE_FEE_PAYMENTS: FeePayment[] = [
  {
    receiptNumber: "RCP20240001",
    studentAdmissionNumber: "VPS2024001",
    paymentDate: "2024-04-05",
    amount: 3800,
    paymentMode: "online",
    balance: 0,
    remarks: "First installment",
  },
  {
    receiptNumber: "RCP20240002",
    studentAdmissionNumber: "VPS2024002",
    paymentDate: "2024-04-06",
    amount: 3800,
    paymentMode: "cash",
    balance: 0,
  },
  {
    receiptNumber: "RCP20240003",
    studentAdmissionNumber: "VPS2024003",
    paymentDate: "2024-04-07",
    amount: 3800,
    discount: 200,
    paymentMode: "cheque",
    balance: 0,
  },
  {
    receiptNumber: "RCP20240004",
    studentAdmissionNumber: "VPS2024001",
    paymentDate: "2024-05-05",
    amount: 3800,
    paymentMode: "online",
    balance: 0,
    remarks: "May installment",
  },
  {
    receiptNumber: "RCP20240005",
    studentAdmissionNumber: "VPS2024004",
    paymentDate: "2024-04-08",
    amount: 4700,
    paymentMode: "online",
    balance: 0,
  },
];

export const SAMPLE_NOTICES: Notice[] = [
  {
    noticeId: "NTC001",
    title: "Annual Sports Day 2024",
    content:
      "We are pleased to announce that the Annual Sports Day will be held on 15th March 2024. All students are encouraged to participate in various sports events. Registration forms are available at the school office.",
    postedBy: "Principal",
    postedDate: "2024-03-01",
    targetRole: "all",
  },
  {
    noticeId: "NTC002",
    title: "Half Yearly Examination Schedule",
    content:
      "The Half Yearly Examinations will commence from 20th September 2024. Students are advised to prepare well. Detailed time table is posted on the notice board.",
    postedBy: "Academic Office",
    postedDate: "2024-09-01",
    targetRole: "all",
  },
  {
    noticeId: "NTC003",
    title: "Parent Teacher Meeting – Class 10",
    content:
      "A Parent Teacher Meeting for Class 10 students is scheduled for 25th April 2024 from 10:00 AM to 1:00 PM. Parents are requested to attend without fail.",
    postedBy: "Principal",
    postedDate: "2024-04-15",
    targetRole: "all",
  },
  {
    noticeId: "NTC004",
    title: "Fee Submission Deadline Reminder",
    content:
      "This is a reminder that the last date for fee submission for the current quarter is 10th May 2024. A late fine of Rs. 50 per day will be charged after the due date.",
    postedBy: "Accounts Office",
    postedDate: "2024-05-01",
    targetRole: "all",
  },
  {
    noticeId: "NTC005",
    title: "Science Exhibition Invitation",
    content:
      "Vidya Public School is organizing an inter-school Science Exhibition on 5th June 2024. Students from Class 8 to 12 are invited to participate with their innovative projects.",
    postedBy: "Science Department",
    postedDate: "2024-05-10",
    targetRole: "all",
  },
];

export const SAMPLE_ATTENDANCE: Attendance[] = [
  {
    studentAdmissionNumber: "VPS2024001",
    className: "Class 10",
    section: "A",
    date: "2024-05-14",
    present: true,
  },
  {
    studentAdmissionNumber: "VPS2024002",
    className: "Class 10",
    section: "A",
    date: "2024-05-14",
    present: true,
  },
  {
    studentAdmissionNumber: "VPS2024003",
    className: "Class 9",
    section: "A",
    date: "2024-05-14",
    present: false,
  },
  {
    studentAdmissionNumber: "VPS2024004",
    className: "Class 11",
    section: "Science",
    date: "2024-05-14",
    present: true,
  },
  {
    studentAdmissionNumber: "VPS2024005",
    className: "Class 9",
    section: "A",
    date: "2024-05-14",
    present: true,
  },
];

export const FEE_CHART_DATA = [
  { day: "Mon", amount: 12400 },
  { day: "Tue", amount: 8600 },
  { day: "Wed", amount: 15200 },
  { day: "Thu", amount: 9800 },
  { day: "Fri", amount: 18500 },
  { day: "Sat", amount: 7200 },
  { day: "Sun", amount: 3100 },
];
