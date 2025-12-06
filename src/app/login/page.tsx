
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, BookOpen, Eye, EyeOff } from "lucide-react";
import { authenticate } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { mockClassrooms } from "@/lib/mock-data";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(1, { message: "Password tidak boleh kosong." }),
  role: z.enum(['student', 'lecturer', 'admin'], { required_error: "You must select a role." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSwitchToRegister: () => void;
}

export function LoginDialog({ isOpen, onOpenChange, onSwitchToRegister }: LoginDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'student';

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: defaultRole as 'student' | 'lecturer' | 'admin',
    },
  });
  
  const role = form.watch("role");

  useEffect(() => {
    const role = (searchParams.get('role') || 'student') as 'student' | 'lecturer' | 'admin';
    form.setValue('role', role);
  }, [searchParams, form]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('loggedInUser');
    }
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // In a real app, you wouldn't store sensitive info in localStorage.
      // This is for prototype demonstration purposes only.
      await authenticate(data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('loggedInUser', data.email);
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
          throw error; // Let Next.js handle the redirect
      }
      
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Login Gagal",
        description: errorMessage,
      });

      if (typeof window !== 'undefined') {
        localStorage.removeItem('loggedInUser');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
            <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
            </div>
          <DialogTitle className="text-2xl">Selamat Datang</DialogTitle>
          <DialogDescription>
            silahkan Login untuk mengakses SIAKAD TKJ
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@gmail.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                        className="pr-10"
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>Login sebagai</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                      <SelectTrigger disabled={isLoading}>
                          <SelectValue placeholder="Pilih peran Anda" />
                      </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                      <SelectItem value="student">Siswa</SelectItem>
                      <SelectItem value="lecturer">Guru</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                  </Select>
                  <FormMessage />
                  </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Masuk'}
            </Button>
          </form>
        </Form>
        <DialogFooter className="text-sm text-muted-foreground pt-4 mt-4 border-t w-full flex-row justify-center items-center">
          <p>
            Belum punya akun?{" "}
            <Button variant="link" className="p-0 h-auto" onClick={onSwitchToRegister}>
              Daftar di sini
            </Button>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


// The default export now renders nothing as the login is a dialog
export default function LoginPage() {
    return null;
}
