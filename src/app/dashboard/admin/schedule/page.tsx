
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ScheduleItem, Classroom } from "@/lib/types";
import { mockClassrooms } from "@/lib/mock-data";

const localizer = momentLocalizer(moment);

const allSchedules: ScheduleItem[] = [
    { day: 'Senin', time: '07:00 - 08:30', courseName: 'Sistem Komputer', courseCode: 'INF103', location: 'Lab TKJ 3', class: 'X TKJ 1' },
    { day: 'Senin', time: '08:30 - 10:00', courseName: 'Dasar Dasar Pemrograman', courseCode: 'INF101', location: 'Lab TKJ 1', class: 'XI TKJ 1' },
    { day: 'Selasa', time: '10:00 - 11:30', courseName: 'Administrasi Sistem Jaringan', courseCode: 'INF301', location: 'Lab TKJ 2', class: 'XII TKJ 2' },
    { day: 'Rabu', time: '07:00 - 08:30', courseName: 'Jaringan Komputer', courseCode: 'INF102', location: 'Lab TKJ 2', class: 'XI TKJ 2' },
    { day: 'Kamis', time: '13:00 - 14:30', courseName: 'Keamanan Jaringan', courseCode: 'INF202', location: 'Lab TKJ 1', class: 'XII TKJ 1' },
    { day: 'Jumat', time: '08:30 - 10:00', courseName: 'Produk Kreatif dan Kewirausahaan', courseCode: 'PKK', location: 'Ruang Teori 1', class: 'X TKJ 2' },
];

const parseTime = (timeStr: string, date: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

const getDayOfWeekNumber = (day: string) => {
    const days: { [key: string]: number } = { 'minggu': 0, 'senin': 1, 'selasa': 2, 'rabu': 3, 'kamis': 4, 'jumat': 5, 'sabtu': 6 };
    return days[day.toLowerCase()];
}

export default function AdminSchedulePage() {
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        const startOfWeek = moment().startOf('week').toDate();
        const calendarEvents = allSchedules.map(item => {
            const dayIndex = getDayOfWeekNumber(item.day!);
            const eventDate = moment(startOfWeek).add(dayIndex, 'days').toDate();

            const [startTimeStr, endTimeStr] = item.time.split(' - ');
            const startDate = parseTime(startTimeStr, eventDate);
            const endDate = parseTime(endTimeStr, eventDate);
            
            const lecturer = mockClassrooms.find(c => c.className === item.class)?.lecturerName || "N/A";
            
            return {
                title: `${item.courseName} (${item.class}) - ${lecturer}`,
                start: startDate,
                end: endDate,
                resource: item.location,
            };
        });

        setEvents(calendarEvents);
    }, []);

    return (
        <div className="container mx-auto py-4">
            <PageHeader 
                title="Jadwal & Kalender Akademik"
                description="Kelola jadwal pelajaran, acara sekolah, dan kalender akademik terpusat."
            />
             <Tabs defaultValue="calendar">
                <div className="flex justify-between items-center mb-4">
                    <TabsList>
                        <TabsTrigger value="calendar">Tampilan Kalender</TabsTrigger>
                        <TabsTrigger value="list">Tampilan Daftar</TabsTrigger>
                    </TabsList>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Tambah Jadwal/Acara
                    </Button>
                </div>
                <TabsContent value="calendar">
                    <Card>
                        <CardContent className="p-4">
                            <div className="h-[75vh]">
                                <BigCalendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    defaultView="week"
                                    views={['month', 'week', 'day']}
                                    style={{ height: '100%' }}
                                    eventPropGetter={(event) => ({
                                        className: 'text-white p-1 rounded-md'
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="list">
                    <Card>
                         <CardHeader>
                            <CardTitle>Daftar Semua Jadwal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Hari</TableHead>
                                        <TableHead>Waktu</TableHead>
                                        <TableHead>Mata Pelajaran</TableHead>
                                        <TableHead>Kelas</TableHead>
                                        <TableHead>Guru</TableHead>
                                        <TableHead>Lokasi</TableHead>
                                        <TableHead><span className="sr-only">Aksi</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allSchedules.sort((a,b) => getDayOfWeekNumber(a.day!) - getDayOfWeekNumber(b.day!)).map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.day}</TableCell>
                                            <TableCell>{item.time}</TableCell>
                                            <TableCell>{item.courseName}</TableCell>
                                            <TableCell>{item.class}</TableCell>
                                            <TableCell>{mockClassrooms.find(c => c.className === item.class)?.lecturerName}</TableCell>
                                            <TableCell>{item.location}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
