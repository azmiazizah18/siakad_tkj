
"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockLecturers } from "@/lib/mock-data";
import { Calendar } from "lucide-react";

export default function SchedulePage() {
  const allWeekSchedule = [
    { day: 'Senin', time: '07:00 - 08:30', courseName: 'Sistem Komputer', courseCode: 'INF103', location: 'Lab TKJ 1', lecturer: 'Amo Sisdianto, S.Kom.' },
    { day: 'Selasa', time: '08:30 - 10:00', courseName: 'Dasar Dasar Pemrograman', courseCode: 'INF101', location: 'Lab TKJ 2', lecturer: 'Dedi Suandi Setiawan, S.Pd., M.Pd.' },
    { day: 'Rabu', time: '07:00 - 08:30', courseName: 'Jaringan Komputer', courseCode: 'INF102', location: 'Lab TKJ 1', lecturer: 'Ahmad Bustomi Sahrul, S.Pd.' },
    { day: 'Kamis', time: '13:00 - 14:30', courseName: 'Keamanan Jaringan', courseCode: 'INF202', location: 'Lab TKJ 2', lecturer: 'Ahmad Sanusi, S.Kom., M.Sos.' },
    { day: 'Jumat', time: '08:30 - 10:00', courseName: 'Administrasi Sistem Jaringan', courseCode: 'INF301', location: 'Lab TKJ 1', lecturer: 'Bimuka Jati Andromeda, S.Pd.' },
  ]

  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title="Jadwal Pelajaran"
        description="Berikut adalah jadwal pelajaran Anda untuk minggu ini."
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Jadwal Minggu Ini</CardTitle>
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">Hari</TableHead>
                <TableHead className="w-1/6">Waktu</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Guru</TableHead>
                <TableHead className="text-right w-1/6">Ruangan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allWeekSchedule.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.day}</TableCell>
                  <TableCell>{item.time}</TableCell>
                  <TableCell>
                    <div>{item.courseName}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.courseCode}
                    </div>
                  </TableCell>
                  <TableCell>{item.lecturer}</TableCell>
                  <TableCell className="text-right">{item.location}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
