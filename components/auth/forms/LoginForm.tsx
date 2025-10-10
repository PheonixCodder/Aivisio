"use client";
import React, { useId, useTransition } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema } from "@/lib/validations";
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
import { logIn } from '@/actions/auth.actions';
import { toast } from 'sonner';
import { redirect } from 'next/navigation';


const LoginForm = ({ className, onClick } : { className?: string; onClick: (mode : AuthFormType) => void}) => {
  const [isPending, startTransition] = useTransition();

    // 1. Define your form.
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const toastId = useId();

  const onSubmit = (values: z.infer<typeof LoginFormSchema>) => {
    toast("Logging in...", {
      id: toastId,
    })
    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    startTransition( async () => {
      const { success, error } = await logIn(formData);

      if (success) {
        toast.success("Logged in successfully", {
          id: toastId,
        });
        redirect('/dashboard');
      } else {
        toast.error(error, {
          id: toastId,
        });
      }
    });
  }

  return (
    <>
      <div className={cn("grid gap-6", className)}>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
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
                <FormControl>
                  <Input placeholder="Enter your password" type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full'>{isPending ? <Loader2Icon className="h-4 w-4 animate-spin" /> : "Login"}</Button>
        </form>
      </Form>
      </div>
      <div className='text-center flex justify-between'>
        <Button className='p-0' variant={'link'} onClick={ () => onClick('signup') }>Need an account? Sign Up</Button>
        <Button className='p-0' variant={'link'} onClick={ () => onClick('reset') }>Forgot Password</Button>
      </div>
    </>
  )
}

export default LoginForm
