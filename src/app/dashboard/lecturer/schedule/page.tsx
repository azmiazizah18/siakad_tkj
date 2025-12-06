
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
import { mockCourses, mockClassrooms } from "@/lib/mock-data";
import { Calendar, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import type { User, Classroom } from "@/lib/types";
import { users } from "@/lib/users";


function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userEmail = localStorage.getItem('loggedInUser');
  if (!userEmail) return null;
  return users.find(u => u.email === userEmail) || null;
}

export default function LecturerSchedulePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lecturerSchedule, setLecturerSchedule] = useState<any[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    if(user) {
      const allSchedules = [
          { day: 'Senin', time: '07:00 - 08:30', courseName: 'Sistem Komputer', courseCode: 'INF103', location: 'Lab TKJ 3' },
          { day: 'Selasa', time: '08:30 - 10:00', courseName: 'Dasar Dasar Pemrograman', courseCode: 'INF101', location: 'Lab TKJ 2' },
          { day: 'Rabu', time: '07:00 - 08:30', courseName: 'Jaringan Komputer', courseCode: 'INF102', location: 'Lab TKJ 1' },
          { day: 'Kamis', time: '13:00 - 14:30', courseName: 'Keamanan Jaringan', courseCode: 'INF202', location: 'Lab TKJ 2' },
          { day: 'Jumat', time: '08:30 - 10:00', courseName: 'Administrasi Sistem Jaringan', courseCode: 'INF301', location: 'Lab TKJ 1' },
      ];
      
      const userSchedule = allSchedules.filter(schedule => {
          const classroom = mockClassrooms.find(c => c.courseName === schedule.courseName);
          return classroom?.lecturerName === user.name;
      }).map(schedule => {
          const classroom = mockClassrooms.find(c => c.courseName === schedule.courseName);
          return { ...schedule, class: classroom?.className || 'N/A' };
      });

      setLecturerSchedule(userSchedule);
    }
  }, []);
  

  return (
    <div className="container mx-auto py-4">
      <PageHeader
        title="Jadwal Mengajar"
        description="Berikut adalah jadwal mengajar Anda untuk minggu ini."
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Jadwal Minggu Ini</CardTitle>
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/lecturer/calendar">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Tampilan Kalender</span>
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hari</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead className="text-right">Lokasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lecturerSchedule.length > 0 ? lecturerSchedule.map((item, index) => (
                  <TableRow key={index}>
                     <TableCell className="font-medium">{item.day}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{item.time}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{item.courseName}</div>
                      <div className="text-sm text-muted-foreground">
                        {item.courseCode}
                      </div>
                    </TableCell>
                    <TableCell>{item.class}</TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{item.location}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Tidak ada jadwal mengajar untuk minggu ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


    