
"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Card, CardContent } from "@/components/ui/card";
import { users } from "@/lib/users";
import { mockClassrooms } from "@/lib/mock-data";
import type { User, Classroom } from "@/lib/types";

// Setup the localizer by providing the moment Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

const parseTime = (timeStr: string, date: Date): Date => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  return newDate;
};

function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userEmail = localStorage.getItem('loggedInUser');
  if (!userEmail) return null;
  return users.find(u => u.email === userEmail) || null;
}

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isMounted, setIsMounted] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        setIsMounted(true);

        if (user) {
            // This is a simplified schedule generation. A real app would fetch this from a DB.
             const allSchedules = [
                { time: '08:30 - 10:00', courseName: "Dasar Dasar Pemrograman", className: "XI TKJ 1", location: 'Lab TKJ 1' },
                { time: '07:00 - 08:30', courseName: "Jaringan Komputer", className: "XI TKJ 2", location: 'Lab TKJ 2' },
                { time: '13:00 - 14:30', courseName: "Keamanan Jaringan", className: "XII TKJ 1", location: 'Lab TKJ 1' },
                { time: '10:00 - 11:30', courseName: "Administrasi Sistem Jaringan", className: "XII TKJ 2", location: 'Lab TKJ 2' },
                { time: '07:00 - 08:30', courseName: "Sistem Komputer", className: "X TKJ 1", location: 'Lab TKJ 3' },
                { time: '08:30 - 10:00', courseName: "Produk Kreatif dan Kewirausahaan", className: "X TKJ 2", location: 'Ruang Teori 1' },
            ];

            const lecturerClasses = mockClassrooms.filter(c => c.lecturerName === user.name);

            const lecturerSchedule = allSchedules.filter(item => 
                lecturerClasses.some(lc => lc.className === item.className)
            );
            
            const today = new Date();

            const calendarEvents = lecturerSchedule.map(item => {
                const [startTimeStr, endTimeStr] = item.time.split(' - ');
                const startDate = parseTime(startTimeStr, today);
                const endDate = parseTime(endTimeStr, today);
                
                return {
                    title: `${item.courseName} (${item.className}) - ${item.location}`,
                    start: startDate,
                    end: endDate,
                };
            });

            setEvents(calendarEvents);
        }
    }, []);

    if (!isMounted) {
        // You can return a loader here if you want
        return null;
    }

  return (
    <div className="container mx-auto py-4">
        <PageHeader 
            title="Tampilan Kalender Jadwal"
            description="Tampilan visual dari jadwal mengajar Anda."
        />
        <Card>
            <CardContent className="p-4">
                <div className="h-[70vh]">
                     <BigCalendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView="week"
                        views={['week', 'day', 'agenda']}
                        style={{ height: '100%' }}
                     />
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
