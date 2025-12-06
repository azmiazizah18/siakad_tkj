
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { mockSchedule, mockGrades, mockAttendance } from "@/lib/mock-data";
import { Calendar, ClipboardCheck, Percent } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader title="Dashboard" description="Selamat Datang di Sistem Informasi Akademik TKJ SMKN 1 KARAWANG." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Jadwal Hari Ini</CardTitle>
            <Calendar className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {mockSchedule.map((item) => (
                  <TableRow key={item.time}>
                    <TableCell className="font-medium w-1/3">{item.time}</TableCell>
                    <TableCell>
                      <div>{item.courseName}</div>
                      <div className="text-sm text-muted-foreground">{item.courseCode}</div>
                    </TableCell>
                    <TableCell className="text-right">{item.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Ringkasan Kehadiran</CardTitle>
              <CardDescription>Semester Ganjil 2023</CardDescription>
            </div>
            <Percent className="h-5 w-5 text-muted-foreground"/>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockAttendance.map((att) => {
              const percentage = Math.round((att.attendedClasses / att.totalClasses) * 100);
              return (
                <div key={att.courseName}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{att.courseName}</span>
                    <span className="text-sm text-muted-foreground">{percentage}%</span>
                  </div>
                  <Progress value={percentage} aria-label={`${att.courseName} attendance`} />
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
