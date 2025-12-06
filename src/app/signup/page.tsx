
"use client";

import { useState } from "react";
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
import { handleGoogleSignInSuccess } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

const registerSchema = z.object({
  name: z.string().min(3, { message: "Nama harus memiliki setidaknya 3 karakter." }),
  email: z.string().email({ message: "Format email tidak valid." }),
  password: z
    .string()
    .min(6, { message: "Password harus memiliki setidaknya 6 karakter." }),
  role: z.enum(["student", "lecturer", "admin"], { required_error: "Anda harus memilih peran." }),
  className: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onSwitchToLogin: () => void;
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.02,35.636,44,30.138,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  )
}

export function RegisterDialog({ isOpen, onOpenChange, onSwitchToLogin }: RegisterDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "student",
    },
  });

  const role = form.watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
        const userData = { ...data };
        // This is a simulation. In a real app with a real database,
        // you would call a server action here to create the user.
        // await registerUser(userData);
        console.log("Simulating user registration:", userData);
        toast({
          title: "Pendaftaran Berhasil (Simulasi)",
          description: "Akun telah disimulasikan. Silakan login dengan akun demo yang telah disediakan.",
        });
        onSwitchToLogin();
    } catch (error) {
      if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
        toast({
          variant: "destructive",
          title: "Pendaftaran Gagal",
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const roleValue = form.getValues('role');
    const classNameValue = form.getValues('className');
    setIsGoogleLoading(true);

    try {
      // This logic now correctly runs on the client
      const { auth } = initializeFirebase();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Pass the necessary user info to the server action
      await handleGoogleSignInSuccess(
        roleValue,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        },
        classNameValue
      );
      // The server action will handle the redirect.
    } catch (error: any) {
        if (error.message.includes('NEXT_REDIRECT')) {
            // This is expected, do not show a toast for redirects
            throw error;
        }
        let errorMessage = "Terjadi kesalahan saat mencoba login dengan Google.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = 'Proses login dibatalkan oleh pengguna.';
        }
        toast({
            variant: "destructive",
            title: "Login Google Gagal",
            description: errorMessage,
        });
    } finally {
        setIsGoogleLoading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader className="items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl">Buat Akun baru</DialogTitle>
            </DialogHeader>

            <div className="px-4 pb-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nama Lengkap</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan nama lengkap Anda"
                              {...field}
                              disabled={isLoading || isGoogleLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Masukkan email Anda"
                              {...field}
                              disabled={isLoading || isGoogleLoading}
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
                                  placeholder="Buat password Anda"
                                  {...field}
                                  disabled={isLoading || isGoogleLoading}
                                  className="pr-10"
                              />
                              </FormControl>
                              <button
                                  type="button"
                                  onClick={() => setShowPassword((prev) => !prev)}
                                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                                  disabled={isLoading || isGoogleLoading}
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
                        <FormLabel>Daftar sebagai</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger disabled={isLoading || isGoogleLoading}>
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
                  <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Daftar
                  </Button>
                </form>
              </Form>
              
              <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                      atau
                      </span>
                  </div>
              </div>

              <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
                  {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
                  Lanjutkan dengan Google
              </Button>
            </div>
        </DialogContent>
    </Dialog>
  );
}

// Default export renders null as the page is now a dialog
export default function SignUpPage() {
    return null;
}
    
    

    

    