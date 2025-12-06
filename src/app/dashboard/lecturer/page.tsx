

"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockClassrooms, users as mockUsers } from "@/lib/mock-data";
import { Activity, PlusCircle, MoreVertical, Folder, Edit, Copy, Move, Link2, Archive as ArchiveIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type { User, Classroom, Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CreateClassDialog } from "@/components/dashboard/create-class-dialog";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getStudents } from "@/lib/firebase/firestore";

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userEmail = localStorage.getItem('loggedInUser');
  if (!userEmail) return null;
  return mockUsers.find(u => u.email === userEmail) || null;
}

export default function LecturerDashboardPage() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [activeClasses, setActiveClasses] = useState<Classroom[]>([]);
  const [archivedClasses, setArchivedClasses] = useState<Classroom[]>([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);

  useEffect(() => {
    // This effect now correctly fetches user and then data
    const user = getCurrentUser();
    setCurrentUser(user);

    async function fetchData(loggedInUser: User) {
      const lecturerClasses = mockClassrooms.filter(c => c.lecturerName === loggedInUser.name);
      setActiveClasses(lecturerClasses);
      
      try {
        const students = await getStudents();
        setAllStudents(students);
      } catch (e) {
        console.error("Failed to fetch students", e);
        toast({
            variant: "destructive",
            title: "Gagal memuat data siswa",
            description: "Terjadi kesalahan saat mengambil data siswa."
        });
      } finally {
        setIsLoading(false);
      }
    }

    if (user) {
        fetchData(user);
    } else {
        setIsLoading(false); // Stop loading if no user is found
    }
  }, [toast]);

  const lecturerName = currentUser?.name?.split(',')[0] || "Guru";

  const handleOpenDialog = (mode: "create" | "edit", classroom?: Classroom) => {
    setDialogMode(mode);
    setSelectedClass(classroom || null);
    setIsDialogOpen(true);
  };
  
  const handleDialogSubmit = (data: { className: string; subject: string; }) => {
    if (dialogMode === "create" && currentUser) {
      const newClass: Classroom = {
          id: `CLASS-${Date.now()}`,
          className: data.className,
          courseName: data.subject || 'Mata Pelajaran Baru',
          lecturerName: currentUser.name,
          studentCount: 0,
          imageUrl: `https://picsum.photos/seed/class-${Date.now()}/600/400`,
          imageHint: "classroom study",
      };
      setActiveClasses(prev => [newClass, ...prev]);
      toast({ title: "Kelas Dibuat", description: `Kelas "${data.className}" telah berhasil dibuat.` });
    } else if (dialogMode === "edit" && selectedClass) {
      const updatedData = { ...selectedClass, className: data.className, courseName: data.subject };
      setActiveClasses(prev => prev.map(c => 
        c.id === selectedClass.id ? updatedData : c
      ));
      toast({ title: "Kelas Diperbarui", description: `Kelas "${data.className}" telah diperbarui.` });
    }
  };

  const handleArchiveAction = (classId: string) => {
    const classToArchive = activeClasses.find(c => c.id === classId);
    if (classToArchive) {
      setActiveClasses(prev => prev.filter(c => c.id !== classId));
      setArchivedClasses(prev => [classToArchive, ...prev]);
      toast({ title: "Kelas Diarsipkan", description: `Kelas "${classToArchive.className}" telah diarsipkan.` });
    }
  };
  
  const showNotImplementedToast = (feature: string) => {
    toast({ title: "Fitur Dalam Pengembangan", description: `Fungsionalitas "${feature}" akan segera hadir.` });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader title="Dashboard Guru" description="Memuat data..." />
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-7 w-48 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-40 mb-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentUser) {
      return (
         <div className="container mx-auto p-4 md:p-6">
             <PageHeader title="Akses Ditolak" description="Anda harus login untuk melihat halaman ini." />
             <Button asChild><Link href="/">Kembali ke Beranda</Link></Button>
         </div>
      )
  }

  const recentStudents = allStudents.slice(0, 2);

  return (
    <>
      <CreateClassDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        mode={dialogMode}
        initialData={selectedClass}
      />
      <div className="container mx-auto p-4 md:p-6">
        <PageHeader title={`Dashboard ${lecturerName}`} description={`Selamat Datang! Kelola mata pelajaran dan siswa Anda.`} />
        
        <div className="flex flex-row items-center justify-between mt-8 mb-4">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Mata Pelajaran (Kelas)
          </h2>
          <Button variant="outline" size="sm" onClick={() => handleOpenDialog('create')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Buat Kelas
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeClasses.length > 0 ? (
                activeClasses.map((course, index) => (
                    <Card key={course.id} className="overflow-visible">
                        <CardHeader className="p-0 relative">
                            <div className="h-28 rounded-t-lg bg-purple-600 flex justify-end p-2">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-8 w-8">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onSelect={() => showNotImplementedToast('Move')}><Move className="mr-2 h-4 w-4"/> Move</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => showNotImplementedToast('Copy invite link')}><Link2 className="mr-2 h-4 w-4"/> Copy invite link</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => handleOpenDialog('edit', course)}><Edit className="mr-2 h-4 w-4"/> Edit</DropdownMenuItem>
                                        <DropdownMenuItem onSelect={() => showNotImplementedToast('Copy')}><Copy className="mr-2 h-4 w-4"/> Copy</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive" onSelect={() => handleArchiveAction(course.id)}><ArchiveIcon className="mr-2 h-4 w-4"/> Archive</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <Avatar className="h-20 w-20 absolute -bottom-10 left-4 border-4 border-card">
                                <AvatarImage src={`https://i.pravatar.cc/150?u=${course.lecturerName}`} />
                                <AvatarFallback>{course.lecturerName.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </CardHeader>
                        <CardContent className="pt-14 px-4 pb-4">
                            <Link href="/dashboard/student/subjects" className="hover:underline">
                                <h3 className="font-bold text-lg">{course.courseName}</h3>
                            </Link>
                            <p className="text-sm text-muted-foreground">{course.className}</p>
                            <p className="text-xs text-muted-foreground mt-2">{allStudents.filter(s => s.class === course.className).length} Siswa</p>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <p className="text-muted-foreground text-sm text-center py-8 col-span-full">Tidak ada kelas aktif untuk guru ini. Coba buat kelas baru.</p>
            )}
        </div>
        
        <Card className="mt-8">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Aktivitas Terkini</CardTitle>
              <Activity className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                   <Avatar className="h-8 w-8 border">
                      <AvatarFallback>{recentStudents[0]?.name.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Tugas baru dikumpulkan untuk INF101.</p>
                    <p className="text-xs text-muted-foreground">oleh {recentStudents[0]?.name || 'Siswa'} - 1 jam lalu</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                   <Avatar className="h-8 w-8 border">
                      <AvatarFallback>{recentStudents[1]?.name.charAt(0) || 'S'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Pertanyaan di forum INF102.</p>
                    <p className="text-xs text-muted-foreground">oleh {recentStudents[1]?.name || 'Siswa'} - 3 jam lalu</p>
                  </div>
                </li>
                 <li className="flex items-start gap-3">
                   <div className="h-8 w-8 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                   </div>
                  <div>
                    <p className="text-sm font-medium">Nilai untuk UTS INF201 harus diisi.</p>
                    <p className="text-xs text-muted-foreground">Pengingat Sistem - 2 hari lalu</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        
        {archivedClasses.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
              Kelas yang Diarsipkan
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {archivedClasses.map((course) => (
                <Card key={course.id} className="opacity-60">
                   <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-base">{course.courseName}</CardTitle>
                        <CardDescription>{course.className}</CardDescription>
                      </div>
                      <Badge variant="secondary">Diarsipkan</Badge>
                   </CardHeader>
                   <CardContent>
                      <p className="text-sm text-muted-foreground">{allStudents.filter(s => s.class === course.className).length} Siswa</p>
                   </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
    

    

    

