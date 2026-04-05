# Vidya Public School – ERP Bug Fixes & Enhancements

## Current State
- Student portal exists at `/student-portal` with 10 sections
- Documents section shows a toast 'ready for download' on click – no actual document generated
- Homework section shows Overdue/Due Soon badges but no way for student to submit or mark status
- Report Card (Results section) has a Print button but the printed/previewed card has no header (school name/logo/address) or footer (signature/seal line)
- Teacher HomeworkManagePage only allows assign/edit/delete homework – no way to see or update student submission statuses
- `Homework` type has no `status` field; no `HomeworkSubmission` model exists

## Requested Changes (Diff)

### Add
- `HomeworkSubmission` interface in types: `{ submissionId, homeworkId, studentAdmissionNumber, submittedDate, status: 'pending'|'submitted'|'graded', note, grade, teacherComment }`
- Sample data for `SAMPLE_HOMEWORK_SUBMISSIONS` in sampleData.ts
- `homeworkSubmissions` state + CRUD in AppContext (addSubmission, updateSubmission)
- Student portal Homework section: per-assignment "Submit" button; shows current submission status badge; marks as submitted on click with optional note
- Student portal Documents section: clicking Download generates a printable document view (school header + doc details + seal/footer) in a Dialog, with a Print button – not just a toast
- Report Card print view: add school header (logo + name + address) above the marks table and a footer (authorised signatory line) below – identical pattern as the fee receipt header/footer
- Teacher/Admin HomeworkManagePage: add a "Submissions" panel / drawer per homework entry – shows list of students in that class/section with their submission status (Pending/Submitted/Graded); teacher can update status and add grade/comment per student

### Modify
- `StudentPortal.tsx` – homework and documents case blocks, results case (report card print area)
- `HomeworkManagePage.tsx` – add Submissions side panel
- `AppContext.tsx` – add homeworkSubmissions state + CRUD
- `types/index.ts` – add HomeworkSubmission interface
- `data/sampleData.ts` – add SAMPLE_HOMEWORK_SUBMISSIONS

### Remove
- Toast-only download behavior in Documents section

## Implementation Plan
1. Add `HomeworkSubmission` to `types/index.ts`
2. Add `SAMPLE_HOMEWORK_SUBMISSIONS` to `data/sampleData.ts`
3. Wire `homeworkSubmissions` state + CRUD into `AppContext.tsx`
4. Update `StudentPortal.tsx`:
   a. Homework section: show submission status per assignment; add Submit dialog with optional note
   b. Documents section: open printable Dialog with school header + document details + footer/print button
   c. Results section: wrap marks table in a printable report card container with school header + footer
5. Update `HomeworkManagePage.tsx`: add Submissions button per row that opens a dialog showing all students in that class/section with submission status; allow teacher to update status + add grade/comment
