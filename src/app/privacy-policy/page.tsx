
"use client";

import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Search } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import type { FormEvent } from 'react';
import { cn } from '@/lib/utils';

export default function PrivacyPolicyPage() {
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
          <div className="container mx-auto px-4 max-w-4xl">
              <PageHeader title="Kebijakan Privasi" description="Terakhir diperbarui: 25 Juli 2025" />
              <div className="prose lg:prose-lg max-w-none">
                  <p>
                      Selamat datang di Kebijakan Privasi SIAKAD TKJ. Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
                  </p>
                  <h2>1. Informasi yang Kami Kumpulkan</h2>
                  <p>
                      Kami dapat mengumpulkan informasi pribadi yang dapat diidentifikasi seperti nama, alamat email, dan peran Anda (siswa, guru, admin) saat Anda mendaftar dan menggunakan layanan kami.
                  </p>
                  <h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                  <p>
                      Informasi yang kami kumpulkan digunakan untuk menyediakan, memelihara, dan meningkatkan layanan kami. Kami juga menggunakannya untuk mempersonalisasi pengalaman Anda dan untuk berkomunikasi dengan Anda.
                  </p>
                  <h2>3. Keamanan Informasi</h2>
                  <p>
                      Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Namun, tidak ada metode transmisi melalui internet atau metode penyimpanan elektronik yang 100% aman.
                  </p>
                  <h2>4. Perubahan pada Kebijakan Ini</h2>
                  <p>
                      Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Kami akan memberi tahu Anda tentang perubahan apa pun dengan memposting kebijakan baru di halaman ini.
                  </p>
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

    

    
