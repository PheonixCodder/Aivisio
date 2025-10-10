import PlanSummary from '@/components/dashboard/billing/PlanSummary';
import { getProducts, getSubscription, getUser } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/server';
import React from 'react'

const Page = async () => {
    const supabase = await createClient();
  
  const [user, products, subscription] = await Promise.all([
      getUser(supabase),
      getProducts(supabase),
      getSubscription(supabase),
    ])
    
  return (
    <section className='container mx-auto space-y-8'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Plans & Billing</h1>
        <p className='text-muted-foreground'>
          Manage your subscription plan and billing details
        </p>
      </div>
      <div className='grid gap-10'>
        <PlanSummary subscription={subscription} user={user} products={products}  />
      </div>
    </section>
  )
}

export default Page
