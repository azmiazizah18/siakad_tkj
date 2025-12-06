
"use client";

import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';

export default function ContactPage() {
  const router = useRouter();
  const pathname = usePathname();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    const lowerCaseQuery = query.toLowerCase();

    // Simple keyword-based routing for prototype
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
                <PageHeader title="Lokasi Kami" description="Temukan kami di alamat berikut." />
                <div className="max-w-6xl mx-auto mt-8">
                    <Card className="h-[60vh]">
                        <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                           <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.195321526433!2d107.2833987153676!3d-6.284082695484876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6982aca5fe0815%3A0xa7ea3fae1f54165b!2sSMK%20Negeri%201%20Karawang!5e0!3m2!1sid!2sid!4v1689758156321!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border:0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </CardContent>
                    </Card>
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

    

    

    

    
