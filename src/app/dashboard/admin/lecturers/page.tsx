
"use client";

import { useState, useEffect } from "react";
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
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Search, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockLecturers } from "@/lib/mock-data";
import { Skeleton } from "@/components/ui/skeleton";

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
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Mata Pelajaran Utama</TableHead>
              <TableHead>Tanggal Perekrutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell><Skeleton className="h-5 w-32" /></TableCell>
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

export default function LecturerRecordsPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <PageSkeleton />;
  }

  return (
    <div className="container mx-auto py-4">
      <PageHeader title="Data Guru" description="Kelola data dan informasi guru.">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Tambah Guru
        </Button>
      </PageHeader>
      
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Cari guru berdasarkan nama..." className="pl-10" />
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Mata Pelajaran Utama</TableHead>
              <TableHead>Tanggal Perekrutan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead><span className="sr-only">Aksi</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockLecturers.map((lecturer) => (
              <TableRow key={lecturer.id}>
                <TableCell className="font-medium">{lecturer.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{lecturer.name}</div>
                  <div className="text-sm text-muted-foreground">{lecturer.email}</div>
                </TableCell>
                <TableCell>{lecturer.subject}</TableCell>
                <TableCell>{lecturer.hireDate}</TableCell>
                <TableCell>
                  <Badge variant={lecturer.status === 'Active' ? 'default' : 'secondary'} className={lecturer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-gray-100 text-gray-800'}>
                    {lecturer.status}
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
                      <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                      <DropdownMenuItem>Ubah</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
