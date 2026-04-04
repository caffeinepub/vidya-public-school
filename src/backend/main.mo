import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Storage "blob-storage/Storage";
import Array "mo:core/Array";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Include persistent blob-storage
  include MixinStorage();

  // Authorization system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Student = {
    admissionNumber : Text;
    name : Text;
    className : Text;
    section : Text;
    parentName : Text;
    contact : Text;
    photo : Storage.ExternalBlob;
    admissionDate : Time.Time;
  };

  public type Employee = {
    empId : Text;
    name : Text;
    role : EmployeeRole;
    department : Text;
    designation : Text;
    salary : Nat;
    active : Bool;
  };

  public type EmployeeRole = {
    #teacher;
    #admin;
    #supportStaff;
  };

  module EmployeeRole {
    public func toText(role : EmployeeRole) : Text {
      switch (role) {
        case (#teacher) { "Teacher" };
        case (#admin) { "Admin" };
        case (#supportStaff) { "Support Staff" };
      };
    };
  };

  public type ClassInfo = {
    className : Text;
    section : Text;
    subjects : [Text];
    feeStructure : FeeStructure;
  };

  public type FeeStructure = {
    tuition : Nat;
    transport : Nat;
    examFees : Nat;
  };

  public type FeePayment = {
    receiptNumber : Text;
    studentAdmissionNumber : Text;
    amount : Nat;
    paymentDate : Time.Time;
    paymentMode : PaymentMode;
    discount : ?Nat;
    fine : ?Nat;
  };

  public type PaymentMode = {
    #cash;
    #cheque;
    #online;
  };

  module PaymentMode {
    public func toText(mode : PaymentMode) : Text {
      switch (mode) {
        case (#cash) { "Cash" };
        case (#cheque) { "Cheque" };
        case (#online) { "Online" };
      };
    };
  };

  public type Exam = {
    examId : Text;
    name : Text;
    className : Text;
    section : Text;
    date : Time.Time;
  };

  public type StudentMark = {
    studentAdmissionNumber : Text;
    examId : Text;
    subject : Text;
    marks : Nat;
    grade : Text;
  };

  public type Attendance = {
    date : Time.Time;
    className : Text;
    section : Text;
    studentAdmissionNumber : Text;
    present : Bool;
  };

  public type Notice = {
    noticeId : Text;
    title : Text;
    content : Text;
    postedBy : Text;
    attachment : ?Storage.ExternalBlob;
    postedDate : Time.Time;
  };

  public type DashboardStats = {
    totalStudents : Nat;
    totalEmployees : Nat;
    monthlyFeesCollected : Nat;
    pendingDues : Nat;
  };

  // Persistent data structures
  let students = Map.empty<Text, Student>();
  let employees = Map.empty<Text, Employee>();
  let classes = Map.empty<Text, ClassInfo>();
  let fees = Map.empty<Text, FeePayment>();
  let exams = Map.empty<Text, Exam>();
  let marks = Map.empty<Text, StudentMark>();
  let attendance = Map.empty<Time.Time, Map.Map<Text, Attendance>>();
  let notices = Map.empty<Text, Notice>();

  // Student Management - Admin only for modifications

  public shared ({ caller }) func addStudent(student : Student) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add a student");
    };

    if (students.containsKey(student.admissionNumber)) {
      Runtime.trap("Student with this admission number already exists");
    };
    students.add(student.admissionNumber, student);
  };

  public shared ({ caller }) func updateStudent(admissionNumber : Text, student : Student) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update a student");
    };

    if (not students.containsKey(admissionNumber)) {
      Runtime.trap("Student not found");
    };
    students.add(admissionNumber, student);
  };

  public shared ({ caller }) func deleteStudent(admissionNumber : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete a student");
    };

    students.remove(admissionNumber);
  };

  public query ({ caller }) func findStudentByAdminNo(admissionNumber : Text) : async ?Student {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    students.get(admissionNumber);
  };

  public query ({ caller }) func getStudentsByClass(className : Text, section : Text) : async [Student] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    students.values().toArray().filter(
      func(s) {
        s.className == className and s.section == section
      }
    );
  };

  public query ({ caller }) func searchStudentsByName(name : Text) : async [Student] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    students.values().toArray().filter(
      func(s) {
        s.name == name
      }
    );
  };

  // Employee Management - Admin only for modifications

  public shared ({ caller }) func addEmployee(employee : Employee) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add an employee");
    };

    if (employees.containsKey(employee.empId)) {
      Runtime.trap("Employee with this ID already exists");
    };
    employees.add(employee.empId, employee);
  };

  public shared ({ caller }) func updateEmployee(empId : Text, employee : Employee) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update an employee");
    };

    if (not employees.containsKey(empId)) {
      Runtime.trap("Employee not found");
    };
    employees.add(empId, employee);
  };

  public shared ({ caller }) func deleteEmployee(empId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete an employee");
    };

    employees.remove(empId);
  };

  public query ({ caller }) func findEmployee(empID : Text) : async ?Employee {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    employees.get(empID);
  };

  public query ({ caller }) func findTeacherEmployees() : async [Employee] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    employees.values().toArray().filter(
      func(e) {
        e.role == #teacher;
      }
    );
  };

  public query ({ caller }) func findSupportStaffEmployees() : async [Employee] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    employees.values().toArray().filter(
      func(e) {
        e.role == #supportStaff;
      }
    );
  };

  public query ({ caller }) func findAdminEmployees() : async [Employee] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    employees.values().toArray().filter(
      func(e) {
        e.role == #admin;
      }
    );
  };

  // Class Management - Admin only for modifications

  public shared ({ caller }) func addClass(classInfo : ClassInfo) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add a class");
    };

    let key = classInfo.className # "-" # classInfo.section;
    if (classes.containsKey(key)) {
      Runtime.trap("Class with this name and section already exists");
    };
    classes.add(key, classInfo);
  };

  public shared ({ caller }) func updateClass(className : Text, section : Text, classInfo : ClassInfo) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update a class");
    };

    let key = className # "-" # section;
    if (not classes.containsKey(key)) {
      Runtime.trap("Class not found");
    };
    classes.add(key, classInfo);
  };

  public shared ({ caller }) func deleteClass(className : Text, section : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete a class");
    };

    let key = className # "-" # section;
    classes.remove(key);
  };

  public query ({ caller }) func getClass(className : Text, section : Text) : async ?ClassInfo {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    let key = className # "-" # section;
    classes.get(key);
  };

  public query ({ caller }) func getAllClasses() : async [ClassInfo] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    classes.values().toArray();
  };

  // Fee Payment Management - Admin only for modifications

  public shared ({ caller }) func recordFeePayment(payment : FeePayment) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can record fee payments");
    };

    if (fees.containsKey(payment.receiptNumber)) {
      Runtime.trap("Receipt number already exists");
    };
    fees.add(payment.receiptNumber, payment);
  };

  public query ({ caller }) func getFeePayment(receiptNumber : Text) : async ?FeePayment {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    fees.get(receiptNumber);
  };

  public query ({ caller }) func getFeeLedger(studentAdmissionNumber : Text) : async [FeePayment] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    fees.values().toArray().filter(
      func(f) {
        f.studentAdmissionNumber == studentAdmissionNumber
      }
    );
  };

  public query ({ caller }) func getOutstandingBalance(studentAdmissionNumber : Text) : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };

    let student = students.get(studentAdmissionNumber);
    switch (student) {
      case null { 0 };
      case (?s) {
        let classKey = s.className # "-" # s.section;
        let classInfo = classes.get(classKey);
        switch (classInfo) {
          case null { 0 };
          case (?c) {
            let totalFees = c.feeStructure.tuition + c.feeStructure.transport + c.feeStructure.examFees;
            let payments = fees.values().toArray().filter(
              func(f) {
                f.studentAdmissionNumber == studentAdmissionNumber
              }
            );
            var totalPaid : Nat = 0;
            for (payment in payments.vals()) {
              totalPaid += payment.amount;
            };
            if (totalFees > totalPaid) {
              totalFees - totalPaid
            } else {
              0
            };
          };
        };
      };
    };
  };

  // Exam Management - Admin only for modifications

  public shared ({ caller }) func addExam(exam : Exam) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add exams");
    };

    if (exams.containsKey(exam.examId)) {
      Runtime.trap("Exam with this ID already exists");
    };
    exams.add(exam.examId, exam);
  };

  public shared ({ caller }) func updateExam(examId : Text, exam : Exam) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update exams");
    };

    if (not exams.containsKey(examId)) {
      Runtime.trap("Exam not found");
    };
    exams.add(examId, exam);
  };

  public shared ({ caller }) func deleteExam(examId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete exams");
    };

    exams.remove(examId);
  };

  public query ({ caller }) func getExam(examId : Text) : async ?Exam {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    exams.get(examId);
  };

  // Marks Management - Admin only for modifications

  public shared ({ caller }) func recordMarks(mark : StudentMark) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can record marks");
    };

    let key = mark.studentAdmissionNumber # "-" # mark.examId # "-" # mark.subject;
    marks.add(key, mark);
  };

  public query ({ caller }) func getStudentMarks(studentAdmissionNumber : Text, examId : Text) : async [StudentMark] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    marks.values().toArray().filter(
      func(m) {
        m.studentAdmissionNumber == studentAdmissionNumber and m.examId == examId
      }
    );
  };

  public query ({ caller }) func getReportCard(studentAdmissionNumber : Text) : async [StudentMark] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };
    marks.values().toArray().filter(
      func(m) {
        m.studentAdmissionNumber == studentAdmissionNumber
      }
    );
  };

  // Attendance Management - Admin only for modifications

  public shared ({ caller }) func markAttendance(attendanceRecord : Attendance) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can mark attendance");
    };

    let dateKey = attendanceRecord.date;
    let studentKey = attendanceRecord.studentAdmissionNumber;

    switch (attendance.get(dateKey)) {
      case null {
        let dayMap = Map.empty<Text, Attendance>();
        dayMap.add(studentKey, attendanceRecord);
        attendance.add(dateKey, dayMap);
      };
      case (?dayMap) {
        dayMap.add(studentKey, attendanceRecord);
      };
    };
  };

  public query ({ caller }) func getAttendance(date : Time.Time, className : Text, section : Text) : async [Attendance] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };

    switch (attendance.get(date)) {
      case null { [] };
      case (?dayMap) {
        dayMap.values().toArray().filter(
          func(a) {
            a.className == className and a.section == section
          }
        );
      };
    };
  };

  public query ({ caller }) func getStudentAttendance(studentAdmissionNumber : Text) : async [Attendance] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access this info");
    };

    var result : [Attendance] = [];
    for (dayMap in attendance.values()) {
      let records = dayMap.values().toArray().filter(
        func(a) {
          a.studentAdmissionNumber == studentAdmissionNumber
        }
      );
      result := result.concat(records);
    };
    result;
  };

  // Notice Management - Admin only for modifications

  public shared ({ caller }) func addNotice(notice : Notice) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add notices");
    };

    if (notices.containsKey(notice.noticeId)) {
      Runtime.trap("Notice with this ID already exists");
    };
    notices.add(notice.noticeId, notice);
  };

  public shared ({ caller }) func updateNotice(noticeId : Text, notice : Notice) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can update notices");
    };

    if (not notices.containsKey(noticeId)) {
      Runtime.trap("Notice not found");
    };
    notices.add(noticeId, notice);
  };

  public shared ({ caller }) func deleteNotice(noticeId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can delete notices");
    };

    notices.remove(noticeId);
  };

  public query func getAllNotices() : async [Notice] {
    // Public access - no authentication required
    notices.values().toArray();
  };

  public query ({ caller }) func getNotice(noticeId : Text) : async ?Notice {
    // Public access - no authentication required
    notices.get(noticeId);
  };

  // Dashboard Stats - User access required

  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only authenticated users can access dashboard stats");
    };

    let totalStudents = students.size();
    let totalEmployees = employees.size();

    // Calculate monthly fees collected (simplified - last 30 days)
    let now = Time.now();
    let thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1_000_000_000);
    var monthlyFeesCollected : Nat = 0;
    for (payment in fees.values()) {
      if (payment.paymentDate >= thirtyDaysAgo) {
        monthlyFeesCollected += payment.amount;
      };
    };

    // TODO: Calculate pending dues
    var pendingDues : Nat = totalStudents;

    {
      totalStudents = totalStudents;
      totalEmployees = totalEmployees;
      monthlyFeesCollected = monthlyFeesCollected;
      pendingDues = pendingDues;
    };
  };
};
