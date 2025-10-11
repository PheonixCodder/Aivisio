"use client";
import React, { useId } from 'react'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetFormSchema } from "@/lib/validations";
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
import { resetPassword } from '@/actions/auth.actions';
import { toast } from 'sonner';


const SignupForm = ({ className, onClick } : { className?: string; onClick: (mode : AuthFormType) => void}) => {

    // 1. Define your form.
  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: ""
    },
  })

 const toastId = useId();

  const onSubmit = async (values: z.infer<typeof ResetFormSchema>) => {
        toast.loading("Sending reset password email...", {id: toastId});
        try {
            const { success, error } = await resetPassword({email: values.email});
            if (success) {
                toast.success("Reset password email sent successfully", {id: toastId});
            } else {
                toast.error(error, {id: toastId});
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Error sending reset password email";
            toast.error(errorMessage, {id: toastId});
};
};

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
          <Button type="submit" className='w-full'>Sign Up</Button>
        </form>
      </Form>
      </div>
      <div className='text-center'>
        <Button className='p-0' variant={'link'} onClick={ () => onClick('login') }>Back to Login</Button>
      </div>
    </>
  )
}

export default SignupForm
