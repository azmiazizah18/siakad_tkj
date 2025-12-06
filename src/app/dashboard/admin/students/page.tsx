
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle, Search, MoreHorizontal, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Student } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStudents, addStudent, updateStudent, deleteStudent, updateStudentStatus as apiUpdateStudentStatus } from "@/lib/firebase/firestore";


const studentFormSchema = z.object({
  name: z.string().min(3, { message: "Nama harus memiliki setidaknya 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  class: z.string().min(1, { message: "Kelas tidak boleh kosong." }),
  status: z.enum(["Active", "Inactive", "Graduated"]),
  nis: z.string().min(1, { message: "NIS tidak boleh kosong." }),
});

type StudentFormValues = z.infer<typeof studentFormSchema>;

function PageSkeleton() {
  return (
    <div className="container mx-auto py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="mb-4">
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIS</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Tanggal Pendaftaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell>
                   <Skeleton className="h-5 w-40 mb-2" />
                   <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default function StudentRecordsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit" | "view">("add");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      class: "",
      status: "Active",
      nis: "",
    },
  });
  
  useEffect(() => {
    setIsMounted(true);
    const fetchStudents = async () => {
        setIsLoading(true);
        const fetchedStudents = await getStudents();
        setStudents(fetchedStudents);
        setIsLoading(false);
    }
    fetchStudents();
  }, []);

  const handleFormOpen = (mode: "add" | "edit" | "view", student?: Student) => {
    setFormMode(mode);
    if (student) {
      setSelectedStudent(student);
      form.reset({
        nis: student.nis,
        name: student.name,
        email: student.email,
        class: student.class,
        status: student.status,
      });
    } else {
      setSelectedStudent(null);
      form.reset({ nis: "", name: "", email: "", class: "", status: "Active" });
    }
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedStudent(null);
    form.reset();
  };

  const onSubmit = async (data: StudentFormValues) => {
    try {
        if (formMode === "add") {
            const newStudentId = await addStudent({
                ...data,
            });
            const newStudent: Student = {
                ...data,
                id: newStudentId, 
                enrollmentDate: new Date().toISOString().split('T')[0],
            };
            setStudents(prev => [newStudent, ...prev]);
            toast({ title: "Siswa Ditambahkan", description: `${data.name} telah berhasil ditambahkan.` });
        } else if (formMode === "edit" && selectedStudent) {
            await updateStudent(selectedStudent.id, data);
            setStudents(prev => 
                prev.map(s => s.id === selectedStudent.id ? {...s, ...data} : s)
            );
            toast({ title: "Siswa Diperbarui", description: `Data untuk ${data.name} telah diperbarui.` });
        }
    } catch (error) {
        console.error("Form submission error: ", error);
        toast({
            variant: "destructive",
            title: "Terjadi Kesalahan",
            description: (error as Error).message || "Tidak dapat menyimpan data siswa.",
        });
    } finally {
        handleFormClose();
    }
  };
  
  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
        await deleteStudent(studentToDelete.id);
        setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        toast({ title: "Siswa Dihapus", description: `Data siswa "${studentToDelete.name}" telah berhasil dihapus.` });
    } catch (error) {
         toast({
            variant: "destructive",
            title: "Gagal Menghapus",
            description: (error as Error).message,
        });
    } finally {
        setStudentToDelete(null);
    }
  };
  
  const handleStatusChange = async (studentId: string, newStatus: Student['status']) => {
    try {
        await apiUpdateStudentStatus(studentId, newStatus);
        setStudents(prev => prev.map(s => s.id === studentId ? {...s, status: newStatus} : s));
        toast({ title: "Status Diperbarui", description: `Status siswa telah diubah menjadi ${newStatus}.`});
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Gagal Memperbarui Status",
            description: (error as Error).message,
        });
    }
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.nis.includes(searchTerm)
  );

  if (!isMounted) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto py-4">
      <PageHeader title="Data Siswa" description="Kelola data dan informasi siswa.">
        <Button onClick={() => handleFormOpen("add")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Siswa
        </Button>
      </PageHeader>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cari siswa berdasarkan nama atau NIS..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NIS</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Tanggal Pendaftaran</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell>
                     <Skeleton className="h-5 w-40 mb-2" />
                     <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                </TableRow>
              ))
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nis}</TableCell>
                  <TableCell>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">{student.email}</div>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.enrollmentDate}</TableCell>
                  <TableCell>
                    <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className={
                        student.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                        : student.status === 'Inactive' ? 'bg-gray-100 text-gray-800' 
                        : 'bg-red-100 text-red-800'
                      }>
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => handleFormOpen("view", student)}>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleFormOpen("edit", student)}>Ubah</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => handleStatusChange(student.id, student.status === 'Active' ? 'Inactive' : 'Active')}>
                          {student.status === 'Active' ? 'Jadikan Tidak Aktif' : 'Jadikan Aktif'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onSelect={() => setStudentToDelete(student)}
                        >
                          Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        Tidak ada data siswa ditemukan. Mulai tambahkan siswa baru.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
           <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle>
                  {formMode === 'add' ? 'Tambah Siswa Baru' : formMode === 'edit' ? 'Ubah Data Siswa' : 'Detail Data Siswa'}
                </DialogTitle>
                <DialogDescription>
                  {formMode === 'add' ? 'Isi detail di bawah untuk menambahkan siswa baru.' : formMode === 'edit' ? 'Ubah informasi siswa di bawah ini.' : 'Lihat informasi detail siswa.'}
                </DialogDescription>
              </DialogHeader>
              
              <FormField
                control={form.control}
                name="nis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>NIS</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Induk Siswa" {...field} disabled={formMode !== 'add'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. John Doe" {...field} disabled={formMode === 'view'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="student@gmail.com" {...field} disabled={formMode === 'view'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                <FormField
                control={form.control}
                name="class"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kelas</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. X TKJ 1" {...field} disabled={formMode === 'view'} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                       <Select onValueChange={field.onChange} defaultValue={field.value} disabled={formMode === 'view'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Active">Aktif</SelectItem>
                          <SelectItem value="Inactive">Tidak Aktif</SelectItem>
                          <SelectItem value="Graduated">Lulus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={handleFormClose}>Batal</Button>
                </DialogClose>
                {formMode !== 'view' && (
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Simpan
                  </Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!studentToDelete} onOpenChange={() => setStudentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Ini akan menghapus data siswa ({studentToDelete?.name}) secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
