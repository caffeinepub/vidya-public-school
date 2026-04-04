import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface Attendance {
    present: boolean;
    date: Time;
    section: string;
    studentAdmissionNumber: string;
    className: string;
}
export interface StudentMark {
    marks: bigint;
    subject: string;
    studentAdmissionNumber: string;
    grade: string;
    examId: string;
}
export interface FeePayment {
    fine?: bigint;
    studentAdmissionNumber: string;
    paymentDate: Time;
    discount?: bigint;
    paymentMode: PaymentMode;
    amount: bigint;
    receiptNumber: string;
}
export interface DashboardStats {
    totalEmployees: bigint;
    monthlyFeesCollected: bigint;
    totalStudents: bigint;
    pendingDues: bigint;
}
export interface ClassInfo {
    subjects: Array<string>;
    section: string;
    feeStructure: FeeStructure;
    className: string;
}
export interface FeeStructure {
    transport: bigint;
    tuition: bigint;
    examFees: bigint;
}
export interface Exam {
    date: Time;
    name: string;
    section: string;
    examId: string;
    className: string;
}
export interface Notice {
    title: string;
    postedBy: string;
    content: string;
    postedDate: Time;
    noticeId: string;
    attachment?: ExternalBlob;
}
export interface Employee {
    active: boolean;
    salary: bigint;
    name: string;
    designation: string;
    role: EmployeeRole;
    empId: string;
    department: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export interface Student {
    contact: string;
    admissionDate: Time;
    name: string;
    section: string;
    admissionNumber: string;
    photo: ExternalBlob;
    className: string;
    parentName: string;
}
export enum EmployeeRole {
    admin = "admin",
    teacher = "teacher",
    supportStaff = "supportStaff"
}
export enum PaymentMode {
    cash = "cash",
    cheque = "cheque",
    online = "online"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addClass(classInfo: ClassInfo): Promise<void>;
    addEmployee(employee: Employee): Promise<void>;
    addExam(exam: Exam): Promise<void>;
    addNotice(notice: Notice): Promise<void>;
    addStudent(student: Student): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteClass(className: string, section: string): Promise<void>;
    deleteEmployee(empId: string): Promise<void>;
    deleteExam(examId: string): Promise<void>;
    deleteNotice(noticeId: string): Promise<void>;
    deleteStudent(admissionNumber: string): Promise<void>;
    findAdminEmployees(): Promise<Array<Employee>>;
    findEmployee(empID: string): Promise<Employee | null>;
    findStudentByAdminNo(admissionNumber: string): Promise<Student | null>;
    findSupportStaffEmployees(): Promise<Array<Employee>>;
    findTeacherEmployees(): Promise<Array<Employee>>;
    getAllClasses(): Promise<Array<ClassInfo>>;
    getAllNotices(): Promise<Array<Notice>>;
    getAttendance(date: Time, className: string, section: string): Promise<Array<Attendance>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClass(className: string, section: string): Promise<ClassInfo | null>;
    getDashboardStats(): Promise<DashboardStats>;
    getExam(examId: string): Promise<Exam | null>;
    getFeeLedger(studentAdmissionNumber: string): Promise<Array<FeePayment>>;
    getFeePayment(receiptNumber: string): Promise<FeePayment | null>;
    getNotice(noticeId: string): Promise<Notice | null>;
    getOutstandingBalance(studentAdmissionNumber: string): Promise<bigint>;
    getReportCard(studentAdmissionNumber: string): Promise<Array<StudentMark>>;
    getStudentAttendance(studentAdmissionNumber: string): Promise<Array<Attendance>>;
    getStudentMarks(studentAdmissionNumber: string, examId: string): Promise<Array<StudentMark>>;
    getStudentsByClass(className: string, section: string): Promise<Array<Student>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markAttendance(attendanceRecord: Attendance): Promise<void>;
    recordFeePayment(payment: FeePayment): Promise<void>;
    recordMarks(mark: StudentMark): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchStudentsByName(name: string): Promise<Array<Student>>;
    updateClass(className: string, section: string, classInfo: ClassInfo): Promise<void>;
    updateEmployee(empId: string, employee: Employee): Promise<void>;
    updateExam(examId: string, exam: Exam): Promise<void>;
    updateNotice(noticeId: string, notice: Notice): Promise<void>;
    updateStudent(admissionNumber: string, student: Student): Promise<void>;
}
