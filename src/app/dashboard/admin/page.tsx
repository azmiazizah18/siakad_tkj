
"use client";

import { PageHeader } from "@/components/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, GraduationCap, BookOpen, School, Calendar } from "lucide-react";
import { ClassroomCard } from "@/components/dashboard/classroom-card";
import { mockLecturers, mockClassrooms } from "@/lib/mock-data";
import { useState, useEffect } from "react";
import type { Classroom, Student } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getStudents } from "@/lib/firebase/firestore";


export default function AdminDashboardPage() {
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const fetchedStudents = await getStudents();
            setStudents(fetchedStudents);
            setClassrooms(mockClassrooms);
            setIsLoading(false);
        }
        fetchData();
    }, []);

  // In a real app, these handlers would be passed to ClassroomCard
  // to update a central state or make API calls. For this prototype,
  // we define them here to show the structure, but they won't be used
  // directly by the current ClassroomCard implementation.
  const handleEdit = (classId: string) => {
    console.log(`Admin wants to edit class: ${classId}`);
    // Logic to open an edit dialog would go here
  };

  const handleArchive = (classId: string) => {
    console.log(`Admin wants to archive class: ${classId}`);
    // Logic to archive the class would go here
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader title="Dashboard Admin" description="Ringkasan statistik dan aktivitas sekolah." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard title="Total Siswa" value={isLoading ? '...' : students.length.toString()} icon={Users} description="+5% dari bulan lalu" />
        <StatsCard title="Total Guru" value={mockLecturers.length.toString()} icon={GraduationCap} description="+2 dari tahun lalu" />
        <StatsCard title="Mata Pelajaran" value="7" icon={BookOpen} description="Informatika & lainnya" />
        <StatsCard title="Kelas" value={isLoading ? '...' : classrooms.length.toString()} icon={School} description="X, XI, XII TKJ" />
        <StatsCard title="Jadwal & Kalender" value="Terpusat" icon={Calendar} description="Lihat jadwal" />
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">
          Daftar Kelas
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)
          ) : (
            classrooms.map((classroom) => (
              <ClassroomCard 
                key={classroom.id} 
                classroom={classroom}
                // In a real app, you'd pass handler functions like this:
                // onEdit={() => handleEdit(classroom.id)}
                // onArchive={() => handleArchive(classroom.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
