"use client";
import React from 'react'
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


const SignupForm = ({ className, onClick } : { className?: string; onClick: (mode : AuthFormType) => void}) => {

    // 1. Define your form.
  const form = useForm<z.infer<typeof ResetFormSchema>>({
    resolver: zodResolver(ResetFormSchema),
    defaultValues: {
      email: ""
    },
  })

  const onSubmit = (values: z.infer<typeof ResetFormSchema>) => {
    
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
