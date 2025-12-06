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
import { mockGrades } from "@/lib/mock-data";
import { ClipboardCheck } from "lucide-react";

export default function GradesPage() {
  return (
    <div className="container mx-auto p-4 md:p-6">
      <PageHeader
        title="Transkrip Nilai"
        description="Berikut adalah rekap nilai Anda untuk semua mata pelajaran."
      />
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Semua Nilai</CardTitle>
          <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockGrades.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="font-medium">{grade.courseName}</div>
                    <div className="text-sm text-muted-foreground">
                      {grade.courseCode}
                    </div>
                  </TableCell>
                  <TableCell>{grade.semester}</TableCell>
                  <TableCell className="text-right font-bold text-lg text-primary">
                    {grade.grade}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
