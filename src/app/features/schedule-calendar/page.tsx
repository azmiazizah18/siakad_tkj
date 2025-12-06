
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Search, Calendar, CalendarDays, Users } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ScheduleCalendarPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    const lowerCaseQuery = query.toLowerCase();

    const routes: { [key: string]: string } = {
      'siswa': '/dashboard/admin/students',
      'guru': '/dashboard/admin/lecturers',
      'kelas': '/dashboard/admin/classes',
      'jadwal': '/dashboard/admin/schedule',
      'nilai': '/dashboard/student/grades',
    };

    const foundRoute = Object.keys(routes).find(key => lowerCaseQuery.includes(key));

    if (foundRoute) {
      router.push(routes[foundRoute]);
    } else {
      alert("Maaf, yang Anda cari tidak ada di sini");
    }
  };

  const navLinkClasses = "px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 rounded-md";
  const activeLinkClasses = "bg-primary text-primary-foreground";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Navigation Menu */}
        <nav className="sticky top-0 w-full bg-gray-800 z-10">
          <div className="container mx-auto flex items-center justify-between px-4 h-14">
            <div className="flex items-center justify-start flex-1">
              <Link href="/" className="flex items-center justify-center mr-6">
                <Logo className="text-white" />
              </Link>
            </div>

            <div className="flex items-center justify-center flex-1 gap-2">
                <Link href="/" className={cn(navLinkClasses, pathname === '/' && activeLinkClasses)}>
                    Beranda
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 text-sm font-medium text-white hover:bg-primary/90 hover:text-white">
                      Fitur <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem asChild><Link href="/features/user-management">Manajemen Pengguna</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/features/academic-management">Manajemen Kelas & Akademik</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/features/grading-reporting">Penilaian & Laporan</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/features/schedule-calendar">Jadwal & Kalender</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/about" className={cn(navLinkClasses, pathname === '/about' && activeLinkClasses)}>
                  Tentang
                </Link>
                <Link href="/contact" className={cn(navLinkClasses, pathname === '/contact' && activeLinkClasses)}>
                  Alamat
                </Link>
            </div>

            <div className="flex items-center justify-end flex-1 gap-4">
              
            </div>
          </div>
        </nav>

        {/* Main Body */}
        <main className="flex-1 py-8 lg:py-12">
          <div className="container mx-auto px-4">
            <PageHeader 
                title="Fitur Jadwal & Kalender" 
                description="Organisasi waktu yang lebih baik untuk seluruh warga sekolah." 
            />
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                <InfoCard
                    icon={Calendar}
                    title="Jadwal Pelajaran Terpusat"
                    description="Buat dan kelola jadwal pelajaran untuk semua kelas. Guru dan siswa dapat melihat jadwal pribadi mereka secara real-time dari dasbor masing-masing."
                />
                <InfoCard
                    icon={CalendarDays}
                    title="Kalender Akademik Interaktif"
                    description="Tandai tanggal-tanggal penting seperti hari libur, ujian, dan acara sekolah dalam satu kalender terpusat yang dapat diakses oleh semua pengguna."
                />
                <InfoCard
                    icon={Users}
                    title="Sinkronisasi Antar Peran"
                    description="Setiap perubahan jadwal yang dibuat oleh admin akan secara otomatis diperbarui di kalender guru dan siswa, memastikan semua orang selalu terinformasi."
                />
            </div>
             <div className="mt-12 text-center">
                <p className="text-lg text-muted-foreground">Lihat jadwal sekolah yang terorganisir dengan rapi.</p>
                <Button asChild size="lg" className="mt-4">
                    <Link href="https://docs.google.com/spreadsheets/d/12eTEw2pQHtrAUdd7Nac6tL7Eu4f8W8RiYaZiaYX53u8/edit?gid=309659004#gid=309659004" target="_blank" rel="noopener noreferrer">Lihat Jadwal</Link>
                </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 mt-auto">
          <div className="container mx-auto py-12 px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4 md:col-span-1">
                <Link href="/">
                  <Logo className="text-white" />
                </Link>
                <p className="text-sm text-gray-400">
                  Dirancang untuk menyederhanakan dan memaksimalkan waktu belajar mengajar.
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Fitur</h4>
                  <nav className="flex flex-col space-y-2">
                    <Link href="https://clicky.id/azmiazizah" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-300 hover:text-primary">Developer</Link>
                    <Link href="/about" className="text-sm text-gray-300 hover:text-primary">Tentang TKJ</Link>
                  </nav>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">Alamat</h4>
                  <address className="text-sm text-gray-300 not-italic">
                    Jl. Pangkal Perjuangan<br />
                    Kec. Karawang Barat<br />
                    Karawang - Jawa Barat<br />
                    41316
                  </address>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">FAQ</h4>
                  <nav className="flex flex-col space-y-2">
                    <Link href="/privacy-policy" className="text-sm text-gray-300 hover:text-primary">Kebijakan Privasi</Link>
                    <Link href="/terms-of-service" className="text-sm text-gray-300 hover:text-primary">Ketentuan Layanan</Link>
                  </nav>
                </div>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-6 flex flex-col sm:flex-row items-center justify-center">
              <p className="text-xs text-gray-400">Sistem Informasi Akademik TKJ © 2025</p>
            </div>
          </div>
        </footer>
    </div>
  );
}


function InfoCard({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) {
    return (
        <Card className="text-center">
            <CardHeader className="items-center">
                <div className="p-4 bg-primary/10 rounded-full mb-2">
                    <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
            </CardContent>
        </Card>
    )
}

    

    
