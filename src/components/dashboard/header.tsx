
"use client";

import { useState, useEffect } from 'react';
import { Bell, UserCircle, LogOut, Settings, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { mockNotifications } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Logo } from '../logo';
import { SidebarNav } from './sidebar';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { users } from '@/lib/users';
import type { User } from '@/lib/types';


function getUserFromSimulation(): User | null {
    if (typeof window === 'undefined') return null;
    const userEmail = localStorage.getItem('loggedInUser');
    if (!userEmail) return null;
    return users.find(u => u.email === userEmail) || null;
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

function RealTimeClock() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDateTime);

  const formattedTime = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(currentDateTime).replace(/\./g, ':');

  return (
    <div className="hidden md:flex items-center gap-2 text-sm">
      <span className="font-medium text-muted-foreground">{formattedDate}</span>
      <span className="font-semibold text-foreground">{formattedTime}</span>
    </div>
  );
}

export function DashboardHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedInUser');
    }
    router.push('/'); // Redirect to homepage after logout
  };
  
  const isSubjectDetailPage = pathname.includes('/dashboard/student/subjects/');


  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="lg:hidden">
        {isMounted ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Navigation</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
               <div className="flex h-full flex-col">
                <SheetHeader className="h-16 flex items-center px-6 border-b">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <Link href="/">
                    <Logo />
                  </Link>
                </SheetHeader>
                <nav className="flex-1 px-4 py-6">
                  <SidebarNav isMobile={true} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <Skeleton className="h-8 w-8" />
        )}
      </div>
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
      <div className="flex items-center gap-4">
        {isMounted ? (
          <>
            <RealTimeClock />
            <NotificationBell />
            <UserMenu onLogout={handleLogout} />
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </>
        )}
      </div>
    </header>
  );
}

function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">
              You have {mockNotifications.filter(n => !n.read).length} unread messages.
            </p>
          </div>
          <div className="grid gap-2">
            {mockNotifications.map((notification) => (
              <div
                key={notification.id}
                className="grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
              >
                <span className={cn("flex h-2 w-2 translate-y-1 rounded-full", !notification.read && "bg-primary")} />
                <div className="grid gap-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.description}</p>
                   <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function UserMenu({ onLogout }: { onLogout: () => void }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        setCurrentUser(getUserFromSimulation());
    }, []);

    const accountLabel = currentUser ? currentUser.name : "My Account";
    const userInitial = currentUser ? currentUser.name.charAt(0).toUpperCase() : <UserCircle className="h-6 w-6"/>;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                 <Avatar className="h-8 w-8">
                    <AvatarFallback>
                        {userInitial}
                    </AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{accountLabel}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser && currentUser.role !== 'student' && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
