"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User } from '@supabase/supabase-js'
import React, { useId } from 'react'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import { resetPassword } from '@/actions/auth.actions';


interface SecurityFormProps {
    user: User
}

const SecurityForm = ({user}: SecurityFormProps) => {
    const toastId = useId()
    async function onSubmit() {
    toast.loading("Sending reset password email...", {id: toastId});
    try {
        const { success, error } = await resetPassword({email: user.email!});
        if (success) {
            toast.success("Reset password email sent successfully", {id: toastId});
        } else {
            toast.error(error, {id: toastId});
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error sending reset password email";
        toast.error(errorMessage, {id: toastId});
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
            <h3 className='font-medium'>Password</h3>
            <p className='text-sm text-muted-foreground'>Change your password to keep your account secure</p>
            <Button onClick={onSubmit}>Change Password</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SecurityForm
