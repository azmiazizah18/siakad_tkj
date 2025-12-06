
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import type { Classroom } from "@/lib/types";

const createClassSchema = z.object({
  className: z.string().min(1, { message: "Nama kelas tidak boleh kosong." }),
  subject: z.string().min(1, { message: "Mata pelajaran tidak boleh kosong." }),
});

type CreateClassFormValues = z.infer<typeof createClassSchema>;

interface CreateClassDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClassFormValues) => void;
  mode: "create" | "edit";
  initialData?: Classroom | null;
}

export function CreateClassDialog({ isOpen, onClose, onSubmit, mode, initialData }: CreateClassDialogProps) {
  const form = useForm<CreateClassFormValues>({
    resolver: zodResolver(createClassSchema),
    defaultValues: {
      className: "",
      subject: "",
    },
  });

  const { formState: { isSubmitting }, reset } = form;

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        reset({
          className: initialData.className,
          subject: initialData.courseName,
        });
      } else {
        reset({
          className: "",
          subject: "",
        });
      }
    }
  }, [isOpen, mode, initialData, reset]);

  const handleFormSubmit = async (data: CreateClassFormValues) => {
    onSubmit(data);
    onClose();
  };
  
  const title = mode === 'edit' ? 'Ubah Kelas' : 'Buat Kelas';
  const description = mode === 'edit' ? 'Ubah detail untuk kelas ini.' : 'Isi detail di bawah untuk membuat kelas baru.';
  const buttonText = mode === 'edit' ? 'Simpan Perubahan' : 'Buat';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="className"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Kelas (contoh: XI TKJ 1)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nama Kelas" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mata Pelajaran</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Jaringan Komputer" />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
