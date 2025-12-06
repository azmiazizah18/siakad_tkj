
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { ClassroomCard } from "@/components/dashboard/classroom-card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Classroom } from "@/lib/types";
import { CreateClassDialog } from "@/components/dashboard/create-class-dialog";
import { useToast } from "@/hooks/use-toast";
import { mockClassrooms } from "@/lib/mock-data";


function PageSkeleton() {
  return (
    <div className="container mx-auto py-4">
      <PageHeader title="Kelola Kelas" description="Memuat data kelas...">
        <Button disabled>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Kelas
        </Button>
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}


export default function ClassesPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedClass, setSelectedClass] = useState<Classroom | null>(null);
  
  useEffect(() => {
    // Simulate fetching data and add X TKJ 2
    setTimeout(() => {
      const allClassrooms = [
        ...mockClassrooms,
        {
          id: "CLASS-006",
          className: "X TKJ 2",
          courseName: "Produk Kreatif dan Kewirausahaan",
          lecturerName: "Guru PKK",
          studentCount: 35,
          imageUrl: "",
          imageHint: "",
        }
      ].sort((a, b) => a.className.localeCompare(b.className));
      setClassrooms(allClassrooms);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleOpenDialog = (mode: "create" | "edit", classroom?: Classroom) => {
    setDialogMode(mode);
    setSelectedClass(classroom || null);
    setIsDialogOpen(true);
  };
  
  const handleDialogSubmit = (data: { className: string; subject: string; }) => {
    if (dialogMode === "create") {
      // This is a local-only operation for the prototype
      const newClass: Classroom = {
          id: `CLASS-${Date.now()}`,
          className: data.className,
          courseName: data.subject,
          lecturerName: "Admin", // Or assign dynamically
          studentCount: 0,
          imageUrl: ``,
          imageHint: "",
      };
      setClassrooms(prev => [...prev, newClass].sort((a,b) => a.className.localeCompare(b.className)));
      toast({ title: "Kelas Dibuat", description: `Kelas "${data.className}" telah berhasil dibuat.` });
    } else if (dialogMode === "edit" && selectedClass) {
      // Local-only update
      const updatedData = { ...selectedClass, className: data.className, courseName: data.subject };
      setClassrooms(prev => prev.map(c => 
        c.id === selectedClass.id ? updatedData : c
      ).sort((a,b) => a.className.localeCompare(b.className)));
      toast({ title: "Kelas Diperbarui", description: `Kelas "${data.className}" telah diperbarui.` });
    }
  };

  const handleDelete = (classId: string) => {
    // Local-only delete
    const classToDelete = classrooms.find(c => c.id === classId);
    setClassrooms(prev => prev.filter(c => c.id !== classId));
    toast({ title: "Kelas Dihapus", description: `Kelas "${classToDelete?.className}" telah dihapus.` });
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <>
      <CreateClassDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleDialogSubmit}
        mode={dialogMode}
        initialData={selectedClass}
      />
      <div className="container mx-auto py-4">
        <PageHeader title="Kelola Kelas" description="Kelola semua kelas dan mata pelajaran yang diajarkan.">
          <Button onClick={() => handleOpenDialog('create')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Tambah Kelas
          </Button>
        </PageHeader>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {classrooms.map((classroom) => (
            <ClassroomCard 
              key={classroom.id} 
              classroom={classroom}
              onEdit={() => handleOpenDialog('edit', classroom)}
              onArchive={() => handleDelete(classroom.id)}
             />
          ))}
        </div>
      </div>
    </>
  );
}
