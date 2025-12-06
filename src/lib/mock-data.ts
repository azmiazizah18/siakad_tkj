

import type { Student, Course, NavItem, Grade, Attendance, ScheduleItem, Notification, Lecturer, Classroom, Assignment, StudentGrade, User } from './types';
import { PieChart, Users, BookOpen, ClipboardCheck, GraduationCap, BrainCircuit, Calendar, Award, UserCheck, Settings, School, Archive } from 'lucide-react';

export const adminNavItems: NavItem[] = [
  { href: '/dashboard/admin', label: 'Dashboard', icon: PieChart },
  { href: '/dashboard/admin/students', label: 'Siswa', icon: Users },
  { href: '/dashboard/admin/lecturers', label: 'Guru', icon: GraduationCap },
  { href: '/dashboard/admin/classes', label: 'Kelas', icon: School },
  { href: '/dashboard/admin/schedule', label: 'Jadwal & Kalender', icon: Calendar },
];

export const studentNavItems: NavItem[] = [
  { href: '/dashboard/student', label: 'Dashboard', icon: PieChart },
  { href: '/dashboard/student/schedule', label: 'Jadwal', icon: Calendar },
  { href: '/dashboard/student/subjects', label: 'Mata Pelajaran', icon: BookOpen },
  { href: '/dashboard/student/grades', label: 'Nilai', icon: ClipboardCheck },
];

export const lecturerNavItems: NavItem[] = [
  { href: '/dashboard/lecturer', label: 'Dashboard', icon: PieChart },
  { href: '/dashboard/student/subjects', label: 'Manajemen Mata Pelajaran', icon: BookOpen },
  { href: '/dashboard/lecturer/grading', label: 'Penugasan & Penilaian', icon: Award },
  { href: '/dashboard/lecturer/schedule', label: 'Jadwal Mengajar', icon: Calendar },
];

// This is now just for initial setup reference or fallback, 
// as the main data will be fetched from Firestore.
export const mockStudents: Student[] = [
];

export const users: User[] = [
  {
    email: 'admin@gmail.com',
    password: 'password123',
    role: 'admin',
    name: 'Admin User',
  },
  {
    email: 'dedisuandisetiawan@gmail.com',
    password: 'password123',
    role: 'lecturer',
    name: 'Dedi Suandi Setiawan, S.Pd., M.Pd.',
  },
  {
    email: 'ahmadbustomisahrul@gmail.com',
    password: 'password123',
    role: 'lecturer',
    name: 'Ahmad Bustomi Sahrul, S.Pd.',
  },
  {
    email: 'ahmadsanusi@gmail.com',
    password: 'password123',
    role: 'lecturer',
    name: 'Ahmad Sanusi, S.Kom., M.Sos.',
  },
   {
    email: 'bimukajatiandromeda@gmail.com',
    password: 'password123',
    role: 'lecturer',
    name: 'Bimuka Jati Andromeda, S.Pd.',
  },
   {
    email: 'amosisdianto@gmail.com',
    password: 'password123',
    role: 'lecturer',
    name: 'Amo Sisdianto, S.Kom.',
  },
  {
    email: 'student@gmail.com',
    password: 'password123',
    role: 'student',
    name: 'Student User',
  },
  {
    email: 'nurazmidhimasazizah@gmail.com',
    password: 'password123',
    role: 'student',
    name: 'Nurazmi Dhimas Azizah',
  },
];


export const mockLecturers: Lecturer[] = [
    { id: 'L001', name: 'Dedi Suandi Setiawan, S.Pd., M.Pd.', email: 'dedisuandisetiawan@gmail.com', subject: 'Dasar Dasar Pemrograman', hireDate: '2020-01-10', status: 'Active' },
    { id: 'L002', name: 'Ahmad Bustomi Sahrul, S.Pd.', email: 'ahmadbustomisahrul@gmail.com', subject: 'Jaringan Komputer', hireDate: '2018-05-22', status: 'Active' },
    { id: 'L003', name: 'Ahmad Sanusi, S.Kom., M.Sos.', email: 'ahmadsanusi@gmail.com', subject: 'Keamanan Jaringan', hireDate: '2021-08-01', status: 'Active' },
    { id: 'L004', name: 'Bimuka Jati Andromeda, S.Pd.', email: 'bimukajatiandromeda@gmail.com', subject: 'Administrasi Sistem Jaringan', hireDate: '2019-11-15', status: 'Active' },
    { id: 'L005', name: 'Amo Sisdianto, S.Kom.', email: 'amosisdianto@gmail.com', subject: 'Sistem Komputer', hireDate: '2022-02-20', status: 'Active' },
];

