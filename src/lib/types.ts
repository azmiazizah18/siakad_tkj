
import type { LucideIcon } from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

export type Student = {
  id: string; // This will now be the Firestore document ID
  nis: string; // The student's unique school ID number
  name: string;
  email: string;
  class: string;
  enrollmentDate: string;
  status: 'Active' | 'Inactive' | 'Graduated';
};

export type Lecturer = {
  id: string;
  name: string;
  email: string;
  subject: string;
  hireDate: string;
  status: 'Active' | 'Inactive';
};

export type Course = {
  id: string;
  name: string;
  code: string;
  credits: number;
};

export type Grade = {
  courseName: string;
  courseCode: string;
  grade: string;
  semester: string;
};

export type Attendance = {
  courseName: string;
  totalClasses: number;
  attendedClasses: number;
};

export type ScheduleItem = {
  time: string;
  courseName: string;
  courseCode: string;
  location: string;
  day?: string;
  class?: string;
};

export type Notification = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
};

export type User = {
  email: string;
  password: string;
  role: 'admin' | 'lecturer' | 'student';
  name: string;
};

export type Classroom = {
  id: string;
  className: string;
  courseName: string;
  lecturerName: string;
  studentCount: number;
  imageUrl: string;
  imageHint: string;
}

export type Assignment = {
  id: string;
  title: string;
  dueDate: string | null;
  maxPoints: number;
};

export type StudentGrade = {
  studentId: string;
  assignmentId: string;
  score: number | null;
};
