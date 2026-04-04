import { type ReactNode, createContext, useContext, useState } from "react";
import {
  SAMPLE_ATTENDANCE,
  SAMPLE_CLASSES,
  SAMPLE_EMPLOYEES,
  SAMPLE_EXAMS,
  SAMPLE_FEE_PAYMENTS,
  SAMPLE_MARKS,
  SAMPLE_NOTICES,
  SAMPLE_SALARY_RECORDS,
  SAMPLE_STUDENTS,
} from "../data/sampleData";
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
  UserSession,
} from "../types";
import { sessionStore } from "../utils/sessionStore";
import { safeStorage } from "../utils/storage";

interface AppStore {
  students: Student[];
  employees: Employee[];
  classes: ClassInfo[];
  exams: Exam[];
  marks: StudentMark[];
  feePayments: FeePayment[];
  notices: Notice[];
  attendance: Attendance[];
  salaryRecords: SalaryRecord[];
  session: UserSession | null;
  addStudent: (s: Student) => void;
  updateStudent: (admNo: string, s: Partial<Student>) => void;
  deleteStudent: (admNo: string) => void;
  addEmployee: (e: Employee) => void;
  updateEmployee: (empId: string, e: Partial<Employee>) => void;
  deleteEmployee: (empId: string) => void;
  addClass: (c: ClassInfo) => void;
  updateClass: (key: string, c: Partial<ClassInfo>) => void;
  deleteClass: (className: string, section: string) => void;
  addExam: (e: Exam) => void;
  updateExam: (examId: string, e: Partial<Exam>) => void;
  deleteExam: (examId: string) => void;
  addMark: (m: StudentMark) => void;
  updateMark: (key: string, m: Partial<StudentMark>) => void;
  addFeePayment: (p: FeePayment) => void;
  addNotice: (n: Notice) => void;
  updateNotice: (noticeId: string, n: Partial<Notice>) => void;
  deleteNotice: (noticeId: string) => void;
  markAttendance: (a: Attendance) => void;
  addSalaryRecord: (r: SalaryRecord) => void;
  updateSalaryRecord: (recordId: string, r: Partial<SalaryRecord>) => void;
  setSession: (s: UserSession | null) => void;
}