export const mockCourses: Course[] = [
    { id: 'C001', name: 'Dasar Dasar Pemrograman', code: 'INF101', credits: 3 },
    { id: 'C002', name: 'Jaringan Komputer', code: 'INF102', credits: 3 },
    { id: 'C003', name: 'Keamanan Jaringan', code: 'INF202', credits: 3 },
    { id: 'C004', name: 'Administrasi Sistem Jaringan', code: 'INF301', credits: 4 },
    { id: 'C005', name: 'Sistem Komputer', code: 'INF103', credits: 3 },
];

export const mockGrades: Grade[] = [
    { courseName: 'Dasar Dasar Pemrograman', courseCode: 'INF101', grade: 'A', semester: 'X TKJ' },
    { courseName: 'Jaringan Komputer', courseCode: 'INF102', grade: 'B+', semester: 'X TKJ' },
    { courseName: 'Keamanan Jaringan', courseCode: 'INF202', grade: 'B', semester: 'X TKJ' },
    { courseName: 'Administrasi Sistem Jaringan', courseCode: 'INF301', grade: 'A-', semester: 'X TKJ' },
    { courseName: 'Sistem Komputer', courseCode: 'INF103', grade: 'B+', semester: 'X TKJ' },
];

export const mockAttendance: Attendance[] = [
    { courseName: 'Dasar Dasar Pemrograman', totalClasses: 30, attendedClasses: 28 },
    { courseName: 'Jaringan Komputer', totalClasses: 30, attendedClasses: 29 },
    { courseName: 'Keamanan Jaringan', totalClasses: 28, attendedClasses: 25 },
    { courseName: 'Administrasi Sistem Jaringan', totalClasses: 32, attendedClasses: 31 },
    { courseName: 'Sistem Komputer', totalClasses: 28, attendedClasses: 27 },
];

export const mockSchedule: ScheduleItem[] = [
    { time: '07:00 - 08:30', courseName: 'Jaringan Komputer', courseCode: 'INF102', location: 'Lab TKJ 2' },
];

export const mockNotifications: Notification[] = [
    { id: 'N001', title: 'Pengingat Tugas: Algoritma Dasar', description: 'Tugas untuk mata pelajaran Dasar Dasar Pemrograman akan jatuh tempo besok.', timestamp: '1 hari lalu', read: false },
    { id: 'N002', title: 'Jadwal UTS Diterbitkan', description: 'Jadwal Ujian Tengah Semester kini tersedia di portal akademik Anda.', timestamp: '3 hari lalu', read: false },
    { id: 'N003', title: 'Materi Baru: Keamanan Jaringan', description: 'Materi baru untuk pertemuan ke-3 telah ditambahkan. Silakan dipelajari.', timestamp: '1 minggu lalu', read: true },
];

export const mockClassrooms: Classroom[] = [
    {
        id: "CLASS-001",
        className: "XI TKJ 1",
        courseName: "Dasar Dasar Pemrograman",
        lecturerName: "Dedi Suandi Setiawan, S.Pd., M.Pd.",
        studentCount: 36,
        imageUrl: "",
        imageHint: "",
    },
    {
        id: "CLASS-002",
        className: "XI TKJ 2",
        courseName: "Jaringan Komputer",
        lecturerName: "Ahmad Bustomi Sahrul, S.Pd.",
        studentCount: 34,
        imageUrl: "",
        imageHint: "",
    },
    {
        id: "CLASS-003",
        className: "XII TKJ 1",
        courseName: "Keamanan Jaringan",
        lecturerName: "Ahmad Sanusi, S.Kom., M.Sos.",
        studentCount: 35,
        imageUrl: "",
        imageHint: "",
    },
    {
        id: "CLASS-004",
        className: "XII TKJ 2",
        courseName: "Administrasi Sistem Jaringan",
        lecturerName: "Bimuka Jati Andromeda, S.Pd.",
        studentCount: 32,
        imageUrl: "",
        imageHint: "",
    },
     {
        id: "CLASS-005",
        className: "X TKJ 1",
        courseName: "Sistem Komputer",
        lecturerName: "Amo Sisdianto, S.Kom.",
        studentCount: 38,
        imageUrl: "",
        imageHint: "",
    },
        {
          id: "CLASS-006",
          className: "X TKJ 2",
          courseName: "Produk Kreatif dan Kewirausahaan",
          lecturerName: "Guru PKK",
          studentCount: 35,
          imageUrl: "",
          imageHint: "",
        }
];


