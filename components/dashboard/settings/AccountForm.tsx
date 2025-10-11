"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountFormSchema } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from '@supabase/supabase-js'
import React, { useId } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner';
import { updateProfile } from '@/actions/auth.actions';


interface AccountFormProps {
    user: User
}

const AccountForm = ({user}: AccountFormProps) => {
    const form = useForm<z.infer<typeof AccountFormSchema>>({
        resolver: zodResolver(AccountFormSchema),
        defaultValues: {
            name: user.user_metadata.name || "",
            email: user.email || ""
        }
    })

    const toastId = useId()
    async function onSubmit(values: z.infer<typeof AccountFormSchema>) {
    toast.loading("Updating profile...", {id: toastId});
    try {
        const { success, error } = await updateProfile(values);
        if (success) {
            toast.success("Profile updated successfully", {id: toastId});
        } else {
            toast.error(error, {id: toastId});
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error updating profile";
        toast.error(errorMessage, {id: toastId});
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Update your personal information</CardDescription>
      </CardHeader>
      <CardContent>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                Your email address is used for sign in and communications
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
          <Button type="submit">Update Profile</Button>
      </form>
    </Form>
      </CardContent>
    </Card>
  )
}

export default AccountForm
