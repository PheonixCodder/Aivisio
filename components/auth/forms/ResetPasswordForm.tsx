"use client";
import React, { useId, useTransition } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordFormSchema } from "@/lib/validations";
import z from "zod";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from '@/lib/utils';
import { Loader2Icon } from 'lucide-react';
import { changePassword } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';
import { ROUTES } from '@/lib/routes';


const ResetPasswordForm = () => {
  const [isPending, startTransition] = useTransition();

    // 1. Define your form.
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const toastId = useId();

  const onSubmit = (values: z.infer<typeof ResetPasswordFormSchema>) => {
    toast("Changing password...", {
      id: toastId,
    })
    startTransition( async () => {
      const { success, error } = await changePassword(values.password);

      if (success) {
        toast.success("Password changed successfully", {
          id: toastId,
        });
        redirect(`${ROUTES.LOGIN}?state=login`);
      } else {
        toast.error(error, {
          id: toastId,
        });
      }
    });
  }

  return (
    <>
      <div className={cn("grid gap-6")}>
        <div className="flex flex-col space-y-2 text-center ">
        <h1 className="text-2xl font-semibold tracking-tight">Change Password</h1>
        <p className="text-sm text-muted-foreground">Enter your new password below</p>
      </div>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your password" type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input placeholder="Confirm your password" type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full mt-4'>{isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Change Password"}</Button>
          <div className='text-center text-sm text-muted-foreground'>Make sure to remember your new password or store it somewhere safe</div>
        </form>
      </Form>
      </div>
    </>
  )
}

export default ResetPasswordForm
