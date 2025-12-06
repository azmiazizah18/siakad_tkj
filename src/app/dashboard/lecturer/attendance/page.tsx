
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockStudents, mockClassrooms } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import type { Student, User, Classroom } from "@/lib/types";
import { cn } from "@/lib/utils";
import { users } from "@/lib/users";
import { getStudents } from "@/lib/firebase/firestore";

type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';

// A simple date picker component placeholder if it doesn't exist
function DatePickerComponent() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toISOString().substring(0, 10));
  }, []);

  return (
    <input
      type="date"
      value={currentDate}
      onChange={(e) => setCurrentDate(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  );
}

function PageSkeleton() {
  return (
    <div className="container mx-auto py-4">
       <PageHeader title="Pengelolaan Absensi" description="Catat dan pantau kehadiran siswa untuk setiap mata pelajaran." />
       <Card>
        <CardHeader>
           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <Skeleton className="h-7 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-[180px]" />
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-24" />
            </div>
           </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"><Skeleton className="h-5 w-5" /></TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead className="text-center w-64">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex justify-center gap-1">
                          <Skeleton className="h-8 w-14" />
                          <Skeleton className="h-8 w-14" />
                          <Skeleton className="h-8 w-14" />
                          <Skeleton className="h-8 w-14" />
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
         <CardFooter className="flex items-center justify-between border-t pt-6">
            <Skeleton className="h-5 w-48" />
            <div className="flex gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
                <Skeleton className="h-9 w-16" />
            </div>
        </CardFooter>
       </Card>
    </div>
  );
}

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userEmail = localStorage.getItem('loggedInUser');
  if (!userEmail) return null;
  return users.find(u => u.email === userEmail) || null;
}

export default function LecturerAttendancePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lecturerClasses, setLecturerClasses] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [attendanceStatus, setAttendanceStatus] = useState<Record<string, AttendanceStatus>>({});
  
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsMounted(true);
    
    const fetchAllStudents = async () => {
        const studentsFromDb = await getStudents();
        setAllStudents(studentsFromDb);
    };
    fetchAllStudents();
    
    if (user) {
        const userClasses = mockClassrooms.filter(c => c.lecturerName === user.name);
        setLecturerClasses(userClasses);
        if (userClasses.length > 0) {
            setSelectedClass(userClasses[0].className);
        }
    }
  }, []);

  const students = allStudents.filter(s => s.class === selectedClass);
  
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceStatus(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleBulkAction = (status: AttendanceStatus) => {
    const newStatus = { ...attendanceStatus };
    selectedStudents.forEach(studentId => {
      newStatus[studentId] = status;
    });
    setAttendanceStatus(newStatus);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedStudents(students.map((student) => student.id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents((prev) => [...prev, studentId]);
    } else {
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const isAllSelected = selectedStudents.length === students.length && students.length > 0;
  const isSomeSelected = selectedStudents.length > 0 && selectedStudents.length < students.length;

  if (!isMounted) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto py-4">
      <PageHeader
        title="Pengelolaan Absensi"
        description="Catat dan pantau kehadiran siswa untuk setiap mata pelajaran."
      />
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>Rekap Absensi</CardTitle>
            <div className="flex gap-2">
               <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {lecturerClasses.map(c => (
                    <SelectItem key={c.id} value={c.className}>{c.className}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <DatePickerComponent />
               <Button>Terapkan</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected || (isSomeSelected && 'indeterminate')}
                      onCheckedChange={handleSelectAll}
                      aria-label="Pilih semua"
                      disabled={students.length === 0}
                    />
                  </TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead className="text-center w-72">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length > 0 ? students.map((student) => (
                  <TableRow key={student.id} data-state={selectedStudents.includes(student.id) && 'selected'}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleSelectStudent(student.id, !!checked)}
                        aria-label={`Pilih ${student.name}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                           <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{student.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                       <div className="flex justify-center gap-1">
                          {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as AttendanceStatus[]).map(status => (
                             <Button 
                                key={status}
                                variant={attendanceStatus[student.id] === status ? 'default' : 'outline'} 
                                size="sm" 
                                className="text-xs h-8 w-16"
                                onClick={() => handleStatusChange(student.id, status)}
                              >
                                {status}
                              </Button>
                          ))}
                       </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">
                      Pilih kelas untuk melihat daftar siswa.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
                {selectedStudents.length} dari {students.length} siswa dipilih.
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleBulkAction('Hadir')} disabled={selectedStudents.length === 0}>Hadir Semua</Button>
                <Button variant="outline" onClick={() => handleBulkAction('Izin')} disabled={selectedStudents.length === 0}>Izin</Button>
                <Button variant="outline" onClick={() => handleBulkAction('Sakit')} disabled={selectedStudents.length === 0}>Sakit</Button>
                <Button variant="destructive" onClick={() => handleBulkAction('Alpa')} disabled={selectedStudents.length === 0}>Alpa</Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// Minimal placeholder for DatePicker in case it doesn't exist yet.
// In a real scenario, this would be a full-fledged component using react-day-picker.
namespace JSX {
  interface IntrinsicElements {
    'date-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
  }
}
