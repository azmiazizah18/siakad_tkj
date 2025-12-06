
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems, studentNavItems, lecturerNavItems } from "@/lib/mock-data";
import type { NavItem, User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useEffect, useState } from "react";
import { users } from "@/lib/users";
import { SheetClose } from "@/components/ui/sheet";

function getRoleFromSimulation(): User['role'] | 'unknown' {
    if (typeof window === 'undefined') return 'unknown';
    
    // First, try to get from current URL path
    const pathname = window.location.pathname;
    if (pathname.startsWith("/dashboard/admin")) return "admin";
    if (pathname.startsWith("/dashboard/student")) return "student";
    if (pathname.startsWith("/dashboard/lecturer")) return "lecturer";

    // If on a shared page like settings, get user from localStorage
    const userEmail = localStorage.getItem('loggedInUser');
    if (userEmail) {
        const user = users.find(u => u.email === userEmail);
        return user ? user.role : 'unknown';
    }

    return 'unknown';
}


export function DashboardSidebar() {
  const pathname = usePathname();
  const isSubjectDetailPage = pathname.includes('/dashboard/student/subjects/');
  


  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <nav className="flex-1 px-4 py-6">
          <SidebarNav />
        </nav>
      </div>
    </aside>
  );
}

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();
  const [navItems, setNavItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const role = getRoleFromSimulation();
    
    if (role === 'admin') {
        setNavItems(adminNavItems);
    } else if (role === 'student') {
        setNavItems(studentNavItems);
    } else if (role === 'lecturer') {
        setNavItems(lecturerNavItems);
    } else {
        // Default or fallback
        setNavItems(adminNavItems);
    }
  }, [pathname]);

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        pathname.startsWith(item.href) && item.href !== '/dashboard/student'
          ? "bg-primary/10 text-primary"
          : pathname === item.href ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      )}
    >
      <item.icon className="h-4 w-4" />
      <span>{item.label}</span>
    </Link>
  );

  return (
    <ul className="space-y-1">
      {navItems.map((item) => (
        <li key={item.href}>
          {isMobile ? (
            <SheetClose asChild>
              <NavLink item={item} />
            </SheetClose>
          ) : (
            <NavLink item={item} />
          )}
        </li>
      ))}
    </ul>
  );
}
