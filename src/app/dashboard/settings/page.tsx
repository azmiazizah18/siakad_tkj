
"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/types";
import { users } from "@/lib/users";
import { Skeleton } from "@/components/ui/skeleton";

function getUserFromSimulation(): User | null {
    // In a real app, this would come from a secure auth context/provider.
    // For this prototype, we simulate it by getting the user's email from localStorage
    // which we set during the login process.
    if (typeof window === 'undefined') return null;
    
    const userEmail = localStorage.getItem('loggedInUser');
    if (!userEmail) return null;

    return users.find(u => u.email === userEmail) || null;
}


export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // We get the user data on the client side to ensure consistency
    setCurrentUser(getUserFromSimulation());
    setIsMounted(true);
  }, []);

  if (!isMounted || !currentUser) {
    return (
       <div className="container mx-auto py-4">
        <PageHeader
          title="Pengaturan"
          description="Kelola pengaturan akun dan preferensi aplikasi Anda."
        />
        <div className="max-w-3xl mx-auto space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profil Pengguna</CardTitle>
                    <CardDescription>
                        Perbarui informasi pribadi Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap</Label>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Alamat Email</Label>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Password Saat Ini</Label>
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Password Baru</Label>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button disabled>Simpan Perubahan</Button>
                </CardFooter>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Preferensi Tampilan</CardTitle>
                    <CardDescription>
                    Sesuaikan tampilan dan nuansa aplikasi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-10 w-[240px]" />
                </CardContent>
             </Card>
        </div>
      </div>
    )
  }


  return (
    <div className="container mx-auto py-4">
      <PageHeader
        title="Pengaturan"
        description="Kelola pengaturan akun dan preferensi aplikasi Anda."
      />
      <div className="max-w-3xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>
              Perbarui informasi pribadi Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" defaultValue={currentUser.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" type="email" defaultValue={currentUser.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email tidak dapat diubah.
              </p>
            </div>
             <div className="space-y-2">
              <Label htmlFor="current-password">Password Saat Ini</Label>
              <Input id="current-password" type="password" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="new-password">Password Baru</Label>
              <Input id="new-password" type="password" />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button>Simpan Perubahan</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferensi Tampilan</CardTitle>
            <CardDescription>
              Sesuaikan tampilan dan nuansa aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select defaultValue="system">
                <SelectTrigger id="theme" className="w-[240px]">
                  <SelectValue placeholder="Pilih tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Terang</SelectItem>
                  <SelectItem value="dark">Gelap</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