export const mockAssignments: Assignment[] = [
    { id: 'A001', title: 'Tugas 1: Algoritma Dasar', dueDate: '2023-09-15', maxPoints: 100 },
    { id: 'A002', title: 'Tugas 2: Topologi Jaringan', dueDate: '2023-09-20', maxPoints: 100 },
    { id: 'A003', title: 'UTS', dueDate: '2023-10-05', maxPoints: 100 },
    { id: 'A004', title: 'UAS', dueDate: '2023-11-25', maxPoints: 100 },
];

export const mockStudentGrades: { [studentId: string]: { [assignmentId: string]: number | null } } = {
  'S001': { 'A001': 85, 'A002': 90, 'A003': 88, 'A004': 92 },
  'S002': { 'A001': 78, 'A002': 82, 'A003': 80, 'A004': 85 },
};

export const fallbackCourseData = {
    title: "Mata Pelajaran Tidak Ditemukan",
    sessions: [
        {
            title: "Error",
            items: [
                { id: "error-1", title: "Konten tidak dapat dimuat.", type: "Error", href: "", contentType: "component", completed: false },
            ]
        }
    ]
};

export const courseDataMap: { [key: string]: { title: string; sessions: { title: string; items: { id: string; title: string; type: string; href: string; contentType: string; completed: boolean; }[] }[] } } = {
  'dasar-dasar-pemrograman': {
    title: "Dasar Dasar Pemrograman",
    sessions: [
        {
            title: "Pertemuan 1: Pengenalan Algoritma",
            items: [
                { id: 'ddp-intro-1', title: "Materi Konsep Dasar Algoritma", type: "Materi", href: "https://online.fliphtml5.com/iognb/erwv/", contentType: "iframe", completed: false },
                { id: 'ddp-intro-2', title: "Catat Kehadiran Anda", type: "Absensi", href: "https://online.fliphtml5.com/iognb/mlbc/#p=1", contentType: "iframe", completed: false },
            ]
        },
    ]
  },
  'jaringan-komputer': {
    title: "Jaringan Komputer",
    sessions: [
        {
            title: "Pertemuan 1: Pengenalan Jaringan",
            items: [
                { id: 'jk-intro-1', title: "Materi Konsep Dasar Jaringan", type: "Materi", href: "https://online.fliphtml5.com/iognb/wffe/", contentType: "iframe", completed: false },
                { id: 'jk-intro-2', title: "Catat Kehadiran Anda", type: "Absensi", href: "https://online.fliphtml5.com/iognb/mlbc/#p=1", contentType: "iframe", completed: false },
            ]
        },
    ]
  },
  'keamanan-jaringan': {
    title: "Keamanan Jaringan",
    sessions: [
        {
            title: "Pertemuan 1: Konsep Dasar Keamanan",
            items: [
                { id: 'kj-intro-1', title: "Materi Konsep Dasar Keamanan", type: "Materi", href: "https://online.fliphtml5.com/iognb/yexx/", contentType: "iframe", completed: false },
                { id: 'kj-intro-2', title: "Catat Kehadiran Anda", type: "Absensi", href: "https://online.fliphtml5.com/iognb/mlbc/#p=1", contentType: "iframe", completed: false },
            ]
        },
    ]
  },
  'administrasi-sistem-jaringan': {
    title: "Administrasi Sistem Jaringan",
    sessions: [
        {
            title: "Pertemuan 1: Pengenalan Sistem Operasi Jaringan",
            items: [
                { id: 'asj-intro-1', title: "Materi Pengenalan OS Jaringan", type: "Materi", href: "https://online.fliphtml5.com/iognb/ngsf/#p=1", contentType: "iframe", completed: false },
                { id: 'asj-intro-2', title: "Catat Kehadiran Anda", type: "Absensi", href: "https://online.fliphtml5.com/iognb/mlbc/#p=1", contentType: "iframe", completed: false },
            ]
        },
    ]
  },
  'sistem-komputer': {
    title: "Sistem Komputer",
     sessions: [
        {
            title: "Pertemuan 1: Pengenalan Arsitektur Komputer",
            items: [
                { id: 'sk-intro-1', title: "Materi Arsitektur Komputer", type: "Materi", href: "https://online.fliphtml5.com/iognb/zhfq/", contentType: "iframe", completed: false },
                { id: 'sk-intro-2', title: "Catat Kehadiran Anda", type: "Absensi", href: "https://online.fliphtml5.com/iognb/mlbc/#p=1", contentType: "iframe", completed: false },
            ]
        },
    ]
  }
};

    