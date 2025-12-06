
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Users, PlusCircle } from "lucide-react";
import type { Student, Assignment, User, Classroom } from "@/lib/types";
import { mockAssignments, mockStudentGrades, mockClassrooms } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";
import { users } from "@/lib/users";
import { getStudents } from "@/lib/firebase/firestore";

type GradeData = {
  [studentId: string]: {
    [assignmentId: string]: number | null;
  };
};

function calculateOverallGrade(studentId: string, grades: GradeData, assignments: Assignment[]): string {
  const studentGrades = grades[studentId];
  if (!studentGrades) return "0.00%";
  
  let totalScore = 0;
  let totalMaxScore = 0;

  assignments.forEach(assignment => {
    const score = studentGrades[assignment.id];
    if (score !== null && score !== undefined) {
      totalScore += score;
      totalMaxScore += assignment.maxPoints;
    }
  });

  if (totalMaxScore === 0) return "0.00%";
  
  const percentage = (totalScore / totalMaxScore) * 100;
  return `${percentage.toFixed(2)}%`;
}

function calculateClassAverage(assignmentId: string, grades: GradeData, students: Student[]): string {
  let totalScore = 0;
  let count = 0;

  students.forEach(student => {
    const score = grades[student.id]?.[assignmentId];
    if (score !== null && score !== undefined) {
      totalScore += score;
      count++;
    }
  });

  if (count === 0) return "-";
  
  const average = totalScore / count;
  return average.toFixed(2);
}

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userEmail = localStorage.getItem('loggedInUser');
  if (!userEmail) return null;
  return users.find(u => u.email === userEmail) || null;
}

export default function LecturerGradingPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [grades, setGrades] = useState<GradeData>(mockStudentGrades);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lecturerClasses, setLecturerClasses] = useState<Classroom[]>([]);
  const [selectedClass, setSelectedClass] = useState('');

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

  const handleGradeChange = (studentId: string, assignmentId: string, value: string) => {
    const newGrades = { ...grades };
    if (!newGrades[studentId]) {
      newGrades[studentId] = {};
    }
    const score = value === "" ? null : Number(value);
    newGrades[studentId][assignmentId] = score;
    setGrades(newGrades);
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto py-4">
        <PageHeader
            title="Pengelolaan Penilaian"
            description="Masukkan dan kelola nilai siswa untuk tugas, kuis, dan ujian."
        />
        <Skeleton className="h-[600px] w-full" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4">
      <PageHeader
        title="Pengelolaan Penilaian"
        description="Masukkan dan kelola nilai siswa untuk tugas, kuis, dan ujian."
      >
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Buat Tugas
        </Button>
      </PageHeader>

      <Tabs defaultValue="grades">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="grades">Penilaian</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
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
          </div>
        </div>
        <TabsContent value="grades">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="sticky left-0 bg-muted z-10 w-[300px]">
                        Nama Siswa
                      </TableHead>
                      <TableHead className="w-[120px]">Rata-rata</TableHead>
                      {mockAssignments.map((assignment) => (
                        <TableHead key={assignment.id} className="w-[180px]">
                          <div className="flex items-center justify-between">
                            <div>
                                <a href="#" className="font-semibold text-primary hover:underline">{assignment.title}</a>
                                <div className="text-xs text-muted-foreground">
                                    {assignment.dueDate ? `Jatuh tempo ${assignment.dueDate}` : "Tanpa batas waktu"}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Dari {assignment.maxPoints}
                                </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Ubah</DropdownMenuItem>
                                <DropdownMenuItem>Hapus</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                     <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell className="sticky left-0 bg-muted z-10 font-medium">
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Rata-rata Kelas</span>
                            </div>
                        </TableCell>
                        <TableCell></TableCell>
                        {mockAssignments.map(assignment => (
                            <TableCell key={assignment.id} className="font-medium text-center">
                               {students.length > 0 ? calculateClassAverage(assignment.id, grades, students) : '-'}
                            </TableCell>
                        ))}
                    </TableRow>
                    {students.length > 0 ? students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="sticky left-0 bg-card z-10">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-muted-foreground">
                           {calculateOverallGrade(student.id, grades, mockAssignments)}
                        </TableCell>
                        {mockAssignments.map((assignment) => (
                          <TableCell key={assignment.id}>
                            <div className="flex items-center gap-1">
                                <Input
                                type="number"
                                value={grades[student.id]?.[assignment.id] ?? ""}
                                onChange={(e) => handleGradeChange(student.id, assignment.id, e.target.value)}
                                className="w-20 text-center"
                                placeholder="__"
                                />
                                <span className="text-muted-foreground text-sm">/ {assignment.maxPoints}</span>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={mockAssignments.length + 2} className="h-24 text-center">
                           Pilih kelas untuk melihat data penilaian.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
            <Card>
                <CardContent className="p-6">
                    <p className="text-muted-foreground">Pengaturan penilaian akan segera tersedia.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
