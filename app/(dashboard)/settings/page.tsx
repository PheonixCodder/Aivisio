import AccountForm from '@/components/dashboard/settings/AccountForm'
import SecurityForm from '@/components/dashboard/settings/SecurityForm';
import { getUser } from '@/lib/supabase/queries';
import { createClient } from '@/lib/supabase/server';
import React from 'react'

const Settings = async () => {
  const supabase = await createClient();
  const user = await getUser(supabase);
  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Account Settings</h1>
        <p className='text-muted-foreground'>
          Manage your account settings and personal information
        </p>
      </div>
      <div className='grid gap-8'>
        <AccountForm user={user!} />
        <SecurityForm user={user!} />
      </div>
    </section>
  )
}

export default Settings
