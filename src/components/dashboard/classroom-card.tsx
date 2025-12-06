
"use client";

import type { Classroom } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Copy, Archive } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface ClassroomCardProps {
  classroom: Classroom;
  onEdit?: () => void;
  onArchive?: () => void;
}

export function ClassroomCard({ classroom, onEdit, onArchive }: ClassroomCardProps) {
  const { toast } = useToast();

  const showNotImplementedToast = (feature: string) => {
    toast({ title: "Fitur Dalam Pengembangan", description: `Fungsionalitas "${feature}" akan segera hadir.` });
  };
  
  const handleEdit = onEdit ?? (() => showNotImplementedToast('Edit'));
  const handleArchive = onArchive ?? (() => showNotImplementedToast('Archive'));

  return (
    <Card className="flex flex-col justify-center rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 min-h-[96px]">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <Link href="#" className="hover:underline">
          <CardTitle className="text-lg font-bold">{classroom.className}</CardTitle>
        </Link>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-muted h-8 w-8 -mt-2 -mr-2">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={handleEdit}>
                  <Edit className="mr-2 h-4 w-4"/> Edit
                </DropdownMenuItem>
                 <DropdownMenuItem onSelect={() => showNotImplementedToast('Copy')}>
                  <Copy className="mr-2 h-4 w-4"/> Copy
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onSelect={handleArchive}>
                  <Archive className="mr-2 h-4 w-4"/> Archive
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
    </Card>
  );
}
