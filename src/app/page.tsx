
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, BookOpen, Users, FileText, CalendarCheck, Search, Menu } from 'lucide-react';
import { Logo } from '@/components/logo';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, type FormEvent } from 'react';
import { LoginDialog } from '@/app/login/page';
import { RegisterDialog } from '@/app/signup/page';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';

export default function LandingPage() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);


  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get('search') as string;
    alert(`Pencarian untuk "${query}" belum diimplementasikan.`);
  };


  const navLinkClasses = "text-sm font-medium text-white hover:text-primary-foreground/80 transition-colors";
  const activeLinkClasses = "text-primary-foreground font-semibold";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header & Hero Section */}
      <header className="relative flex flex-col items-center justify-center h-[60vh] md:h-[70vh] text-center text-white px-4">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2728&auto=format&fit=crop"
            alt="Students in a library"
            fill
            className="object-cover"
            priority
            data-ai-hint="library students"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <nav className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto flex items-center justify-between p-4 h-20">
            <Link href="/" className="flex items-center justify-center">
              <Logo className="text-white" />
            </Link>
            
            <div className="hidden md:flex items-center justify-center gap-6">
                <Link href="/" className={cn(navLinkClasses, pathname === '/' && activeLinkClasses)}>
                    Beranda
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger className={cn(navLinkClasses, "flex items-center gap-1 focus:outline-none")}>
                        Fitur <ChevronDown className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 bg-gray-800 text-white border-gray-700">
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

            <div className="hidden md:flex items-center justify-end gap-4">
                <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="text-white hover:bg-white/10">
                    Masuk
                </Button>
                <Button onClick={() => setIsRegisterOpen(true)}>
                    Daftar
                </Button>
            </div>
             <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Buka menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="bg-gray-900 text-white border-gray-800 w-64">
                     <div className="p-6">
                        <Link href="/" className="flex items-center justify-center mb-8">
                            <Logo className="text-white" />
                        </Link>
                        <nav className="flex flex-col gap-4 text-lg">
                           <SheetClose asChild><Link href="/" className="hover:text-primary">Beranda</Link></SheetClose>
                           <SheetClose asChild><Link href="/about" className="hover:text-primary">Tentang</Link></SheetClose>
                           <SheetClose asChild><Link href="/contact" className="hover:text-primary">Alamat</Link></SheetClose>
                           <hr className="border-gray-700 my-4" />
                           <SheetClose asChild><Button variant="outline" className="bg-transparent border-primary text-primary" onClick={() => setIsLoginOpen(true)}>Masuk</Button></SheetClose>
                           <SheetClose asChild><Button onClick={() => setIsRegisterOpen(true)}>Daftar</Button></SheetClose>
                        </nav>
                     </div>
                  </SheetContent>
                </Sheet>
             </div>
          </div>
        </nav>

        <div className="relative z-10 flex flex-col items-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Teknik Komputer dan Jaringan
          </h1>
        </div>
      </header>
      
      {/* Main Body */}
      <main id="features" className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Fitur Unggulan Kami</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                    icon={Users}
                    title="Manajemen Pengguna"
                    description="Kelola profil siswa, guru, dan admin dengan sistem berbasis peran yang aman dan mudah."
                    href="/features/user-management"
                />
                <FeatureCard 
                    icon={BookOpen}
                    title="Manajemen Akademik"
                    description="Atur kelas, mata pelajaran, dan kurikulum tahun ajaran dengan fleksibilitas penuh."
                    href="/features/academic-management"
                />
                <FeatureCard 
                    icon={FileText}
                    title="Penilaian & Laporan"
                    description="Input nilai secara efisien dan hasilkan rapor atau transkrip nilai otomatis."
                    href="/features/grading-reporting"
                />
                <FeatureCard 
                    icon={CalendarCheck}
                    title="Jadwal & Kalender"
                    description="Buat jadwal pelajaran terpusat dan kalender akademik yang tersinkronisasi untuk semua."
                    href="/features/schedule-calendar"
                />
            </div>
        </div>
      </main>

      {/* Modals */}
      <LoginDialog isOpen={isLoginOpen} onOpenChange={setIsLoginOpen} onSwitchToRegister={handleSwitchToRegister} />
      <RegisterDialog isOpen={isRegisterOpen} onOpenChange={setIsRegisterOpen} onSwitchToLogin={handleSwitchToLogin} />

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

function FeatureCard({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) {
    return (
      <Link href={href}>
        <Card className="text-center h-full hover:shadow-lg hover:-translate-y-1 transition-transform duration-300">
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
      </Link>
    );
}
