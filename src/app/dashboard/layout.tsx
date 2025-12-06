
"use client";

import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const isSubjectDetailPage = pathname.includes('/dashboard/student/subjects/');

  // On mobile, if we are on the subject detail page, we want a different layout
  // that is managed within that page component itself for a full-screen experience.
  if (isMobile && isSubjectDetailPage) {
    return (
      <div className="h-screen w-full font-body overflow-hidden">
        {children}
      </div>
    );
  }
  
  // Default layout for desktop and other mobile pages
  return (
    <div className="flex h-screen w-full font-body overflow-hidden">
      {!isSubjectDetailPage && <DashboardSidebar />}
      <div className="flex flex-1 flex-col">
        {!isSubjectDetailPage && <DashboardHeader />}
        <main className={cn("flex-1 overflow-y-auto bg-background", isSubjectDetailPage && "h-full")}>
          <div className={cn(!isSubjectDetailPage && "h-full")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