const AppContext = createContext<AppStore | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(SAMPLE_STUDENTS);
  const [employees, setEmployees] = useState<Employee[]>(SAMPLE_EMPLOYEES);
  const [classes, setClasses] = useState<ClassInfo[]>(SAMPLE_CLASSES);
  const [exams, setExams] = useState<Exam[]>(SAMPLE_EXAMS);
  const [marks, setMarks] = useState<StudentMark[]>(SAMPLE_MARKS);
  const [feePayments, setFeePayments] =
    useState<FeePayment[]>(SAMPLE_FEE_PAYMENTS);
  const [notices, setNotices] = useState<Notice[]>(SAMPLE_NOTICES);
  const [attendance, setAttendance] = useState<Attendance[]>(SAMPLE_ATTENDANCE);
  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>(
    SAMPLE_SALARY_RECORDS,
  );
  const [session, setSessionState] = useState<UserSession | null>(() => {
    const inMemory = sessionStore.get();
    if (inMemory) return inMemory;
    try {
      const stored = safeStorage.get("vidya_session");
      if (stored) {
        const parsed = JSON.parse(stored) as UserSession;
        sessionStore.set(parsed);
        return parsed;
      }
    } catch {
      /* ignore */
    }
    return null;
  });

  const handleSetSession = (s: UserSession | null) => {
    sessionStore.set(s);
    setSessionState(s);
    if (s) safeStorage.set("vidya_session", JSON.stringify(s));
    else safeStorage.remove("vidya_session");
  };

  const addStudent = (s: Student) => setStudents((prev) => [...prev, s]);
  const updateStudent = (admNo: string, s: Partial<Student>) =>
    setStudents((prev) =>
      prev.map((st) => (st.admissionNumber === admNo ? { ...st, ...s } : st)),
    );
  const deleteStudent = (admNo: string) =>
    setStudents((prev) => prev.filter((st) => st.admissionNumber !== admNo));

  const addEmployee = (e: Employee) => setEmployees((prev) => [...prev, e]);
  const updateEmployee = (empId: string, e: Partial<Employee>) =>
    setEmployees((prev) =>
      prev.map((em) => (em.empId === empId ? { ...em, ...e } : em)),
    );
  const deleteEmployee = (empId: string) =>
    setEmployees((prev) => prev.filter((em) => em.empId !== empId));

  const addClass = (c: ClassInfo) => setClasses((prev) => [...prev, c]);
  const updateClass = (key: string, c: Partial<ClassInfo>) =>
    setClasses((prev) =>
      prev.map((cl) =>
        `${cl.className}|${cl.section}` === key ? { ...cl, ...c } : cl,
      ),
    );
  const deleteClass = (className: string, section: string) =>
    setClasses((prev) =>
      prev.filter(
        (cl) => !(cl.className === className && cl.section === section),
      ),
    );

  const addExam = (e: Exam) => setExams((prev) => [...prev, e]);
  const updateExam = (examId: string, e: Partial<Exam>) =>
    setExams((prev) =>
      prev.map((ex) => (ex.examId === examId ? { ...ex, ...e } : ex)),
    );
  const deleteExam = (examId: string) =>
    setExams((prev) => prev.filter((ex) => ex.examId !== examId));

  const addMark = (m: StudentMark) =>
    setMarks((prev) => {
      const key = `${m.studentAdmissionNumber}|${m.examId}|${m.subject}`;
      const exists = prev.find(
        (mk) =>
          `${mk.studentAdmissionNumber}|${mk.examId}|${mk.subject}` === key,
      );
      if (exists)
        return prev.map((mk) =>
          `${mk.studentAdmissionNumber}|${mk.examId}|${mk.subject}` === key
            ? m
            : mk,
        );
      return [...prev, m];
    });
  const updateMark = (key: string, m: Partial<StudentMark>) =>
    setMarks((prev) =>
      prev.map((mk) =>
        `${mk.studentAdmissionNumber}|${mk.examId}|${mk.subject}` === key
          ? { ...mk, ...m }
          : mk,
      ),
    );

  const addFeePayment = (p: FeePayment) =>
    setFeePayments((prev) => [...prev, p]);

  const addNotice = (n: Notice) => setNotices((prev) => [n, ...prev]);
  const updateNotice = (noticeId: string, n: Partial<Notice>) =>
    setNotices((prev) =>
      prev.map((nt) => (nt.noticeId === noticeId ? { ...nt, ...n } : nt)),
    );
  const deleteNotice = (noticeId: string) =>
    setNotices((prev) => prev.filter((nt) => nt.noticeId !== noticeId));

  const markAttendance = (a: Attendance) =>
    setAttendance((prev) => {
      const key = `${a.studentAdmissionNumber}|${a.date}`;
      const exists = prev.find(
        (at) => `${at.studentAdmissionNumber}|${at.date}` === key,
      );
      if (exists)
        return prev.map((at) =>
          `${at.studentAdmissionNumber}|${at.date}` === key ? a : at,
        );
      return [...prev, a];
    });

  const addSalaryRecord = (r: SalaryRecord) =>
    setSalaryRecords((prev) => {
      const key = `${r.empId}|${r.month}|${r.year}`;
      const exists = prev.find(
        (sr) => `${sr.empId}|${sr.month}|${sr.year}` === key,
      );
      if (exists)
        return prev.map((sr) =>
          `${sr.empId}|${sr.month}|${sr.year}` === key ? r : sr,
        );
      return [...prev, r];
    });

  const updateSalaryRecord = (recordId: string, r: Partial<SalaryRecord>) =>
    setSalaryRecords((prev) =>
      prev.map((sr) => (sr.recordId === recordId ? { ...sr, ...r } : sr)),
    );

  return (
    <AppContext.Provider
      value={{
        students,
        employees,
        classes,
        exams,
        marks,
        feePayments,
        notices,
        attendance,
        salaryRecords,
        session,
        addStudent,
        updateStudent,
        deleteStudent,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addClass,
        updateClass,
        deleteClass,
        addExam,
        updateExam,
        deleteExam,
        addMark,
        updateMark,
        addFeePayment,
        addNotice,
        updateNotice,
        deleteNotice,
        markAttendance,
        addSalaryRecord,
        updateSalaryRecord,
        setSession: handleSetSession,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
